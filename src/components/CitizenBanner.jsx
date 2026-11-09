import { AlertTriangle, CheckCircle, Users, PlusCircle } from 'lucide-react';

export function CitizenBanner({ resumo, onAbrirFormulario }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 border border-blue-100">
            <span>Monitoramento Comunitário · Jabaquara, Vila Mariana, Saúde, Bela Vista e Mooca</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Relate fiação caída, bueiros e entulho em menos de 15 segundos.
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Em vez de enfrentar formulários lentos ou abrir chamados repetidos no mesmo quarteirão,
            consulte ocorrências abertas na sua rua, some seu apoio à demanda da vizinhança e
            acompanhe cada etapa do reparo.
          </p>

          <div className="pt-1 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onAbrirFormulario}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
            >
              <PlusCircle className="h-4 w-4" />
              Registrar Nova Ocorrência
            </button>
          </div>
        </div>

        {/* Painel dinâmico calculado diretamente dos dados da API */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:w-96 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
              <CheckCircle className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{resumo.totalAbertas}</p>
            <p className="text-[11px] font-medium text-slate-600 leading-tight mt-0.5">
              Chamados em aberto
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-amber-900">{resumo.totalCriticas}</p>
            <p className="text-[11px] font-medium text-amber-800 leading-tight mt-0.5">
              Risco alto / elétrico
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-emerald-900">{resumo.totalApoios}</p>
            <p className="text-[11px] font-medium text-emerald-800 leading-tight mt-0.5">
              Apoios sem duplicidade
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
