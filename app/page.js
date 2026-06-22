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

// --- Content Sections ---

export default async function SarfaProtestPage() {
  // Obtenir la suma total de retard dels últims 7 dies
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: records, error } = await supabase
    .from('Incidencies')
    .select('retard, operadora')
    .gte('created_at', sevenDaysAgo.toISOString());

  if (error) {
    console.error("Error obtenint retards de Supabase:", error);
  }

  // Agrupació i sumatori per operadora
  const operatorDelays = {};
  let totalDelayMinutes = 0;

  if (records) {
    records.forEach(row => {
      const op = row.operadora || 'Desconegut';
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

        <div className="flex flex-col gap-4">
          {comments.map((comment, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-full ${comment.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner`}>
                {comment.initials}
              </div>
              <div className="flex-1">
                <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <p className="text-sm font-medium leading-relaxed mb-2">&ldquo;{comment.text}&rdquo;</p>
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

      {/* Guia de Queixa Efectiva Section */}
      <section>
        <SectionTitle>
          <ClipboardList className="text-accent" /> GUIA DE QUEIXA EFECTIVA
        </SectionTitle>
        <div className="flex flex-col gap-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-accent/20">
                1
              </div>
              <div className="w-0.5 h-full bg-neutral-200 dark:bg-neutral-800 my-1"></div>
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-accent" />
                <h4 className="font-bold text-lg leading-none">Documenta la incidència</h4>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Anota l&apos;hora exacta del retard i la parada on et trobes. Les dades precises són la teva millor arma contra el &ldquo;no ens consta&rdquo;.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-accent/20">
                2
              </div>
              <div className="w-0.5 h-full bg-neutral-200 dark:bg-neutral-800 my-1"></div>
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Camera size={16} className="text-accent" />
                <h4 className="font-bold text-lg leading-none">Identifica el vehicle</h4>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Quan arribi el bus, fes una foto o apunta el **número de calca** (el número pintat a sobre de la porta o al darrere) o la matrícula.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-accent/20">
                3
              </div>
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-accent" />
                <h4 className="font-bold text-lg leading-none">Exigeix els teus drets</h4>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Omple el formulari oficial. Cada queixa formal és un gra de sorra per forçar el canvi de concessió el 2028.
              </p>
            </div>
          </div>
        </div>

        {/* Callout Box */}
        <div className="mt-8 p-5 bg-red-50 dark:bg-red-950/20 border-2 border-red-600/20 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <AlertTriangle size={60} />
          </div>
          <div className="flex gap-4 items-start relative z-10">
            <div className="bg-red-600 p-2 rounded-lg text-white shrink-0 shadow-lg">
              <Info size={24} />
            </div>
            <div>
              <h5 className="font-black text-red-600 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-2">
                Dada Crítica per a la Validesa Legal
              </h5>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 leading-snug">
                Sense el **número de calca** o la **matrícula**, la Generalitat pot arxivar la queixa automàticament. No deixis que la teva veu es perdi!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="mt-8 mb-12 text-center border-t border-neutral-200 dark:border-neutral-800 pt-12">
        <h3 className="text-lg font-black mb-6 italic tracking-tight">NO ET QUEDIS CALLAT!</h3>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-2">
            <a
              href="https://queixes.gencat.cat/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 px-6 bg-foreground text-background rounded-2xl font-bold transition-all hover:opacity-90 active:scale-95"
            >
              <ExternalLink size={18} />
              FORMULARI DE QUEIXA OFICIAL GENCAT
            </a>
            <p className="text-[10px] text-neutral-500 font-medium italic">
              Important: Perquè la queixa tingui validesa legal, cal omplir aquest formulari oficial
            </p>
          </div>
        </div>
        <p className="mt-12 text-[10px] uppercase font-bold opacity-30 tracking-[0.2em]">
          <a href="https://comarquesgironines.cat" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">CUP Comarques Gironines</a>
        </p>
      </section>
    </main>
  );
}


