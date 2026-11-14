import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
} from '../services/api';
import {
  calcularPrioridade,
  gerarProtocolo,
  avaliarRiscoTerritorial,
  gerarDataHoraSp,
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
  const [origemDados, setOrigemDados] = useState('carregando');

  // Estados de filtragem e busca
  const [filtroBairro, setFiltroBairro] = useState('TODOS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [termoBusca, setTermoBusca] = useState('');

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    setOrigemDados('carregando');
    try {
      const resultado = await getIncidents();
      const lista = Array.isArray(resultado) ? resultado : resultado?.dados;
      const origem = Array.isArray(resultado) ? 'local' : resultado?.origem || 'local';
      setOcorrencias(Array.isArray(lista) ? lista : []);
      setOrigemDados(origem);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar ocorrências.');
      setOrigemDados('cache');
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
        criadoEm: gerarDataHoraSp(),
        fotoNome: dadosFormulario.fotoNome ? String(dadosFormulario.fotoNome).trim() : '',
        notaTecnica: '',
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
    if (item.status === 'RESOLVIDO') {
      throw new Error('Ocorrências resolvidas não recebem novos apoios.');
    }
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
        // Prioriza abertos com maior risco e, no empate, maior apoio comunitário
        if (a.status === 'RESOLVIDO' && b.status !== 'RESOLVIDO') return 1;
        if (a.status !== 'RESOLVIDO' && b.status === 'RESOLVIDO') return -1;
        const diffPrioridade =
          (Number(b.nivelPrioridade) || 0) - (Number(a.nivelPrioridade) || 0);
        if (diffPrioridade !== 0) return diffPrioridade;
        return (Number(b.apoios) || 0) - (Number(a.apoios) || 0);
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
    origemDados,
    apiRemotaAtiva: origemDados === 'nuvem',
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
