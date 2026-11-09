import { useState, useEffect } from 'react';
import { Camera, ThumbsUp, Wrench, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

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

const CENAS = [
  {
    id: 'fio',
    rotulo: '1. Fio elétrico partido',
    detalhe: 'Cidadão relata risco na rede → Equipe religa a fiação',
    pinoX: 210,
    pinoY: 6,
  },
  {
    id: 'bueiro',
    rotulo: '2. Bueiro aberto',
    detalhe: 'Bueiro sem tampa na via → Subprefeitura sela a tampa',
    pinoX: 210,
    pinoY: 78,
  },
  {
    id: 'entulho',
    rotulo: '3. Entulho na calçada',
    detalhe: 'Descarte irregular bloqueando passeio → Limpeza urbana',
    pinoX: 129,
    pinoY: 58,
  },
  {
    id: 'carro',
    rotulo: '4. Carro abandonado',
    detalhe: 'Carcaça abandonada na rua → Remoção e via liberada',
    pinoX: 294,
    pinoY: 60,
  },
];

const DURACAO_ETAPA_MS = 3000;

export function SplashScreen({ onConcluir }) {
  // etapa: 0 = Fio, 1 = Bueiro, 2 = Entulho, 3 = Carro, 4 = Todos resolvidos
  const [etapa, setEtapa] = useState(0);
  const [cicloKey, setCicloKey] = useState(0);

  useEffect(() => {
    if (etapa >= CENAS.length) return undefined;
    const timer = setTimeout(() => {
      setEtapa((anterior) => anterior + 1);
    }, DURACAO_ETAPA_MS);
    return () => clearTimeout(timer);
  }, [etapa, cicloKey]);

  const selecionarCena = (indice) => {
    setEtapa(indice);
    setCicloKey((k) => k + 1);
  };

  const reiniciarSequencia = () => {
    setEtapa(0);
    setCicloKey((k) => k + 1);
  };

  const cenaAtual = CENAS[etapa] || null;

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
        {/* Indicador do problema que está acontecendo na vez */}
        <div className="mb-2 flex min-h-[28px] items-center justify-center">
          {cenaAtual ? (
            <span
              key={`status-${etapa}-${cicloKey}`}
              className="zs-surgir inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
              {cenaAtual.detalhe}
            </span>
          ) : (
            <span className=" zs-surgir inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              4 ocorrências relatadas e resolvidas na vizinhança!
              <button
                type="button"
                onClick={reiniciarSequencia}
                className="ml-1 inline-flex items-center gap-1 underline hover:text-emerald-950"
              >
                <RotateCcw className="h-3 w-3" />
                Repetir
              </button>
            </span>
          )}
        </div>

        <svg
          viewBox="0 0 420 190"
          className="mx-auto w-full max-w-lg"
          role="img"
          aria-label="Ilustração passo a passo: fio rompido, bueiro aberto, entulho na calçada e carro abandonado são relatados e resolvidos um de cada vez"
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

          {/* ==========================================================
              ETAPA 0: FIO ELÉTRICO PARTIDO (acontece primeiro)
             ========================================================== */}
          {etapa === 0 && (
            <g key={`fio-${cicloKey}`}>
              <g className="zs-ato-problema">
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
              <path
                d="M89 44 Q210 82 331 44"
                pathLength="1"
                className="zs-ato-reparo"
                stroke="#059669"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}
          {etapa > 0 && (
            <path
              d="M89 44 Q210 82 331 44"
              stroke="#059669"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* ==========================================================
              ETAPA 1: BUEIRO ABERTO NA RUA (acontece em segundo)
             ========================================================== */}
          {etapa === 1 && (
            <g key={`bueiro-${cicloKey}`}>
              <g className="zs-ato-problema">
                <ellipse
                  cx="176"
                  cy="158"
                  rx="14"
                  ry="4.5"
                  fill="#64748b"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="210"
                  cy="156"
                  rx="22"
                  ry="6.5"
                  fill="#0f172a"
                  stroke="#dc2626"
                  strokeWidth="2"
                />
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
              <g className="zs-ato-tampa">
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
            </g>
          )}
          {etapa > 1 && (
            <g>
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
          )}

          {/* ==========================================================
              ETAPA 2: ENTULHO NA CALÇADA (acontece em terceiro)
             ========================================================== */}
          {etapa === 2 && (
            <g key={`entulho-${cicloKey}`}>
              <g className="zs-ato-problema">
                <path
                  d="M98 142 Q114 122 132 128 Q146 118 160 142 Z"
                  fill="#d6d3d1"
                  stroke="#78716c"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
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
              <g className="zs-ato-check">
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
            </g>
          )}
          {etapa > 2 && (
            <g>
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
          )}

          {/* ==========================================================
              ETAPA 3: CARRO ABANDONADO NA RUA (acontece em quarto)
             ========================================================== */}
          {etapa === 3 && (
            <g key={`carro-${cicloKey}`}>
              <g className="zs-ato-carro">
                <g transform="rotate(4 294 146)">
                  <path
                    d="M262 150 L267 138 L279 130 L306 130 L316 139 L326 141 L326 150 Z"
                    fill="#cbd5e1"
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path d="M280 133 H303 L310 139 H272 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1.3" />
                  <line x1="286" y1="133" x2="292" y2="139" stroke="#dc2626" strokeWidth="1.3" />
                  <circle cx="278" cy="145" r="2.5" fill="#b45309" opacity="0.7" />
                  <circle cx="308" cy="144" r="3" fill="#b45309" opacity="0.7" />
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
              <g className="zs-ato-check">
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
            </g>
          )}
          {etapa > 3 && (
            <g>
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
          )}

          {/* Pino de geolocalização do ZelaSP que desce exatamente sobre o problema da vez */}
          {cenaAtual && (
            <g
              key={`pino-${etapa}-${cicloKey}`}
              transform={`translate(${cenaAtual.pinoX}, ${cenaAtual.pinoY})`}
            >
              <circle
                cx="0"
                cy="26"
                r="15"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                className="zs-ato-onda"
              />
              <g className="zs-ato-pino">
                <path
                  d="M0 0 c-10 0 -18 8 -18 18 c0 13 18 30 18 30 s18 -17 18 -30 c0 -10 -8 -18 -18 -18z"
                  fill="#1e40af"
                />
                <circle cx="0" cy="18" r="6" fill="#ffffff" />
              </g>
            </g>
          )}
        </svg>

        {/* Etiquetas sequenciais das 4 ocorrências (clicáveis para rever qualquer uma) */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {CENAS.map((cena, idx) => {
            const concluida = etapa > idx;
            const emAndamento = etapa === idx;
            return (
              <button
                key={cena.id}
                type="button"
                onClick={() => selecionarCena(idx)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                  concluida
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : emAndamento
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
                }`}
              >
                {concluida ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                ) : emAndamento ? (
                  <span className="h-2 w-2 animate-ping rounded-full bg-blue-600" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                )}
                {cena.rotulo}
              </button>
            );
          })}
        </div>

        <div
          className="zs-surgir mt-5 flex items-center justify-center gap-3"
          style={{ animationDelay: '0.4s' }}
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
          style={{ animationDelay: '0.6s' }}
        >
          Fio caído, bueiro aberto, entulho na calçada ou carro abandonado: a vizinhança
          avisa, a prefeitura resolve e todo mundo acompanha.
        </p>

        <ul className="mt-7 grid gap-3 text-left sm:grid-cols-3">
          {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
            <li
              key={titulo}
              className="zs-surgir rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              style={{ animationDelay: `${0.8 + i * 0.2}s` }}
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
          className="zs-surgir mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-800 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-900"
          style={{ animationDelay: '1.4s' }}
        >
          Começar
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
