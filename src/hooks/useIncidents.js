import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
  isRemoteApiConfigured,
} from '../services/api';
import {
  calcularPrioridade,
  gerarProtocolo,
  avaliarRiscoTerritorial,
} from '../utils/riskCalculator';

/**
 * Custom Hook principal da aplicação ZelaSP:
 * Orquestra o ciclo completo de CRUD com a API, filtros dinâmicos,
 * regras de apoio comunitário (sem duplicidade) e métricas territoriais.
 */
export function useIncidents() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Estados de filtragem e busca
  const [filtroBairro, setFiltroBairro] = useState('TODOS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [termoBusca, setTermoBusca] = useState('');

  const apiRemotaAtiva = isRemoteApiConfigured();

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const lista = await getIncidents();
      setOcorrencias(Array.isArray(lista) ? lista : []);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar ocorrências.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // CREATE
  const adicionarOcorrencia = useCallback(
    async (dadosFormulario) => {
      const protocolo = gerarProtocolo(ocorrencias);
      const nivelPrioridade = calcularPrioridade(
        dadosFormulario.categoria,
        dadosFormulario.riscoChoque,
        1
      );

      const novoRegistro = {
        protocolo,
        categoria: dadosFormulario.categoria,
        bairro: dadosFormulario.bairro,
        cep: dadosFormulario.cep || '',
        endereco: dadosFormulario.endereco,
        descricao: dadosFormulario.descricao,
        riscoChoque: Boolean(dadosFormulario.riscoChoque),
        nivelPrioridade,
        status: 'ABERTO',
        apoios: 1,
        criadoEm: new Date().toISOString(),
        notaTecnica: dadosFormulario.fotoNome
          ? `Evidência anexada: ${dadosFormulario.fotoNome}`
          : 'Relato enviado pelo cidadão via ZelaSP Web.',
        coordenadas: dadosFormulario.coordenadas || null,
      };

      const salvo = await createIncident(novoRegistro);
      setOcorrencias((prev) => [salvo, ...prev]);
      return salvo;
    },
    [ocorrencias]
  );

  // UPDATE — Apoio Comunitário (+1 sem criar chamado duplicado)
  const apoiarOcorrencia = useCallback(async (item) => {
    const novosApoios = (Number(item.apoios) || 1) + 1;
    const novaPrioridade = calcularPrioridade(
      item.categoria,
      item.riscoChoque,
      novosApoios
    );

    const atualizado = await updateIncident(item.id, {
      ...item,
      apoios: novosApoios,
      nivelPrioridade: novaPrioridade,
    });

    setOcorrencias((prev) =>
      prev.map((o) => (String(o.id) === String(item.id) ? atualizado : o))
    );
    return atualizado;
  }, []);

  // UPDATE — Atualização de Status e Nota Técnica
  const atualizarStatusOcorrencia = useCallback(async (item, novoStatus, notaTecnica) => {
    const atualizado = await updateIncident(item.id, {
      ...item,
      status: novoStatus,
      notaTecnica: notaTecnica ?? item.notaTecnica,
    });

    setOcorrencias((prev) =>
      prev.map((o) => (String(o.id) === String(item.id) ? atualizado : o))
    );
    return atualizado;
  }, []);

  // DELETE
  const removerOcorrencia = useCallback(async (id) => {
    await deleteIncident(id);
    setOcorrencias((prev) => prev.filter((o) => String(o.id) !== String(id)));
  }, []);

  // READ filtrado e ordenado por severidade
  const ocorrenciasFiltradas = useMemo(() => {
    const busca = termoBusca.trim().toLowerCase();

    return ocorrencias
      .filter((item) => {
        if (filtroBairro !== 'TODOS' && item.bairro !== filtroBairro) {
          return false;
        }
        if (filtroStatus !== 'TODOS' && item.status !== filtroStatus) {
          return false;
        }
        if (busca) {
          const textoAlvo = `${item.protocolo} ${item.endereco} ${item.bairro} ${item.categoria} ${item.descricao}`.toLowerCase();
          return textoAlvo.includes(busca);
        }
        return true;
      })
      .sort((a, b) => {
        // Prioriza abertos com maior risco e maior apoio comunitário
        if (a.status === 'RESOLVIDO' && b.status !== 'RESOLVIDO') return 1;
        if (a.status !== 'RESOLVIDO' && b.status === 'RESOLVIDO') return -1;
        return (Number(b.nivelPrioridade) || 0) - (Number(a.nivelPrioridade) || 0);
      });
  }, [ocorrencias, filtroBairro, filtroStatus, termoBusca]);

  const resumoTerritorial = useMemo(
    () => avaliarRiscoTerritorial(ocorrencias),
    [ocorrencias]
  );

  return {
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
    recarregar: carregarDados,
    adicionarOcorrencia,
    apoiarOcorrencia,
    atualizarStatusOcorrencia,
    removerOcorrencia,
  };
}
