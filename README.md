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
  1. **Abertura Animada Sequencial (`SplashScreen`):** Apresenta visualmente, um de cada vez, os 4 problemas urbanos do ZelaSP (fio elétrico partido, bueiro aberto, entulho na calçada e carro abandonado) sendo relatados e resolvidos, além dos 3 passos da plataforma.
  2. **Login Demonstrativo por Perfil (`LoginScreen`):** Permite escolher entrar como **Cidadão** ou como **Prefeitura**.
  3. **Painéis Conectados em Tempo Real:**
     * **Área do Cidadão:** Focada em registrar ocorrências em <15 segundos (com autopreenchimento via **ViaCEP** e **GPS**) e apoiar chamados já abertos por vizinhos (**Apoiar +1**) sem criar duplicidade.
     * **Painel da Prefeitura:** Focado na triagem operacional por gravidade e apoio comunitário, monitoramento do Gatilho Preditivo de Contingência Territorial (**GPCT**), atualização de parecer de vistoria/status (`PUT`) e exclusão de registros inválidos (`DELETE`).
* **Indicador de Impacto:** Redução do tempo médio de relato para <30 segundos e eliminação de duplicidade de demandas no mesmo raio urbano.
* **ODS Conectados:** ODS 11 (Cidades e Comunidades Sustentáveis) e ODS 9 (Indústria, Inovação e Infraestrutura).

---

## 🛠️ Arquitetura e Requisitos Atendidos (FIAP)

| Requisito Oficial | Implementação no Projeto |
| :--- | :--- |
| **React + Vite** | Configurado com Vite 5 e React 18 em JavaScript moderno (`ESM`). |
| **Tailwind CSS** | Tema claro cívico acessível (`slate-50` + `blue-800`), animações SVG customizadas e layout *mobile-first*. |
| **Componentização (Mín. 8)** | **13 módulos visuais reutilizáveis** em `src/components/` e `src/pages/` (`SplashScreen`, `LoginScreen`, `Header`, `CitizenBanner`, `DistrictOverview`, `FilterBar`, `IncidentForm`, `IncidentCard`, `IncidentModal`, `StatusBadge`, `RiskIndicator`, `ToastNotification`, `Footer`). |
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
