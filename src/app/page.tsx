import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Goal = {
  player: string;
  minute: number;
  team: 'home' | 'away';
};

type TeamStanding = {
  name: string;
  flag: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
};

type Scorer = {
  player: string;
  team: string;
  flag: string;
  goals: number;
};

// Función para calcular las tablas de posiciones dinámicamente
function calculateStandings(matches: any[]): Record<string, TeamStanding[]> {
  const standings: Record<string, Record<string, TeamStanding>> = {};

  for (const match of matches) {
    if (match.phase !== 'GROUP') continue;
    const group = match.groupName;

    if (!standings[group]) {
      standings[group] = {};
    }

    // Inicializar equipos si no existen en el registro del grupo
    if (!standings[group][match.homeTeam]) {
      standings[group][match.homeTeam] = {
        name: match.homeTeam,
        flag: match.homeFlag,
        pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0,
      };
    }
    if (!standings[group][match.awayTeam]) {
      standings[group][match.awayTeam] = {
        name: match.awayTeam,
        flag: match.awayFlag,
        pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0,
      };
    }

    // Si el partido se jugó, calcular estadísticas
    if (match.homeScore !== null && match.awayScore !== null) {
      const h = standings[group][match.homeTeam];
      const a = standings[group][match.awayTeam];

      h.pj += 1;
      a.pj += 1;
      h.gf += match.homeScore;
      h.gc += match.awayScore;
      a.gf += match.awayScore;
      a.gc += match.homeScore;

      if (match.homeScore > match.awayScore) {
        h.pg += 1;
        h.pts += 3;
        a.pp += 1;
      } else if (match.homeScore < match.awayScore) {
        a.pg += 1;
        a.pts += 3;
        h.pp += 1;
      } else {
        h.pe += 1;
        h.pts += 1;
        a.pe += 1;
        a.pts += 1;
      }

      h.dg = h.gf - h.gc;
      a.dg = a.gf - a.gc;
    }
  }

  // Ordenar los equipos de cada grupo según reglas oficiales
  const sortedStandings: Record<string, TeamStanding[]> = {};
  for (const group of Object.keys(standings)) {
    sortedStandings[group] = Object.values(standings[group]).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg !== a.dg) return b.dg - a.dg;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.name.localeCompare(b.name);
    });
  }

  return sortedStandings;
}

// Función para obtener la tabla de goleadores de forma dinámica
function getTopScorers(matches: any[]): Scorer[] {
  const scorersMap: Record<string, Scorer> = {};

  for (const match of matches) {
    if (!match.goals) continue;
    try {
      const goalsList: Goal[] = typeof match.goals === 'string' ? JSON.parse(match.goals) : match.goals;
      for (const g of goalsList) {
        const teamName = g.team === 'home' ? match.homeTeam : match.awayTeam;
        const flag = g.team === 'home' ? match.homeFlag : match.awayFlag;
        const key = `${g.player}_${teamName}`;

        if (!scorersMap[key]) {
          scorersMap[key] = {
            player: g.player,
            team: teamName,
            flag: flag,
            goals: 0,
          };
        }
        scorersMap[key].goals += 1;
      }
    } catch (e) {
      // Ignorar errores de parsing
    }
  }

  return Object.values(scorersMap)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);
}

export default async function HomePage() {
  const matches = await prisma.match.findMany({
    orderBy: { matchDate: 'asc' },
  });

  const standings = calculateStandings(matches);
  const topScorers = getTopScorers(matches);

  // Separar en jugados (con resultado) y próximos
  const playedMatches = matches.filter((m) => m.homeScore !== null && m.awayScore !== null);
  const upcomingMatches = matches.filter((m) => m.homeScore === null || m.awayScore === null);

  // Obtener los últimos 10 partidos jugados para visualización rápida
  const recentPlayed = [...playedMatches].reverse().slice(0, 10);
  // Obtener los próximos 5 partidos
  const nextUpcoming = upcomingMatches.slice(0, 5);

  const groups = Object.keys(standings).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-12 min-h-[100dvh]">
      {/* Encabezado Principal */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-prode-green to-slate-900 text-white p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-prode-gold/20 text-prode-gold px-3.5 py-1 text-xs font-bold tracking-wide uppercase border border-prode-gold/30">
            Mundial 2026 - Centro de Resultados
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
            Sigue cada minuto del torneo oficial
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Resultados en tiempo real, goleadores al minuto, tablas de posiciones dinámicas y transmisión oficial de todos los partidos.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-prode-gold/5 rounded-full blur-3xl pointer-events-none" />
      </header>

      {/* Grid de Partidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna de Resultados Recientes (66% de ancho en lg) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
              Resultados Recientes
            </h2>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              {playedMatches.length} partidos jugados
            </span>
          </div>

          <div className="space-y-4">
            {recentPlayed.map((match) => {
              // Parsear goles de forma segura
              let goalsList: Goal[] = [];
              if (match.goals) {
                try {
                  goalsList = typeof match.goals === 'string' ? JSON.parse(match.goals) : (match.goals as any);
                } catch (e) {
                  goalsList = [];
                }
              }

              const homeGoals = goalsList.filter((g) => g.team === 'home');
              const awayGoals = goalsList.filter((g) => g.team === 'away');

              return (
                <div
                  key={match.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-all duration-300"
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    <span>Grupo {match.groupName}</span>
                    <span>
                      {new Date(match.matchDate).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        timeZone: 'America/Argentina/Buenos_Aires',
                      })}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 items-center text-center">
                    {/* Equipo Local */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-4xl filter drop-shadow-sm select-none">{match.homeFlag}</span>
                      <span className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[120px]">
                        {match.homeTeam}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <div className="flex items-center gap-4 text-3xl font-extrabold text-slate-900 font-mono">
                        <span>{match.homeScore}</span>
                        <span className="text-slate-300 text-xl font-normal">-</span>
                        <span>{match.awayScore}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">
                        Finalizado
                      </span>
                    </div>

                    {/* Equipo Visitante */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-4xl filter drop-shadow-sm select-none">{match.awayFlag}</span>
                      <span className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[120px]">
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>

                  {/* Detalle de Goles */}
                  {goalsList.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
                      {/* Goles Local */}
                      <div className="space-y-1 text-left">
                        {homeGoals.map((g, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 truncate">
                            <span className="text-amber-500 font-mono">⚽</span>
                            <span className="font-medium text-slate-700">{g.player}</span>
                            <span className="text-slate-400 font-mono">({g.minute}&apos;)</span>
                          </div>
                        ))}
                      </div>

                      {/* Goles Visitante */}
                      <div className="space-y-1 text-right">
                        {awayGoals.map((g, idx) => (
                          <div key={idx} className="flex items-center justify-end gap-1.5 truncate">
                            <span className="text-slate-400 font-mono">({g.minute}&apos;)</span>
                            <span className="font-medium text-slate-700">{g.player}</span>
                            <span className="text-amber-500 font-mono">⚽</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Lateral de Información Extra (33% ancho) */}
        <div className="space-y-8">
          {/* Próximos Partidos */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Próximos Partidos
              </h2>
            </div>

            <div className="space-y-3">
              {nextUpcoming.map((match) => (
                <div
                  key={match.id}
                  className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm hover:border-slate-300 transition-all duration-200"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                    <span>Grupo {match.groupName}</span>
                    <span>
                      {new Date(match.matchDate).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'America/Argentina/Buenos_Aires',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{match.homeFlag}</span>
                      <span className="font-bold text-slate-700 text-xs truncate max-w-[80px]">
                        {match.homeTeam}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-800 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                      VS
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-xs truncate max-w-[80px]">
                        {match.awayTeam}
                      </span>
                      <span className="text-2xl">{match.awayFlag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de Goleadores (Bota de Oro) */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Tabla de Goleadores
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-sm space-y-3">
              {topScorers.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Aún no se registraron goles.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {topScorers.map((scorer, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-bold text-slate-400 text-xs w-4">
                          {idx + 1}
                        </span>
                        <span className="text-base filter drop-shadow-sm select-none">
                          {scorer.flag}
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-slate-800 text-xs truncate">
                            {scorer.player}
                          </p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">
                            {scorer.team}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-xs font-mono text-prode-green bg-prode-green/5 px-2 py-1 rounded-lg">
                        {scorer.goals} Goles
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tablas de Posiciones de los Grupos */}
      <section className="space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Tablas de Posiciones
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Calculadas automáticamente en base a los marcadores oficiales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden"
            >
              <h3 className="font-black text-lg text-slate-900 border-b pb-2 mb-3 tracking-tight">
                Grupo {group}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono border-b pb-1">
                      <th className="py-1.5">Equipo</th>
                      <th className="py-1.5 text-center">PJ</th>
                      <th className="py-1.5 text-center">DG</th>
                      <th className="py-1.5 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings[group].map((team, idx) => (
                      <tr key={team.name} className="border-b last:border-0 hover:bg-slate-50/50">
                        <td className="py-2 flex items-center gap-2">
                          <span className="font-bold text-slate-400 w-3 text-center">{idx + 1}</span>
                          <span className="text-lg filter drop-shadow-sm select-none">{team.flag}</span>
                          <span className="font-bold text-slate-700 truncate max-w-[110px]">
                            {team.name}
                          </span>
                        </td>
                        <td className="py-2 text-center font-mono text-slate-600">{team.pj}</td>
                        <td className="py-2 text-center font-mono text-slate-600">
                          {team.dg > 0 ? `+${team.dg}` : team.dg}
                        </td>
                        <td className="py-2 text-right font-black font-mono text-slate-900">
                          {team.pts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
