import { MapPin, Activity } from 'lucide-react';

const BAIRROS_PRIORITARIOS = [
  'Jabaquara',
  'Vila Mariana',
  'Saúde',
  'Bela Vista',
  'Mooca',
  'Vila Mascote',
];

export function DistrictOverview({
  ocorrencias,
  filtroBairro,
  onSelecionarBairro,
  statusContingencia,
}) {
  const contagemPorBairro = BAIRROS_PRIORITARIOS.map((bairro) => {
    const itens = ocorrencias.filter(
      (o) => o.bairro === bairro && o.status !== 'RESOLVIDO'
    );
    const criticos = itens.filter((o) => Number(o.nivelPrioridade) >= 4).length;
    return {
      bairro,
      abertos: itens.length,
      criticos,
    };
  });

  const corContingencia =
    statusContingencia === 'CONTINGÊNCIA ATIVADA'
      ? 'bg-red-50 text-red-800 border-red-200'
      : statusContingencia === 'ATENÇÃO OPERACIONAL'
      ? 'bg-amber-50 text-amber-900 border-amber-200'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-800" />
          <h3 className="text-sm font-bold text-slate-900">
            Visão Territorial — Bairros Prioritários
          </h3>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${corContingencia}`}
          title="Gatilho Preditivo de Contingência Territorial (calculado pela concentração de risco)"
        >
          <Activity className="h-3.5 w-3.5" />
          <span>GPCT: {statusContingencia}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {contagemPorBairro.map(({ bairro, abertos, criticos }) => {
          const ativo = filtroBairro === bairro;
          return (
            <button
              key={bairro}
              type="button"
              onClick={() =>
                onSelecionarBairro(ativo ? 'TODOS' : bairro)
              }
              className={`flex flex-col items-start rounded-lg border p-3 text-left transition ${
                ativo
                  ? 'border-blue-700 bg-blue-50 ring-1 ring-blue-700'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 truncate w-full">
                {bairro}
              </span>
              <span className="mt-1 text-xs text-slate-600">
                {abertos} {abertos === 1 ? 'aberto' : 'abertos'}
              </span>
              {criticos > 0 && (
                <span className="mt-1 text-[11px] font-semibold text-red-700">
                  {criticos} {criticos === 1 ? 'crítico' : 'críticos'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
