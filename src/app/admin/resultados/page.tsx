import { prisma } from '@/lib/prisma';
import ResultRow, { type ResultMatch } from '@/components/admin/ResultRow';

export const dynamic = 'force-dynamic';

export default async function AdminResultadosPage() {
  const matches = await prisma.match.findMany({
    orderBy: [{ groupName: 'asc' }, { matchDate: 'asc' }],
  });

  const grouped = new Map<string, ResultMatch[]>();
  for (const m of matches) {
    const arr = grouped.get(m.groupName) ?? [];
    arr.push({
      id: m.id,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeFlag: m.homeFlag,
      awayFlag: m.awayFlag,
      matchDate: m.matchDate.toISOString(),
      homeScore: m.homeScore,
      awayScore: m.awayScore,
    });
    grouped.set(m.groupName, arr);
  }

  const keys = Array.from(grouped.keys()).sort();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold text-prode-green sm:text-2xl">📥 Cargar resultados</h1>
        <p className="text-sm text-gray-600">
          Al guardar un resultado, se recalculan automáticamente los puntos de todos los picks.
        </p>
      </header>

      {keys.map((g) => (
        <section key={g} className="card space-y-3">
          <h2 className="text-lg font-bold text-prode-green">Grupo {g}</h2>
          {grouped.get(g)!.map((m) => (
            <ResultRow key={m.id} match={m} />
          ))}
        </section>
      ))}
    </div>
  );
}
