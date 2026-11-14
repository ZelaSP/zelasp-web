import { useState, useEffect } from 'react';
import { X, Save, MapPin, Loader2, ExternalLink } from 'lucide-react';
import { STATUS_FLUXO } from '../data/seedIncidents';
import { StatusBadge } from './StatusBadge';

const OPCOES_STATUS = [
  { value: 'ABERTO', label: 'Aberto (Aguardando análise)' },
  { value: 'EM_VISTORIA', label: 'Em Vistoria Técnica' },
  { value: 'EM_EXECUCAO', label: 'Em Execução no Local' },
  { value: 'RESOLVIDO', label: 'Resolvido / Concluído' },
];

export function IncidentModal({ item, onFechar, onSalvarEdicao }) {
  const [status, setStatus] = useState('ABERTO');
  const [notaTecnica, setNotaTecnica] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (item) {
      setStatus(item.status || STATUS_FLUXO[0]);
      setNotaTecnica(item.notaTecnica || '');
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await onSalvarEdicao(item, status, notaTecnica.trim());
      onFechar();
    } catch {
      // Erro já exibido em toast; mantém modal e campos abertos para o usuário não perder o texto.
    } finally {
      setSalvando(false);
    }
  };

  const linkMaps = item.coordenadas
    ? `https://www.google.com/maps?q=${item.coordenadas.lat},${item.coordenadas.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${item.endereco}, ${item.bairro}, São Paulo - SP`
      )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-vistoria"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <span className="font-mono text-xs font-bold text-slate-500">
              {item.protocolo}
            </span>
            <h2 id="titulo-modal-vistoria" className="text-base font-bold text-slate-900">
              Atualizar Atendimento
            </h2>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar detalhes"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900">{item.categoria}</strong>
              <StatusBadge status={item.status} />
            </div>
            <p className="flex items-center gap-1 text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-blue-700 shrink-0" />
              {item.bairro} — {item.endereco}
            </p>
            <a
              href={linkMaps}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline pt-1"
            >
              <span>Ver ponto no Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div>
            <label htmlFor="select-status" className="block text-xs font-semibold text-slate-700 mb-1">
              Novo Status Operacional
            </label>
            <select
              id="select-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            >
              {OPCOES_STATUS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nota-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Nota da Vistoria / Equipe em Campo
            </label>
            <textarea
              id="nota-input"
              rows={3}
              value={notaTecnica}
              onChange={(e) => setNotaTecnica(e.target.value)}
              placeholder="Descreva a providência tomada pela subprefeitura ou concessionária..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
            >
              {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Salvar Atualização</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
