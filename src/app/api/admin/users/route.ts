import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const s = await getServerSession(authOptions);
  if (!s?.user?.isAdmin) return null;
  return s.user;
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await req.json().catch(() => null);
  const { userId, action, notes } = (body || {}) as {
    userId?: string;
    action?: 'APPROVE' | 'REJECT' | 'CONFIRM_PAYMENT' | 'REVERT_PAYMENT' | 'TOGGLE_ADMIN';
    notes?: string;
  };

  if (!userId || !action) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

  if (action === 'APPROVE') {
    await prisma.user.update({ where: { id: userId }, data: { status: 'APPROVED' } });
  } else if (action === 'REJECT') {
    await prisma.user.update({ where: { id: userId }, data: { status: 'REJECTED' } });
  } else if (action === 'CONFIRM_PAYMENT') {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { hasPaid: true, paidAt: new Date() },
      }),
      prisma.payment.create({
        data: {
          userId,
          amount: 20000,
          confirmedBy: admin.id,
          notes: notes || null,
        },
      }),
    ]);
  } else if (action === 'REVERT_PAYMENT') {
    await prisma.user.update({
      where: { id: userId },
      data: { hasPaid: false, paidAt: null },
    });
  } else if (action === 'TOGGLE_ADMIN') {
    await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: !target.isAdmin },
    });
  } else {
    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
