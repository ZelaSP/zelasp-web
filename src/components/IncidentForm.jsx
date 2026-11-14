import { useState } from 'react';
import { X, MapPin, Search, Camera, Zap, Loader2 } from 'lucide-react';
import { BAIRROS_FOCO, CATEGORIAS_ZELA } from '../data/seedIncidents';
import { useViaCep } from '../hooks/useViaCep';
import { useGeolocation } from '../hooks/useGeolocation';

export function IncidentForm({ aberto, onFechar, onSalvar }) {
  const [categoria, setCategoria] = useState(CATEGORIAS_ZELA[0]);
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('Jabaquara');
  const [endereco, setEndereco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [riscoChoque, setRiscoChoque] = useState(false);
  const [fotoNome, setFotoNome] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const { buscandoCep, erroCep, consultarCep, limparErroCep } = useViaCep();
  const { coordenadas, localizando, erroGps, obterLocalizacaoAtual, limparLocalizacao } =
    useGeolocation();

  if (!aberto) return null;

  const handleBuscarCep = async () => {
    limparErroCep();
    const dados = await consultarCep(cep);
    if (dados) {
      if (dados.logradouro) setEndereco(dados.logradouro);
      if (dados.bairro) {
        // Verifica se o bairro está na lista ou adiciona dinamicamente se for outro de SP
        setBairro(dados.bairro);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroForm('');

    if (!endereco.trim()) {
      setErroForm('Informe a rua e o número aproximado do problema.');
      return;
    }
    if (!descricao.trim() || descricao.trim().length < 8) {
      setErroForm('Descreva brevemente o que aconteceu (mínimo 8 caracteres).');
      return;
    }

    setEnviando(true);
    try {
      await onSalvar({
        categoria,
        cep,
        bairro,
        endereco: endereco.trim(),
        descricao: descricao.trim(),
        riscoChoque,
        fotoNome: fotoNome || '',
        coordenadas,
      });
      // Limpa formulário após sucesso
      setCep('');
      setEndereco('');
      setDescricao('');
      setRiscoChoque(false);
      setFotoNome('');
      limparLocalizacao();
      onFechar();
    } catch (err) {
      setErroForm(err.message || 'Erro ao enviar relato.');
    } finally {
      setEnviando(false);
    }
  };

  const listaBairrosOpcoes = BAIRROS_FOCO.includes(bairro)
    ? BAIRROS_FOCO
    : [bairro, ...BAIRROS_FOCO];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-form-zelasp"
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="titulo-form-zelasp" className="text-lg font-bold text-slate-900">
              Novo Relato Urbano
            </h2>
            <p className="text-xs text-slate-500">
              Registro rápido para a zeladoria municipal e concessionárias
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar formulário"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {erroForm && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800">
              {erroForm}
            </div>
          )}

          {/* Categoria */}
          <div>
            <label htmlFor="categoria-select" className="block text-xs font-semibold text-slate-700 mb-1">
              O que está acontecendo? *
            </label>
            <select
              id="categoria-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            >
              {CATEGORIAS_ZELA.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Alerta Elétrico */}
          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3">
            <input
              type="checkbox"
              checked={riscoChoque}
              onChange={(e) => setRiscoChoque(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-amber-400 text-amber-700 focus:ring-amber-600"
            />
            <span className="text-xs text-amber-950">
              <strong className="inline-flex items-center gap-1 font-bold">
                <Zap className="h-3.5 w-3.5 text-amber-700" /> Há risco imediato de choque ou faíscas?
              </strong>
              <span className="block text-[11px] text-amber-800 mt-0.5">
                Eleva qualquer categoria para Urgência Máxima (Nível 5).
              </span>
            </span>
          </label>

          {/* Consulta Real ViaCEP */}
          <div>
            <label htmlFor="cep-input" className="block text-xs font-semibold text-slate-700 mb-1">
              CEP (Preenchimento automático via ViaCEP)
            </label>
            <div className="flex gap-2">
              <input
                id="cep-input"
                type="text"
                maxLength={9}
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Ex: 04309-011"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleBuscarCep}
                disabled={buscandoCep}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200 disabled:opacity-50"
              >
                {buscandoCep ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
                Buscar CEP
              </button>
            </div>
            {erroCep && <p className="mt-1 text-xs text-red-600">{erroCep}</p>}
          </div>

          {/* Bairro e Endereço */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="bairro-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Bairro *
              </label>
              <select
                id="bairro-select"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                {listaBairrosOpcoes.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="endereco-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Rua e número aproximado *
              </label>
              <input
                id="endereco-input"
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Rua Domingos de Morais, 2100"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Captura de GPS */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-xs text-slate-700">
              {coordenadas ? (
                <span className="font-medium text-emerald-700">
                  📍 Coordenadas capturadas: {coordenadas.lat}, {coordenadas.lng}
                </span>
              ) : (
                <span>Deseja capturar a posição opcional pelo GPS do navegador?</span>
              )}
              {erroGps && <p className="text-[11px] text-slate-500">{erroGps}</p>}
            </div>

            <button
              type="button"
              onClick={() => obterLocalizacaoAtual(bairro)}
              disabled={localizando}
              className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100"
            >
              <MapPin className="h-3.5 w-3.5" />
              {localizando ? 'Localizando...' : 'Usar meu GPS'}
            </button>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição breve *
            </label>
            <textarea
              id="descricao-input"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Fiação solta encostando no ponto de ônibus em frente à padaria..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Seleção demonstrativa de foto */}
          <div>
            <label htmlFor="foto-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Foto do local — demonstração
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                <Camera className="h-4 w-4" />
                <span>{fotoNome ? 'Alterar arquivo' : 'Selecionar arquivo'}</span>
                <input
                  id="foto-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFotoNome(file.name);
                  }}
                />
              </label>
              {fotoNome && (
                <span className="text-xs text-slate-600 truncate max-w-[260px]">
                  Arquivo selecionado para demonstração: {fotoNome}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              O envio da imagem e a localização pela foto estão previstos para uma próxima versão.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 disabled:opacity-60"
            >
              {enviando && <Loader2 className="h-4 w-4 animate-spin" />}
              {enviando ? 'Enviando...' : 'Publicar Relato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
