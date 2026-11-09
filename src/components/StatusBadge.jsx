const ESTILOS_STATUS = {
  ABERTO: {
    label: 'Aberto',
    classes: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  EM_VISTORIA: {
    label: 'Em Vistoria',
    classes: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  EM_EXECUCAO: {
    label: 'Em Execução',
    classes: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  RESOLVIDO: {
    label: 'Resolvido',
    classes: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
};

export function StatusBadge({ status }) {
  const config = ESTILOS_STATUS[status] || ESTILOS_STATUS.ABERTO;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
