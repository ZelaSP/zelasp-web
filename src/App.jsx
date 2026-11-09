import { useState } from 'react';
import {
  RefreshCw,
  Inbox,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Users,
  PlusCircle,
} from 'lucide-react';
import { useIncidents } from './hooks/useIncidents';
import { useSessao } from './hooks/useSessao';
import { useToast } from './hooks/useToast';
import { SplashScreen } from './pages/SplashScreen';
import { LoginScreen } from './pages/LoginScreen';
import { Header } from './components/Header';
import { CitizenBanner } from './components/CitizenBanner';
import { DistrictOverview } from './components/DistrictOverview';
import { FilterBar } from './components/FilterBar';
import { IncidentCard } from './components/IncidentCard';
import { IncidentForm } from './components/IncidentForm';
import { IncidentModal } from './components/IncidentModal';
import { ToastNotification } from './components/ToastNotification';
import { Footer } from './components/Footer';

export function App() {
  const { etapa, perfil, concluirAbertura, entrar, sair, reverAbertura } = useSessao();
  const { notificacao, mostrarAviso, fecharAviso } = useToast();

  const {
    ocorrencias,
    ocorrenciasFiltradas,
    resumoTerritorial,
    carregando,
    erro,
    apiRemotaAtiva,
    filtroBairro,
    setFiltroBairro,
    filtroStatus,
    setFiltroStatus,
    termoBusca,
    setTermoBusca,
    recarregar,
    adicionarOcorrencia,
    apoiarOcorrencia,
    atualizarStatusOcorrencia,
    removerOcorrencia,
  } = useIncidents();

  const [formAberto, setFormAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);

  if (etapa === 'abertura') {
    return <SplashScreen onConcluir={concluirAbertura} />;
  }

  if (etapa === 'login') {
    return <LoginScreen onEntrar={entrar} onReverAbertura={reverAbertura} />;
  }

  const ehPrefeitura = perfil === 'prefeitura';

  const handleCriar = async (dados) => {
    const salvo = await adicionarOcorrencia(dados);
    mostrarAviso(
      `Ocorrência ${salvo.protocolo} registrada! Já disponível no Painel da Prefeitura.`
    );
  };

  const handleApoiar = async (item) => {
    try {
      await apoiarOcorrencia(item);
      mostrarAviso(`Apoio somado ao protocolo ${item.protocolo}.`);
    } catch {
      mostrarAviso('Não foi possível registrar o apoio.', 'erro');
    }
  };

  const handleAtualizarStatus = async (item, novoStatus, notaTecnica) => {
    try {
      await atualizarStatusOcorrencia(item, novoStatus, notaTecnica);
      mostrarAviso(`Protocolo ${item.protocolo} atualizado pela equipe.`);
    } catch {
      mostrarAviso('Erro ao atualizar o chamado.', 'erro');
    }
  };

  const handleExcluir = async (id) => {
    try {
      await removerOcorrencia(id);
      mostrarAviso('Chamado removido da fila operacional.');
    } catch {
      mostrarAviso('Erro ao remover o chamado.', 'erro');
    }
  };

  const handleAlternarPerfil = () => {
    const proximo = ehPrefeitura ? 'cidadao' : 'prefeitura';
    entrar(proximo);
    mostrarAviso(
      proximo === 'prefeitura'
        ? 'Você entrou no Painel Operacional da Prefeitura.'
        : 'Você entrou na Área do Cidadão.'
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header
        perfil={perfil}
        onAbrirFormulario={() => setFormAberto(true)}
        onAlternarPerfil={handleAlternarPerfil}
        onSair={sair}
        apiRemotaAtiva={apiRemotaAtiva}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        {!ehPrefeitura ? (
          /* VISÃO DO CIDADÃO */
          <CitizenBanner
            resumo={resumoTerritorial}
            onAbrirFormulario={() => setFormAberto(true)}
          />
        ) : (
          /* VISÃO OPERACIONAL DA PREFEITURA */
          <>
            <section className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-900">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Central de Triagem e Despacho · Subprefeituras & Defesa Civil</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                    Fila única ordenada por gravidade e apoio comunitário
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Os relatos enviados pelos moradores no modo Cidadão chegam aqui em tempo real.
                    Priorize riscos elétricos e chamados com mais confirmações de vizinhos, atualize
                    o parecer de vistoria ou descarte registros inválidos.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setFormAberto(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <PlusCircle className="h-4 w-4 text-blue-800" />
                      Registrar Vistoria Manual (193 / 199)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:w-96 shrink-0">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
                    <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {resumoTerritorial.totalAbertas}
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 leading-tight mt-0.5">
                      Pendentes na fila
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-center">
                    <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold text-amber-900">
                      {resumoTerritorial.totalCriticas}
                    </p>
                    <p className="text-[11px] font-medium text-amber-800 leading-tight mt-0.5">
                      Prioridade máxima
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-center">
                    <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                      <Users className="h-4 w-4" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">
                      {resumoTerritorial.totalApoios}
                    </p>
                    <p className="text-[11px] font-medium text-emerald-800 leading-tight mt-0.5">
                      Confirmações de rua
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <DistrictOverview
              ocorrencias={ocorrencias}
              filtroBairro={filtroBairro}
              onSelecionarBairro={setFiltroBairro}
              statusContingencia={resumoTerritorial.statusContingencia}
            />
          </>
        )}

        {/* Cabeçalho contextual da lista de ocorrências */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {ehPrefeitura
                ? 'Chamados Recebidos para Triagem e Despacho'
                : 'Ocorrências Abertas na Sua Vizinhança'}
            </h3>
            <p className="text-xs text-slate-500">
              {ehPrefeitura
                ? 'Use "Despachar / Status" para atualizar o andamento ou o ícone de lixeira para excluir.'
                : 'Já viu algum destes problemas na sua rua? Clique em "Apoiar" para reforçar a urgência sem duplicar.'}
            </p>
          </div>

          <FilterBar
            termoBusca={termoBusca}
            onMudarBusca={setTermoBusca}
            filtroBairro={filtroBairro}
            onMudarBairro={setFiltroBairro}
            filtroStatus={filtroStatus}
            onMudarStatus={setFiltroStatus}
            totalExibidos={ocorrenciasFiltradas.length}
          />
        </div>

        {/* Tratamento de carregamento e erros */}
        {erro && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <span>{erro}</span>
            <button
              type="button"
              onClick={recarregar}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Tentar novamente
            </button>
          </div>
        )}

        {carregando ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((skeleton) => (
              <div
                key={skeleton}
                className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="h-4 w-24 rounded bg-slate-200 mb-3" />
                <div className="h-5 w-3/4 rounded bg-slate-200 mb-2" />
                <div className="h-3 w-1/2 rounded bg-slate-200 mb-4" />
                <div className="h-12 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : ocorrenciasFiltradas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
            <Inbox className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">
              Nenhuma ocorrência encontrada para este filtro
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Tente limpar os filtros ou registrar um novo problema urbano no botão acima.
            </p>
          </div>
        ) : (
          <section
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            aria-label="Lista de ocorrências"
          >
            {ocorrenciasFiltradas.map((item) => (
              <IncidentCard
                key={item.id}
                item={item}
                perfil={perfil}
                onApoiar={handleApoiar}
                onAbrirModal={(oc) => setItemEditando(oc)}
                onExcluir={handleExcluir}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />

      <IncidentForm
        aberto={formAberto}
        onFechar={() => setFormAberto(false)}
        onSalvar={handleCriar}
      />

      <IncidentModal
        item={itemEditando}
        onFechar={() => setItemEditando(null)}
        onSalvarEdicao={handleAtualizarStatus}
      />

      <ToastNotification
        notificacao={notificacao}
        onFechar={fecharAviso}
      />
    </div>
  );
}

export default App;
