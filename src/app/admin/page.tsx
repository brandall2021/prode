import { prisma } from '@/lib/prisma';
import { getPozo, formatARS } from '@/lib/pozo';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [pozo, pendientes, totalUsers, totalMatches, withResults] = await Promise.all([
    getPozo(),
    prisma.user.count({ where: { status: 'PENDING' } }),
    prisma.user.count(),
    prisma.match.count(),
    prisma.match.count({ where: { homeScore: { not: null } } }),
  ]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat title="Usuarios" value={totalUsers} />
        <Stat title="Pendientes" value={pendientes} highlight={pendientes > 0} />
        <Stat title="Activos (pagos)" value={pozo.participantes} />
        <Stat title="Partidos cargados" value={`${withResults}/${totalMatches}`} />
      </div>

      <div className="card">
        <h2 className="mb-2 text-lg font-bold text-prode-green">💰 Pozo</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <KV label="Recaudado" value={formatARS(pozo.totalRecaudado)} />
          <KV label="Premio (70%)" value={formatARS(pozo.premio)} />
          <KV label="Organización (30%)" value={formatARS(pozo.organizacion)} />
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div className={`card text-center ${highlight ? 'ring-2 ring-prode-gold' : ''}`}>
      <div className="text-xs uppercase text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-prode-green">{value}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-lg font-bold text-prode-green">{value}</div>
    </div>
  );
}
