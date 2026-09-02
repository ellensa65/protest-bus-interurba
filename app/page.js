import React from 'react';
import {
  AlertTriangle,
  MessageSquare,
  Clock,
  ExternalLink,
  Info,
  ClipboardList,
  Camera,
  FileText
} from 'lucide-react';
import Countdown from './components/Countdown';
import ProtestButton from './components/ProtestButton';
import { supabase } from '../lib/supabase';

export const dynamic = 'force-dynamic';

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

function formatDelay(minutes) {
  if (!minutes || minutes <= 0) return "0h 00min";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}min`;
}

function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) {
    return "FA UNS SEGONS";
  }
  if (diffMins === 1) {
    return "FA 1 MINUT";
  }
  if (diffMins < 60) {
    return `FA ${diffMins} MINUTS`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) {
    return "FA 1 HORA";
  }
  if (diffHours < 24) {
    return `FA ${diffHours} HORES`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "FA 1 DIA";
  }
  return `FA ${diffDays} DIES`;
}

// --- Content Sections ---

export default async function SarfaProtestPage() {
  // Obtenir la suma total de retard dels últims 7 dies
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: records, error } = await supabase
    .from('Incidencies')
    .select('retard, operadora_id')
    .gte('created_at', sevenDaysAgo.toISOString());

  if (error) {
    console.error("Error obtenint retards de Supabase:", error);
  }

  // Agrupació i sumatori per operadora
  const operatorDelays = {};
  let totalDelayMinutes = 0;

  if (records) {
    records.forEach(row => {
      const op = row.operadora_id || 'Desconegut';
      const delay = row.retard || 0;
      totalDelayMinutes += delay;
      operatorDelays[op] = (operatorDelays[op] || 0) + delay;
    });
  }

  const formattedTime = formatDelay(totalDelayMinutes);

  // Topall simbòlic de 50 hores (3000 minuts)
  const maxMinutes = 50 * 60;
  const percentage = Math.min(100, (totalDelayMinutes / maxMinutes) * 100);

  // Mapeig de claus d'operadores a noms descriptius
  const OPERATOR_NAMES = {
    '3': 'Ampsa',
    '2': 'TEISA',
    '1': 'Sarfa',
    'Ampsa': 'Ampsa',
    'TEISA': 'TEISA',
    'Sarfa': 'Sarfa'
  };

  const breakdown = Object.entries(operatorDelays)
    .map(([op, minutes]) => {
      const name = OPERATOR_NAMES[op] || op;
      return {
        key: op,
        name,
        minutes,
        formatted: formatDelay(minutes),
        percentage: totalDelayMinutes > 0 ? (minutes / totalDelayMinutes) * 100 : 0
      };
    })
    .filter(item => item.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  // Obtenir els comentaris reals d'incidències per a EL MUR
  const { data: dbComments, error: commentsError } = await supabase
    .from('Incidencies')
    .select('id, created_at, comentari, operadora_id, Operadores(nom)')
    .not('comentari', 'is', null)
    .neq('comentari', '')
    .order('created_at', { ascending: false })
    .limit(10);

  if (commentsError) {
    console.error("Error obtenint comentaris de Supabase:", commentsError);
  }

  const comments = (dbComments || []).map(row => ({
    text: row.comentari,
    time: formatRelativeTime(row.created_at),
    operator: row.Operadores?.nom || 'Operadora no identificada'
  }));

  return (
    <main className="min-h-screen max-w-md mx-auto px-4 py-8 flex flex-col gap-12 bg-background text-foreground">

      {/* Header / Hero Section */}
      <section className="text-center pt-8 pb-4">

        <h1 className="text-6xl sm:text-7xl font-black leading-none mb-4 tracking-tighter">
          ENCARA <span className="text-red-600 tracking-normal overflow-visible">ESPERES?</span>
        </h1>

        <p className="text-xl font-medium text-neutral-600 dark:text-neutral-400 mb-10 leading-snug">
          La realitat diària del bus a les Comarques Gironines
        </p>

        <ProtestButton />
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
              <p className="text-xs font-bold text-neutral-400 tracking-wider uppercase">TEMPS ACUMULAT DE RETARD</p>
              <h3 className="text-4xl font-black text-red-600 leading-none mt-1">
                {formattedTime}
              </h3>
            </div>
            <p className="text-right text-xs font-black max-w-[150px] leading-tight text-neutral-600 dark:text-neutral-400 uppercase">
              DE TEMPS PERDUT PELS USUARIS
            </p>
          </div>

          <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Desglòs per operadora */}
          {breakdown.length > 0 && (
            <>
              <div className="my-6 border-t border-neutral-200 dark:border-neutral-800" />
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-black text-neutral-400 tracking-wider uppercase">
                  DESGLÒS PER OPERADORA
                </p>
                <div className="flex flex-col gap-4">
                  {breakdown.map((item) => (
                    <div key={item.key} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-extrabold text-neutral-600">
                          {item.name}
                        </span>
                        <span className="font-black text-red-600 dark:text-red-400 text-sm">
                          {item.formatted}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-600 dark:bg-red-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mt-4 flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400 italic">
            <Info size={12} className="shrink-0 mt-0.5" />
            <span>Dades basades en els minuts de retard reportats per la ciutadania aquesta setmana.</span>
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

        <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-2">
          {comments.map((comment, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-inner`}>
                UA
              </div>
              <div className="flex-1">
                <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <p className="text-sm font-medium leading-relaxed mb-2">&ldquo;{comment.text}&rdquo;</p>
                  <div className="flex justify-between items-center opacity-60 text-[10px] font-bold">
                    <span>USUARI ANÒNIM</span>
                    <span>{comment.operator.toUpperCase()}</span>
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
        <h3 className="text-lg font-black mb-6 italic tracking-tight">DIGUE-HI LA TEVA!</h3>

        <p className="mt-12 text-[15px] uppercase font-bold opacity-70 tracking-[0.2em]">
          <a href="https://comarquesgironines.cat" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">CUP Comarques Gironines</a>
        </p>
        <div className="flex justify-center mt-12">
          <a href="https://comarquesgironines.cat" target="_blank" rel="noopener noreferrer">
            <img src="logo_cup_comarques_gironines.png" alt="Logo CUP Comarques Gironines" width={200} height={200} />
          </a>
        </div>
      </section>
    </main>
  );
}


