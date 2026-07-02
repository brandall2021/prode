import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REAL_PLAYERS: Record<string, { name: string; position: string }[]> = {
  'México': [
    { name: 'Santiago Giménez', position: 'Delantero' },
    { name: 'Hirving Lozano', position: 'Delantero' },
    { name: 'Edson Álvarez', position: 'Mediocampista' },
    { name: 'Luis Chávez', position: 'Mediocampista' },
    { name: 'César Montes', position: 'Defensor' },
    { name: 'Luis Malagón', position: 'Arquero' },
  ],
  'Sudáfrica': [
    { name: 'Percy Tau', position: 'Delantero' },
    { name: 'Ronwen Williams', position: 'Arquero' },
    { name: 'Teboho Mokoena', position: 'Mediocampista' },
    { name: 'Themba Zwane', position: 'Mediocampista' },
    { name: 'Aubrey Modiba', position: 'Defensor' },
    { name: 'Mothobi Mvala', position: 'Defensor' },
  ],
  'Corea del Sur': [
    { name: 'Heung-min Son', position: 'Delantero' },
    { name: 'Kang-in Lee', position: 'Mediocampista' },
    { name: 'Min-jae Kim', position: 'Defensor' },
    { name: 'Hee-chan Hwang', position: 'Delantero' },
    { name: 'Jae-sung Lee', position: 'Mediocampista' },
    { name: 'Jo Hyeon-woo', position: 'Arquero' },
  ],
  'Chequia': [
    { name: 'Patrik Schick', position: 'Delantero' },
    { name: 'Tomáš Souček', position: 'Mediocampista' },
    { name: 'Vladimír Coufal', position: 'Defensor' },
    { name: 'Adam Hložek', position: 'Delantero' },
    { name: 'Antonín Barák', position: 'Mediocampista' },
    { name: 'Jindřich Staněk', position: 'Arquero' },
  ],
  'Canadá': [
    { name: 'Alphonso Davies', position: 'Defensor' },
    { name: 'Jonathan David', position: 'Delantero' },
    { name: 'Cyle Larin', position: 'Delantero' },
    { name: 'Stephen Eustáquio', position: 'Mediocampista' },
    { name: 'Tajon Buchanan', position: 'Delantero' },
    { name: 'Maxime Crépeau', position: 'Arquero' },
  ],
  'Suiza': [
    { name: 'Granit Xhaka', position: 'Mediocampista' },
    { name: 'Manuel Akanji', position: 'Defensor' },
    { name: 'Yann Sommer', position: 'Arquero' },
    { name: 'Xherdan Shaqiri', position: 'Mediocampista' },
    { name: 'Breel Embolo', position: 'Delantero' },
    { name: 'Remo Freuler', position: 'Mediocampista' },
  ],
  'Qatar': [
    { name: 'Akram Afif', position: 'Delantero' },
    { name: 'Almoez Ali', position: 'Delantero' },
    { name: 'Hassan Al-Haydos', position: 'Mediocampista' },
    { name: 'Boualem Khoukhi', position: 'Defensor' },
    { name: 'Lucas Mendes', position: 'Defensor' },
    { name: 'Meshaal Barsham', position: 'Arquero' },
  ],
  'Bosnia': [
    { name: 'Edin Džeko', position: 'Delantero' },
    { name: 'Sead Kolašinac', position: 'Defensor' },
    { name: 'Miralem Pjanić', position: 'Mediocampista' },
    { name: 'Rade Krunić', position: 'Mediocampista' },
    { name: 'Amar Dedić', position: 'Defensor' },
    { name: 'Ibrahim Šehić', position: 'Arquero' },
  ],
  'Brasil': [
    { name: 'Vinicius Jr', position: 'Delantero' },
    { name: 'Rodrygo', position: 'Delantero' },
    { name: 'Alisson Becker', position: 'Arquero' },
    { name: 'Bruno Guimarães', position: 'Mediocampista' },
    { name: 'Marquinhos', position: 'Defensor' },
    { name: 'Raphinha', position: 'Delantero' },
  ],
  'Marruecos': [
    { name: 'Achraf Hakimi', position: 'Defensor' },
    { name: 'Yassine Bounou', position: 'Arquero' },
    { name: 'Hakim Ziyech', position: 'Delantero' },
    { name: 'Sofyan Amrabat', position: 'Mediocampista' },
    { name: 'Brahim Díaz', position: 'Mediocampista' },
    { name: 'Youssef En-Nesyri', position: 'Delantero' },
  ],
  'Haití': [
    { name: 'Duckens Nazon', position: 'Delantero' },
    { name: 'Frantzdy Pierrot', position: 'Delantero' },
    { name: 'Wilde-Donald Guerrier', position: 'Defensor' },
    { name: 'Carlens Arcus', position: 'Defensor' },
    { name: 'Johny Placide', position: 'Arquero' },
    { name: 'Danley Jean Jacques', position: 'Mediocampista' },
  ],
  'Escocia': [
    { name: 'Scott McTominay', position: 'Mediocampista' },
    { name: 'Andy Robertson', position: 'Defensor' },
    { name: 'John McGinn', position: 'Mediocampista' },
    { name: 'Billy Gilmour', position: 'Mediocampista' },
    { name: 'Che Adams', position: 'Delantero' },
    { name: 'Angus Gunn', position: 'Arquero' },
  ],
  'Estados Unidos': [
    { name: 'Christian Pulisic', position: 'Delantero' },
    { name: 'Weston McKennie', position: 'Mediocampista' },
    { name: 'Timothy Weah', position: 'Delantero' },
    { name: 'Tyler Adams', position: 'Mediocampista' },
    { name: 'Antonee Robinson', position: 'Defensor' },
    { name: 'Matt Turner', position: 'Arquero' },
  ],
  'Paraguay': [
    { name: 'Miguel Almirón', position: 'Delantero' },
    { name: 'Julio Enciso', position: 'Delantero' },
    { name: 'Gustavo Gómez', position: 'Defensor' },
    { name: 'Ramón Sosa', position: 'Delantero' },
    { name: 'Mathías Villasanti', position: 'Mediocampista' },
    { name: 'Carlos Coronel', position: 'Arquero' },
  ],
  'Australia': [
    { name: 'Mathew Ryan', position: 'Arquero' },
    { name: 'Harry Souttar', position: 'Defensor' },
    { name: 'Jackson Irvine', position: 'Mediocampista' },
    { name: 'Mitchell Duke', position: 'Delantero' },
    { name: 'Craig Goodwin', position: 'Delantero' },
    { name: 'Connor Metcalfe', position: 'Mediocampista' },
  ],
  'Turquía': [
    { name: 'Arda Güler', position: 'Mediocampista' },
    { name: 'Hakan Çalhanoğlu', position: 'Mediocampista' },
    { name: 'Kenan Yıldız', position: 'Delantero' },
    { name: 'Kerem Aktürkoğlu', position: 'Delantero' },
    { name: 'Ferdi Kadıoğlu', position: 'Defensor' },
    { name: 'Uğurcan Çakır', position: 'Arquero' },
  ],
  'Alemania': [
    { name: 'Jamal Musiala', position: 'Mediocampista' },
    { name: 'Florian Wirtz', position: 'Mediocampista' },
    { name: 'Kai Havertz', position: 'Delantero' },
    { name: 'Antonio Rüdiger', position: 'Defensor' },
    { name: 'Marc-André ter Stegen', position: 'Arquero' },
    { name: 'İlkay Gündoğan', position: 'Mediocampista' },
  ],
  'Curazao': [
    { name: 'Juninho Bacuna', position: 'Mediocampista' },
    { name: 'Leandro Bacuna', position: 'Mediocampista' },
    { name: 'Kenji Gorré', position: 'Delantero' },
    { name: 'Vurnon Anita', position: 'Mediocampista' },
    { name: 'Roshon van Eijma', position: 'Defensor' },
    { name: 'Eloy Room', position: 'Arquero' },
  ],
  'Costa de Marfil': [
    { name: 'Sébastien Haller', position: 'Delantero' },
    { name: 'Franck Kessié', position: 'Mediocampista' },
    { name: 'Simon Adingra', position: 'Delantero' },
    { name: 'Seko Fofana', position: 'Mediocampista' },
    { name: 'Odilon Kossounou', position: 'Defensor' },
    { name: 'Yahia Fofana', position: 'Arquero' },
  ],
  'Ecuador': [
    { name: 'Moisés Caicedo', position: 'Mediocampista' },
    { name: 'Enner Valencia', position: 'Delantero' },
    { name: 'Piero Hincapié', position: 'Defensor' },
    { name: 'Willian Pacho', position: 'Defensor' },
    { name: 'Kendry Páez', position: 'Mediocampista' },
    { name: 'Alexander Domínguez', position: 'Arquero' },
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
  'Túnez': [
    { name: 'Ellyes Skhiri', position: 'Mediocampista' },
    { name: 'Youssef Msakni', position: 'Delantero' },
    { name: 'Hannibal Mejbri', position: 'Mediocampista' },
    { name: 'Montassar Talbi', position: 'Defensor' },
    { name: 'Ali Abdi', position: 'Defensor' },
    { name: 'Bechir Ben Saïd', position: 'Arquero' },
  ],
  'Suecia': [
    { name: 'Alexander Isak', position: 'Delantero' },
    { name: 'Dejan Kulusevski', position: 'Mediocampista' },
    { name: 'Viktor Gyökeres', position: 'Delantero' },
    { name: 'Emil Forsberg', position: 'Mediocampista' },
    { name: 'Victor Lindelöf', position: 'Defensor' },
    { name: 'Robin Olsen', position: 'Arquero' },
  ],
  'Bélgica': [
    { name: 'Kevin De Bruyne', position: 'Mediocampista' },
    { name: 'Romelu Lukaku', position: 'Delantero' },
    { name: 'Jeremy Doku', position: 'Delantero' },
    { name: 'Amadou Onana', position: 'Mediocampista' },
    { name: 'Wout Faes', position: 'Defensor' },
    { name: 'Koen Casteels', position: 'Arquero' },
  ],
  'Egipto': [
    { name: 'Mohamed Salah', position: 'Delantero' },
    { name: 'Mostafa Mohamed', position: 'Delantero' },
    { name: 'Trezeguet', position: 'Delantero' },
    { name: 'Mohamed Elneny', position: 'Mediocampista' },
    { name: 'Ahmed Hegazi', position: 'Defensor' },
    { name: 'Mohamed El Shenawy', position: 'Arquero' },
  ],
  'Irán': [
    { name: 'Mehdi Taremi', position: 'Delantero' },
    { name: 'Sardar Azmoun', position: 'Delantero' },
    { name: 'Alireza Jahanbakhsh', position: 'Delantero' },
    { name: 'Saman Ghoddos', position: 'Mediocampista' },
    { name: 'Milad Mohammadi', position: 'Defensor' },
    { name: 'Alireza Beiranvand', position: 'Arquero' },
  ],
  'Nueva Zelanda': [
    { name: 'Chris Wood', position: 'Delantero' },
    { name: 'Liberato Cacace', position: 'Defensor' },
    { name: 'Sarpreet Singh', position: 'Mediocampista' },
    { name: 'Marko Stamenic', position: 'Mediocampista' },
    { name: 'Joe Bell', position: 'Mediocampista' },
    { name: 'Alex Paulsen', position: 'Arquero' },
  ],
  'España': [
    { name: 'Lamine Yamal', position: 'Delantero' },
    { name: 'Pedri', position: 'Mediocampista' },
    { name: 'Rodri', position: 'Mediocampista' },
    { name: 'Álvaro Morata', position: 'Delantero' },
    { name: 'Dani Carvajal', position: 'Defensor' },
    { name: 'Unai Simón', position: 'Arquero' },
  ],
  'Cabo Verde': [
    { name: 'Ryan Mendes', position: 'Delantero' },
    { name: 'Garry Rodrigues', position: 'Delantero' },
    { name: 'Bebé', position: 'Delantero' },
    { name: 'Logan Costa', position: 'Defensor' },
    { name: 'Jamiro Monteiro', position: 'Mediocampista' },
    { name: 'Vozinha', position: 'Arquero' },
  ],
  'Arabia Saudita': [
    { name: 'Salem Al-Dawsari', position: 'Delantero' },
    { name: 'Firas Al-Buraikan', position: 'Delantero' },
    { name: 'Saleh Al-Shehri', position: 'Delantero' },
    { name: 'Mohamed Kanno', position: 'Mediocampista' },
    { name: 'Ali Al-Bulaihi', position: 'Defensor' },
    { name: 'Mohammed Al-Owais', position: 'Arquero' },
  ],
  'Uruguay': [
    { name: 'Federico Valverde', position: 'Mediocampista' },
    { name: 'Darwin Núñez', position: 'Delantero' },
    { name: 'Ronald Araújo', position: 'Defensor' },
    { name: 'Rodrigo Bentancur', position: 'Mediocampista' },
    { name: 'Facundo Pellistri', position: 'Delantero' },
    { name: 'Sergio Rochet', position: 'Arquero' },
  ],
  'Francia': [
    { name: 'Kylian Mbappé', position: 'Delantero' },
    { name: 'Antoine Griezmann', position: 'Mediocampista' },
    { name: 'Aurélien Tchouaméni', position: 'Mediocampista' },
    { name: 'Ousmane Dembélé', position: 'Delantero' },
    { name: 'William Saliba', position: 'Defensor' },
    { name: 'Mike Maignan', position: 'Arquero' },
  ],
  'Senegal': [
    { name: 'Sadio Mané', position: 'Delantero' },
    { name: 'Nicolas Jackson', position: 'Delantero' },
    { name: 'Kalidou Koulibaly', position: 'Defensor' },
    { name: 'Édouard Mendy', position: 'Arquero' },
    { name: 'Idrissa Gueye', position: 'Mediocampista' },
    { name: 'Lamine Camara', position: 'Mediocampista' },
  ],
  'Noruega': [
    { name: 'Erling Haaland', position: 'Delantero' },
    { name: 'Martin Ødegaard', position: 'Mediocampista' },
    { name: 'Alexander Sørloth', position: 'Delantero' },
    { name: 'Oscar Bobb', position: 'Delantero' },
    { name: 'Leo Østigård', position: 'Defensor' },
    { name: 'Ørjan Nyland', position: 'Arquero' },
  ],
  'Iraq': [
    { name: 'Aymen Hussein', position: 'Delantero' },
    { name: 'Ali Jasim', position: 'Delantero' },
    { name: 'Mohanad Ali', position: 'Delantero' },
    { name: 'Ibrahim Bayesh', position: 'Mediocampista' },
    { name: 'Rebin Sulaka', position: 'Defensor' },
    { name: 'Jalal Hassan', position: 'Arquero' },
  ],
  'Argentina': [
    { name: 'Lionel Messi', position: 'Delantero' },
    { name: 'Emiliano Martínez', position: 'Arquero' },
    { name: 'Rodrigo De Paul', position: 'Mediocampista' },
    { name: 'Alexis Mac Allister', position: 'Mediocampista' },
    { name: 'Lautaro Martínez', position: 'Delantero' },
    { name: 'Julián Álvarez', position: 'Delantero' },
  ],
  'Argelia': [
    { name: 'Riyad Mahrez', position: 'Delantero' },
    { name: 'Baghdad Bounedjah', position: 'Delantero' },
    { name: 'Rayan Aït-Nouri', position: 'Defensor' },
    { name: 'Ismaël Bennacer', position: 'Mediocampista' },
    { name: 'Saïd Benrahma', position: 'Delantero' },
    { name: 'Anthony Mandrea', position: 'Arquero' },
  ],
  'Austria': [
    { name: 'Marcel Sabitzer', position: 'Mediocampista' },
    { name: 'Konrad Laimer', position: 'Mediocampista' },
    { name: 'Christoph Baumgartner', position: 'Mediocampista' },
    { name: 'Marko Arnautović', position: 'Delantero' },
    { name: 'David Alaba', position: 'Defensor' },
    { name: 'Patrick Pentz', position: 'Arquero' },
  ],
  'Jordania': [
    { name: 'Mousa Al-Tamari', position: 'Delantero' },
    { name: 'Yazan Al-Naimat', position: 'Delantero' },
    { name: 'Ali Olwan', position: 'Delantero' },
    { name: 'Nizar Al-Rashdan', position: 'Mediocampista' },
    { name: 'Yazan Al-Arab', position: 'Defensor' },
    { name: 'Yazid Abu Layla', position: 'Arquero' },
  ],
  'Portugal': [
    { name: 'Cristiano Ronaldo', position: 'Delantero' },
    { name: 'Bruno Fernandes', position: 'Mediocampista' },
    { name: 'Bernardo Silva', position: 'Mediocampista' },
    { name: 'Rúben Dias', position: 'Defensor' },
    { name: 'Rafael Leão', position: 'Delantero' },
    { name: 'Diogo Costa', position: 'Arquero' },
  ],
  'Colombia': [
    { name: 'Luis Díaz', position: 'Delantero' },
    { name: 'James Rodríguez', position: 'Mediocampista' },
    { name: 'Richard Ríos', position: 'Mediocampista' },
    { name: 'Jefferson Lerma', position: 'Mediocampista' },
    { name: 'Davinson Sánchez', position: 'Defensor' },
    { name: 'Camilo Vargas', position: 'Arquero' },
  ],
  'Uzbekistán': [
    { name: 'Eldor Shomurodov', position: 'Delantero' },
    { name: 'Abbosbek Fayzullaev', position: 'Mediocampista' },
    { name: 'Oston Urunov', position: 'Delantero' },
    { name: 'Jaloliddin Masharipov', position: 'Mediocampista' },
    { name: 'Abdukodir Khusanov', position: 'Defensor' },
    { name: 'Utkir Yusupov', position: 'Arquero' },
  ],
  'DR Congo': [
    { name: 'Yoane Wissa', position: 'Delantero' },
    { name: 'Chancel Mbemba', position: 'Defensor' },
    { name: 'Meschack Elia', position: 'Delantero' },
    { name: 'Arthur Masuaku', position: 'Defensor' },
    { name: 'Samuel Moutoussamy', position: 'Mediocampista' },
    { name: 'Lionel Mpasi', position: 'Arquero' },
  ],
  'Inglaterra': [
    { name: 'Jude Bellingham', position: 'Mediocampista' },
    { name: 'Harry Kane', position: 'Delantero' },
    { name: 'Bukayo Saka', position: 'Delantero' },
    { name: 'Phil Foden', position: 'Delantero' },
    { name: 'Declan Rice', position: 'Mediocampista' },
    { name: 'Jordan Pickford', position: 'Arquero' },
  ],
  'Croacia': [
    { name: 'Luka Modrić', position: 'Mediocampista' },
    { name: 'Mateo Kovačić', position: 'Mediocampista' },
    { name: 'Joško Gvardiol', position: 'Defensor' },
    { name: 'Andrej Kramarić', position: 'Delantero' },
    { name: 'Ivan Perišić', position: 'Delantero' },
    { name: 'Dominik Livaković', position: 'Arquero' },
  ],
  'Ghana': [
    { name: 'Mohammed Kudus', position: 'Mediocampista' },
    { name: 'Inaki Williams', position: 'Delantero' },
    { name: 'Jordan Ayew', position: 'Delantero' },
    { name: 'Thomas Partey', position: 'Mediocampista' },
    { name: 'Salis Abdul Samed', position: 'Mediocampista' },
    { name: 'Lawrence Ati-Zigi', position: 'Arquero' },
  ],
  'Panamá': [
    { name: 'Adalberto Carrasquilla', position: 'Mediocampista' },
    { name: 'José Fajardo', position: 'Delantero' },
    { name: 'Ismael Díaz', position: 'Delantero' },
    { name: 'Michael Amir Murillo', position: 'Defensor' },
    { name: 'Édgar Bárcenas', position: 'Mediocampista' },
    { name: 'Orlando Mosquera', position: 'Arquero' },
  ],
};

async function main() {
  console.log('1. Eliminando jugadores antiguos...');
  await prisma.player.deleteMany();

  console.log('2. Población de plantillas oficiales reales para los 48 equipos...');
  const teams = await prisma.team.findMany();

  for (const team of teams) {
    const roster = REAL_PLAYERS[team.name];
    if (roster) {
      console.log(`Sembrando plantilla de: ${team.name} (${team.flag})`);
      for (const p of roster) {
        await prisma.player.create({
          data: {
            name: p.name,
            position: p.position,
            teamId: team.id,
          },
        });
      }
    } else {
      console.log(`⚠️ Alerta: Plantilla no definida para ${team.name}, generando nombres realistas alternativos...`);
      // Generador de nombres alternativos para países no cubiertos
      const backupNames = [
        { name: `Arquero de ${team.name}`, position: 'Arquero' },
        { name: `Defensor Titular ${team.name}`, position: 'Defensor' },
        { name: `Mediocampista Estrella ${team.name}`, position: 'Mediocampista' },
        { name: `Delantero Goleador ${team.name}`, position: 'Delantero' },
        { name: `Capitán de ${team.name}`, position: 'Mediocampista' },
        { name: `Juvenil Promesa ${team.name}`, position: 'Delantero' },
      ];
      for (const p of backupNames) {
        await prisma.player.create({
          data: {
            name: p.name,
            position: p.position,
            teamId: team.id,
          },
        });
      }
    }
  }

  console.log('3. Generando resultados detallados con goleadores reales para todos los partidos...');

  const matches = await prisma.match.findMany({
    where: {
      matchDate: {
        lt: new Date('2026-07-01T00:00:00.000Z'),
      },
    },
  });

  for (const match of matches) {
    const r = Math.random();
    let homeScore = 1;
    let awayScore = 0;
    if (r < 0.2) { homeScore = 0; awayScore = 0; }
    else if (r < 0.4) { homeScore = 1; awayScore = 1; }
    else if (r < 0.6) { homeScore = 2; awayScore = 1; }
    else if (r < 0.75) { homeScore = 0; awayScore = 2; }
    else if (r < 0.9) { homeScore = 3; awayScore = 1; }
    else { homeScore = 2; awayScore = 2; }

    const homeTeamDb = await prisma.team.findUnique({
      where: { name: match.homeTeam },
      include: { players: true },
    });
    const awayTeamDb = await prisma.team.findUnique({
      where: { name: match.awayTeam },
      include: { players: true },
    });

    const goals: { player: string; minute: number; team: 'home' | 'away' }[] = [];

    // Goles de local
    for (let i = 0; i < homeScore; i++) {
      let pName = `Jugador Local ${i + 1}`;
      if (homeTeamDb && homeTeamDb.players.length > 0) {
        // Preferir delanteros/mediocampistas para goles
        const attackingPlayers = homeTeamDb.players.filter((p) => p.position !== 'Arquero');
        const pool = attackingPlayers.length > 0 ? attackingPlayers : homeTeamDb.players;
        pName = pool[Math.floor(Math.random() * pool.length)].name;
      }
      goals.push({
        player: pName,
        minute: Math.floor(Math.random() * 90) + 1,
        team: 'home',
      });
    }

    // Goles de visitante
    for (let i = 0; i < awayScore; i++) {
      let pName = `Jugador Visitante ${i + 1}`;
      if (awayTeamDb && awayTeamDb.players.length > 0) {
        // Preferir delanteros/mediocampistas para goles
        const attackingPlayers = awayTeamDb.players.filter((p) => p.position !== 'Arquero');
        const pool = attackingPlayers.length > 0 ? attackingPlayers : awayTeamDb.players;
        pName = pool[Math.floor(Math.random() * pool.length)].name;
      }
      goals.push({
        player: pName,
        minute: Math.floor(Math.random() * 90) + 1,
        team: 'away',
      });
    }

    goals.sort((a, b) => a.minute - b.minute);

    await prisma.match.update({
      where: { id: match.id },
      data: {
        homeScore,
        awayScore,
        goals: JSON.stringify(goals),
      },
    });
  }

  console.log('¡Sincronización de bases de datos completada exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
