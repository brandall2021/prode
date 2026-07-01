'use client';

import { useState, useEffect, useRef } from 'react';

type Channel = {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
};

const CHANNELS: Channel[] = [
  {
    id: 'tyc-sports',
    name: 'TyC Sports',
    logo: 'https://cdn.futbol-libres.su/img/tyc_sports.webp',
    url: 'https://futbol-libres.su/tyc-sports/',
    description: 'Transmisión oficial de partidos, análisis y debates del fútbol argentino.',
  },
  {
    id: 'directv-sports',
    name: 'DSports (DirecTV)',
    logo: 'https://cdn.futbol-libres.su/img/dsports.webp',
    url: 'https://futbol-libres.su/directv-sports/',
    description: 'Cobertura completa de eventos internacionales y transmisiones exclusivas.',
  },
  {
    id: 'espn-1',
    name: 'ESPN',
    logo: 'https://cdn.futbol-libres.su/img/espn1.webp',
    url: 'https://futbol-libres.su/espn-1/',
    description: 'Toda la emoción de los mejores partidos de las ligas de élite del mundo.',
  },
  {
    id: 'fox-sports',
    name: 'Fox Sports',
    logo: 'https://cdn.futbol-libres.su/img/fox_sports.webp',
    url: 'https://futbol-libres.su/fox-sports/',
    description: 'Análisis deportivo, competiciones internacionales y cobertura en directo.',
  },
  {
    id: 'espn-premium',
    name: 'ESPN Premium',
    logo: 'https://cdn.futbol-libres.su/img/espn_premium.webp',
    url: 'https://futbol-libres.su/espn-premium/',
    description: 'La señal exclusiva con transmisiones de fútbol de primer nivel.',
  },
  {
    id: 'tnt-sports',
    name: 'TNT Sports',
    logo: 'https://cdn.futbol-libres.su/img/tnt_sport.webp',
    url: 'https://futbol-libres.su/tnt-sports/',
    description: 'El canal del fútbol profesional con análisis minuciosos del juego.',
  },
  {
    id: 'tudn',
    name: 'TUDN',
    logo: 'https://cdn.futbol-libres.su/img/tudn.webp',
    url: 'https://futbol-libres.su/tudn/',
    description: 'La señal líder en deportes con todo el sabor del fútbol continental.',
  },
];

type ChatMessage = {
  id: string;
  user: string;
  flag: string;
  text: string;
  time: string;
};

const CHAT_TEMPLATE = [
  { user: 'BocaPasion99', flag: '🇦🇷', text: '¡VAAAAAMOS SELECCIÓN! ¡Hoy se gana como sea!' },
  { user: 'Juan_Mx_26', flag: '🇲🇽', text: 'Gran partido que se viene señores, un saludo desde Guadalajara.' },
  { user: 'LaRoja_Fan', flag: '🇪🇸', text: 'Vaya jugada colectiva, esto es fútbol de verdad.' },
  { user: 'SambaNey', flag: '🇧🇷', text: '¡Qué golazo por favor! Una genialidad total.' },
  { user: 'CafeFC', flag: '🇨🇴', text: 'El mediocampo está controlando todo el juego hoy.' },
  { user: 'Alex_USA', flag: '🇺🇸', text: 'Incredible atmosphere in the stadium!' },
  { user: 'GauchoAlbiceleste', flag: '🇦🇷', text: '¡Qué tapada del arquero! Impresionante.' },
  { user: 'Marta_G', flag: '🇪🇸', text: 'Se nota la tensión de la fase final, nadie quiere regalar nada.' },
];

export default function EnVivoPage() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>(CHANNELS[0]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Generador de mensajes de chat en vivo simulados
  useEffect(() => {
    // Inicializar chat con unos pocos mensajes
    const initial = CHAT_TEMPLATE.slice(0, 4).map((m, i) => ({
      id: `${Date.now()}-${i}`,
      user: m.user,
      flag: m.flag,
      text: m.text,
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    }));
    setChatMessages(initial);

    const interval = setInterval(() => {
      const template = CHAT_TEMPLATE[Math.floor(Math.random() * CHAT_TEMPLATE.length)];
      const newMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        user: template.user,
        flag: template.flag,
        text: template.text,
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev.slice(-30), newMessage]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll para el chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Mundial En Vivo
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-3xl">
          Sigue las transmisiones oficiales de Fútbol Libre. Selecciona tu canal preferido para ver los encuentros en directo y únete a la conversación en tiempo real.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel del Reproductor y Canales (75% ancho) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Contenedor del Reproductor de Video */}
          <div className="overflow-hidden rounded-2xl bg-black border border-slate-900 shadow-2xl relative aspect-video">
            <iframe
              src={selectedChannel.url}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              allow="autoplay; encrypted-media"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>

          {/* Información del Canal Seleccionado y Enlace Externo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedChannel.logo}
                alt={selectedChannel.name}
                className="h-12 w-12 rounded-xl object-contain border bg-slate-50 p-1"
              />
              <div>
                <h2 className="font-bold text-lg text-slate-900">{selectedChannel.name}</h2>
                <p className="text-xs text-slate-500">{selectedChannel.description}</p>
              </div>
            </div>
            <a
              href={selectedChannel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-prode-green text-white px-5 py-3 font-semibold text-sm transition-all duration-300 hover:bg-prode-green-light active:scale-[0.98] shadow-md shadow-prode-green/10"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Abrir en Fútbol Libre
            </a>
          </div>

          {/* Selector de Canales */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">Alternar Señal de Transmisión</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CHANNELS.map((channel) => {
                const isActive = selectedChannel.id === channel.id;
                return (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                      isActive
                        ? 'border-prode-green bg-prode-green/5 ring-1 ring-prode-green'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="h-8 w-8 rounded-lg object-contain border bg-white p-0.5"
                    />
                    <span
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-prode-green' : 'text-slate-700'
                      }`}
                    >
                      {channel.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel del Chat En Vivo (25% ancho) */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white flex flex-col h-[520px] lg:h-full shadow-sm overflow-hidden">
          {/* Cabecera del Chat */}
          <div className="border-b px-4 py-3 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="font-bold text-slate-800 text-sm">Chat del Partido</span>
            </div>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-mono">
              En Vivo
            </span>
          </div>

          {/* Mensajes de Chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0 bg-slate-50/30">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="text-xs space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="select-none text-sm">{msg.flag}</span>
                  <span className="font-extrabold text-slate-700 truncate max-w-[120px]">
                    {msg.user}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">{msg.time}</span>
                </div>
                <div className="bg-white border rounded-xl rounded-tl-none px-3 py-2 text-slate-600 shadow-sm leading-relaxed break-words">
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
