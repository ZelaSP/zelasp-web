# 🏙️ ZelaSP — Aplicação Web (Front-end Design & Web Development)

> **Global Solution 2026.2 · FIAP**  
> **Disciplinas:** Front-end Design e Web Development  
> **Tema:** CitizenTech  
> **Curso:** Engenharia de Software (1º Ano · Campus Paulista/Lins)  
> **Link do Deploy (Vercel):** [https://zelasp-web.vercel.app/](https://zelasp-web.vercel.app/)  
> **Repositório GitHub:** [https://github.com/ZelaSP/zelasp-web](https://github.com/ZelaSP/zelasp-web)  
> **Integrantes:**
> * Gustavo Rezende Louro — RM570708
> * João Pedro Lagonegro Bosco e Silva — RM569444
> * João Pedro Maschion da Cruz Sá — RM570509
> * Lucas Henrique Alves da Silva — RM572216

---

## 📋 A Ficha da CitizenTech

* **Nome da CitizenTech:** ZelaSP
* **Cidade e Bairros de Atuação:** São Paulo — SP (foco prioritário em **Jabaquara, Vila Mariana, Saúde, Bela Vista, Mooca e Vila Mascote**).
* **Cidadão Beneficiado:** Moradores, pedestres, comerciantes e pessoas com mobilidade reduzida que enfrentam riscos diários com fiação aérea rompida, bueiros abertos, buracos e entulho nas vias.
* **Problema em uma Frase:** O canal oficial atual (SP 156) é burocrático e opaco, desestimulando relatos rápidos e gerando centenas de chamados duplicados no mesmo quarteirão durante temporais.
* **Como Funciona (Jornada em 3 Etapas):**
  1. **Abertura Interativa 3D (`SplashScreen` + `ZelaspBackground3D`):** Cenário WebGL *cartoon/toon* em Three.js controlado pela rolagem da página (`GSAP ScrollTrigger` em ~`480vh`), percorrendo os 4 problemas urbanos do ZelaSP (fio elétrico partido, bueiro aberto, entulho na calçada e carro abandonado) até a rua revitalizada e os 3 passos da plataforma.
  2. **Login Demonstrativo por Perfil (`LoginScreen`):** Permite escolher entrar como **Cidadão** ou como **Prefeitura** (protótipo acadêmico; sem validação de senha ou autenticação real de servidor).
  3. **Painéis com Dados Compartilhados pela API:**
     * **Área do Cidadão:** Focada na meta de registro em até 15 segundos (a validar com testes de usabilidade), com autopreenchimento opcional via **ViaCEP**, captura opcional de **GPS** do navegador, **seleção demonstrativa de foto** (sem envio, armazenamento ou análise automática nesta versão) e apoio manual a ocorrências existentes para incentivar a redução de relatos repetidos.
     * **Painel da Prefeitura:** Utiliza dados compartilhados pela API e atualizados no carregamento (a troca de perfil na mesma aba reaproveita o estado atual), ordenado por prioridade decrescente e, no empate, quantidade de apoios decrescente (com resolvidos ao final), exibindo o **GPCT operacional do painel** (baseado no total de chamados não resolvidos de nível ≥4: `< 2` estável, `2–3` atenção, `≥ 4` contingência), parecer de vistoria/status (`PUT`) e exclusão (`DELETE`).
* **Metas e Resultados Acadêmicos Alinhados:**
  * **Tempo de relato:** Meta de registro em até 15 segundos, a validar com testes de usabilidade.
  * **Duplicidade atual e meta:** Apoio manual a ocorrências existentes para incentivar a redução de relatos repetidos; meta futura de reduzir em 45% a parcela de chamados duplicados.
  * **Resultado matemático (estudo paralelo):** Redução simulada de 38,5% do excedente sobre a base já deduplicada, após reforço de capacidade, nas hipóteses do exercício.
  * **Foto e localização:** Funcionalidade futura: foto como evidência e apoio à localização da ocorrência; seleção demonstrativa na versão atual.
  * **Arquitetura:** Web com MockAPI e ViaCEP; CLI Python com JSON; estudo matemático independente; integração entre módulos e IoT prevista na evolução.
* **ODS Conectados:** ODS 11 (Cidades e Comunidades Sustentáveis) e ODS 9 (Indústria, Inovação e Infraestrutura).

---

## ⚖️ Regra Única de Prioridade e Escopo do Protótipo

1. **Risco elétrico marcado:** resulta em **nível 5** em todas as categorias.
2. **Sem risco elétrico marcado (prioridade-base):** Tampa de Bueiro (`5`), Buraco (`4`), Fios (`3`), Poda (`3`), Entulho (`2`), Carro Abandonado (`1`).
3. **Escalonamento comunitário:** a partir de **10 apoios**, acrescenta-se **um único nível** à prioridade-base (teto `5`), recalculado sempre a partir da base. Ocorrências `RESOLVIDO` não recebem novos apoios. Os níveis representam política interna de triagem acadêmica, não classificação oficial da Prefeitura ou concessionária.

> A proposta de evolução do ZelaSP inclui o uso de fotografias como evidência e apoio à localização da ocorrência, aproveitando metadados GPS disponíveis no arquivo e a confirmação do cidadão — considerando inclusive que fotos podem não conter coordenadas válidas, como registra a documentação técnica de referência [ExifInterface — getLatLong](https://developer.android.com/reference/androidx/exifinterface/media/ExifInterface#getLatLong()). No protótipo acadêmico atual, a seleção de foto é demonstrativa: o conteúdo da imagem não é enviado, armazenado ou analisado. O endereço é informado por CEP ou digitação, com captura opcional de GPS do navegador. O protótipo mantém ainda **cache local apenas para consulta** (`Dados locais` ou `Sem conexão — consulta em cache`), exigindo conexão para criação, apoio e edição; upload real de imagens, fila offline de sincronização, deduplicação geográfica automática e autenticação real compõem o roadmap futuro.

---

## 🛠️ Arquitetura e Requisitos Atendidos (FIAP)

| Requisito Oficial | Implementação no Projeto |
| :--- | :--- |
| **React + Vite** | Configurado com Vite 5 e React 18 em JavaScript moderno (`ESM`). |
| **Tailwind CSS** | Tema claro cívico acessível (`slate-50` + `blue-800`), cards translúcidos (`backdrop-filter: blur(10px)`) sobre cena 3D em Three.js + GSAP ScrollTrigger e layout *mobile-first*. |
| **Componentização (Mín. 8)** | **14 módulos visuais reutilizáveis** em `src/components/` e `src/pages/` (`ZelaspBackground3D`, `SplashScreen`, `LoginScreen`, `Header`, `CitizenBanner`, `DistrictOverview`, `FilterBar`, `IncidentForm`, `IncidentCard`, `IncidentModal`, `StatusBadge`, `RiskIndicator`, `ToastNotification`, `Footer`). |
| **React Hooks Nativos** | Uso direto de `useState`, `useEffect`, `useCallback` e `useMemo`. |
| **Custom Hooks (Mín. 2)** | **5 Custom Hooks** em `src/hooks/`: `useIncidents`, `useViaCep`, `useGeolocation`, `useSessao` e `useToast`. |
| **Separação de Camadas** | Acesso a APIs isolado em `src/services/api.js` e `src/services/viaCepService.js`; regras de risco em `src/utils/riskCalculator.js`. |
| **API Externa + CRUD Completo** | Integração dupla com **MockAPI** (`GET`, `POST`, `PUT`, `DELETE`) e **ViaCEP** (`GET` real ao digitar o CEP). |
| **Documentação Ética de IA** | Arquivo `AI.md` completo na raiz do projeto. |
| **Versionamento Git** | Histórico limpo com **20+ commits significativos**. |

---

## 🚀 Pré-requisitos e Execução Local

### Pré-requisitos
* **Node.js** versão 18 ou superior (testado no Node v24).
* **npm** (instalado junto com o Node).

### Passo a passo para rodar na sua máquina:
1. Clone o repositório (ou extraia o ZIP):
   ```bash
   git clone https://github.com/ZelaSP/zelasp-web.git
   cd zelasp-web
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse no navegador o endereço exibido no terminal (geralmente `http://localhost:5173`).

---

## 🌐 APIs Externas Integradas (Prontas para Uso)

O projeto **já vem pré-configurado** com a chave da equipe, não sendo necessário criar conta nem configurar variáveis de ambiente para testar:

1. **MockAPI REST (`https://6af20abf42c6561ced38f16e.mockapi.io/ocorrencias`):**
   * Configurada diretamente em `src/services/api.js` para executar o **CRUD completo** em nuvem:
     * **`GET /ocorrencias`** — Lista os chamados registrados em São Paulo.
     * **`POST /ocorrencias`** — Cria um novo relato aberto pelo Cidadão.
     * **`PUT /ocorrencias/:id`** — Soma apoio comunitário (**Apoiar +1**) ou registra o despacho/mudança de status da Prefeitura.
     * **`DELETE /ocorrencias/:id`** — Remove chamados descartados pela Prefeitura.
2. **ViaCEP (`https://viacep.com.br/ws/{cep}/json/`):**
   * Configurada em `src/services/viaCepService.js` e consumida pelo hook `useViaCep` para preencher automaticamente logradouro e bairro ao digitar os 8 dígitos do CEP.
