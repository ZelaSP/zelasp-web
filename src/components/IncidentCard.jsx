import { useState } from 'react';
import {
  MapPin,
  ThumbsUp,
  ClipboardEdit,
  Trash2,
  Clock,
  Check,
  Users,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { RiskIndicator } from './RiskIndicator';
import { formatarDataBr } from '../utils/riskCalculator';

export function IncidentCard({
  item,
  perfil = 'cidadao',
  onApoiar,
  onAbrirModal,
  onExcluir,
}) {
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [processandoApoio, setProcessandoApoio] = useState(false);
  const [apoiadoLocal, setApoiadoLocal] = useState(false);

  const ehPrefeitura = perfil === 'prefeitura';

  const handleApoio = async () => {
    if (processandoApoio || apoiadoLocal || item.status === 'RESOLVIDO') return;
    setProcessandoApoio(true);
    try {
      await onApoiar(item);
      setApoiadoLocal(true);
    } catch {
      // Erro tratado em App.jsx; mantém botão ativo sem marcar "Apoiado por você".
    } finally {
      setProcessandoApoio(false);
    }
  };

  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-5">
      <div>
        {/* Linha de protocolo e badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className="font-mono text-xs font-bold text-slate-500">
            {item.protocolo}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <RiskIndicator nivel={item.nivelPrioridade} riscoChoque={item.riscoChoque} />
            <StatusBadge status={item.status} />
          </div>
        </div>

        {/* Categoria e Endereço */}
        <h3 className="text-base font-bold text-slate-900">
          {item.categoria}
        </h3>

        <p className="mt-1 flex items-start gap-1.5 text-xs font-semibold text-blue-900">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-700" />
          <span>
            {item.bairro} — {item.endereco}
          </span>
        </p>

        {/* Descrição */}
        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
          {item.descricao}
        </p>

        {item.fotoNome && (
          <p className="mt-2 text-xs text-slate-500">
            Arquivo selecionado para demonstração:{' '}
            <strong className="font-medium text-slate-700">{item.fotoNome}</strong>
          </p>
        )}

        {item.notaTecnica && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
            <strong className="font-semibold text-slate-900">Parecer da Prefeitura: </strong>
            {item.notaTecnica}
          </div>
        )}
      </div>

      {/* Rodapé do Card: Data e Botões específicos por perfil */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
          <Clock className="h-3 w-3" />
          {formatarDataBr(item.criadoEm)}
        </span>

        {!ehPrefeitura ? (
          /* Ações do Cidadão: Apoiar chamado existente para evitar duplicidade */
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleApoio}
              disabled={processandoApoio || apoiadoLocal || item.status === 'RESOLVIDO'}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                apoiadoLocal
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 disabled:opacity-50'
              }`}
              title="Some seu apoio a este relato sem precisar abrir outro chamado igual"
            >
              {apoiadoLocal ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <ThumbsUp className="h-3.5 w-3.5" />
              )}
              <span>
                {apoiadoLocal ? 'Apoiado por você' : 'Também vi na rua · Apoiar'} ({item.apoios || 1})
              </span>
            </button>
          </div>
        ) : (
          /* Ações Operacionais da Prefeitura: Ver apoios, Atualizar Status (PUT) e Excluir (DELETE) */
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700"
              title="Contador demonstrativo de apoios somados a este chamado"
            >
              <Users className="h-3 w-3 text-slate-500" />
              {item.apoios || 1} {Number(item.apoios || 1) === 1 ? 'apoio' : 'apoios'}
            </span>

            {/* UPDATE: Modal de status / vistoria */}
            <button
              type="button"
              onClick={() => onAbrirModal(item)}
              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-100"
            >
              <ClipboardEdit className="h-3.5 w-3.5" />
              <span>Despachar / Status</span>
            </button>

            {/* DELETE: Confirmação em 2 cliques */}
            {confirmandoExclusao ? (
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onExcluir(item.id)}
                  className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoExclusao(false)}
                  className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmandoExclusao(true)}
                aria-label={`Excluir ocorrência ${item.protocolo}`}
                title="Excluir chamado inválido ou duplicado"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
