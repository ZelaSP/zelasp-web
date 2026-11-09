import { useState, useCallback } from 'react';

const COORDENADAS_BAIRROS_SP = {
  Jabaquara: { lat: -23.6461, lng: -46.6413 },
  'Vila Mariana': { lat: -23.5952, lng: -46.6368 },
  Saúde: { lat: -23.6164, lng: -46.6277 },
  'Bela Vista': { lat: -23.5594, lng: -46.6476 },
  Mooca: { lat: -23.5562, lng: -46.6025 },
  'Vila Mascote': { lat: -23.6468, lng: -46.6631 },
};

/**
 * Custom Hook para captura de geolocalização GPS do dispositivo ou referência
 * automática por bairro de São Paulo.
 */
export function useGeolocation() {
  const [coordenadas, setCoordenadas] = useState(null);
  const [localizando, setLocalizando] = useState(false);
  const [erroGps, setErroGps] = useState(null);

  const obterLocalizacaoAtual = useCallback((bairroFallback = 'Jabaquara') => {
    setLocalizando(true);
    setErroGps(null);

    if (!('geolocation' in navigator)) {
      const ref = COORDENADAS_BAIRROS_SP[bairroFallback] || { lat: -23.5505, lng: -46.6333 };
      setCoordenadas(ref);
      setLocalizando(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordenadas({
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
        });
        setLocalizando(false);
      },
      () => {
        // Fallback gentil com coordenadas reais do bairro em SP caso o GPS seja bloqueado
        const ref = COORDENADAS_BAIRROS_SP[bairroFallback] || { lat: -23.5952, lng: -46.6368 };
        setCoordenadas(ref);
        setErroGps('GPS indisponível no navegador; usando coordenadas aproximadas do bairro.');
        setLocalizando(false);
      },
      { timeout: 5000 }
    );
  }, []);

  const limparLocalizacao = useCallback(() => {
    setCoordenadas(null);
    setErroGps(null);
  }, []);

  return {
    coordenadas,
    localizando,
    erroGps,
    obterLocalizacaoAtual,
    limparLocalizacao,
  };
}
