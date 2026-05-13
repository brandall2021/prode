'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { formatFullAR } from '@/lib/timezone';

export type ResultMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  matchDate: string;
  homeScore: number | null;
  awayScore: number | null;
};

export default function ResultRow({ match }: { match: ResultMatch }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [home, setHome] = useState(match.homeScore != null ? String(match.homeScore) : '');
  const [away, setAway] = useState(match.awayScore != null ? String(match.awayScore) : '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  const save = async (clear: boolean) => {
    setStatus('saving');
    setMsg('');
    const body = clear
      ? { matchId: match.id, homeScore: null, awayScore: null }
      : {
          matchId: match.id,
          homeScore: Number(home),
          awayScore: Number(away),
        };
    const res = await fetch('/api/admin/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus('err');
      setMsg(data.error || 'Error');
      return;
    }
    setStatus('ok');
    setMsg(`Recalculados: ${data.recalculated ?? 0} picks`);
    startTransition(() => router.refresh());
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs text-gray-500">{formatFullAR(new Date(match.matchDate))}</div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 text-sm font-semibold">
          <span className="text-xl">{match.homeFlag}</span>
          <span className="truncate">{match.homeTeam}</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={99}
            className="input-score"
            value={home}
            onChange={(e) => setHome(e.target.value)}
          />
          <span className="font-bold text-gray-400">-</span>
          <input
            type="number"
            min={0}
            max={99}
            className="input-score"
            value={away}
            onChange={(e) => setAway(e.target.value)}
          />
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 text-right text-sm font-semibold">
          <span className="truncate">{match.awayTeam}</span>
          <span className="text-xl">{match.awayFlag}</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-gray-500">
          {status === 'ok' && <span className="text-green-600">✅ {msg}</span>}
          {status === 'err' && <span className="text-red-600">⚠ {msg}</span>}
          {status === 'idle' && match.homeScore != null && (
            <span>
              Resultado guardado: {match.homeScore}-{match.awayScore}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {match.homeScore != null && (
            <button
              className="rounded border border-gray-400 px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              disabled={pending || status === 'saving'}
              onClick={() => {
                if (confirm('¿Borrar el resultado y resetear puntos?')) save(true);
              }}
            >
              Borrar
            </button>
          )}
          <button
            className="btn-primary !py-1 !px-3 text-xs"
            disabled={pending || status === 'saving' || home === '' || away === ''}
            onClick={() => save(false)}
          >
            {status === 'saving' ? 'Guardando…' : 'Guardar y recalcular'}
          </button>
        </div>
      </div>
    </div>
  );
}
