import { PrismaClient } from '@prisma/client';
import { calculatePoints } from '../src/lib/scoring';

const prisma = new PrismaClient();

function getRandomGoals(): number {
  const r = Math.random();
  if (r < 0.25) return 0;
  if (r < 0.60) return 1;
  if (r < 0.85) return 2;
  if (r < 0.95) return 3;
  if (r < 0.98) return 4;
  return 5;
}

async function main() {
  console.log('Buscando partidos ya realizados antes del 1 de Julio de 2026...');

  const matches = await prisma.match.findMany({
    where: {
      matchDate: {
        lt: new Date('2026-07-01T00:00:00.000Z'),
      },
    },
  });

  console.log(`Encontrados ${matches.length} partidos. Generando y guardando resultados...`);

  let updatedCount = 0;
  for (const match of matches) {
    const homeScore = getRandomGoals();
    const awayScore = getRandomGoals();

    // Actualizar partido
    await prisma.match.update({
      where: { id: match.id },
      data: {
        homeScore,
        awayScore,
      },
    });

    // Actualizar picks para este partido si existen
    const picks = await prisma.pick.findMany({ where: { matchId: match.id } });
    if (picks.length > 0) {
      await prisma.$transaction(
        picks.map((p) =>
          prisma.pick.update({
            where: { id: p.id },
            data: {
              points: calculatePoints(
                { homeScore: p.homeScore, awayScore: p.awayScore },
                { homeScore, awayScore }
              ),
            },
          })
        )
      );
    }
    updatedCount++;
  }

  console.log(`¡Completado con éxito! Se cargaron los resultados de ${updatedCount} partidos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
