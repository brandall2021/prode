'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type AdminAction = 'APPROVE' | 'REJECT' | 'CONFIRM_PAYMENT' | 'REVERT_PAYMENT' | 'TOGGLE_ADMIN';

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  hasPaid: boolean;
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

  const run = async (userId: string, action: AdminAction, notes?: string) => {
    setBusyId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, notes }),
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
              <th className="p-2">Usuario</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Pago</th>
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
                  <StatusBadge status={u.status} />
                </td>
                <td className="p-2">
                  {u.hasPaid ? (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Pagado
                    </span>
                  ) : (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      Sin pago
                    </span>
                  )}
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
                    {u.status !== 'APPROVED' && (
                      <button
                        className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        disabled={busyId === u.id || pending}
                        onClick={() => run(u.id, 'APPROVE')}
                      >
                        Aprobar
                      </button>
                    )}
                    {u.status !== 'REJECTED' && (
                      <button
                        className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        disabled={busyId === u.id || pending}
                        onClick={() => run(u.id, 'REJECT')}
                      >
                        Rechazar
                      </button>
                    )}
                    {!u.hasPaid ? (
                      <button
                        className="rounded bg-prode-gold px-2 py-1 text-xs font-semibold text-prode-green hover:brightness-95 disabled:opacity-50"
                        disabled={busyId === u.id || pending}
                        onClick={() => {
                          const notes = window.prompt('Notas del pago (opcional):') ?? '';
                          run(u.id, 'CONFIRM_PAYMENT', notes);
                        }}
                      >
                        Confirmar pago
                      </button>
                    ) : (
                      <button
                        className="rounded bg-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-400 disabled:opacity-50"
                        disabled={busyId === u.id || pending}
                        onClick={() => {
                          if (confirm('¿Revertir el pago?')) run(u.id, 'REVERT_PAYMENT');
                        }}
                      >
                        Revertir pago
                      </button>
                    )}
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
                <td colSpan={5} className="p-4 text-center text-gray-500">
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

function StatusBadge({ status }: { status: AdminUser['status'] }) {
  const map = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  } as const;
  const labels = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
  } as const;
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${map[status]}`}>
      {labels[status]}
    </span>
  );
}
