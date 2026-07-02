import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEAMS_JSON_URL = 'https://raw.githubusercontent.com/rezarahiminia/worldcup2026/main/football.teams.json';
const MATCHES_JSON_URL = 'https://raw.githubusercontent.com/rezarahiminia/worldcup2026/main/football.matches.json';
const STADIUMS_JSON_URL = 'https://raw.githubusercontent.com/rezarahiminia/worldcup2026/main/football.stadiums.json';

const API_TEAM_TO_DB: Record<string, string> = {
  'Mexico': 'México',
  'South Africa': 'Sudáfrica',
  'South Korea': 'Corea del Sur',
  'Czech Republic': 'Chequia',
  'Canada': 'Canadá',
  'Bosnia and Herzegovina': 'Bosnia',
  'Qatar': 'Qatar',
  'Switzerland': 'Suiza',
  'Brazil': 'Brasil',
  'Morocco': 'Marruecos',
  'Haiti': 'Haití',
  'Scotland': 'Escocia',
  'United States': 'Estados Unidos',
  'Paraguay': 'Paraguay',
  'Australia': 'Australia',
  'Turkey': 'Turquía',
  'Germany': 'Alemania',
  'Curaçao': 'Curazao',
  'Ivory Coast': 'Costa de Marfil',
  'Ecuador': 'Ecuador',
  'Netherlands': 'Países Bajos',
  'Japan': 'Japón',
  'Sweden': 'Suecia',
  'Tunisia': 'Túnez',
  'Belgium': 'Bélgica',
  'Egypt': 'Egipto',
  'Iran': 'Irán',
  'New Zealand': 'Nueva Zelanda',
  'Spain': 'España',
  'Cape Verde': 'Cabo Verde',
  'Saudi Arabia': 'Arabia Saudita',
  'Uruguay': 'Uruguay',
  'France': 'Francia',
  'Senegal': 'Senegal',
  'Iraq': 'Iraq',
  'Norway': 'Noruega',
  'Argentina': 'Argentina',
  'Algeria': 'Argelia',
  'Austria': 'Austria',
  'Jordan': 'Jordania',
  'Portugal': 'Portugal',
  'Democratic Republic of the Congo': 'DR Congo',
  'Uzbekistan': 'Uzbekistán',
  'Colombia': 'Colombia',
  'England': 'Inglaterra',
  'Croatia': 'Croacia',
  'Ghana': 'Ghana',
  'Panama': 'Panamá',
};

const STADIUM_NAMES: Record<string, string> = {
  '1': 'Estadio Azteca',
  '2': 'Estadio Akron',
  '3': 'Estadio BBVA',
  '4': 'AT&T Stadium',
  '5': 'NRG Stadium',
  '6': 'GEHA Field at Arrowhead Stadium',
  '7': 'Mercedes-Benz Stadium',
  '8': 'Hard Rock Stadium',
  '9': 'Gillette Stadium',
  '10': 'Lincoln Financial Field',
  '11': 'MetLife Stadium',
  '12': 'BMO Field',
  '13': 'BC Place',
  '14': 'Lumen Field',
  '15': "Levi's Stadium",
  '16': 'SoFi Stadium',
};

const PHASE_MAP: Record<string, string> = {
  'group': 'GROUP',
  'r32': 'R32',
  'r16': 'R16',
  'qf': 'QF',
  'sf': 'SF',
  '3rd': '3RD',
  'final': 'FINAL',
};

const GROUP_NAME_MAP: Record<string, string> = {
  'r32': 'Ronda de 32',
  'r16': 'Octavos',
  'qf': 'Cuartos',
  'sf': 'Semifinal',
  '3rd': 'Tercer puesto',
  'final': 'Final',
};

const KNOCKOUT_LABELS: Record<string, Record<string, string>> = {
  '73': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M1' },
  '74': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M2' },
  '75': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M3' },
  '76': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M4' },
  '77': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M5' },
  '78': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M6' },
  '79': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M7' },
  '80': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M8' },
  '81': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M9' },
  '82': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M10' },
  '83': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M11' },
  '84': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M12' },
  '85': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M13' },
  '86': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M14' },
  '87': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M15' },
  '88': { phase: 'R32', groupName: 'Ronda de 32', id: 'R32-M16' },
  '89': { phase: 'R16', groupName: 'Octavos', id: 'R16-M1' },
  '90': { phase: 'R16', groupName: 'Octavos', id: 'R16-M2' },
  '91': { phase: 'R16', groupName: 'Octavos', id: 'R16-M3' },
  '92': { phase: 'R16', groupName: 'Octavos', id: 'R16-M4' },
  '93': { phase: 'R16', groupName: 'Octavos', id: 'R16-M5' },
  '94': { phase: 'R16', groupName: 'Octavos', id: 'R16-M6' },
  '95': { phase: 'R16', groupName: 'Octavos', id: 'R16-M7' },
  '96': { phase: 'R16', groupName: 'Octavos', id: 'R16-M8' },
  '97': { phase: 'QF', groupName: 'Cuartos', id: 'QF-M1' },
  '98': { phase: 'QF', groupName: 'Cuartos', id: 'QF-M2' },
  '99': { phase: 'QF', groupName: 'Cuartos', id: 'QF-M3' },
  '100': { phase: 'QF', groupName: 'Cuartos', id: 'QF-M4' },
  '101': { phase: 'SF', groupName: 'Semifinal', id: 'SF-M1' },
  '102': { phase: 'SF', groupName: 'Semifinal', id: 'SF-M2' },
  '103': { phase: '3RD', groupName: 'Tercer puesto', id: '3RD-M1' },
  '104': { phase: 'FINAL', groupName: 'Final', id: 'FINAL-M1' },
};

function parseApiDate(localDate: string): Date {
  const [datePart, timePart] = localDate.split(' ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute] = timePart.split(':');
  return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute)));
}

function translateLabel(label: string): string {
  return label
    .replace(/^Winner Group /, '1° Grupo ')
    .replace(/^Runner-up Group /, '2° Grupo ')
    .replace(/^3rd Group /, '3° Grupo ')
    .replace(/\//g, '/');
}

async function main() {
  console.log('Fetching API data...');
  const [teamsRes, matchesRes, stadiumsRes] = await Promise.all([
    fetch(TEAMS_JSON_URL),
    fetch(MATCHES_JSON_URL),
    fetch(STADIUMS_JSON_URL),
  ]);
  const apiTeams = await teamsRes.json() as any[];
  const apiMatches = await matchesRes.json() as any[];
  const apiStadiums = await stadiumsRes.json() as any[];

  console.log(`Got ${apiTeams.length} teams, ${apiMatches.length} matches, ${apiStadiums.length} stadiums`);

  const teamIdMap: Record<string, string> = {};
  for (const t of apiTeams) {
    const dbName = API_TEAM_TO_DB[t.name_en];
    if (dbName) {
      teamIdMap[t.id] = dbName;
    } else {
      console.warn(`No DB mapping for API team: ${t.name_en} (id=${t.id})`);
    }
  }

  let groupUpdated = 0;
  let knockoutUpdated = 0;

  for (const match of apiMatches) {
    const apiId = match.id;
    const type = match.type;
    const group = match.group;
    const localDate = match.local_date;
    const stadiumId = match.stadium_id;
    const stadiumName = STADIUM_NAMES[stadiumId] || null;
    const matchDate = parseApiDate(localDate);

    if (type === 'group') {
      const homeTeamId = match.home_team_id;
      const awayTeamId = match.away_team_id;
      const homeTeam = teamIdMap[homeTeamId];
      const awayTeam = teamIdMap[awayTeamId];

      if (!homeTeam || !awayTeam) {
        console.warn(`Cannot resolve teams for group match ${apiId}: home=${homeTeamId}(${homeTeam}), away=${awayTeamId}(${awayTeam})`);
        continue;
      }

      let existing = await prisma.match.findFirst({
        where: { groupName: group, homeTeam, awayTeam },
      });

      if (!existing) {
        existing = await prisma.match.findFirst({
          where: { groupName: group, homeTeam: awayTeam, awayTeam: homeTeam },
        });
      }

      if (existing) {
        await prisma.match.update({
          where: { id: existing.id },
          data: { matchDate, stadium: stadiumName },
        });
        groupUpdated++;
      } else {
        console.warn(`Group match not found in DB: ${group}: ${homeTeam} vs ${awayTeam} (nor swapped)`);
      }
    } else {
      const map = KNOCKOUT_LABELS[apiId];
      if (!map) {
        console.warn(`No mapping for knockout match API id ${apiId}`);
        continue;
      }

      let homeLabel = match.home_team_label || '';
      let awayLabel = match.away_team_label || '';
      homeLabel = translateLabel(homeLabel);
      awayLabel = translateLabel(awayLabel);

      const existing = await prisma.match.findUnique({
        where: { id: map.id },
      });

      if (existing) {
        await prisma.match.update({
          where: { id: map.id },
          data: {
            groupName: map.groupName,
            phase: map.phase,
            homeTeam: homeLabel,
            awayTeam: awayLabel,
            homeFlag: '🏳️',
            awayFlag: '🏳️',
            matchDate,
            stadium: stadiumName,
          },
        });
        knockoutUpdated++;
      } else {
        console.warn(`Knockout match not found in DB: ${map.id}`);
      }
    }
  }

  console.log(`\nDone! Updated ${groupUpdated} group matches, ${knockoutUpdated} knockout matches.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
