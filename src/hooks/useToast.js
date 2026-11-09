import { useState, useEffect, useCallback } from 'react';

/**
 * Avisos temporários de sucesso/erro exibidos após ações do usuário.
 */
export function useToast(duracao = 4000) {
  const [notificacao, setNotificacao] = useState(null);

  useEffect(() => {
    if (!notificacao) return;
    const timer = setTimeout(() => setNotificacao(null), duracao);
    return () => clearTimeout(timer);
  }, [notificacao, duracao]);

  const mostrarAviso = useCallback((mensagem, tipo = 'sucesso') => {
    setNotificacao({ mensagem, tipo, id: Date.now() });
  }, []);

  const fecharAviso = useCallback(() => setNotificacao(null), []);

  return { notificacao, mostrarAviso, fecharAviso };
}
