import { Camera, ThumbsUp, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';

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

const OCORRENCIAS_CENA = [
  'Fio elétrico partido',
  'Entulho na calçada',
  'Bueiro aberto',
  'Carro abandonado',
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
          viewBox="0 0 420 190"
          className="mx-auto w-full max-w-lg"
          role="img"
          aria-label="Ilustração: fio rompido, entulho na calçada, bueiro aberto e carro abandonado são relatados e resolvidos"
        >
          {/* Linha da calçada (meio-fio) */}
          <line
            x1="15"
            y1="142"
            x2="405"
            y2="142"
            pathLength="1"
            className="zs-draw"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Faixa da rua / asfalto */}
          <line
            x1="15"
            y1="168"
            x2="405"
            y2="168"
            pathLength="1"
            className="zs-draw"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Postes de energia (esquerda e direita) */}
          <path
            d="M75 142 V38 M61 44 H89"
            pathLength="1"
            className="zs-draw zs-atraso-1"
            stroke="#334155"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M345 142 V38 M331 44 H359"
            pathLength="1"
            className="zs-draw zs-atraso-1"
            stroke="#334155"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 1. FIO ELÉTRICO PARTIDO (antes do reparo) */}
          <g className="zs-fio-quebrado">
            <g className="zs-balanca-esq">
              <path
                d="M89 44 Q125 68 144 106"
                stroke="#d97706"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="144" cy="106" r="4" fill="#fbbf24" className="zs-faisca" />
            </g>
            <g className="zs-balanca-dir">
              <path
                d="M331 44 Q296 66 276 102"
                stroke="#d97706"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="276" cy="102" r="4" fill="#fbbf24" className="zs-faisca" />
            </g>
          </g>

          {/* 1B. FIO RELIGADO (após reparo) */}
          <path
            d="M89 44 Q210 82 331 44"
            pathLength="1"
            className="zs-reparo"
            stroke="#059669"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* 2. ENTULHO NA CALÇADA (blocos, tábuas e detritos à esquerda) */}
          <g className="zs-problema-solo">
            {/* Monte de terra/detritos */}
            <path
              d="M98 142 Q114 122 132 128 Q146 118 160 142 Z"
              fill="#d6d3d1"
              stroke="#78716c"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Tijolos/blocos quebrados */}
            <rect
              x="108"
              y="129"
              width="14"
              height="8"
              rx="1.5"
              transform="rotate(-14 108 129)"
              fill="#ea580c"
            />
            <rect
              x="128"
              y="126"
              width="15"
              height="8"
              rx="1.5"
              transform="rotate(18 128 126)"
              fill="#b45309"
            />
            {/* Tábua inclinada */}
            <line
              x1="104"
              y1="122"
              x2="148"
              y2="138"
              stroke="#92400e"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text
              x="129"
              y="115"
              textAnchor="middle"
              fill="#b45309"
              fontSize="8.5"
              fontWeight="700"
            >
              ENTULHO
            </text>
          </g>
          {/* Check verde onde o entulho foi limpo */}
          <g className="zs-check-ok">
            <circle cx="129" cy="130" r="8" fill="#d1fae5" stroke="#059669" strokeWidth="1.8" />
            <path
              d="M125.5 130 L128 132.5 L133 127.5"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* 3. BUEIRO ABERTO NA RUA (centro da via) */}
          <g className="zs-problema-solo">
            {/* Tampa solta deslocada ao lado */}
            <ellipse
              cx="176"
              cy="158"
              rx="14"
              ry="4.5"
              fill="#64748b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Buraco escuro do bueiro sem tampa */}
            <ellipse
              cx="210"
              cy="156"
              rx="22"
              ry="6.5"
              fill="#0f172a"
              stroke="#dc2626"
              strokeWidth="2"
            />
            {/* Linhas de alerta saindo do bueiro aberto */}
            <line x1="202" y1="146" x2="200" y2="138" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <line x1="210" y1="145" x2="210" y2="136" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <line x1="218" y1="146" x2="220" y2="138" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <text
              x="210"
              y="131"
              textAnchor="middle"
              fill="#dc2626"
              fontSize="8.5"
              fontWeight="700"
            >
              BUEIRO ABERTO
            </text>
          </g>
          {/* Tampa selada em verde cobrindo o bueiro após o reparo */}
          <g className="zs-tampa-bueiro">
            <ellipse
              cx="210"
              cy="156"
              rx="22"
              ry="6.5"
              fill="#10b981"
              stroke="#047857"
              strokeWidth="2"
            />
            <line x1="196" y1="156" x2="224" y2="156" stroke="#064e3b" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* 4. CARRO ABANDONADO NA RUA (direita, inclinado e enferrujado) */}
          <g className="zs-carro-abandonado">
            {/* Carcaça inclinada do veículo */}
            <g transform="rotate(4 294 146)">
              <path
                d="M262 150 L267 138 L279 130 L306 130 L316 139 L326 141 L326 150 Z"
                fill="#cbd5e1"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Janelas com rachadura */}
              <path d="M280 133 H303 L310 139 H272 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1.3" />
              <line x1="286" y1="133" x2="292" y2="139" stroke="#dc2626" strokeWidth="1.3" />
              {/* Manchas de ferrugem */}
              <circle cx="278" cy="145" r="2.5" fill="#b45309" opacity="0.7" />
              <circle cx="308" cy="144" r="3" fill="#b45309" opacity="0.7" />
              {/* Rodas (uma murcha/faltando) */}
              <circle cx="274" cy="151" r="5.5" fill="#334155" />
              <ellipse cx="313" cy="152" rx="6" ry="3.2" fill="#334155" />
            </g>
            <text
              x="294"
              y="121"
              textAnchor="middle"
              fill="#64748b"
              fontSize="8.5"
              fontWeight="700"
            >
              ABANDONADO
            </text>
          </g>
          {/* Check verde onde o carro abandonado foi removido */}
          <g className="zs-check-ok">
            <circle cx="294" cy="142" r="8" fill="#d1fae5" stroke="#059669" strokeWidth="1.8" />
            <path
              d="M290.5 142 L293 144.5 L298 139.5"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Onda de acionamento e Pino central do ZelaSP */}
          <circle
            cx="210"
            cy="32"
            r="16"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            className="zs-onda"
          />
          <g className="zs-pino">
            <path
              d="M210 6 c-11 0 -20 9 -20 20 c0 15 20 34 20 34 s20 -19 20 -34 c0 -11 -9 -20 -20 -20z"
              fill="#1e40af"
            />
            <circle cx="210" cy="26" r="7" fill="#ffffff" />
          </g>
        </svg>

        {/* Etiquetas das 4 ocorrências urbanas resolvidas na cena */}
        <div
          className="zs-surgir mt-2 flex flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: '2.6s' }}
        >
          {OCORRENCIAS_CENA.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              {item}
            </span>
          ))}
        </div>

        <div
          className="zs-surgir mt-5 flex items-center justify-center gap-3"
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
          Fio caído, bueiro aberto, entulho na calçada ou carro abandonado: a vizinhança
          avisa, a prefeitura resolve e todo mundo acompanha.
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
