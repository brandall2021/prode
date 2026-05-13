'use client';

import { useState, useTransition } from 'react';
import { formatFullAR, isLocked, minutesUntilLock } from '@/lib/timezone';

export type PickRowMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  matchDate: string; // ISO
  stadium: string | null;
  homeScore: number | null;
  awayScore: number | null;
  pickHome: number | null;
  pickAway: number | null;
};

export default function PickRow({ match }: { match: PickRowMatch }) {
  const date = new Date(match.matchDate);
  const locked = isLocked(date);
  const finalized = match.homeScore != null && match.awayScore != null;

  const [home, setHome] = useState<string>(match.pickHome != null ? String(match.pickHome) : '');
  const [away, setAway] = useState<string>(match.pickAway != null ? String(match.pickAway) : '');
  const [saved, setSaved] = useState<boolean>(match.pickHome != null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle');
  const [errMsg, setErrMsg] = useState<string>('');
  const [pending, startTransition] = useTransition();

  const hasInputs = home !== '' && away !== '';
  const canSave = !locked && hasInputs && !pending;

  const handleSave = () => {
    if (!canSave) return;
    setStatus('saving');
    setErrMsg('');
    startTransition(async () => {
      try {
        const res = await fetch('/api/picks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchId: match.id,
            homeScore: Number(home),
            awayScore: Number(away),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus('err');
          setErrMsg(data.error || 'Error');
          return;
        }
        setStatus('ok');
        setSaved(true);
        setTimeout(() => setStatus('idle'), 1500);
      } catch (e) {
        setStatus('err');
        setErrMsg('Error de red');
      }
    });
  };

  return (
    <div
      className={`rounded-lg border p-3 ${
        locked ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex flex-col gap-1 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <span>{formatFullAR(date)}</span>
        {match.stadium && <span className="text-gray-500">📍 {match.stadium}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2 text-sm font-semibold sm:text-base">
          <span className="text-xl sm:text-2xl">{match.homeFlag}</span>
          <span className="truncate">{match.homeTeam}</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={99}
            inputMode="numeric"
            className="input-score"
            value={home}
            disabled={locked}
            onChange={(e) => {
              setHome(e.target.value);
              setSaved(false);
            }}
            aria-label={`Goles ${match.homeTeam}`}
          />
          <span className="font-bold text-gray-400">-</span>
          <input
            type="number"
            min={0}
            max={99}
            inputMode="numeric"
            className="input-score"
            value={away}
            disabled={locked}
            onChange={(e) => {
              setAway(e.target.value);
              setSaved(false);
            }}
            aria-label={`Goles ${match.awayTeam}`}
          />
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 text-right text-sm font-semibold sm:text-base">
          <span className="truncate">{match.awayTeam}</span>
          <span className="text-xl sm:text-2xl">{match.awayFlag}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <div>
          {locked ? (
            match.pickHome == null ? (
              <span className="rounded bg-red-100 px-2 py-0.5 font-semibold text-red-700">
                Sin pick
              </span>
            ) : finalized ? (
              <span className="text-gray-600">
                Resultado: {match.homeScore}-{match.awayScore}
              </span>
            ) : (
              <span className="text-gray-500">🔒 Cerrado</span>
            )
          ) : (
            <span className="text-gray-500">
              Cierra en {minutesUntilLock(date)} min
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saved && status === 'idle' && (
            <span className="text-green-600">✅ Guardado</span>
          )}
          {status === 'ok' && <span className="text-green-600">✅ Guardado</span>}
          {status === 'err' && <span className="text-red-600">⚠ {errMsg}</span>}
          {!locked && (
            <button
              type="button"
              className="btn-primary !py-1 !px-3 text-xs"
              onClick={handleSave}
              disabled={!canSave}
            >
              {status === 'saving' || pending ? 'Guardando…' : 'Guardar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
