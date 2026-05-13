import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isLocked } from '@/lib/timezone';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  const u = session.user;
  if (u.status !== 'APPROVED' || !u.hasPaid) {
    return NextResponse.json({ error: 'Cuenta no activa' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { matchId, homeScore, awayScore } = body as {
    matchId?: string;
    homeScore?: number;
    awayScore?: number;
  };

  if (
    typeof matchId !== 'string' ||
    typeof homeScore !== 'number' ||
    typeof awayScore !== 'number' ||
    !Number.isInteger(homeScore) ||
    !Number.isInteger(awayScore) ||
    homeScore < 0 ||
    awayScore < 0 ||
    homeScore > 99 ||
    awayScore > 99
  ) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });

  if (isLocked(match.matchDate)) {
    return NextResponse.json({ error: 'Pick cerrado (90 min antes del partido)' }, { status: 409 });
  }

  const saved = await prisma.pick.upsert({
    where: { userId_matchId: { userId: u.id, matchId } },
    update: { homeScore, awayScore },
    create: { userId: u.id, matchId, homeScore, awayScore },
  });

  return NextResponse.json({ ok: true, pick: saved });
}
