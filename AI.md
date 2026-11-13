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

* **Google Antigravity (Claude Opus & Gemini):** Utilizada como assistente de engenharia de software para estruturar a jornada de acesso em 3 etapas (Abertura 3D interativa -> Login Cidadão/Prefeitura -> Painéis dedicados), integrar o cenário 3D em WebGL (*Three.js* + *GSAP ScrollTrigger*) para tornar o site visualmente atrativo, organizar a separação de camadas no React (Services, Custom Hooks e Componentes), validar o consumo assíncrono de APIs REST e auxiliar na formatação e escrita dos textos.

---

## 2. Interações Realizadas (Exemplos de Prompts e Respostas)

### Interação 1 — Animação de Abertura e Jornada de Acesso (Cidadão vs. Prefeitura)
* **Prompt enviado:**  
  *"Crie uma tela de abertura animada para o ZelaSP em SVG + CSS mostrando dois postes com um fio rompido soltando faísca, um pino de localização caindo e o fio sendo religado em verde, seguido de uma breve explicação do sistema. Em seguida, leve para uma tela de login demonstrativa onde a pessoa escolhe entrar como Cidadão ou como Prefeitura, redirecionando para o painel específico de cada perfil compartilhando a mesma base de ocorrências."*
* **Resposta obtida:**  
  Foram gerados os componentes `SplashScreen.jsx` (com animações `stroke-dashoffset` em `index.css`), `LoginScreen.jsx` (com seleção de perfil Cidadão/Prefeitura) e o Custom Hook `useSessao.js` para gerenciar a transição entre abertura, login e os dois painéis conectados aos mesmos dados.

### Interação 2 — Inclusão dos 4 Problemas Urbanos, Animação Sequencial e Cena Final de Capa
* **Prompt enviado:**  
  *"Inclua na animação o bueiro aberto, entulho na calçada e carro abandonado na rua. Não faça os 4 problemas simultaneamente, deixe um de cada vez, mesmo que aumente o tempo. Quando ela finaliza, complete o próprio desenho SVG com cenário de 'Rua de SP Revitalizada' (prédios, árvores, postes acesos e selo central) para não ficar a animação final congelada."*
* **Resposta obtida:**  
  A animação em `SplashScreen.jsx` e `index.css` foi expandida com os 4 elementos em SVG (fio elétrico partido, bueiro aberto sem tampa, pilha de entulho na calçada e carcaça de carro abandonado na rua) exibidos um de cada vez em etapas de 3 segundos e, ao encerrar a 4ª etapa, faz uma transição suave para uma ilustração completa de capa com prédios de São Paulo ao fundo, árvores na calçada, postes acesos e o selo central *"Rua Revitalizada • ZelaSP"*.

### Interação 3 — Arquitetura de Custom Hooks e Separação de Camadas
* **Prompt enviado:**  
  *"Como organizar um projeto React com Vite e Tailwind CSS separando a lógica de acesso a dados (CRUD com MockAPI e ViaCEP) em serviços e Custom Hooks reutilizáveis (`useIncidents`, `useViaCep`, `useGeolocation`, `useSessao` e `useToast`), mantendo os componentes visuais limpos?"*
* **Resposta obtida:**  
  A IA estruturou a divisão em `src/services/`, `src/hooks/`, `src/pages/` e `src/components/`, utilizando `useCallback` e `useMemo` dentro do hook `useIncidents` para filtrar ocorrências e atualizar o estado da lista após requisições `POST`, `PUT` e `DELETE`.

### Interação 4 — Integração com ViaCEP e Geolocalização
* **Prompt enviado:**  
  *"Crie um Custom Hook em React que consulte a API pública do ViaCEP ao informar 8 dígitos, valide erros de CEP inexistente e preencha automaticamente a rua e o bairro no formulário sem travar a digitação do usuário."*
* **Resposta obtida:**  
  Foi gerado o hook `useViaCep` com estados dedicados (`buscandoCep`, `erroCep`) e tratamento para CEPs inválidos (`dados.erro === true`).

### Interação 5 — Apoio na Formatação e Redação dos Textos
* **Prompt enviado:**  
  *"Ajude a revisar a escrita dos textos da interface voltada ao cidadão de São Paulo e ao operador da prefeitura, mantendo linguagem simples e direta, e ajude na formatação estrutural da documentação em Markdown (`README.md` e `AI.md`) para entrega aos professores."*
* **Resposta obtida:**  
  A ferramenta estruturou os avisos de emergência de fiação caída de forma acessível, diferenciou os textos do painel do morador e da central da prefeitura, e organizou as tabelas de requisitos em Markdown.

### Interação 6 — Integração do Background 3D WebGL em Scrollytelling para Atratividade Visual (`Three.js` + `GSAP`)
* **Objetivo:** Evoluir a tela inicial de uma abertura estática em SVG para uma experiência visual mais bonita, moderna e envolvente para o usuário, usando um diorama 3D interativo controlado pela rolagem da página.
* **Prompt enviado:**  
  *"Quero integrar a animação 3D WebGL em anexo (`zelasp_background_3d_cartoon_webgl.html`) como o background interativo de rolagem (scrollytelling) da tela de início (Home) do meu site já existente, seguindo estas regras estritas: 1. Não alterar, simplificar nem reescrever a geometria 3D, os materiais Toon (`createCartoonMesh` / `addCartoonOutline`), as luzes ou as coordenadas de câmera (`waypoints`) do script Three.js original; 2. Inserir `<canvas id='zelasp-bg'>` fixo no fundo (`position: fixed`, `100vw × 100vh`, `z-index: 0`, `pointer-events: none`); 3. Remover a `.scroll-spacer` de teste e ligar o `ScrollTrigger` do GSAP ao container principal da Home (`start: 'top top'`, `end: 'bottom bottom'`, `scrub: 1`); 4. Deixar `body`, `main` e `section` com fundo transparente (`z-index: 1`) e aplicar `backdrop-filter: blur(10px)` / fundo semitransparente nos cards e navbar para manter leitura perfeita sobre a rua 3D; 5. Ajustar a altura vertical da Home (~400vh a 500vh) para percorrer suavemente os 5 estados da câmera até a rua revitalizada."*
* **O que foi feito (Resposta e Implementação):**
  1. **Componente 3D preservado (`src/components/ZelaspBackground3D.jsx`):** Instalação de `three@0.128.0` e `gsap@^3.12.5` (`ScrollTrigger`). Toda a geometria Toon, contornos *inverted-hull*, iluminação solar, textura da calçada paulistana, animações das 4 ocorrências (fio com faísca, bueiro aberto com cones, entulho e carro abandonado com fumaça) e props da rua revitalizada (tampa fechada, fio religado, banco, paraciclos e iluminação do poste), além dos 7 `waypoints` de câmera, foram mantidos idênticos ao protótipo original — adicionando apenas `ScrollTrigger` vinculado ao `triggerRef` da Home, sincronização da etapa ativa (`onStageChange`) e limpeza de recursos WebGL/listeners no *unmount* do React.
  2. **Scrollytelling na Home (`src/pages/SplashScreen.jsx`):** A página inicial foi reestruturada em 5 seções verticais (~480vh de altura total) alinhadas aos 5 estados da câmera 3D, com barra superior translúcida para salto rápido entre cenários e botões **Começar** e **Pular** preservando a transição direta para a `LoginScreen`.
  3. **Transparência e Legibilidade (`index.html` e `src/index.css`):** Remoção de fundo sólido no `<body>`, posicionamento fixo de `#zelasp-bg` em tela cheia atrás das seções transparentes (`.zelasp-home-root`, `.zelasp-home-main`, `.zelasp-home-section`) e criação da classe utilitária `.zelasp-glass` (`rgba(255, 255, 255, 0.78)` + `backdrop-filter: blur(10px)`).

### Interação 7 — Diagnóstico e Correção da Rolagem com Scroll do Mouse (`mouseWheel`)
* **Prompt enviado:**  
  *"A única coisa que não está funcionando em relação à animação é o scroll do mouse e ir alterando a animação ao descer ou subir a rolagem da tela."*
* **O que foi feito (Resposta e Implementação):**  
  Por meio de inspeção em navegador com eventos reais de roda do mouse (`mouseWheel`), foi identificado que manter `overflow-x: hidden` e `overscroll-behavior-y: none` simultaneamente em `html` e `body` fazia o navegador tratar o `body` como container isolado e bloquear a propagação do scroll para a janela (`window.scrollY` permanecia em `0`). A regra base em `src/index.css` foi ajustada para usar `overflow-x: clip;` apenas no `html` e manter o `body` limpo (`margin: 0; padding: 0; width: 100%; background: transparent;`), desbloqueando o avanço e o retorno suaves da câmera 3D ao rolar para baixo e para cima com o mouse.

---

## 3. Aplicação no Projeto

* **Jornada em 3 Etapas (`src/pages/SplashScreen.jsx`, `ZelaspBackground3D.jsx`, `LoginScreen.jsx` e `src/hooks/useSessao.js`):** Abertura interativa em 3D (*scrollytelling*) explicando o propósito do ZelaSP, tela de login demonstrativa com escolha de perfil e painéis separados para Cidadão (relatar problema + apoiar chamado existente) e Prefeitura (monitorar GPCT + atualizar status/vistoria + excluir chamados inválidos).
* **Camada de Serviços (`src/services/api.js` e `viaCepService.js`):** Estruturação das funções `getIncidents`, `createIncident`, `updateIncident`, `deleteIncident` e `buscarEnderecoPorCep`.
* **Custom Hooks (`src/hooks/`):** Implementação de 5 hooks personalizados (`useIncidents`, `useViaCep`, `useGeolocation`, `useSessao`, `useToast`) que desacoplam regras de negócio e efeitos colaterais da camada visual.
* **Componentização (`src/components/` e `src/pages/`):** Desenvolvimento de 14 módulos visuais reutilizáveis com responsividade em Tailwind CSS.
* **Lógica de Risco (`src/utils/riskCalculator.js`):** Conexão com a regra de classificação de urgência (níveis 1 a 5) e avaliação territorial (GPCT) criada nas disciplinas de Python e Matemática.

---

## 4. Validação das Respostas pelo Grupo

1. **Separação Real entre Visão do Cidadão e Visão da Prefeitura:** Ao testar a primeira versão, identificamos que misturar ações do cidadão com botões administrativos da prefeitura na mesma tela causava confusão. Criamos a jornada com abertura animada, escolha de perfil no login e ações específicas por perfil, garantindo que uma ocorrência criada no modo Cidadão apareça imediatamente na fila da Prefeitura.
2. **Adaptação Território e Anti-Clichê:** O grupo rejeitou modelos visuais genéricos em tema escuro com contadores fictícios. Definimos um tema claro cívico com contraste adequado, incorporamos os bairros prioritários reais do projeto (**Jabaquara, Vila Mariana, Saúde, Bela Vista, Mooca e Vila Mascote**) e fizemos os contadores refletirem estritamente o estado dinâmico dos dados carregados.
3. **Testes Manuais de Fluxo CRUD e Build:** Testamos a criação de um chamado no perfil Cidadão preenchendo um CEP real via ViaCEP, o acionamento do botão **Apoiar** (`PUT`), a troca para o perfil Prefeitura, a atualização de status no modal de vistoria (`PUT`) e a confirmação em dois cliques no botão **Excluir** (`DELETE`), além de validar `npm run build` sem erros.
4. **Validação da Experiência 3D e Rolagem Real pelo Mouse:** Após integrar o diorama 3D e diagnosticar o bloqueio inicial de `overflow-x: hidden` + `overscroll-behavior-y: none`, verificamos com rolagem real de `mouseWheel` (descendo do estado `01/05` até `05/05` e subindo de volta ao início) que os 5 `waypoints` da câmera, a revitalização da cena e a barra de etapas respondem suavemente sem erros no console.

---

## 5. Análise Crítica

* **Benefícios:** O uso da IA acelerou a construção da jornada de abertura em 3D (*scrollytelling* com Three.js e GSAP), o tratamento de estados assíncronos e a estilização responsiva no Tailwind CSS, deixando a entrada do site muito mais atrativa e intuitiva para o usuário entender os 4 problemas urbanos e o impacto da zeladoria na cidade.
* **Limitações e Dificuldades:** Inicialmente a interface exibia todas as funções administrativas misturadas na tela inicial, exigindo o direcionamento do grupo para estruturar o fluxo em três etapas. Além disso, durante a integração do cenário 3D, a combinação de `overflow-x: hidden` com `overscroll-behavior-y: none` no `body` impediu a rolagem pelo mouse em uso real mesmo com a cena renderizando normalmente — problema detectado na validação manual e corrigido ajustando o CSS de `html`/`body`.
