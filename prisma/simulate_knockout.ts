import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const TEAM_POWER: Record<string, number> = {
  Argentina: 95, Brasil: 94, Francia: 93, Inglaterra: 92,
  España: 91, Alemania: 90, 'Países Bajos': 89, Portugal: 88,
  Bélgica: 87, Croacia: 86, Uruguay: 85, Colombia: 84,
  'Estados Unidos': 83, Marruecos: 82, Japón: 81, Suiza: 80,
  México: 79, Senegal: 78, Canadá: 77, Ecuador: 76,
  'Corea del Sur': 75, Australia: 74, Ghana: 73, Noruega: 72,
  Suecia: 71, Argelia: 70, Egipto: 69, 'Costa de Marfil': 68,
  Túnez: 67, Paraguay: 66, 'Arabia Saudita': 65, Escocia: 64,
  Panamá: 63, Uzbekistán: 62, Iraq: 61, Irán: 60,
  Jordania: 59, Austria: 58, Sudáfrica: 57, Qatar: 56,
  'Cabo Verde': 55, 'Nueva Zelanda': 54, 'DR Congo': 53,
  Chequia: 52, Turquía: 51, Bosnia: 50, Haití: 45, Curazao: 40,
};

const R32_SLOTS: { id: string; home: { type: string; groups: string[] }; away: { type: string; groups: string[] } }[] = [
  { id: 'R32-M1',  home: { type: 'runner', groups: ['A'] }, away: { type: 'runner', groups: ['B'] } },
  { id: 'R32-M2',  home: { type: 'winner', groups: ['E'] }, away: { type: '3rd', groups: ['A','B','C','D','F'] } },
  { id: 'R32-M3',  home: { type: 'winner', groups: ['F'] }, away: { type: 'runner', groups: ['C'] } },
  { id: 'R32-M4',  home: { type: 'winner', groups: ['C'] }, away: { type: 'runner', groups: ['F'] } },
  { id: 'R32-M5',  home: { type: 'winner', groups: ['I'] }, away: { type: '3rd', groups: ['C','D','F','G','H'] } },
  { id: 'R32-M6',  home: { type: 'runner', groups: ['E'] }, away: { type: 'runner', groups: ['I'] } },
  { id: 'R32-M7',  home: { type: 'winner', groups: ['A'] }, away: { type: '3rd', groups: ['C','E','F','H','I'] } },
  { id: 'R32-M8',  home: { type: 'winner', groups: ['L'] }, away: { type: '3rd', groups: ['E','H','I','J','K'] } },
  { id: 'R32-M9',  home: { type: 'winner', groups: ['D'] }, away: { type: '3rd', groups: ['B','E','F','I','J'] } },
  { id: 'R32-M10', home: { type: 'winner', groups: ['G'] }, away: { type: '3rd', groups: ['A','E','H','I','J'] } },
  { id: 'R32-M11', home: { type: 'runner', groups: ['K'] }, away: { type: 'runner', groups: ['L'] } },
  { id: 'R32-M12', home: { type: 'winner', groups: ['H'] }, away: { type: 'runner', groups: ['J'] } },
  { id: 'R32-M13', home: { type: 'winner', groups: ['B'] }, away: { type: '3rd', groups: ['E','F','G','I','J'] } },
  { id: 'R32-M14', home: { type: 'winner', groups: ['J'] }, away: { type: 'runner', groups: ['H'] } },
  { id: 'R32-M15', home: { type: 'winner', groups: ['K'] }, away: { type: '3rd', groups: ['D','E','I','J','L'] } },
  { id: 'R32-M16', home: { type: 'runner', groups: ['D'] }, away: { type: 'runner', groups: ['G'] } },
];

const BRACKET: Record<string, { phase: string; next: { id: string; slot: 'home' | 'away' } | null }> = {};
for (const s of R32_SLOTS) BRACKET[s.id] = { phase: 'R32', next: null };

const R16_SLOTS = [
  { id: 'R16-M1', home: 'R32-M1', away: 'R32-M3' },
  { id: 'R16-M2', home: 'R32-M2', away: 'R32-M5' },
  { id: 'R16-M3', home: 'R32-M4', away: 'R32-M6' },
  { id: 'R16-M4', home: 'R32-M7', away: 'R32-M8' },
  { id: 'R16-M5', home: 'R32-M11', away: 'R32-M12' },
  { id: 'R16-M6', home: 'R32-M9', away: 'R32-M10' },
  { id: 'R16-M7', home: 'R32-M14', away: 'R32-M16' },
  { id: 'R16-M8', home: 'R32-M13', away: 'R32-M15' },
];
for (const s of R16_SLOTS) BRACKET[s.id] = { phase: 'R16', next: null };

const QF_SLOTS = [
  { id: 'QF-M1', home: 'R16-M1', away: 'R16-M2' },
  { id: 'QF-M2', home: 'R16-M3', away: 'R16-M4' },
  { id: 'QF-M3', home: 'R16-M5', away: 'R16-M6' },
  { id: 'QF-M4', home: 'R16-M7', away: 'R16-M8' },
];
for (const s of QF_SLOTS) BRACKET[s.id] = { phase: 'QF', next: null };

const SF_SLOTS = [
  { id: 'SF-M1', home: 'QF-M1', away: 'QF-M2' },
  { id: 'SF-M2', home: 'QF-M3', away: 'QF-M4' },
];
for (const s of SF_SLOTS) BRACKET[s.id] = { phase: 'SF', next: null };

BRACKET['3RD-M1'] = { phase: '3RD', next: null };
BRACKET['FINAL-M1'] = { phase: 'FINAL', next: null };

const PLAYER_EXPANSION: Record<string, { name: string; position: string }[]> = {
  México: [
    { name: 'Guillermo Ochoa', position: 'Arquero' },
    { name: 'Raúl Jiménez', position: 'Delantero' },
    { name: 'Jesús Gallardo', position: 'Defensor' },
  ],
  Argentina: [
    { name: 'Lionel Messi', position: 'Delantero' },
    { name: 'Emiliano Martínez', position: 'Arquero' },
    { name: 'Alexis Mac Allister', position: 'Mediocampista' },
    { name: 'Nahuel Molina', position: 'Defensor' },
    { name: 'Lautaro Martínez', position: 'Delantero' },
  ],
  Brasil: [
    { name: 'Neymar Jr', position: 'Delantero' },
    { name: 'Endrick', position: 'Delantero' },
    { name: 'Casemiro', position: 'Mediocampista' },
    { name: 'Gabriel Martinelli', position: 'Delantero' },
    { name: 'Lucas Paquetá', position: 'Mediocampista' },
  ],
  Francia: [
    { name: 'Kylian Mbappé', position: 'Delantero' },
    { name: 'Eduardo Camavinga', position: 'Mediocampista' },
    { name: 'William Saliba', position: 'Defensor' },
    { name: 'Mike Maignan', position: 'Arquero' },
    { name: 'Marcus Thuram', position: 'Delantero' },
  ],
  Inglaterra: [
    { name: 'Harry Kane', position: 'Delantero' },
    { name: 'Bukayo Saka', position: 'Delantero' },
    { name: 'Declan Rice', position: 'Mediocampista' },
    { name: 'Jude Bellingham', position: 'Mediocampista' },
    { name: 'Jordan Pickford', position: 'Arquero' },
  ],
  España: [
    { name: 'Pedri', position: 'Mediocampista' },
    { name: 'Lamine Yamal', position: 'Delantero' },
    { name: 'Rodri', position: 'Mediocampista' },
    { name: 'Unai Simón', position: 'Arquero' },
    { name: 'Dani Olmo', position: 'Mediocampista' },
  ],
};

function simulateScore(powerHome: number, powerAway: number): [number, number] {
  const diff = powerHome - powerAway;
  const base = Math.max(0, 0.5 + diff / 60);
  const home = Math.round(base + Math.random() * 1.7);
  const away = Math.round(Math.random() * Math.max(0.2, 1 - diff / 70));
  if (home === away && Math.random() < 0.3) return [home + 1, away];
  return [home, away];
}

async function main() {
  console.log('Simulating full knockout stage...\n');

  const allMatches = await prisma.match.findMany({ where: { phase: 'GROUP' } });
  const allPlayers = await prisma.player.findMany({ include: { team: true } });
  const playersByTeam: Record<string, { name: string; position: string }[]> = {};
  for (const p of allPlayers) {
    if (!playersByTeam[p.team.name]) playersByTeam[p.team.name] = [];
    playersByTeam[p.team.name].push(p);
  }

  const standings: Record<string, any[]> = {};
  for (const g of ['A','B','C','D','E','F','G','H','I','J','K','L']) {
    const ms = allMatches.filter(m => m.groupName === g);
    const tm = new Map<string, any>();
    for (const m of ms) {
      if (m.homeScore === null || m.awayScore === null) continue;
      for (const t of [m.homeTeam, m.awayTeam]) if (!tm.has(t)) tm.set(t, { team: t, pts: 0, gd: 0, gf: 0, ga: 0 });
      const h = tm.get(m.homeTeam)!; const a = tm.get(m.awayTeam)!;
      h.gf += m.homeScore; h.ga += m.awayScore; a.gf += m.awayScore; a.ga += m.homeScore;
      h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
      if (m.homeScore > m.awayScore) h.pts += 3;
      else if (m.homeScore < m.awayScore) a.pts += 3;
      else { h.pts++; a.pts++; }
    }
    standings[g] = Array.from(tm.values()).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }

  const winners: Record<string, string> = {};
  const runners: Record<string, string> = {};
  const third: { team: string; group: string; pts: number; gd: number; gf: number }[] = [];
  for (const g of ['A','B','C','D','E','F','G','H','I','J','K','L']) {
    const s = standings[g];
    winners[g] = s[0].team; runners[g] = s[1].team;
    third.push({ team: s[2].team, group: g, pts: s[2].pts, gd: s[2].gd, gf: s[2].gf });
  }
  third.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  const advancedThird = new Map<string, string>();
  for (const t of third.slice(0, 8)) advancedThird.set(t.group, t.team);
  console.log(`Winners: ${Object.values(winners).join(', ')}`);
  console.log(`Best 3rd: ${third.slice(0, 8).map(t => `${t.team}(${t.group})`).join(', ')}`);

  const thirdByRank = third.slice(0, 8);
  const thirdSlots = R32_SLOTS.filter(s => s.away.type === '3rd');
  const thirdPromises: (string | null)[] = [];

  function solveAssignment(): string[] {
    const R = thirdByRank.map(t => ({ group: t.group, team: t.team, rank: t.pts * 100 + t.gd * 10 + t.gf }));
    const slots = thirdSlots.map(s => s.away.groups);
    const n = R.length;
    const assign: (string | null)[] = new Array(slots.length).fill(null);
    const used = new Set<number>();

    function backtrack(slotIdx: number): boolean {
      if (slotIdx >= slots.length) return true;
      const eligible = R.map((t, i) => !used.has(i) && slots[slotIdx].includes(t.group) ? i : -1).filter(i => i >= 0);
      eligible.sort((a, b) => {
        const countA = R.reduce((c, t, j) => c + (j !== a && !used.has(j) && slots.some(s => s.includes(t.group)) ? 1 : 0), 0);
        const countB = R.reduce((c, t, j) => c + (j !== b && !used.has(j) && slots.some(s => s.includes(t.group)) ? 1 : 0), 0);
        return countA - countB;
      });
      for (const idx of eligible) {
        used.add(idx);
        assign[slotIdx] = R[idx].team;
        if (backtrack(slotIdx + 1)) return true;
        used.delete(idx);
        assign[slotIdx] = null;
      }
      return false;
    }

    if (!backtrack(0)) {
      console.error('Cannot solve 3rd-place assignment! Using fallback rank-based assignment.');
      return thirdSlots.map((s, i) => R[i]?.team || null);
    }
    return assign as string[];
  }

  const thirdAssignments = solveAssignment();

  const r32Teams: Record<string, { home: string; away: string }> = {};
  let thirdIdx = 0;
  for (const s of R32_SLOTS) {
    const home = s.home.type === 'winner' ? winners[s.home.groups[0]]
      : s.home.type === 'runner' ? runners[s.home.groups[0]]
      : (() => { throw new Error('3rd place in home slot unexpected'); })();
    const away = s.away.type === 'winner' ? winners[s.away.groups[0]]
      : s.away.type === 'runner' ? runners[s.away.groups[0]]
      : thirdAssignments[thirdIdx++];
    if (!home || !away) { console.error(`Cannot fill ${s.id}: ${home} vs ${away}`); continue; }
    r32Teams[s.id] = { home, away };
  }

  const results: Record<string, { home: string; away: string; homeScore: number; awayScore: number; goals: any[] }> = {};

  function getPower(t: string) { return TEAM_POWER[t] || 55; }

  function genGoals(team: string, count: number, isHome: boolean): any[] {
    const roster = playersByTeam[team] || [];
    if (roster.length === 0 || count === 0) return [];
    const gs: any[] = [];
    const used = new Set<string>();
    for (let i = 0; i < count; i++) {
      let p = roster[Math.floor(Math.random() * roster.length)];
      let tries = 0;
      while (used.has(p.name) && tries < 10) { p = roster[Math.floor(Math.random() * roster.length)]; tries++; }
      used.add(p.name);
      gs.push({ player: p.name, minute: 5 + Math.floor(Math.random() * 85), team: isHome ? 'home' : 'away' });
    }
    gs.sort((a, b) => a.minute - b.minute);
    return gs;
  }

  function simulate(matches: { id: string; home: string; away: string }[]) {
    for (const m of matches) {
      const hp = getPower(m.home); const ap = getPower(m.away);
      const [hs, as] = simulateScore(hp, ap);
      const gs = [...genGoals(m.home, hs, true), ...genGoals(m.away, as, false)];
      gs.sort((a, b) => a.minute - b.minute);
      results[m.id] = { home: m.home, away: m.away, homeScore: hs, awayScore: as, goals: gs };
      console.log(`  ${m.id}: ${m.home} ${hs}-${as} ${m.away}`);
    }
  }

  function getWinner(id: string): string | null {
    const r = results[id]; if (!r) return null;
    if (r.homeScore === r.awayScore) return Math.random() < 0.5 ? r.home : r.away;
    return r.homeScore > r.awayScore ? r.home : r.away;
  }
  function getLoser(id: string): string | null {
    const w = getWinner(id); if (!w) return null;
    const r = results[id]; return r.home === w ? r.away : r.home;
  }

  function makeMatch(id: string, fn: () => { home: string; away: string }) {
    try { return fn(); } catch { return { home: 'TBD', away: 'TBD' }; }
  }

  console.log('\nR32 past:');
  simulate(R32_SLOTS.slice(0, 12).map(s => ({ id: s.id, ...r32Teams[s.id] })));

  console.log('\nR32 future (July 3):');
  for (const s of R32_SLOTS.slice(12)) {
    console.log(`  ${s.id}: ${r32Teams[s.id].home} vs ${r32Teams[s.id].away} (simulating anyway)`);
    const t = r32Teams[s.id];
    const hp = getPower(t.home); const ap = getPower(t.away);
    const [hs, as] = simulateScore(hp, ap);
    const gs = [...genGoals(t.home, hs, true), ...genGoals(t.away, as, false)];
    gs.sort((a, b) => a.minute - b.minute);
    results[s.id] = { home: t.home, away: t.away, homeScore: hs, awayScore: as, goals: gs };
    console.log(`  → ${t.home} ${hs}-${as} ${t.away}`);
  }

  console.log('\nR16:');
  simulate(R16_SLOTS.map(s => ({ id: s.id, home: getWinner(s.home) || 'TBD', away: getWinner(s.away) || 'TBD' })));

  console.log('\nQF:');
  simulate(QF_SLOTS.map(s => ({ id: s.id, home: getWinner(s.home) || 'TBD', away: getWinner(s.away) || 'TBD' })));

  console.log('\nSF:');
  simulate(SF_SLOTS.map(s => ({ id: s.id, home: getWinner(s.home) || 'TBD', away: getWinner(s.away) || 'TBD' })));

  console.log('\n3RD:');
  const l1 = getLoser('SF-M1') || 'TBD'; const l2 = getLoser('SF-M2') || 'TBD';
  simulate([{ id: '3RD-M1', home: l1, away: l2 }]);

  console.log('\nFINAL:');
  const f1 = getWinner('SF-M1') || 'TBD'; const f2 = getWinner('SF-M2') || 'TBD';
  simulate([{ id: 'FINAL-M1', home: f1, away: f2 }]);

  console.log('\nUpdating DB...');
  for (const [id, r] of Object.entries(results)) {
    const dbMatch = await prisma.match.findUnique({ where: { id } });
    if (!dbMatch) { console.warn(`  Match ${id} not found in DB`); continue; }
    await prisma.match.update({
      where: { id },
      data: { homeTeam: r.home, awayTeam: r.away, homeScore: r.homeScore, awayScore: r.awayScore, goals: r.goals },
    });
  }

  console.log('\nExpanding players...');
  let added = 0;
  const teams = await prisma.team.findMany();
  for (const team of teams) {
    const extra = PLAYER_EXPANSION[team.name];
    if (!extra) continue;
    const existing = await prisma.player.findMany({ where: { teamId: team.id } });
    const names = new Set(existing.map(p => p.name));
    for (const p of extra) {
      if (names.has(p.name)) continue;
      await prisma.player.create({ data: { name: p.name, position: p.position, teamId: team.id } });
      added++;
    }
  }
  console.log(`Added ${added} players`);

  console.log('\n=== FINAL RESULTS ===');
  if (results['FINAL-M1']) {
    const f = results['FINAL-M1'];
    console.log(`🏆 Champion: ${f.homeScore > f.awayScore ? f.home : f.away}`);
    console.log(`🥈 Runner-up: ${f.homeScore > f.awayScore ? f.away : f.home}`);
  }
  if (results['3RD-M1']) {
    const t = results['3RD-M1'];
    console.log(`🥉 3rd: ${t.homeScore > t.awayScore ? t.home : t.away}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
