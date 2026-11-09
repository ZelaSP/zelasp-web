import { useState, useCallback } from 'react';

const CHAVE_PERFIL = 'zelasp_perfil';
const CHAVE_ABERTURA = 'zelasp_abertura_vista';

/**
 * Controla a jornada de acesso: abertura animada -> login -> painel do perfil.
 * Usa sessionStorage para manter o perfil ao recarregar a página.
 */
export function useSessao() {
  const [perfil, setPerfil] = useState(() => sessionStorage.getItem(CHAVE_PERFIL));
  const [aberturaVista, setAberturaVista] = useState(
    () => sessionStorage.getItem(CHAVE_ABERTURA) === 'sim'
  );

  const etapa = !aberturaVista ? 'abertura' : !perfil ? 'login' : perfil;

  const concluirAbertura = useCallback(() => {
    sessionStorage.setItem(CHAVE_ABERTURA, 'sim');
    setAberturaVista(true);
  }, []);

  const entrar = useCallback((novoPerfil) => {
    sessionStorage.setItem(CHAVE_PERFIL, novoPerfil);
    setPerfil(novoPerfil);
  }, []);

  const sair = useCallback(() => {
    sessionStorage.removeItem(CHAVE_PERFIL);
    setPerfil(null);
  }, []);

  const reverAbertura = useCallback(() => {
    sessionStorage.removeItem(CHAVE_ABERTURA);
    setAberturaVista(false);
  }, []);

  return { etapa, perfil, concluirAbertura, entrar, sair, reverAbertura };
}
