import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatARS, CUOTA } from '@/lib/pozo';

export const dynamic = 'force-dynamic';

export default async function PendientePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const u = session.user;
  const activo = u.status === 'APPROVED' && u.hasPaid;
  if (activo) redirect('/picks');

  let titulo = 'Tu cuenta está pendiente de aprobación.';
  let mensaje = 'Contactá al administrador para que apruebe tu acceso.';

  if (u.status === 'REJECTED') {
    titulo = 'Tu cuenta fue rechazada.';
    mensaje = 'Contactá al administrador si creés que esto es un error.';
  } else if (u.status === 'APPROVED' && !u.hasPaid) {
    titulo = 'Aprobado. Falta registrar el pago.';
    mensaje = `Para participar, registrá el pago de ${formatARS(
      CUOTA,
    )}. El administrador confirmará tu pago manualmente.`;
  }

  return (
    <div className="mx-auto mt-10 max-w-lg card text-center">
      <div className="text-5xl">⏳</div>
      <h1 className="mt-2 text-2xl font-bold text-prode-green">{titulo}</h1>
      <p className="mt-3 text-gray-700">{mensaje}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href="/" className="btn-gold">
          Ver leaderboard
        </Link>
      </div>
      <p className="mt-6 text-xs text-gray-500">Conectado como {u.email}</p>
    </div>
  );
}
