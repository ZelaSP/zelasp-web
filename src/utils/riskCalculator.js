/**
 * Lógica de negócio unificada com os módulos de Python e DPS (Matemática):
 * Calcula severidade de risco (1 a 5), gera protocolos e avalia
 * saturação territorial (Gatilho Preditivo de Contingência - GPCT).
 */

export function calcularPrioridade(categoria, riscoChoque, apoios = 1) {
  let score = 2;

  switch (categoria) {
    case 'Fios e Cabos Rompidos/Soltos':
    case 'Poda de Árvore com Risco Elétrico':
      score = riscoChoque ? 5 : 3;
      break;
    case 'Tampa de Bueiro Furtada/Quebrada':
      score = 5;
      break;
    case 'Buraco em Via ou Calçada':
      score = 4;
      break;
    case 'Descarte Irregular de Entulho':
      score = 2;
      break;
    case 'Carro Abandonado':
      score = 1;
      break;
    default:
      score = 2;
  }

  // Escalonamento por impacto comunitário (sem duplicar chamado)
  if (apoios >= 10 && score < 5) {
    score += 1;
  }

  return Math.min(5, Math.max(1, score));
}

export function gerarProtocolo(ocorrencias = []) {
  const numeros = ocorrencias
    .map((item) => {
      const partes = String(item.protocolo || '').split('-');
      return parseInt(partes[2], 10);
    })
    .filter((n) => !Number.isNaN(n));

  const proximo = numeros.length > 0 ? Math.max(...numeros) + 1 : 101;
  return `SP-2026-${proximo}`;
}

/**
 * Gera data/hora ISO no fuso horário de São Paulo/Brasília (America/Sao_Paulo, UTC-3)
 * em vez de UTC (Z), para que o JSON no MockAPI mostre o horário local real.
 */
export function gerarDataHoraSp(data = new Date()) {
  const opcoes = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', opcoes)
      .formatToParts(data)
      .map(({ type, value }) => [type, value])
  );
  return `${partes.year}-${partes.month}-${partes.day}T${partes.hour}:${partes.minute}:${partes.second}-03:00`;
}

export function formatarDataBr(isoDate) {
  if (!isoDate) return 'Recente';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export function avaliarRiscoTerritorial(ocorrencias = []) {
  const abertas = ocorrencias.filter((o) => o.status !== 'RESOLVIDO');
  const criticas = abertas.filter((o) => Number(o.nivelPrioridade) >= 4);
  const totalApoios = ocorrencias.reduce((acc, o) => acc + (Number(o.apoios) || 0), 0);

  let statusContingencia = 'ESTÁVEL';
  if (criticas.length >= 4) {
    statusContingencia = 'CONTINGÊNCIA ATIVADA';
  } else if (criticas.length >= 2) {
    statusContingencia = 'ATENÇÃO OPERACIONAL';
  }

  return {
    totalAbertas: abertas.length,
    totalCriticas: criticas.length,
    totalApoios,
    statusContingencia,
  };
}
