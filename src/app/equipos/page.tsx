import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EquiposPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { players: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Equipos del Mundial
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl">
          Explora las selecciones participantes, conoce a sus jugadores y consulta las plantillas oficiales del torneo.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/equipos/${team.id}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <span className="text-4xl select-none filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                {team.flag}
              </span>
              <div className="space-y-1">
                <h2 className="font-bold text-slate-800 group-hover:text-prode-green transition-colors duration-200">
                  {team.name}
                </h2>
                <p className="text-xs text-slate-400">
                  {team._count.players} Jugadores
                </p>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-prode-green to-prode-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        ))}
      </div>
    </div>
  );
}
