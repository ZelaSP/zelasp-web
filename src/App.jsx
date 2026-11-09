import { useState, useEffect } from 'react';
import { RefreshCw, Inbox } from 'lucide-react';
import { useIncidents } from './hooks/useIncidents';
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
  const [notificacao, setNotificacao] = useState(null);

  useEffect(() => {
    if (!notificacao) return;
    const timer = setTimeout(() => setNotificacao(null), 4000);
    return () => clearTimeout(timer);
  }, [notificacao]);

  const mostrarAviso = (mensagem, tipo = 'sucesso') => {
    setNotificacao({ mensagem, tipo });
  };

  const handleCriar = async (dados) => {
    const salvo = await adicionarOcorrencia(dados);
    mostrarAviso(`Ocorrência ${salvo.protocolo} registrada com sucesso!`);
  };

  const handleApoiar = async (item) => {
    try {
      await apoiarOcorrencia(item);
      mostrarAviso(`Apoio registrado para o protocolo ${item.protocolo}.`);
    } catch {
      mostrarAviso('Não foi possível registrar o apoio.', 'erro');
    }
  };

  const handleAtualizarStatus = async (item, novoStatus, notaTecnica) => {
    try {
      await atualizarStatusOcorrencia(item, novoStatus, notaTecnica);
      mostrarAviso(`Protocolo ${item.protocolo} atualizado.`);
    } catch {
      mostrarAviso('Erro ao atualizar o chamado.', 'erro');
    }
  };

  const handleExcluir = async (id) => {
    try {
      await removerOcorrencia(id);
      mostrarAviso('Chamado removido do painel.');
    } catch {
      mostrarAviso('Erro ao remover o chamado.', 'erro');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header
        onAbrirFormulario={() => setFormAberto(true)}
        apiRemotaAtiva={apiRemotaAtiva}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        <CitizenBanner
          resumo={resumoTerritorial}
          onAbrirFormulario={() => setFormAberto(true)}
        />

        <DistrictOverview
          ocorrencias={ocorrencias}
          filtroBairro={filtroBairro}
          onSelecionarBairro={setFiltroBairro}
          statusContingencia={resumoTerritorial.statusContingencia}
        />

        <FilterBar
          termoBusca={termoBusca}
          onMudarBusca={setTermoBusca}
          filtroBairro={filtroBairro}
          onMudarBairro={setFiltroBairro}
          filtroStatus={filtroStatus}
          onMudarStatus={setFiltroStatus}
          totalExibidos={ocorrenciasFiltradas.length}
        />

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
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Lista de ocorrências">
            {ocorrenciasFiltradas.map((item) => (
              <IncidentCard
                key={item.id}
                item={item}
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
        onFechar={() => setNotificacao(null)}
      />
    </div>
  );
}

export default App;
