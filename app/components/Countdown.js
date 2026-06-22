'use client';

import React from 'react';

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

export default function Countdown() {
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
        <span className="text-white/20 font-black tracking-widest">CARREGANT COMPTE ENRERE...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-[11px] font-bold text-neutral-500 px-4 leading-normal">
        Compte enrere per a la fi de la concessió actual (2028)<br />
        <span className="uppercase text-[9px] opacity-60">Tot i això la Generalitat de Catalunya ho ha prorrogat fins el 2034</span>
      </p>
      <div className="bg-neutral-900 rounded-3xl p-6 pt-7 pb-5 mx-2 flex justify-center items-center gap-2 shadow-2xl border-t border-white/5 relative overflow-hidden">
        <TimeUnit value={timeLeft.days} label="DIES" />
        <TimeUnit value={timeLeft.hours} label="HORES" />
        <TimeUnit value={timeLeft.minutes} label="MIN" />
        <TimeUnit value={timeLeft.seconds} label="SEG" isLast />
      </div>
    </div>
  );
}
