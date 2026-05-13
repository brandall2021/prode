import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatFullAR, isLocked } from '@/lib/timezone';

export const dynamic = 'force-dynamic';

export default async function MisPicksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  const u = session.user;
  if (u.status !== 'APPROVED' || !u.hasPaid) redirect('/pendiente');

  const matches = await prisma.match.findMany({
    orderBy: { matchDate: 'asc' },
    include: {
      picks: {
        where: { userId: u.id },
        select: { homeScore: true, awayScore: true, points: true },
      },
    },
  });

  const totalMatches = matches.length;
  let pickedCount = 0;
  let total = 0;
  let exactos = 0;
  let ganadores = 0;
  let fallados = 0;
  let sinPick = 0;

  type Row = {
    id: string;
    label: string;
    flagLine: string;
    matchDate: Date;
    locked: boolean;
    pick: string;
    real: string;
    puntos: number | null;
    sinPick: boolean;
  };

  const rows: Row[] = matches.map((m) => {
    const pick = m.picks[0];
    const locked = isLocked(m.matchDate);
    const finalized = m.homeScore != null && m.awayScore != null;

    let puntos: number | null = null;
    let userSinPick = false;

    if (pick) {
      pickedCount++;
      if (pick.points != null) {
        puntos = pick.points;
        total += pick.points;
        if (pick.points === 3) exactos++;
        else if (pick.points === 1) ganadores++;
        else fallados++;
      }
    } else if (locked) {
      userSinPick = true;
      sinPick++;
    }

    return {
      id: m.id,
      label: `${m.homeTeam} vs ${m.awayTeam}`,
      flagLine: `${m.homeFlag} ${m.homeTeam} vs ${m.awayTeam} ${m.awayFlag}`,
      matchDate: m.matchDate,
      locked,
      pick: pick ? `${pick.homeScore} - ${pick.awayScore}` : '—',
      real: finalized ? `${m.homeScore} - ${m.awayScore}` : '—',
      puntos,
      sinPick: userSinPick,
    };
  });

  const progreso = totalMatches === 0 ? 0 : Math.round((pickedCount / totalMatches) * 100);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold text-prode-green sm:text-2xl">📋 Mis picks</h1>
        <p className="text-sm text-gray-600">{u.name}</p>
      </header>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <div className="card text-center">
          <div className="text-xs uppercase text-gray-500">Total</div>
          <div className="text-2xl font-bold text-prode-green">{total}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs uppercase text-gray-500">Exactos</div>
          <div className="text-2xl font-bold text-green-700">{exactos}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs uppercase text-gray-500">Ganadores</div>
          <div className="text-2xl font-bold text-blue-700">{ganadores}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs uppercase text-gray-500">Fallados</div>
          <div className="text-2xl font-bold text-gray-700">{fallados}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs uppercase text-gray-500">Sin pick</div>
          <div className="text-2xl font-bold text-red-700">{sinPick}</div>
        </div>
      </section>

      <section className="card">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span>Picks cargados</span>
          <span className="font-semibold">
            {pickedCount}/{totalMatches} ({progreso}%)
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-prode-gold"
            style={{ width: `${progreso}%` }}
            aria-hidden
          />
        </div>
      </section>

      <section className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-gray-500">
              <th className="py-2 pr-2">Partido</th>
              <th className="py-2 pr-2 text-center">Mi pick</th>
              <th className="py-2 pr-2 text-center">Resultado</th>
              <th className="py-2 pr-2 text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2 pr-2">
                  <div className="font-medium">{r.flagLine}</div>
                  <div className="text-xs text-gray-500">{formatFullAR(r.matchDate)}</div>
                </td>
                <td className="py-2 pr-2 text-center font-mono">
                  {r.sinPick ? (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                      Sin pick
                    </span>
                  ) : (
                    r.pick
                  )}
                </td>
                <td className="py-2 pr-2 text-center font-mono">{r.real}</td>
                <td className="py-2 pr-2 text-right">
                  {r.puntos == null ? (
                    <span className="text-gray-400">—</span>
                  ) : r.puntos === 3 ? (
                    <span className="font-bold text-green-700">3</span>
                  ) : r.puntos === 1 ? (
                    <span className="font-bold text-blue-700">1</span>
                  ) : (
                    <span className="text-gray-500">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
