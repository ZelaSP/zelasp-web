import { Camera, ThumbsUp, Wrench, ArrowRight } from 'lucide-react';

const PASSOS = [
  {
    icone: Camera,
    titulo: 'Relate em 15 segundos',
    texto: 'Foto, CEP e localização. Sem formulário longo.',
  },
  {
    icone: ThumbsUp,
    titulo: 'Apoie, não duplique',
    texto: 'Se um vizinho já avisou, some seu apoio ao mesmo chamado.',
  },
  {
    icone: Wrench,
    titulo: 'Acompanhe o reparo',
    texto: 'Veja quando a prefeitura vistoria, executa e resolve.',
  },
];

export function SplashScreen({ onConcluir }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10">
      <button
        type="button"
        onClick={onConcluir}
        className="absolute right-4 top-4 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200/60 hover:text-slate-800"
      >
        Pular
      </button>

      <div className="w-full max-w-2xl text-center">
        <svg
          viewBox="0 0 320 170"
          className="mx-auto w-full max-w-sm"
          role="img"
          aria-label="Ilustração: um fio rompido entre dois postes é relatado e religado"
        >
          <line
            x1="10"
            y1="150"
            x2="310"
            y2="150"
            pathLength="1"
            className="zs-draw"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M70 150 V40 M58 46 H82"
            pathLength="1"
            className="zs-draw zs-atraso-1"
            stroke="#334155"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M250 150 V40 M238 46 H262"
            pathLength="1"
            className="zs-draw zs-atraso-1"
            stroke="#334155"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          <g className="zs-fio-quebrado">
            <g className="zs-balanca-esq">
              <path
                d="M82 46 Q110 70 128 112"
                stroke="#d97706"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="128" cy="112" r="4" fill="#fbbf24" className="zs-faisca" />
            </g>
            <g className="zs-balanca-dir">
              <path
                d="M238 46 Q212 66 196 104"
                stroke="#d97706"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="196" cy="104" r="4" fill="#fbbf24" className="zs-faisca" />
            </g>
          </g>

          <path
            d="M82 46 Q160 84 238 46"
            pathLength="1"
            className="zs-reparo"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          <g className="zs-pino">
            <path
              d="M160 4 c-11 0 -20 9 -20 20 c0 15 20 34 20 34 s20 -19 20 -34 c0 -11 -9 -20 -20 -20z"
              fill="#1e40af"
            />
            <circle cx="160" cy="24" r="7" fill="#ffffff" />
          </g>
        </svg>

        <div
          className="zs-surgir mt-2 flex items-center justify-center gap-3"
          style={{ animationDelay: '2.9s' }}
        >
          <img
            src="/zelasp-logo.jpg"
            alt=""
            className="h-12 w-12 rounded-xl border border-slate-200 object-cover shadow-sm"
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            ZelaSP
          </h1>
        </div>

        <p
          className="zs-surgir mx-auto mt-3 max-w-xl text-base text-slate-600 sm:text-lg"
          style={{ animationDelay: '3.2s' }}
        >
          Fio caído, bueiro aberto, entulho na calçada: a vizinhança avisa, a prefeitura
          resolve e todo mundo acompanha.
        </p>

        <ul className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
            <li
              key={titulo}
              className="zs-surgir rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              style={{ animationDelay: `${3.6 + i * 0.25}s` }}
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                <Icone className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-900">{titulo}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{texto}</p>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onConcluir}
          className="zs-surgir mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-900"
          style={{ animationDelay: '4.5s' }}
        >
          Começar
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
