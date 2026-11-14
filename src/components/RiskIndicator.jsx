import { Zap, AlertOctagon, Info } from 'lucide-react';

export function RiskIndicator({ nivel, riscoChoque }) {
  const numNivel = Number(nivel) || 1;

  if (numNivel >= 5) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700 border border-red-200">
        {riscoChoque ? <Zap className="h-3.5 w-3.5 text-red-600" /> : <AlertOctagon className="h-3.5 w-3.5 text-red-600" />}
        Nível {numNivel} · Urgência Máxima
      </span>
    );
  }

  if (numNivel === 4) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
        <AlertOctagon className="h-3.5 w-3.5 text-amber-700" />
        Nível 4 · Prioridade Alta
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
      <Info className="h-3.5 w-3.5 text-slate-500" />
      Nível {numNivel} · Zeladoria Regular
    </span>
  );
}
