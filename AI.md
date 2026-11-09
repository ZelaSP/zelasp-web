# 🤖 Documentação Transparente do Uso de Inteligência Artificial — `AI.md`

**Disciplinas:** Front-end Design & Web Development  
**Projeto:** ZelaSP — Zeladoria Cidadã Inteligente  
**Global Solution 2026.2:** CitizenTech · FIAP  
**Integrantes:**
* Gustavo Rezende Louro — RM570708
* João Pedro Lagonegro Bosco e Silva — RM569444
* João Pedro Maschion da Cruz Sá — RM570509
* Lucas Henrique Alves da Silva — RM572216

---

## 1. Ferramentas Utilizadas

* **Google Antigravity (Claude Opus & Gemini):** Utilizada como assistente de engenharia de software para criar a animação SVG de abertura do ZelaSP, estruturar a jornada de acesso em 3 etapas (Abertura -> Login Cidadão/Prefeitura -> Painéis dedicados), organizar a separação de camadas no React (Services, Custom Hooks e Componentes), validar o consumo assíncrono de APIs REST e auxiliar na formatação e escrita dos textos.

---

## 2. Interações Realizadas (Exemplos de Prompts e Respostas)

### Interação 1 — Animação de Abertura e Jornada de Acesso (Cidadão vs. Prefeitura)
* **Prompt enviado:**  
  *"Crie uma tela de abertura animada para o ZelaSP em SVG + CSS mostrando dois postes com um fio rompido soltando faísca, um pino de localização caindo e o fio sendo religado em verde, seguido de uma breve explicação do sistema. Em seguida, leve para uma tela de login demonstrativa onde a pessoa escolhe entrar como Cidadão ou como Prefeitura, redirecionando para o painel específico de cada perfil compartilhando a mesma base de ocorrências."*
* **Resposta obtida:**  
  Foram gerados os componentes `SplashScreen.jsx` (com animações `stroke-dashoffset` em `index.css`), `LoginScreen.jsx` (com seleção de perfil Cidadão/Prefeitura) e o Custom Hook `useSessao.js` para gerenciar a transição entre abertura, login e os dois painéis conectados aos mesmos dados.

### Interação 2 — Arquitetura de Custom Hooks e Separação de Camadas
* **Prompt enviado:**  
  *"Como organizar um projeto React com Vite e Tailwind CSS separando a lógica de acesso a dados (CRUD com MockAPI e ViaCEP) em serviços e Custom Hooks reutilizáveis (`useIncidents`, `useViaCep`, `useGeolocation`, `useSessao` e `useToast`), mantendo os componentes visuais limpos?"*
* **Resposta obtida:**  
  A IA estruturou a divisão em `src/services/`, `src/hooks/`, `src/pages/` e `src/components/`, utilizando `useCallback` e `useMemo` dentro do hook `useIncidents` para filtrar ocorrências e atualizar o estado da lista após requisições `POST`, `PUT` e `DELETE`.

### Interação 3 — Integração com ViaCEP e Geolocalização
* **Prompt enviado:**  
  *"Crie um Custom Hook em React que consulte a API pública do ViaCEP ao informar 8 dígitos, valide erros de CEP inexistente e preencha automaticamente a rua e o bairro no formulário sem travar a digitação do usuário."*
* **Resposta obtida:**  
  Foi gerado o hook `useViaCep` com estados dedicados (`buscandoCep`, `erroCep`) e tratamento para CEPs inválidos (`dados.erro === true`).

### Interação 4 — Apoio na Formatação e Redação dos Textos
* **Prompt enviado:**  
  *"Ajude a revisar a escrita dos textos da interface voltada ao cidadão de São Paulo e ao operador da prefeitura, mantendo linguagem simples e direta, e ajude na formatação estrutural da documentação em Markdown (`README.md` e `AI.md`) para entrega aos professores."*
* **Resposta obtida:**  
  A ferramenta estruturou os avisos de emergência de fiação caída de forma acessível, diferenciou os textos do painel do morador e da central da prefeitura, e organizou as tabelas de requisitos em Markdown.

---

## 3. Aplicação no Projeto

* **Jornada em 3 Etapas (`src/pages/SplashScreen.jsx`, `LoginScreen.jsx` e `src/hooks/useSessao.js`):** Abertura animada explicando o propósito do ZelaSP, tela de login demonstrativa com escolha de perfil e painéis separados para Cidadão (relatar problema + apoiar chamado existente) e Prefeitura (monitorar GPCT + atualizar status/vistoria + excluir chamados inválidos).
* **Camada de Serviços (`src/services/api.js` e `viaCepService.js`):** Estruturação das funções `getIncidents`, `createIncident`, `updateIncident`, `deleteIncident` e `buscarEnderecoPorCep`.
* **Custom Hooks (`src/hooks/`):** Implementação de 5 hooks personalizados (`useIncidents`, `useViaCep`, `useGeolocation`, `useSessao`, `useToast`) que desacoplam regras de negócio e efeitos colaterais da camada visual.
* **Componentização (`src/components/` e `src/pages/`):** Desenvolvimento de 13 módulos visuais reutilizáveis com responsividade em Tailwind CSS.
* **Lógica de Risco (`src/utils/riskCalculator.js`):** Conexão com a regra de classificação de urgência (níveis 1 a 5) e avaliação territorial (GPCT) criada nas disciplinas de Python e Matemática.

---

## 4. Validação das Respostas pelo Grupo

1. **Separação Real entre Visão do Cidadão e Visão da Prefeitura:** Ao testar a primeira versão, identificamos que misturar ações do cidadão com botões administrativos da prefeitura na mesma tela causava confusão. Criamos a jornada com abertura animada, escolha de perfil no login e ações específicas por perfil, garantindo que uma ocorrência criada no modo Cidadão apareça imediatamente na fila da Prefeitura.
2. **Adaptação Território e Anti-Clichê:** O grupo rejeitou modelos visuais genéricos em tema escuro com contadores fictícios. Definimos um tema claro cívico com contraste adequado, incorporamos os bairros prioritários reais do projeto (**Jabaquara, Vila Mariana, Saúde, Bela Vista, Mooca e Vila Mascote**) e fizemos os contadores refletirem estritamente o estado dinâmico dos dados carregados.
3. **Testes Manuais de Fluxo CRUD e Build:** Testamos a criação de um chamado no perfil Cidadão preenchendo um CEP real via ViaCEP, o acionamento do botão **Apoiar** (`PUT`), a troca para o perfil Prefeitura, a atualização de status no modal de vistoria (`PUT`) e a confirmação em dois cliques no botão **Excluir** (`DELETE`), além de validar `npm run build` sem erros.

---

## 5. Análise Crítica

* **Benefícios:** O uso da IA acelerou a construção da animação SVG de abertura, o tratamento de estados assíncronos e a estilização responsiva no Tailwind CSS, permitindo que a equipe focasse na clareza da jornada entre cidadão e prefeitura.
* **Limitações e Dificuldades:** Inicialmente a interface exibia todas as funções administrativas misturadas na tela inicial. Foi necessário o direcionamento do grupo para estruturar o fluxo em três etapas (abertura, login por perfil e painéis dedicados) e garantir que a experiência fizesse sentido tanto para quem relata o problema na rua quanto para quem gerencia a fila na subprefeitura.
