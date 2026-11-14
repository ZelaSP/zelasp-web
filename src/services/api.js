import { SEED_INCIDENTS } from '../data/seedIncidents';

const DEFAULT_MOCKAPI_URL = 'https://6af20abf42c6561ced38f16e.mockapi.io/ocorrencias';
const API_URL = import.meta.env.VITE_API_URL?.trim() || DEFAULT_MOCKAPI_URL;
const LOCAL_STORAGE_KEY = 'zelasp_ocorrencias_v1';

// Evita duplicação de seed quando o React StrictMode dispara useEffect duas vezes em dev
let seedEmAndamento = null;

/**
 * Indica se há uma URL de API externa (MockAPI) configurada.
 */
export function isRemoteApiConfigured() {
  return Boolean(API_URL);
}

function lerLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_INCIDENTS));
      return SEED_INCIDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_INCIDENTS;
  }
}

function salvarLocal(lista) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lista));
}

async function popularBaseInicial() {
  const criados = [];
  for (const item of SEED_INCIDENTS) {
    const { id, ...semId } = item;
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(semId),
    });
    if (response.ok) {
      const novo = await response.json();
      criados.push(novo);
    }
  }
  if (criados.length > 0) {
    salvarLocal(criados);
    return { dados: criados, origem: 'nuvem' };
  }
  return { dados: lerLocal(), origem: 'cache' };
}

/**
 * READ — Lista todas as ocorrências da API externa (MockAPI) ou consulta cache local em caso de falha.
 * Retorna { dados, origem } onde origem ∈ {'nuvem', 'cache', 'local'}.
 */
export async function getIncidents() {
  if (!API_URL) {
    return { dados: lerLocal(), origem: 'local' };
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ocorrências (${response.status})`);
    }
    const dados = await response.json();
    if (!Array.isArray(dados)) {
      throw new Error('Resposta inesperada da API ao listar ocorrências.');
    }

    // Caso a base do MockAPI esteja recém-criada e vazia, popula uma única vez com ocorrências de exemplo
    if (dados.length === 0) {
      if (!seedEmAndamento) {
        seedEmAndamento = popularBaseInicial().finally(() => {
          seedEmAndamento = null;
        });
      }
      return await seedEmAndamento;
    }

    salvarLocal(dados);
    return { dados, origem: 'nuvem' };
  } catch {
    return { dados: lerLocal(), origem: 'cache' };
  }
}

/**
 * CREATE — Envia um novo chamado de zeladoria para a API (requer conexão ativa).
 */
export async function createIncident(payload) {
  if (!API_URL) {
    throw new Error('API remota não configurada: a operação não foi salva.');
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Sem conexão com a internet: o relato não foi salvo.');
  }

  if (!response.ok) {
    throw new Error(`Erro ao registrar ocorrência (${response.status}): a operação não foi salva.`);
  }
  return response.json();
}

/**
 * UPDATE — Atualiza campos de uma ocorrência na API (requer conexão ativa).
 */
export async function updateIncident(id, updates) {
  if (!API_URL) {
    throw new Error('API remota não configurada: a alteração não foi salva.');
  }

  let response;
  try {
    response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch {
    throw new Error('Sem conexão com a internet: a alteração não foi salva.');
  }

  if (!response.ok) {
    throw new Error(`Erro ao atualizar ocorrência (${response.status}): a alteração não foi salva.`);
  }
  return response.json();
}

/**
 * DELETE — Remove ou cancela um registro de ocorrência na API (requer conexão ativa).
 */
export async function deleteIncident(id) {
  if (!API_URL) {
    throw new Error('API remota não configurada: a exclusão não foi realizada.');
  }

  let response;
  try {
    response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
  } catch {
    throw new Error('Sem conexão com a internet: a exclusão não foi realizada.');
  }

  if (!response.ok) {
    throw new Error(`Erro ao remover ocorrência (${response.status}): a exclusão não foi realizada.`);
  }
  return response.json();
}
