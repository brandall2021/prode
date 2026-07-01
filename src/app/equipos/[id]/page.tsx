import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function TeamDetailPage({ params }: PageProps) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: {
      players: {
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!team) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Link
        href="/equipos"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a equipos
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <span className="text-5xl md:text-6xl select-none filter drop-shadow">
            {team.flag}
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {team.name}
            </h1>
            <p className="text-slate-500 text-sm">
              Plantilla Oficial - Mundial 2026
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 border px-4 py-2.5 text-center sm:text-right">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Plantilla</div>
          <div className="text-2xl font-bold text-slate-800 font-mono">
            {team.players.length} jugadores
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {team.players.map((player) => {
          // Obtener iniciales para el avatar de marcador de posición
          const initials = player.name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('');

          return (
            <div
              key={player.id}
              className="group relative h-[360px] overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-white p-[3px] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                boxShadow: '0 4px 20px -2px rgba(217, 119, 6, 0.08)',
              }}
            >
              {/* Borde Panini dorado brillante */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-600 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Contenido de la Tarjeta */}
              <div className="relative h-full w-full bg-white rounded-[13px] p-4 flex flex-col justify-between overflow-hidden">
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg select-none">{team.flag}</span>
                    <span className="text-[10px] font-extrabold tracking-widest text-amber-800 uppercase font-mono">
                      {team.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-full font-mono">
                    PANINI 26
                  </span>
                </div>

                {/* Imagen del Jugador */}
                <div className="relative my-3 flex-1 flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                  {player.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={player.image}
                      alt={player.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-200 shadow-sm">
                        <span className="text-xl font-black text-amber-700 font-mono">
                          {initials}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        Sticker Oficial
                      </div>
                    </div>
                  )}

                  {/* Efecto de Brillo Holográfico al pasar el mouse */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                </div>

                {/* Pie de la Tarjeta */}
                <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50 text-center">
                  <h3 className="font-bold text-slate-800 truncate text-sm">
                    {player.name}
                  </h3>
                  <div className="text-[11px] font-semibold text-amber-800 mt-1 uppercase tracking-wider font-mono">
                    {player.position}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
