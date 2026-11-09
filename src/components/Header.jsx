import { Plus, ShieldAlert, Cloud, HardDrive } from 'lucide-react';

export function Header({ onAbrirFormulario, apiRemotaAtiva }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      {/* Faixa de alerta cívico de segurança elétrica */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center text-xs font-medium text-amber-900">
        <span className="inline-flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-700 shrink-0" />
          <span>
            Fio caído na rua? Não se aproxime nem toque. Sinalize a área e registre o chamado abaixo (Emergência: 193 / Defesa Civil: 199).
          </span>
        </span>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src="/zelasp-logo.jpg"
            alt="Logo ZelaSP"
            className="h-10 w-10 rounded-lg border border-slate-200 object-cover shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                ZelaSP
              </h1>
              <span
                title={
                  apiRemotaAtiva
                    ? 'Sincronizado via MockAPI na nuvem'
                    : 'Armazenamento local ativo (configure VITE_API_URL para nuvem)'
                }
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  apiRemotaAtiva
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {apiRemotaAtiva ? (
                  <>
                    <Cloud className="h-3 w-3" /> Nuvem
                  </>
                ) : (
                  <>
                    <HardDrive className="h-3 w-3" /> Local
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Zeladoria Cidadã Inteligente · São Paulo
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAbrirFormulario}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Relatar Problema</span>
          <span className="sm:hidden">Relatar</span>
        </button>
      </div>
    </header>
  );
}
