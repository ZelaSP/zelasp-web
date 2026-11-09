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
  return criados.length > 0 ? criados : SEED_INCIDENTS;
}

/**
 * READ — Lista todas as ocorrências da API externa (MockAPI) ou armazenamento local.
 */
export async function getIncidents() {
  if (!API_URL) {
    return lerLocal();
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ocorrências (${response.status})`);
    }
    const dados = await response.json();

    // Caso a base do MockAPI esteja recém-criada e vazia, popula uma única vez com ocorrências reais de SP
    if (Array.isArray(dados) && dados.length === 0) {
      if (!seedEmAndamento) {
        seedEmAndamento = popularBaseInicial().finally(() => {
          seedEmAndamento = null;
        });
      }
      const iniciais = await seedEmAndamento;
      salvarLocal(iniciais);
      return iniciais;
    }

    salvarLocal(dados);
    return dados;
  } catch {
    return lerLocal();
  }
}

/**
 * CREATE — Envia um novo chamado de zeladoria para a API.
 */
export async function createIncident(payload) {
  if (!API_URL) {
    const lista = lerLocal();
    const novoItem = {
      ...payload,
      id: String(Date.now()),
      criadoEm: payload.criadoEm || new Date().toISOString(),
    };
    const atualizada = [novoItem, ...lista];
    salvarLocal(atualizada);
    return novoItem;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erro ao registrar ocorrência (${response.status})`);
  }
  return response.json();
}

/**
 * UPDATE — Atualiza campos de uma ocorrência (ex: apoios comunitários, status ou nota técnica).
 */
export async function updateIncident(id, updates) {
  if (!API_URL) {
    const lista = lerLocal();
    const atualizada = lista.map((item) =>
      String(item.id) === String(id) ? { ...item, ...updates } : item
    );
    salvarLocal(atualizada);
    return atualizada.find((item) => String(item.id) === String(id));
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Erro ao atualizar ocorrência (${response.status})`);
  }
  return response.json();
}

/**
 * DELETE — Remove ou cancela um registro de ocorrência.
 */
export async function deleteIncident(id) {
  if (!API_URL) {
    const lista = lerLocal();
    const atualizada = lista.filter((item) => String(item.id) !== String(id));
    salvarLocal(atualizada);
    return { deletedId: id };
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Erro ao remover ocorrência (${response.status})`);
  }
  return response.json();
}
