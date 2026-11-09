import { Search, Filter, RotateCcw } from 'lucide-react';
import { BAIRROS_FOCO, STATUS_FLUXO } from '../data/seedIncidents';

const ROTULOS_STATUS = {
  ABERTO: 'Aberto',
  EM_VISTORIA: 'Em Vistoria',
  EM_EXECUCAO: 'Em Execução',
  RESOLVIDO: 'Resolvido',
};

export function FilterBar({
  termoBusca,
  onMudarBusca,
  filtroBairro,
  onMudarBairro,
  filtroStatus,
  onMudarStatus,
  totalExibidos,
}) {
  const temFiltroAtivo =
    termoBusca.trim() !== '' ||
    filtroBairro !== 'TODOS' ||
    filtroStatus !== 'TODOS';

  const limparFiltros = () => {
    onMudarBusca('');
    onMudarBairro('TODOS');
    onMudarStatus('TODOS');
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Campo de busca textual */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => onMudarBusca(e.target.value)}
            placeholder="Buscar por rua, bairro, categoria ou protocolo (ex: SP-2026-101)..."
            aria-label="Buscar ocorrências"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filtro por Bairro */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-slate-500 hidden sm:inline" />
            <select
              value={filtroBairro}
              onChange={(e) => onMudarBairro(e.target.value)}
              aria-label="Filtrar por bairro"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
            >
              <option value="TODOS">Todos os bairros</option>
              {BAIRROS_FOCO.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <select
            value={filtroStatus}
            onChange={(e) => onMudarStatus(e.target.value)}
            aria-label="Filtrar por status"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
          >
            <option value="TODOS">Todos os status</option>
            {STATUS_FLUXO.map((st) => (
              <option key={st} value={st}>
                {ROTULOS_STATUS[st] || st}
              </option>
            ))}
          </select>

          {temFiltroAtivo && (
            <button
              type="button"
              onClick={limparFiltros}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
        </div>
      </div>

      <p className="mt-2.5 text-xs text-slate-500">
        Exibindo <strong>{totalExibidos}</strong>{' '}
        {totalExibidos === 1 ? 'ocorrência encontrada' : 'ocorrências encontradas'}
      </p>
    </section>
  );
}
