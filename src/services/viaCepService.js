/**
 * Serviço de integração com a API pública ViaCEP para autopreenchimento
 * de endereços e validação de bairros de São Paulo.
 */
export async function buscarEnderecoPorCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('O CEP deve conter 8 dígitos numéricos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

  if (!response.ok) {
    throw new Error('Não foi possível consultar o serviço de CEP no momento.');
  }

  const dados = await response.json();

  if (dados.erro) {
    throw new Error('CEP não encontrado na base nacional.');
  }

  return {
    logradouro: dados.logradouro || '',
    bairro: dados.bairro || '',
    cidade: dados.localidade || 'São Paulo',
    uf: dados.uf || 'SP',
  };
}
