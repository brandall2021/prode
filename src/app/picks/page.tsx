import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PickRow, { type PickRowMatch } from '@/components/PickRow';

export const dynamic = 'force-dynamic';

export default async function PicksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  const u = session.user;
  if (u.status !== 'APPROVED' || !u.hasPaid) redirect('/pendiente');

  const matches = await prisma.match.findMany({
    orderBy: [{ groupName: 'asc' }, { matchDate: 'asc' }],
    include: {
      picks: {
        where: { userId: u.id },
        select: { homeScore: true, awayScore: true },
      },
    },
  });

  const grouped = new Map<string, PickRowMatch[]>();
  for (const m of matches) {
    const arr = grouped.get(m.groupName) ?? [];
    arr.push({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeFlag: m.homeFlag,
      awayFlag: m.awayFlag,
      matchDate: m.matchDate.toISOString(),
      stadium: m.stadium,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      pickHome: m.picks[0]?.homeScore ?? null,
      pickAway: m.picks[0]?.awayScore ?? null,
    });
    grouped.set(m.groupName, arr);
  }

  const groupKeys = Array.from(grouped.keys()).sort();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold text-prode-green sm:text-2xl">⚽ Cargar picks</h1>
        <p className="text-sm text-gray-600">
          Modificá tus picks hasta 90 minutos antes de cada partido. Horarios en hora Argentina.
        </p>
      </header>

      {groupKeys.map((g) => (
        <section key={g} className="card space-y-3">
          <h2 className="text-lg font-bold text-prode-green">Grupo {g}</h2>
          {grouped.get(g)!.map((m) => (
            <PickRow key={m.id} match={m} />
          ))}
        </section>
      ))}
    </div>
  );
}
