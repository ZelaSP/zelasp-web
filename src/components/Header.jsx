import { Plus, ShieldAlert, Cloud, HardDrive, User, Building2, LogOut, ArrowLeftRight } from 'lucide-react';

export function Header({
  perfil,
  onAbrirFormulario,
  onAlternarPerfil,
  onSair,
  apiRemotaAtiva,
}) {
  const ehPrefeitura = perfil === 'prefeitura';

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

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src="/zelasp-logo.jpg"
            alt="Logo ZelaSP"
            className="h-10 w-10 rounded-lg border border-slate-200 object-cover shadow-sm"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                ZelaSP
              </h1>

              {/* Badge do perfil ativo */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  ehPrefeitura
                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                {ehPrefeitura ? (
                  <>
                    <Building2 className="h-3 w-3" />
                    Painel da Prefeitura
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3" />
                    Área do Cidadão
                  </>
                )}
              </span>

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
              {ehPrefeitura
                ? 'Central de Triagem, Vistoria e Despacho · Subprefeituras SP'
                : 'Zeladoria Cidadã Inteligente · São Paulo'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          { !ehPrefeitura && (
            <button
              type="button"
              onClick={onAbrirFormulario}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-800 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-900 sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Relatar Problema</span>
            </button>
          )}

          {onAlternarPerfil && (
            <button
              type="button"
              onClick={onAlternarPerfil}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              title="Alternar rapidamente entre a visão do Cidadão e o Painel da Prefeitura"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden md:inline">
                {ehPrefeitura ? 'Ir para Visão Cidadão' : 'Ir para Painel Prefeitura'}
              </span>
              <span className="md:hidden">
                {ehPrefeitura ? 'Cidadão' : 'Prefeitura'}
              </span>
            </button>
          )}

          {onSair && (
            <button
              type="button"
              onClick={onSair}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              title="Voltar para a tela de login"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
