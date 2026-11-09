import { useState, useCallback } from 'react';
import { buscarEnderecoPorCep } from '../services/viaCepService';

/**
 * Custom Hook para consulta assíncrona de CEP na API pública ViaCEP,
 * isolando estado de carregamento, erro e preenchimento automático.
 */
export function useViaCep() {
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState(null);

  const consultarCep = useCallback(async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setErroCep('Informe um CEP válido com 8 dígitos.');
      return null;
    }

    setBuscandoCep(true);
    setErroCep(null);

    try {
      const endereco = await buscarEnderecoPorCep(cepLimpo);
      return endereco;
    } catch (err) {
      setErroCep(err.message || 'Erro ao buscar CEP.');
      return null;
    } finally {
      setBuscandoCep(false);
    }
  }, []);

  const limparErroCep = useCallback(() => setErroCep(null), []);

  return {
    buscandoCep,
    erroCep,
    consultarCep,
    limparErroCep,
  };
}
