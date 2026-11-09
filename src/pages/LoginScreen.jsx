import { useState } from 'react';
import { User, Building2, LogIn, Info, Play } from 'lucide-react';

const PERFIS = {
  cidadao: {
    titulo: 'Cidadão',
    descricao: 'Morador, pedestre ou comerciante',
    icone: User,
    email: 'morador@zelasp.com.br',
    botao: 'Entrar como Cidadão',
  },
  prefeitura: {
    titulo: 'Prefeitura',
    descricao: 'Subprefeitura, Defesa Civil ou concessionária',
    icone: Building2,
    email: 'operacao@prefeitura.sp.gov.br',
    botao: 'Entrar no Painel da Prefeitura',
  },
};

const BAIRROS = ['Jabaquara', 'Vila Mariana', 'Saúde', 'Bela Vista', 'Mooca', 'Vila Mascote'];

export function LoginScreen({ onEntrar, onReverAbertura }) {
  const [perfil, setPerfil] = useState('cidadao');
  const config = PERFIS[perfil];

  const handleSubmit = (e) => {
    e.preventDefault();
    onEntrar(perfil);
  };

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-blue-800 p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <img
            src="/zelasp-logo.jpg"
            alt="Logo ZelaSP"
            className="h-11 w-11 rounded-lg border border-white/20 object-cover"
          />
          <span className="text-xl font-extrabold tracking-tight">ZelaSP</span>
        </div>

        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            A rua avisa. A prefeitura resolve. Todo mundo acompanha.
          </h2>
          <p className="text-sm leading-relaxed text-blue-100">
            O cidadão relata o problema e apoia chamados da vizinhança. A prefeitura recebe
            tudo em uma fila única, sem duplicidade, ordenada pelo risco.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {BAIRROS.map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-blue-200">Global Solution 2026.2 · FIAP · CitizenTech</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <img
              src="/zelasp-logo.jpg"
              alt="Logo ZelaSP"
              className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
            />
            <span className="text-lg font-extrabold text-slate-900">ZelaSP</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
          <p className="mt-1 text-sm text-slate-600">Escolha como você vai usar a plataforma.</p>

          <div role="radiogroup" aria-label="Tipo de acesso" className="mt-6 grid grid-cols-2 gap-3">
            {Object.entries(PERFIS).map(([chave, p]) => {
              const ativo = perfil === chave;
              const Icone = p.icone;
              return (
                <button
                  key={chave}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  onClick={() => setPerfil(chave)}
                  className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition ${
                    ativo
                      ? 'border-blue-700 bg-blue-50 ring-1 ring-blue-700'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Icone className={`h-5 w-5 ${ativo ? 'text-blue-800' : 'text-slate-500'}`} />
                  <span className="text-sm font-bold text-slate-900">{p.titulo}</span>
                  <span className="text-xs leading-snug text-slate-600">{p.descricao}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-xs font-semibold text-slate-700">
                E-mail
              </label>
              <input
                key={`email-${perfil}`}
                id="login-email"
                type="email"
                defaultValue={config.email}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="login-senha" className="mb-1 block text-xs font-semibold text-slate-700">
                Senha
              </label>
              <input
                key={`senha-${perfil}`}
                id="login-senha"
                type="password"
                defaultValue="demo1234"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-900"
          >
            <LogIn className="h-4 w-4" />
            {config.botao}
          </button>

          <p className="mt-4 flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            Protótipo acadêmico: o login é demonstrativo e não valida senha. O que for relatado
            no modo Cidadão aparece imediatamente no Painel da Prefeitura.
          </p>

          {onReverAbertura && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onReverAbertura}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:underline"
              >
                <Play className="h-3.5 w-3.5" />
                Rever animação de abertura do ZelaSP
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
