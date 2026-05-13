import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  if (!session.user.isAdmin) redirect('/');

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center gap-2 rounded-lg bg-prode-green p-3 text-white">
        <span className="font-bold text-prode-gold">⚙ Admin</span>
        <nav className="flex flex-wrap gap-1 text-sm">
          <Link href="/admin" className="rounded px-2 py-1 hover:bg-prode-green-light">
            Dashboard
          </Link>
          <Link href="/admin/usuarios" className="rounded px-2 py-1 hover:bg-prode-green-light">
            Usuarios
          </Link>
          <Link href="/admin/resultados" className="rounded px-2 py-1 hover:bg-prode-green-light">
            Resultados
          </Link>
          <Link href="/admin/pozo" className="rounded px-2 py-1 hover:bg-prode-green-light">
            Pozo
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
