import { prisma } from '@/lib/prisma';
import { getPozo, formatARS, CUOTA } from '@/lib/pozo';

export const dynamic = 'force-dynamic';

export default async function PagosPage() {
  const [pozo, payments] = await Promise.all([
    getPozo(),
    prisma.payment.findMany({
      orderBy: { confirmedAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        admin: { select: { name: true, email: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-prode-green sm:text-2xl">💰 Estado del Pozo</h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Stat label="Participantes" value={`${pozo.participantes}`} />
        <Stat label="Cuota individual" value={formatARS(CUOTA)} />
        <Stat label="Total recaudado" value={formatARS(pozo.totalRecaudado)} highlight />
        <Stat label="🏆 Premio (70%)" value={formatARS(pozo.premio)} highlight />
      </div>

      <section className="card">
        <h2 className="mb-2 text-lg font-bold text-prode-green">Historial de pagos confirmados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-gray-500">
                <th className="py-2 pr-2">Fecha</th>
                <th className="py-2 pr-2">Usuario</th>
                <th className="py-2 pr-2">Monto</th>
                <th className="py-2 pr-2">Notas</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2 pr-2">
                    {new Intl.DateTimeFormat('es-AR', {
                      timeZone: 'America/Argentina/Buenos_Aires',
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(p.confirmedAt)}
                  </td>
                  <td className="py-2 pr-2">
                    <div className="font-medium">{p.user.name ?? '—'}</div>
                  </td>
                  <td className="py-2 pr-2">{formatARS(p.amount)}</td>
                  <td className="py-2 pr-2 text-xs text-gray-600">{p.notes || '—'}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Aún no se registraron pagos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`card ${highlight ? 'ring-2 ring-prode-gold' : ''}`}>
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-xl font-bold text-prode-green">{value}</div>
    </div>
  );
}
