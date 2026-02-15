'use client';

import React from 'react';
import {
  AlertTriangle,
  MessageSquare,
  Clock,
  ExternalLink,
  Send,
  Users,
  ThumbsDown,
  Info
} from 'lucide-react';

// --- Simplified Components ---

const SectionTitle = ({ children, className = "" }) => (
  <h2 className={`text-3xl font-black mb-6 flex items-center gap-2 ${className}`}>
    {children}
  </h2>
);

const Card = ({ children, className = "" }) => (
  <div className={`p-6 rounded-2xl border border-neutral-200 bg-card shadow-sm ${className}`}>
    {children}
  </div>
);

const Countdown = () => {
  const [mounted, setMounted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    setMounted(true);
    const targetDate = new Date('2028-01-01T00:00:00');

    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-neutral-900 rounded-3xl p-6 mx-2 h-24 animate-pulse flex items-center justify-center">
        <span className="text-white/20 font-black tracking-widest">CARREGANT RELOTGE...</span>
      </div>
    );
  }

  const TimeUnit = ({ value, label, isLast = false }) => (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        <span className="text-4xl font-black text-red-600 tabular-nums leading-tight drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">
          {value.toString().padStart(value >= 100 ? 3 : 2, '0')}
        </span>
        <span className="text-[9px] font-bold text-white/50 tracking-widest mt-1">
          {label}
        </span>
      </div>
      {!isLast && <span className="text-2xl font-black text-white/10 mb-5">:</span>}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-[11px] font-bold text-neutral-500 px-4 leading-normal">
        Compte enrere per a la fi de la concessió actual (2028).<br />
        <span className="uppercase text-[9px] opacity-60">Cada retard compta per al nou concurs.</span>
      </p>
      <div className="bg-neutral-900 rounded-3xl p-6 pt-7 pb-5 mx-2 flex justify-center items-center gap-2 shadow-2xl border-t border-white/5 relative overflow-hidden">
        {/* Background Decal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-8xl font-black italic scale-150">SARFA</span>
        </div>

        <TimeUnit value={timeLeft.days} label="DIES" />
        <TimeUnit value={timeLeft.hours} label="HORES" />
        <TimeUnit value={timeLeft.minutes} label="MINS" />
        <TimeUnit value={timeLeft.seconds} label="SEGS" isLast />
      </div>
    </div>
  );
};

// --- Content Sections ---

export default function SarfaProtestPage() {
  const comments = [
    {
      user: "Joan S.",
      time: "fa 5 minuts",
      text: "El de les 8:15 ni ha passat. Una altra vegada tard a la feina.",
      initials: "JS",
      color: "bg-neutral-500"
    },
    {
      user: "Marta G.",
      time: "fa 20 minuts",
      text: "Bus ple a vessar, gent dreta fins a Girona. Vergonya de servei.",
      initials: "MG",
      color: "bg-neutral-600"
    },
    {
      user: "Usuari anònim",
      time: "fa 35 minuts",
      text: "Portem 30 minuts esperant a la parada del centre sota el sol.",
      initials: "UA",
      color: "bg-neutral-400"
    }
  ];

  return (
    <main className="min-h-screen max-w-md mx-auto px-4 py-8 flex flex-col gap-12 bg-background text-foreground">

      {/* Header / Hero Section */}
      <section className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 bg-red-300 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <AlertTriangle size={14} /> ALERTA SERVEI DEFICIENT
        </div>

        <h1 className="text-6xl sm:text-7xl font-black leading-none mb-4 tracking-tighter italic">
          ENCARA <span className="text-red-600 tracking-normal overflow-visible">ESPERES?</span>
        </h1>

        <p className="text-xl font-medium text-neutral-600 dark:text-neutral-400 mb-10 leading-snug">
          La realitat diària de la Sarfa a La Bisbal
        </p>

        <button
          className="w-full py-6 px-8 bg-accent hover:opacity-90 active:scale-95 transition-all rounded-2xl text-white font-black text-xl uppercase tracking-tighter animate-protest-pulse flex flex-col items-center gap-1 shadow-2xl shadow-accent/20"
          onClick={() => alert('Gràcies per reportar-ho. Aquesta és una demo.')}
        >
          <span>ESTIC A LA PARADA</span>
          <span className="text-sm opacity-80 font-bold">I EL BUS NO VE</span>
        </button>
      </section>

      {/* Countdown Section */}
      <Countdown />

      {/* El Retardòmetre Section */}
      <section>
        <SectionTitle>
          <Clock className="text-accent" /> EL RETARDÒMETRE
        </SectionTitle>
        <Card className="relative overflow-hidden border-2 border-accent/20">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm font-bold opacity-60">FIABILITAT SETMANAL</p>
              <h3 className="text-4xl font-black text-accent leading-none">85%</h3>
            </div>
            <p className="text-right text-xs font-bold max-w-[100px] leading-tight opacity-70 italic">
              DE BUSOS AMB RETARD O INCIDÈNCIES
            </p>
          </div>

          <div className="h-4 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: '85%' }}
            />
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400 italic">
            <Info size={12} className="shrink-0 mt-0.5" />
            <span>Dades basades en les queixes ciutadanes d'aquesta setmana.</span>
          </div>
        </Card>
      </section>

      {/* Mur de la Vergonya Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <SectionTitle className="mb-0">
            <MessageSquare className="text-accent" /> EL MUR
          </SectionTitle>
          <span className="text-[10px] font-bold bg-neutral-200 px-2 py-1 rounded">EN DIRECTE</span>
        </div>

        <div className="flex flex-col gap-4">
          {comments.map((comment, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-full ${comment.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner`}>
                {comment.initials}
              </div>
              <div className="flex-1">
                <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <p className="text-sm font-medium leading-relaxed mb-2">"{comment.text}"</p>
                  <div className="flex justify-between items-center opacity-60 text-[10px] font-bold">
                    <span>{comment.user.toUpperCase()}</span>
                    <span>{comment.time.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <section className="mt-8 mb-12 text-center border-t border-neutral-200 dark:border-neutral-800 pt-12">
        <h3 className="text-lg font-black mb-6 italic tracking-tight">NO ET QUEDIS CALLAT!</h3>

        <div className="grid grid-cols-1 gap-3">
          <a
            href="#"
            className="flex items-center justify-center gap-2 py-4 px-6 bg-foreground text-background rounded-2xl font-bold transition-all hover:opacity-90 active:scale-95"
          >
            <ExternalLink size={18} />
            FORMULARI QUEIXA GENCAT
          </a>

          <div className="flex gap-3">
            <a
              href="#"
              className="flex-1 flex items-center justify-center gap-2 py-4 px-4 border-2 border-foreground rounded-2xl font-bold transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Send size={18} />
              TELEGRAM
            </a>
            <a
              href="#"
              className="flex-1 flex items-center justify-center gap-2 py-4 px-4 bg-green-500 text-white rounded-2xl font-bold transition-all hover:bg-green-600 shadow-lg shadow-green-500/20"
            >
              <Users size={18} />
              WHATSAPP
            </a>
          </div>
        </div>

        <p className="mt-12 text-[10px] uppercase font-bold opacity-30 tracking-[0.2em]">
          Plataforma d'usuaris afectats per la Sarfa • La Bisbal d'Empordà
        </p>
      </section>

      {/* Fixed Background Decal */}
      <div className="fixed top-0 right-0 -z-10 opacity-[0.03] select-none pointer-events-none overflow-hidden">
        <h1 className="text-[200px] font-black leading-none rotate-90 translate-x-1/2">SARFA</h1>
      </div>

    </main>
  );
}
