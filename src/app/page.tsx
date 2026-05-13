import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPozo, formatARS } from '@/lib/pozo';

export const dynamic = 'force-dynamic';

type Row = {
  id: string;
  name: string | null;
  image: string | null;
  total: number;
  exactos: number;
  ganadores: number;
  jugados: number;
};

async function getLeaderboard(): Promise<Row[]> {
  const users = await prisma.user.findMany({
    where: { hasPaid: true, status: 'APPROVED' },
    select: {
      id: true,
      name: true,
      image: true,
      picks: {
        where: { points: { not: null } },
        select: { points: true },
      },
    },
  });

  const rows = users.map((u) => {
    let total = 0;
    let exactos = 0;
    let ganadores = 0;
    let jugados = 0;
    for (const p of u.picks) {
      if (p.points == null) continue;
      jugados++;
      total += p.points;
      if (p.points === 3) exactos++;
      else if (p.points === 1) ganadores++;
    }
    return { id: u.id, name: u.name, image: u.image, total, exactos, ganadores, jugados };
  });

  rows.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.exactos !== a.exactos) return b.exactos - a.exactos;
    return b.ganadores - a.ganadores;
  });

  return rows;
}

export default async function HomePage() {
  const [rows, pozo, session] = await Promise.all([
    getLeaderboard(),
    getPozo(),
    getServerSession(authOptions),
  ]);
  const myId = session?.user?.id;

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-gradient-to-br from-prode-gold to-prode-gold-light p-5 shadow ring-1 ring-prode-gold/40">
        <h2 className="text-lg font-bold text-prode-green sm:text-xl">💰 Pozo actual</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-white/70 p-3">
            <div className="text-xs uppercase text-prode-green/70">Total recaudado</div>
            <div className="text-xl font-bold text-prode-green">{formatARS(pozo.totalRecaudado)}</div>
          </div>
          <div className="rounded-lg bg-white p-3 ring-2 ring-prode-green">
            <div className="text-xs uppercase text-prode-green/70">🏆 Premio (70%)</div>
            <div className="text-2xl font-extrabold text-prode-green">{formatARS(pozo.premio)}</div>
          </div>
          <div className="rounded-lg bg-white/70 p-3">
            <div className="text-xs uppercase text-prode-green/70">👥 Participantes</div>
            <div className="text-xl font-bold text-prode-green">{pozo.participantes} jugadores</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="mb-3 text-lg font-bold text-prode-green sm:text-xl">🏆 Tabla de posiciones</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aún no hay participantes con pagos confirmados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-gray-500">
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 pr-2">Jugador</th>
                  <th className="py-2 pr-2 text-right">Pts</th>
                  <th className="hidden py-2 pr-2 text-right sm:table-cell">Exactos (3)</th>
                  <th className="hidden py-2 pr-2 text-right sm:table-cell">Ganador (1)</th>
                  <th className="py-2 pr-2 text-right">PJ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
                  const mine = myId === r.id;
                  return (
                    <tr
                      key={r.id}
                      className={`border-b last:border-0 ${mine ? 'bg-prode-gold/20 font-semibold' : ''}`}
                    >
                      <td className="py-2 pr-2">
                        {medal ?? <span className="text-gray-500">{i + 1}</span>}
                      </td>
                      <td className="py-2 pr-2">
                        <div className="flex items-center gap-2">
                          {r.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={r.image}
                              alt=""
                              className="h-7 w-7 rounded-full"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-prode-green/20" />
                          )}
                          <span>{r.name ?? 'Sin nombre'}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-2 text-right font-bold">{r.total}</td>
                      <td className="hidden py-2 pr-2 text-right sm:table-cell">{r.exactos}</td>
                      <td className="hidden py-2 pr-2 text-right sm:table-cell">{r.ganadores}</td>
                      <td className="py-2 pr-2 text-right">{r.jugados}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
