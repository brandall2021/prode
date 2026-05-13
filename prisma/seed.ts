import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedMatch = {
  groupName: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  day: number;
  month: number;
  hourUtc: number;
  stadium?: string;
};

// Banderas emoji
const FLAGS: Record<string, string> = {
  Mexico: '🇲🇽',
  Sudafrica: '🇿🇦',
  CoreaDelSur: '🇰🇷',
  Chequia: '🇨🇿',
  Canada: '🇨🇦',
  Suiza: '🇨🇭',
  Qatar: '🇶🇦',
  Bosnia: '🇧🇦',
  Brasil: '🇧🇷',
  Marruecos: '🇲🇦',
  Haiti: '🇭🇹',
  Escocia: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  EstadosUnidos: '🇺🇸',
  Paraguay: '🇵🇾',
  Australia: '🇦🇺',
  Turquia: '🇹🇷',
  Alemania: '🇩🇪',
  Curazao: '🇨🇼',
  CostaDeMarfil: '🇨🇮',
  Ecuador: '🇪🇨',
  PaisesBajos: '🇳🇱',
  Japon: '🇯🇵',
  Tunez: '🇹🇳',
  Suecia: '🇸🇪',
  Belgica: '🇧🇪',
  Egipto: '🇪🇬',
  Iran: '🇮🇷',
  NuevaZelanda: '🇳🇿',
  Espana: '🇪🇸',
  CaboVerde: '🇨🇻',
  ArabiaSaudita: '🇸🇦',
  Uruguay: '🇺🇾',
  Francia: '🇫🇷',
  Senegal: '🇸🇳',
  Noruega: '🇳🇴',
  Iraq: '🇮🇶',
  Argentina: '🇦🇷',
  Argelia: '🇩🇿',
  Austria: '🇦🇹',
  Jordania: '🇯🇴',
  Portugal: '🇵🇹',
  Colombia: '🇨🇴',
  Uzbekistan: '🇺🇿',
  DRCongo: '🇨🇩',
  Inglaterra: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Croacia: '🇭🇷',
  Ghana: '🇬🇭',
  Panama: '🇵🇦',
};

// Nombres en español
const NAME: Record<string, string> = {
  Mexico: 'México',
  Sudafrica: 'Sudáfrica',
  CoreaDelSur: 'Corea del Sur',
  Chequia: 'Chequia',
  Canada: 'Canadá',
  Suiza: 'Suiza',
  Qatar: 'Qatar',
  Bosnia: 'Bosnia',
  Brasil: 'Brasil',
  Marruecos: 'Marruecos',
  Haiti: 'Haití',
  Escocia: 'Escocia',
  EstadosUnidos: 'Estados Unidos',
  Paraguay: 'Paraguay',
  Australia: 'Australia',
  Turquia: 'Turquía',
  Alemania: 'Alemania',
  Curazao: 'Curazao',
  CostaDeMarfil: 'Costa de Marfil',
  Ecuador: 'Ecuador',
  PaisesBajos: 'Países Bajos',
  Japon: 'Japón',
  Tunez: 'Túnez',
  Suecia: 'Suecia',
  Belgica: 'Bélgica',
  Egipto: 'Egipto',
  Iran: 'Irán',
  NuevaZelanda: 'Nueva Zelanda',
  Espana: 'España',
  CaboVerde: 'Cabo Verde',
  ArabiaSaudita: 'Arabia Saudita',
  Uruguay: 'Uruguay',
  Francia: 'Francia',
  Senegal: 'Senegal',
  Noruega: 'Noruega',
  Iraq: 'Iraq',
  Argentina: 'Argentina',
  Argelia: 'Argelia',
  Austria: 'Austria',
  Jordania: 'Jordania',
  Portugal: 'Portugal',
  Colombia: 'Colombia',
  Uzbekistan: 'Uzbekistán',
  DRCongo: 'DR Congo',
  Inglaterra: 'Inglaterra',
  Croacia: 'Croacia',
  Ghana: 'Ghana',
  Panama: 'Panamá',
};

// Helper para construir partido
const m = (
  groupName: string,
  home: string,
  away: string,
  day: number,
  month: number,
  hourUtc: number,
  stadium?: string,
): SeedMatch => ({
  groupName,
  homeTeam: NAME[home],
  awayTeam: NAME[away],
  homeFlag: FLAGS[home],
  awayFlag: FLAGS[away],
  day,
  month,
  hourUtc,
  stadium,
});

// Eliminatorias: equipos placeholder actualizables desde el panel admin
const TBD_FLAG = '🏳️';

type SeedKnockout = {
  id: string;
  groupName: string;
  phase: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  day: number;
  month: number;
  hourUtc: number;
  stadium?: string;
};

const knockoutMatches: SeedKnockout[] = [
  // RONDA DE 32 (16 partidos) — 29 jun al 2 jul
  { id: 'R32-M1',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo A', awayTeam: '2° Grupo C', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 29, month: 6, hourUtc: 19 },
  { id: 'R32-M2',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo B', awayTeam: '2° Grupo D', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 29, month: 6, hourUtc: 22 },
  { id: 'R32-M3',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo C', awayTeam: '2° Grupo A', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 30, month: 6, hourUtc: 19 },
  { id: 'R32-M4',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo D', awayTeam: '2° Grupo B', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 30, month: 6, hourUtc: 22 },
  { id: 'R32-M5',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo E', awayTeam: '2° Grupo G', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 1,  month: 7, hourUtc: 19 },
  { id: 'R32-M6',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo F', awayTeam: '2° Grupo H', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 1,  month: 7, hourUtc: 22 },
  { id: 'R32-M7',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo G', awayTeam: '2° Grupo E', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 2,  month: 7, hourUtc: 19 },
  { id: 'R32-M8',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo H', awayTeam: '2° Grupo F', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 2,  month: 7, hourUtc: 22 },
  { id: 'R32-M9',  groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo I', awayTeam: '3° Grupo (1)', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 29, month: 6, hourUtc: 16 },
  { id: 'R32-M10', groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo J', awayTeam: '3° Grupo (2)', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 30, month: 6, hourUtc: 16 },
  { id: 'R32-M11', groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo K', awayTeam: '3° Grupo (3)', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 1,  month: 7, hourUtc: 16 },
  { id: 'R32-M12', groupName: 'Ronda de 32', phase: 'R32', homeTeam: '1° Grupo L', awayTeam: '3° Grupo (4)', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 2,  month: 7, hourUtc: 16 },
  { id: 'R32-M13', groupName: 'Ronda de 32', phase: 'R32', homeTeam: '2° Grupo I', awayTeam: '3° Grupo (5)', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 29, month: 6, hourUtc: 1  },
  { id: 'R32-M14', groupName: 'Ronda de 32', phase: 'R32', homeTeam: '2° Grupo J', awayTeam: '3° Grupo (6)', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 30, month: 6, hourUtc: 1  },
  { id: 'R32-M15', groupName: 'Ronda de 32', phase: 'R32', homeTeam: '2° Grupo K', awayTeam: '3° Grupo (7)', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 1,  month: 7, hourUtc: 1  },
  { id: 'R32-M16', groupName: 'Ronda de 32', phase: 'R32', homeTeam: '2° Grupo L', awayTeam: '3° Grupo (8)', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 2,  month: 7, hourUtc: 1  },

  // OCTAVOS DE FINAL (8 partidos) — 5 al 8 jul
  { id: 'R16-M1', groupName: 'Octavos', phase: 'R16', homeTeam: 'Gan. R32-M1',  awayTeam: 'Gan. R32-M2',  homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 5, month: 7, hourUtc: 19 },
  { id: 'R16-M2', groupName: 'Octavos', phase: 'R16', homeTeam: 'Gan. R32-M3',  awayTeam: 'Gan. R32-M4',  homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 5, month: 7, hourUtc: 22 },
  { id: 'R16-M3', groupName: 'Octavos', phase: 'R16', homeTeam: 'Gan. R32-M5',  awayTeam: 'Gan. R32-M6',  homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 6, month: 7, hourUtc: 19 },
  { id: 'R16-M4', groupName: 'Octavos', phase: 'R16', homeTeam: 'Gan. R32-M7',  awayTeam: 'Gan. R32-M8',  homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 6, month: 7, hourUtc: 22 },
  { id: 'R16-M5', groupName: 'Octavos', phase: 'R16', homeTeam: 'Gan. R32-M9',  awayTeam: 'Gan. R32-M10', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 7, month: 7, hourUtc: 19 },
  { id: 'R16-M6', groupName: 'Octavos', phase: 'R16', homeTeam: 'Gan. R32-M11', awayTeam: 'Gan. R32-M12', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 7, month: 7, hourUtc: 22 },
  { id: 'R16-M7', groupName: 'Octavos', phase: 'R16', homeTeam: 'Gan. R32-M13', awayTeam: 'Gan. R32-M14', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 8, month: 7, hourUtc: 19 },
  { id: 'R16-M8', groupName: 'Octavos', phase: 'R16', homeTeam: 'Gan. R32-M15', awayTeam: 'Gan. R32-M16', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 8, month: 7, hourUtc: 22 },

  // CUARTOS DE FINAL (4 partidos) — 10 y 11 jul
  { id: 'QF-M1', groupName: 'Cuartos', phase: 'QF', homeTeam: 'Gan. R16-M1', awayTeam: 'Gan. R16-M2', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 10, month: 7, hourUtc: 19 },
  { id: 'QF-M2', groupName: 'Cuartos', phase: 'QF', homeTeam: 'Gan. R16-M3', awayTeam: 'Gan. R16-M4', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 10, month: 7, hourUtc: 22 },
  { id: 'QF-M3', groupName: 'Cuartos', phase: 'QF', homeTeam: 'Gan. R16-M5', awayTeam: 'Gan. R16-M6', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 11, month: 7, hourUtc: 19 },
  { id: 'QF-M4', groupName: 'Cuartos', phase: 'QF', homeTeam: 'Gan. R16-M7', awayTeam: 'Gan. R16-M8', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 11, month: 7, hourUtc: 22 },

  // SEMIFINALES (2 partidos) — 14 y 15 jul
  { id: 'SF-M1', groupName: 'Semifinal', phase: 'SF', homeTeam: 'Gan. QF-M1', awayTeam: 'Gan. QF-M2', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 14, month: 7, hourUtc: 22 },
  { id: 'SF-M2', groupName: 'Semifinal', phase: 'SF', homeTeam: 'Gan. QF-M3', awayTeam: 'Gan. QF-M4', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 15, month: 7, hourUtc: 22 },

  // TERCER PUESTO — 18 jul
  { id: '3RD-M1', groupName: 'Tercer puesto', phase: '3RD', homeTeam: 'Per. SF-M1', awayTeam: 'Per. SF-M2', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 18, month: 7, hourUtc: 19 },

  // FINAL — 19 jul, MetLife Stadium
  { id: 'FINAL-M1', groupName: 'Final', phase: 'FINAL', homeTeam: 'Gan. SF-M1', awayTeam: 'Gan. SF-M2', homeFlag: TBD_FLAG, awayFlag: TBD_FLAG, day: 19, month: 7, hourUtc: 22, stadium: 'MetLife Stadium' },
];

// Horarios UTC tentativos (ART = UTC-3). Pueden editarse desde el admin.
// 19 UTC = 16 ART, 22 UTC = 19 ART, 01 UTC = 22 ART del día previo.
const matches: SeedMatch[] = [
  // GRUPO A
  m('A', 'Mexico', 'Sudafrica', 11, 6, 22, 'Estadio Azteca'),
  m('A', 'CoreaDelSur', 'Chequia', 11, 6, 19, 'Estadio Akron'),
  m('A', 'Chequia', 'Sudafrica', 18, 6, 19, 'Mercedes-Benz Stadium'),
  m('A', 'Mexico', 'CoreaDelSur', 18, 6, 22, 'Estadio Akron'),
  m('A', 'Chequia', 'Mexico', 24, 6, 22, 'Estadio Azteca'),
  m('A', 'Sudafrica', 'CoreaDelSur', 24, 6, 19, 'Estadio BBVA'),

  // GRUPO B
  m('B', 'Canada', 'Bosnia', 12, 6, 22),
  m('B', 'Qatar', 'Suiza', 13, 6, 19),
  m('B', 'Suiza', 'Bosnia', 18, 6, 16),
  m('B', 'Canada', 'Qatar', 18, 6, 1),
  m('B', 'Suiza', 'Canada', 24, 6, 1),
  m('B', 'Bosnia', 'Qatar', 24, 6, 16),

  // GRUPO C
  m('C', 'Brasil', 'Marruecos', 13, 6, 22),
  m('C', 'Haiti', 'Escocia', 13, 6, 16),
  m('C', 'Marruecos', 'Escocia', 19, 6, 19),
  m('C', 'Brasil', 'Haiti', 19, 6, 22),
  m('C', 'Escocia', 'Brasil', 25, 6, 22),
  m('C', 'Haiti', 'Marruecos', 25, 6, 19),

  // GRUPO D
  m('D', 'EstadosUnidos', 'Paraguay', 12, 6, 19),
  m('D', 'Australia', 'Turquia', 13, 6, 1),
  m('D', 'Paraguay', 'Turquia', 19, 6, 16),
  m('D', 'EstadosUnidos', 'Australia', 19, 6, 1),
  m('D', 'Turquia', 'EstadosUnidos', 25, 6, 1),
  m('D', 'Paraguay', 'Australia', 25, 6, 16),

  // GRUPO E
  m('E', 'Alemania', 'CostaDeMarfil', 14, 6, 19),
  m('E', 'Curazao', 'Ecuador', 14, 6, 22),
  m('E', 'CostaDeMarfil', 'Ecuador', 20, 6, 19),
  m('E', 'Alemania', 'Curazao', 20, 6, 22),
  m('E', 'Ecuador', 'Alemania', 25, 6, 22),
  m('E', 'CostaDeMarfil', 'Curazao', 25, 6, 19),

  // GRUPO F
  m('F', 'PaisesBajos', 'Japon', 14, 6, 16),
  m('F', 'Tunez', 'Suecia', 15, 6, 16),
  m('F', 'Japon', 'Suecia', 20, 6, 16),
  m('F', 'PaisesBajos', 'Tunez', 20, 6, 1),
  m('F', 'Suecia', 'PaisesBajos', 26, 6, 1),
  m('F', 'Japon', 'Tunez', 26, 6, 16),

  // GRUPO G
  m('G', 'Belgica', 'Egipto', 15, 6, 19),
  m('G', 'Iran', 'NuevaZelanda', 15, 6, 22),
  m('G', 'Egipto', 'NuevaZelanda', 21, 6, 16),
  m('G', 'Belgica', 'Iran', 21, 6, 19),
  m('G', 'NuevaZelanda', 'Belgica', 26, 6, 19),
  m('G', 'Egipto', 'Iran', 26, 6, 22),

  // GRUPO H
  m('H', 'Espana', 'CaboVerde', 15, 6, 1),
  m('H', 'ArabiaSaudita', 'Uruguay', 16, 6, 16),
  m('H', 'CaboVerde', 'Uruguay', 21, 6, 22),
  m('H', 'Espana', 'ArabiaSaudita', 21, 6, 1),
  m('H', 'Uruguay', 'Espana', 26, 6, 22),
  m('H', 'CaboVerde', 'ArabiaSaudita', 26, 6, 19),

  // GRUPO I
  m('I', 'Francia', 'Senegal', 16, 6, 19),
  m('I', 'Noruega', 'Iraq', 16, 6, 22),
  m('I', 'Senegal', 'Iraq', 22, 6, 16),
  m('I', 'Francia', 'Noruega', 22, 6, 22),
  m('I', 'Iraq', 'Francia', 27, 6, 16),
  m('I', 'Senegal', 'Noruega', 27, 6, 19),

  // GRUPO J
  m('J', 'Argentina', 'Argelia', 16, 6, 1),
  m('J', 'Austria', 'Jordania', 17, 6, 16),
  m('J', 'Argelia', 'Jordania', 22, 6, 19),
  m('J', 'Argentina', 'Austria', 22, 6, 1),
  m('J', 'Jordania', 'Argentina', 27, 6, 1),
  m('J', 'Argelia', 'Austria', 27, 6, 22),

  // GRUPO K
  m('K', 'Portugal', 'Colombia', 17, 6, 22),
  m('K', 'Uzbekistan', 'DRCongo', 17, 6, 19),
  m('K', 'Colombia', 'DRCongo', 23, 6, 19),
  m('K', 'Portugal', 'Uzbekistan', 23, 6, 22),
  m('K', 'DRCongo', 'Portugal', 27, 6, 22),
  m('K', 'Colombia', 'Uzbekistan', 27, 6, 1),

  // GRUPO L
  m('L', 'Inglaterra', 'Croacia', 17, 6, 1),
  m('L', 'Ghana', 'Panama', 18, 6, 22),
  m('L', 'Croacia', 'Panama', 23, 6, 16),
  m('L', 'Inglaterra', 'Ghana', 23, 6, 1),
  m('L', 'Panama', 'Inglaterra', 28, 6, 22),
  m('L', 'Croacia', 'Ghana', 28, 6, 19),
];

async function main() {
  console.log(`Cargando ${matches.length} partidos de grupos...`);

  for (const match of matches) {
    const matchDate = new Date(Date.UTC(2026, match.month - 1, match.day, match.hourUtc, 0, 0));

    await prisma.match.upsert({
      where: {
        id: `${match.groupName}-${match.homeTeam}-${match.awayTeam}-${match.day}${match.month}`.replace(/\s+/g, '_'),
      },
      update: {
        matchDate,
        stadium: match.stadium,
      },
      create: {
        id: `${match.groupName}-${match.homeTeam}-${match.awayTeam}-${match.day}${match.month}`.replace(/\s+/g, '_'),
        groupName: match.groupName,
        phase: 'GROUP',
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeFlag: match.homeFlag,
        awayFlag: match.awayFlag,
        matchDate,
        stadium: match.stadium,
      },
    });
  }

  console.log(`Cargando ${knockoutMatches.length} partidos de eliminatorias...`);

  for (const match of knockoutMatches) {
    const matchDate = new Date(Date.UTC(2026, match.month - 1, match.day, match.hourUtc, 0, 0));

    await prisma.match.upsert({
      where: { id: match.id },
      update: {
        matchDate,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        stadium: match.stadium,
      },
      create: {
        id: match.id,
        groupName: match.groupName,
        phase: match.phase,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeFlag: match.homeFlag,
        awayFlag: match.awayFlag,
        matchDate,
        stadium: match.stadium,
      },
    });
  }

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
