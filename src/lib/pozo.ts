import { prisma } from './prisma';

export const CUOTA = 20000;
export const PCT_PREMIO = 0.7;

export type PozoInfo = {
  participantes: number;
  totalRecaudado: number;
  premio: number;
  organizacion: number;
};

export async function getPozo(): Promise<PozoInfo> {
  const participantes = await prisma.user.count({
    where: { hasPaid: true, status: 'APPROVED' },
  });
  const totalRecaudado = participantes * CUOTA;
  const premio = Math.round(totalRecaudado * PCT_PREMIO);
  const organizacion = totalRecaudado - premio;
  return { participantes, totalRecaudado, premio, organizacion };
}

export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}
