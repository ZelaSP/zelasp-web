import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function ToastNotification({ notificacao, onFechar }) {
  if (!notificacao) return null;

  const isErro = notificacao.tipo === 'erro';

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all ${
        isErro
          ? 'border-red-200 bg-red-50 text-red-900'
          : 'border-emerald-200 bg-emerald-50 text-emerald-900'
      }`}
    >
      {isErro ? (
        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
      ) : (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
      )}

      <p className="text-xs font-semibold sm:text-sm">{notificacao.mensagem}</p>

      <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar aviso"
        className="ml-2 rounded p-0.5 opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
