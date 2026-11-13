import { useState, useRef, useEffect } from 'react';
import {
  Camera,
  ThumbsUp,
  Wrench,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  ArrowDown,
  Zap,
  AlertTriangle,
  Construction,
  Car,
} from 'lucide-react';
import { ZelaspBackground3D } from '../components/ZelaspBackground3D';

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
    tituloCurto: '1. Fio elétrico',
    detalhe: 'Cidadão relata risco na rede → Equipe religa a fiação',
    subtitulo:
      'Cabos rompidos soltam faíscas e colocam pedestres em perigo imediato. O ZelaSP classifica o risco no nível máximo logo na abertura.',
    icone: Zap,
    destaque: 'border-red-200/90 bg-red-50/85 text-red-900',
    iconeCor: 'text-red-600',
  },
  {
    id: 'bueiro',
    rotulo: '2. Bueiro aberto',
    tituloCurto: '2. Bueiro',
    detalhe: 'Bueiro sem tampa na via → Subprefeitura sela a tampa',
    subtitulo:
      'Tampas furtadas ou quebradas representam risco grave de queda para idosos, crianças e pessoas com deficiência.',
    icone: AlertTriangle,
    destaque: 'border-amber-200/90 bg-amber-50/85 text-amber-900',
    iconeCor: 'text-amber-600',
  },
  {
    id: 'entulho',
    rotulo: '3. Entulho na calçada',
    tituloCurto: '3. Entulho',
    detalhe: 'Descarte irregular bloqueando passeio → Limpeza urbana',
    subtitulo:
      'Restos de obra no passeio obrigam o pedestre a caminhar no asfalto entre veículos; fotos e apoios aceleram a remoção.',
    icone: Construction,
    destaque: 'border-amber-200/90 bg-amber-50/85 text-amber-900',
    iconeCor: 'text-amber-700',
  },
  {
    id: 'carro',
    rotulo: '4. Carro abandonado',
    tituloCurto: '4. Carro',
    detalhe: 'Carcaça abandonada na rua → Remoção e via liberada',
    subtitulo:
      'Veículos abandonados acumulam água parada, comprometem o escoamento da via e podem voltar ao radar público com um relato.',
    icone: Car,
    destaque: 'border-blue-200/90 bg-blue-50/85 text-blue-900',
    iconeCor: 'text-blue-700',
  },
];

const ETAPAS_NAV = [
  ...CENAS.map((c) => ({ id: c.id, label: c.tituloCurto })),
  { id: 'revitalizada', label: '5. Rua revitalizada' },
];

export function SplashScreen({ onConcluir }) {
  const homeRef = useRef(null);
  const secaoRefs = useRef([]);
  const [etapaAtiva, setEtapaAtiva] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleConcluir = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    onConcluir();
  };

  const irParaEtapa = (indice) => {
    if (indice === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (indice === ETAPAS_NAV.length - 1) {
      const fimDaPagina =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.max(0, fimDaPagina), behavior: 'smooth' });
      return;
    }
    const alvo = secaoRefs.current[indice];
    if (alvo) {
      alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div ref={homeRef} className="zelasp-home-root relative w-full">
      {/* Canvas WebGL 3D fixo em tela cheia controlado pela rolagem */}
      <ZelaspBackground3D triggerRef={homeRef} onStageChange={setEtapaAtiva} />

      {/* Barra superior translúcida com navegação rápida pelos 5 estados 3D */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 px-4 py-3 sm:px-6">
        <nav
          aria-label="Etapas da cena inicial"
          className="zelasp-glass pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-slate-200/80 px-3.5 py-2 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/zelasp-logo.jpg"
              alt="Logo ZelaSP"
              className="h-8 w-8 rounded-lg border border-slate-200 object-cover"
            />
            <span className="text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
              ZelaSP
            </span>
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            {ETAPAS_NAV.map((item, idx) => {
              const ativa = etapaAtiva === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => irParaEtapa(idx)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    ativa
                      ? idx === ETAPAS_NAV.length - 1
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-blue-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleConcluir}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white hover:text-slate-900"
          >
            <span>Pular</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </nav>
      </header>

      {/* Conteúdo real da Home (~480vh) sincronizado com os 5 waypoints da câmera 3D */}
      <main className="zelasp-home-main mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* ESTADO 1 (0% - 20%): Hero + Fio Elétrico Partido */}
        <section
          ref={(el) => {
            secaoRefs.current[0] = el;
          }}
          className="zelasp-home-section flex min-h-[95vh] flex-col justify-between pt-20 pb-12 sm:pt-24"
          aria-labelledby="titulo-home-zelasp"
        >
          <div className="zelasp-glass zs-surgir max-w-md rounded-2xl border border-slate-200/80 p-5 shadow-md sm:p-6">
            <div className="flex items-center gap-3">
              <img
                src="/zelasp-logo.jpg"
                alt=""
                className="h-11 w-11 rounded-xl border border-slate-200 object-cover shadow-sm"
              />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                  Zeladoria Cidadã Inteligente · SP
                </p>
                <h1
                  id="titulo-home-zelasp"
                  className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  ZelaSP
                </h1>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Fio caído, bueiro aberto, entulho na calçada ou carro abandonado: a vizinhança
              avisa, a prefeitura resolve e todo mundo acompanha.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleConcluir}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
              >
                <span>Começar</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => irParaEtapa(1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white/85 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-white"
              >
                <span>Explorar os 4 cenários</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <article className="zelasp-glass mt-10 max-w-md rounded-2xl border border-slate-200/80 p-4 shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${CENAS[0].destaque}`}
              >
                <Zap className={`h-3.5 w-3.5 ${CENAS[0].iconeCor}`} />
                {CENAS[0].rotulo}
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-500">01 / 05</span>
            </div>
            <p className="mt-2.5 text-sm font-bold text-slate-900">{CENAS[0].detalhe}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{CENAS[0].subtitulo}</p>
          </article>
        </section>

        {/* ESTADO 2 (20% - 40%): Bueiro Aberto */}
        <section
          ref={(el) => {
            secaoRefs.current[1] = el;
          }}
          className="zelasp-home-section flex min-h-[95vh] items-center justify-end py-20"
          aria-label={CENAS[1].rotulo}
        >
          <article className="zelasp-glass max-w-sm rounded-2xl border border-slate-200/80 p-5 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${CENAS[1].destaque}`}
              >
                <AlertTriangle className={`h-3.5 w-3.5 ${CENAS[1].iconeCor}`} />
                {CENAS[1].rotulo}
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-500">02 / 05</span>
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">{CENAS[1].detalhe}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {CENAS[1].subtitulo}
            </p>
          </article>
        </section>

        {/* ESTADO 3 (40% - 60%): Entulho na Calçada */}
        <section
          ref={(el) => {
            secaoRefs.current[2] = el;
          }}
          className="zelasp-home-section flex min-h-[95vh] items-end justify-start pb-20 pt-24"
          aria-label={CENAS[2].rotulo}
        >
          <article className="zelasp-glass max-w-sm rounded-2xl border border-slate-200/80 p-5 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${CENAS[2].destaque}`}
              >
                <Construction className={`h-3.5 w-3.5 ${CENAS[2].iconeCor}`} />
                {CENAS[2].rotulo}
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-500">03 / 05</span>
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">{CENAS[2].detalhe}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {CENAS[2].subtitulo}
            </p>
          </article>
        </section>

        {/* ESTADO 4 (60% - 80%): Carro Abandonado */}
        <section
          ref={(el) => {
            secaoRefs.current[3] = el;
          }}
          className="zelasp-home-section flex min-h-[95vh] items-center justify-start py-20"
          aria-label={CENAS[3].rotulo}
        >
          <article className="zelasp-glass max-w-sm rounded-2xl border border-slate-200/80 p-5 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${CENAS[3].destaque}`}
              >
                <Car className={`h-3.5 w-3.5 ${CENAS[3].iconeCor}`} />
                {CENAS[3].rotulo}
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-500">04 / 05</span>
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">{CENAS[3].detalhe}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {CENAS[3].subtitulo}
            </p>
          </article>
        </section>

        {/* ESTADO 5 (80% - 100%): Rua de SP Revitalizada + 3 Passos + Começar */}
        <section
          ref={(el) => {
            secaoRefs.current[4] = el;
          }}
          className="zelasp-home-section flex min-h-[100vh] flex-col justify-end pt-24 pb-8 sm:pb-10"
          aria-label="Rua de São Paulo revitalizada"
        >
          <div className="mx-auto w-full max-w-3xl text-center">
            <div className="zelasp-glass inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3.5 py-1 text-xs font-semibold text-emerald-900 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>4 ocorrências relatadas e resolvidas na vizinhança!</span>
            </div>

            <ul className="mt-3 grid gap-2.5 text-left sm:grid-cols-3">
              {PASSOS.map(({ icone: Icone, titulo, texto }) => (
                <li
                  key={titulo}
                  className="zelasp-glass rounded-xl border border-slate-200/80 p-3.5 shadow-sm"
                >
                  <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                    <Icone className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{titulo}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{texto}</p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={handleConcluir}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-900"
              >
                <span>Começar</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => irParaEtapa(0)}
                className="zelasp-glass inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Rever do início</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
