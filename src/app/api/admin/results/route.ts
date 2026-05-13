import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculatePoints } from '@/lib/scoring';

export async function POST(req: Request) {
  const s = await getServerSession(authOptions);
  if (!s?.user?.isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await req.json().catch(() => null);
  const { matchId, homeScore, awayScore } = (body || {}) as {
    matchId?: string;
    homeScore?: number | null;
    awayScore?: number | null;
  };

  if (!matchId) return NextResponse.json({ error: 'Falta matchId' }, { status: 400 });

  const clearing = homeScore === null && awayScore === null;
  if (!clearing) {
    if (
      typeof homeScore !== 'number' ||
      typeof awayScore !== 'number' ||
      !Number.isInteger(homeScore) ||
      !Number.isInteger(awayScore) ||
      homeScore < 0 ||
      awayScore < 0 ||
      homeScore > 99 ||
      awayScore > 99
    ) {
      return NextResponse.json({ error: 'Resultado inválido' }, { status: 400 });
    }
  }

  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore: clearing ? null : (homeScore as number),
      awayScore: clearing ? null : (awayScore as number),
    },
  });

  const picks = await prisma.pick.findMany({ where: { matchId } });

  if (clearing) {
    await prisma.$transaction(
      picks.map((p) =>
        prisma.pick.update({ where: { id: p.id }, data: { points: null } }),
      ),
    );
  } else {
    const result = { homeScore: match.homeScore!, awayScore: match.awayScore! };
    await prisma.$transaction(
      picks.map((p) =>
        prisma.pick.update({
          where: { id: p.id },
          data: {
            points: calculatePoints(
              { homeScore: p.homeScore, awayScore: p.awayScore },
              result,
            ),
          },
        }),
      ),
    );
  }

  return NextResponse.json({ ok: true, recalculated: picks.length });
}
