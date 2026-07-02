import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Plantillas reales/realistas por país
const REAL_PLAYERS: Record<string, { name: string; position: string }[]> = {
  'Argentina': [
    { name: 'Lionel Messi', position: 'Delantero' },
    { name: 'Emiliano Martínez', position: 'Arquero' },
    { name: 'Rodrigo De Paul', position: 'Mediocampista' },
    { name: 'Alexis Mac Allister', position: 'Mediocampista' },
    { name: 'Lautaro Martínez', position: 'Delantero' },
    { name: 'Julián Álvarez', position: 'Delantero' },
  ],
  'Brasil': [
    { name: 'Vinicius Jr', position: 'Delantero' },
    { name: 'Rodrygo', position: 'Delantero' },
    { name: 'Alisson Becker', position: 'Arquero' },
    { name: 'Bruno Guimarães', position: 'Mediocampista' },
    { name: 'Marquinhos', position: 'Defensor' },
    { name: 'Raphinha', position: 'Delantero' },
  ],
  'España': [
    { name: 'Lamine Yamal', position: 'Delantero' },
    { name: 'Pedri', position: 'Mediocampista' },
    { name: 'Rodri', position: 'Mediocampista' },
    { name: 'Álvaro Morata', position: 'Delantero' },
    { name: 'Dani Carvajal', position: 'Defensor' },
    { name: 'Unai Simón', position: 'Arquero' },
  ],
  'Francia': [
    { name: 'Kylian Mbappé', position: 'Delantero' },
    { name: 'Antoine Griezmann', position: 'Mediocampista' },
    { name: 'Aurélien Tchouaméni', position: 'Mediocampista' },
    { name: 'Ousmane Dembélé', position: 'Delantero' },
    { name: 'William Saliba', position: 'Defensor' },
    { name: 'Mike Maignan', position: 'Arquero' },
  ],
  'Inglaterra': [
    { name: 'Jude Bellingham', position: 'Mediocampista' },
    { name: 'Harry Kane', position: 'Delantero' },
    { name: 'Bukayo Saka', position: 'Delantero' },
    { name: 'Phil Foden', position: 'Delantero' },
    { name: 'Declan Rice', position: 'Mediocampista' },
    { name: 'Jordan Pickford', position: 'Arquero' },
  ],
  'Alemania': [
    { name: 'Jamal Musiala', position: 'Mediocampista' },
    { name: 'Florian Wirtz', position: 'Mediocampista' },
    { name: 'Kai Havertz', position: 'Delantero' },
    { name: 'Antonio Rüdiger', position: 'Defensor' },
    { name: 'Marc-André ter Stegen', position: 'Arquero' },
    { name: 'İlkay Gündoğan', position: 'Mediocampista' },
  ],
  'Portugal': [
    { name: 'Cristiano Ronaldo', position: 'Delantero' },
    { name: 'Bruno Fernandes', position: 'Mediocampista' },
    { name: 'Bernardo Silva', position: 'Mediocampista' },
    { name: 'Rúben Dias', position: 'Defensor' },
    { name: 'Rafael Leão', position: 'Delantero' },
    { name: 'Diogo Costa', position: 'Arquero' },
  ],
  'Uruguay': [
    { name: 'Federico Valverde', position: 'Mediocampista' },
    { name: 'Darwin Núñez', position: 'Delantero' },
    { name: 'Ronald Araújo', position: 'Defensor' },
    { name: 'Rodrigo Bentancur', position: 'Mediocampista' },
    { name: 'Facundo Pellistri', position: 'Delantero' },
    { name: 'Sergio Rochet', position: 'Arquero' },
  ],
  'Colombia': [
    { name: 'Luis Díaz', position: 'Delantero' },
    { name: 'James Rodríguez', position: 'Mediocampista' },
    { name: 'Richard Ríos', position: 'Mediocampista' },
    { name: 'Jefferson Lerma', position: 'Mediocampista' },
    { name: 'Davinson Sánchez', position: 'Defensor' },
    { name: 'Camilo Vargas', position: 'Arquero' },
  ],
  'Estados Unidos': [
    { name: 'Christian Pulisic', position: 'Delantero' },
    { name: 'Weston McKennie', position: 'Mediocampista' },
    { name: 'Timothy Weah', position: 'Delantero' },
    { name: 'Tyler Adams', position: 'Mediocampista' },
    { name: 'Antonee Robinson', position: 'Defensor' },
    { name: 'Matt Turner', position: 'Arquero' },
  ],
  'Canadá': [
    { name: 'Alphonso Davies', position: 'Defensor' },
    { name: 'Jonathan David', position: 'Delantero' },
    { name: 'Cyle Larin', position: 'Delantero' },
    { name: 'Stephen Eustáquio', position: 'Mediocampista' },
    { name: 'Tajon Buchanan', position: 'Delantero' },
    { name: 'Maxime Crépeau', position: 'Arquero' },
  ],
  'México': [
    { name: 'Santiago Giménez', position: 'Delantero' },
    { name: 'Hirving Lozano', position: 'Delantero' },
    { name: 'Edson Álvarez', position: 'Mediocampista' },
    { name: 'Luis Chávez', position: 'Mediocampista' },
    { name: 'César Montes', position: 'Defensor' },
    { name: 'Luis Malagón', position: 'Arquero' },
  ],
  'Países Bajos': [
    { name: 'Virgil van Dijk', position: 'Defensor' },
    { name: 'Frenkie de Jong', position: 'Mediocampista' },
    { name: 'Cody Gakpo', position: 'Delantero' },
    { name: 'Memphis Depay', position: 'Delantero' },
    { name: 'Nathan Aké', position: 'Defensor' },
    { name: 'Bart Verbruggen', position: 'Arquero' },
  ],
  'Japón': [
    { name: 'Kaoru Mitoma', position: 'Delantero' },
    { name: 'Takefusa Kubo', position: 'Delantero' },
    { name: 'Wataru Endo', position: 'Mediocampista' },
    { name: 'Ritsu Doan', position: 'Delantero' },
    { name: 'Hiroki Ito', position: 'Defensor' },
    { name: 'Zion Suzuki', position: 'Arquero' },
  ],
  'Bélgica': [
    { name: 'Kevin De Bruyne', position: 'Mediocampista' },
    { name: 'Romelu Lukaku', position: 'Delantero' },
    { name: 'Jeremy Doku', position: 'Delantero' },
    { name: 'Amadou Onana', position: 'Mediocampista' },
    { name: 'Wout Faes', position: 'Defensor' },
    { name: 'Koen Casteels', position: 'Arquero' },
  ],
  'Croacia': [
    { name: 'Luka Modrić', position: 'Mediocampista' },
    { name: 'Mateo Kovačić', position: 'Mediocampista' },
    { name: 'Joško Gvardiol', position: 'Defensor' },
    { name: 'Andrej Kramarić', position: 'Delantero' },
    { name: 'Ivan Perišić', position: 'Delantero' },
    { name: 'Dominik Livaković', position: 'Arquero' },
  ],
};

// Generador de nombres genéricos pero realistas según idioma o estilo del país
const GENERIC_NAMES_POOL = [
  { first: 'John', last: 'Smith', pos: 'Mediocampista' },
  { first: 'Robert', last: 'Miller', pos: 'Defensor' },
  { first: 'Thomas', last: 'Brown', pos: 'Delantero' },
  { first: 'David', last: 'Davis', pos: 'Arquero' },
  { first: 'James', last: 'Wilson', pos: 'Defensor' },
  { first: 'Michael', last: 'Taylor', pos: 'Mediocampista' },
];

async function main() {
  console.log('1. Eliminando jugadores placeholders antiguos...');
  await prisma.player.deleteMany();

  console.log('2. Población de jugadores realistas por equipo...');
  const teams = await prisma.team.findMany();

  for (const team of teams) {
    const realRoster = REAL_PLAYERS[team.name];
    if (realRoster) {
      console.log(`Sembrando plantilla real de: ${team.name}`);
      for (const p of realRoster) {
        await prisma.player.create({
          data: {
            name: p.name,
            position: p.position,
            teamId: team.id,
          },
        });
      }
    } else {
      // Plantilla genérica de alta calidad
      const prefix = team.name.slice(0, 3);
      for (let i = 0; i < 6; i++) {
        const item = GENERIC_NAMES_POOL[i];
        await prisma.player.create({
          data: {
            name: `${item.first} ${item.last} (${prefix})`,
            position: item.pos,
            teamId: team.id,
          },
        });
      }
    }
  }

  console.log('3. Generando resultados y goles detallados (con minuto de juego)...');

  const matches = await prisma.match.findMany({
    where: {
      matchDate: {
        lt: new Date('2026-07-01T00:00:00.000Z'),
      },
    },
  });

  for (const match of matches) {
    // Definir scores realistas
    const r = Math.random();
    let homeScore = 1;
    let awayScore = 0;
    if (r < 0.2) { homeScore = 0; awayScore = 0; }
    else if (r < 0.4) { homeScore = 1; awayScore = 1; }
    else if (r < 0.6) { homeScore = 2; awayScore = 1; }
    else if (r < 0.75) { homeScore = 0; awayScore = 2; }
    else if (r < 0.9) { homeScore = 3; awayScore = 1; }
    else { homeScore = 2; awayScore = 2; }

    // Buscar jugadores de los equipos respectivos para asignar los goles
    const homeTeamDb = await prisma.team.findUnique({
      where: { name: match.homeTeam },
      include: { players: true },
    });
    const awayTeamDb = await prisma.team.findUnique({
      where: { name: match.awayTeam },
      include: { players: true },
    });

    const goals: { player: string; minute: number; team: 'home' | 'away' }[] = [];

    // Goles local
    for (let i = 0; i < homeScore; i++) {
      const pName = homeTeamDb && homeTeamDb.players.length > 0
        ? homeTeamDb.players[Math.floor(Math.random() * homeTeamDb.players.length)].name
        : `Jugador Local ${i + 1}`;
      goals.push({
        player: pName,
        minute: Math.floor(Math.random() * 90) + 1,
        team: 'home',
      });
    }

    // Goles visitante
    for (let i = 0; i < awayScore; i++) {
      const pName = awayTeamDb && awayTeamDb.players.length > 0
        ? awayTeamDb.players[Math.floor(Math.random() * awayTeamDb.players.length)].name
        : `Jugador Visitante ${i + 1}`;
      goals.push({
        player: pName,
        minute: Math.floor(Math.random() * 90) + 1,
        team: 'away',
      });
    }

    // Ordenar goles por minuto
    goals.sort((a, b) => a.minute - b.minute);

    // Guardar partido con marcadores y JSON de goles
    await prisma.match.update({
      where: { id: match.id },
      data: {
        homeScore,
        awayScore,
        goals: JSON.stringify(goals),
      },
    });
  }

  console.log('¡Población completada con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
