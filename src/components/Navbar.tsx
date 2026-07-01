'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isActive = user && user.status === 'APPROVED' && user.hasPaid;

  return (
    <header className="sticky top-0 z-30 border-b bg-prode-green text-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-prode-gold">⚽</span>
          <span className="hidden sm:inline">Prode Mundial 2026</span>
          <span className="sm:hidden">Prode 2026</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="rounded px-2 py-1 hover:bg-prode-green-light">
            Inicio
          </Link>
          <Link href="/equipos" className="rounded px-2 py-1 hover:bg-prode-green-light">
            Equipos
          </Link>
          <Link href="/en-vivo" className="rounded px-2 py-1 hover:bg-prode-green-light">
            En Vivo
          </Link>
          <Link href="/pagos" className="rounded px-2 py-1 hover:bg-prode-green-light">
            Pagos
          </Link>
          {isActive && (
            <>
              <Link href="/picks" className="rounded px-2 py-1 hover:bg-prode-green-light">
                Cargar picks
              </Link>
              <Link href="/mis-picks" className="rounded px-2 py-1 hover:bg-prode-green-light">
                Mis picks
              </Link>
            </>
          )}
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="rounded bg-prode-gold px-2 py-1 font-semibold text-prode-green"
            >
              Admin
            </Link>
          )}
          {status === 'loading' ? null : user ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded px-2 py-1 hover:bg-prode-green-light"
            >
              Salir
            </button>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
            >
              Ingresar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
