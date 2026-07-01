'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type AdminAction = 'TOGGLE_ADMIN';

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  isAdmin: boolean;
  createdAt: string;
};

export default function UsersTable({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(t) || (u.name || '').toLowerCase().includes(t),
    );
  }, [q, users]);

  const run = async (userId: string, action: AdminAction) => {
    setBusyId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'Error');
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        placeholder="Buscar por email o nombre…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="overflow-x-auto rounded-lg ring-1 ring-black/5">
        <table className="w-full bg-white text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="p-2">Jugador</th>
              <th className="p-2">Pais</th>
              <th className="p-2">Bandera</th>
              <th className="p-2">Admin</th>
              <th className="p-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {u.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.image}
                        alt=""
                        className="h-8 w-8 rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-prode-green/20" />
                    )}
                    <div>
                      <div className="font-medium">{u.name || '—'}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2">
                  <span className="text-xs text-gray-600">Argentina</span>
                </td>
                <td className="p-2">
                  <span className="text-lg">🇦🇷</span>
                </td>
                <td className="p-2">
                  {u.isAdmin ? (
                    <span className="rounded bg-prode-gold/30 px-2 py-0.5 text-xs font-semibold text-prode-green">
                      Admin
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap justify-end gap-1">
                    <button
                      className="rounded border border-prode-green px-2 py-1 text-xs font-semibold text-prode-green hover:bg-prode-green hover:text-white disabled:opacity-50"
                      disabled={busyId === u.id || pending}
                      onClick={() => run(u.id, 'TOGGLE_ADMIN')}
                    >
                      {u.isAdmin ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
