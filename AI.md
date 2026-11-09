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

* **Google Antigravity (Gemini 3.8 Flash):** Utilizada como assistente de engenharia de software para estruturar a separação de camadas no React (Services, Custom Hooks e Componentes), revisar a acessibilidade das classes Tailwind CSS, validar o tratamento de erros assíncronos no consumo de APIs REST e auxiliar na redação e formatação dos textos da documentação.

---

## 2. Interações Realizadas (Exemplos de Prompts e Respostas)

### Interação 1 — Arquitetura de Custom Hooks e Separação de Camadas
* **Prompt enviado:**  
  *"Como organizar um projeto React com Vite e Tailwind CSS separando a lógica de acesso a dados (CRUD com MockAPI e ViaCEP) em serviços e Custom Hooks reutilizáveis (`useIncidents`, `useViaCep` e `useGeolocation`), mantendo os componentes visuais limpos?"*
* **Resposta obtida:**  
  A IA propôs uma arquitetura em três camadas (`src/services/`, `src/hooks/` e `src/components/`), utilizando `useCallback` e `useMemo` dentro do hook `useIncidents` para filtrar ocorrências e atualizar o estado global da lista após requisições `POST`, `PUT` e `DELETE`.

### Interação 2 — Integração Defensiva com ViaCEP e Geolocalização
* **Prompt enviado:**  
  *"Crie um Custom Hook em React que consulte a API pública do ViaCEP ao informar 8 dígitos, valide erros de CEP inexistente e preencha automaticamente a rua e o bairro no formulário sem travar a digitação do usuário."*
* **Resposta obtida:**  
  Foi gerado o padrão do hook `useViaCep` com estados dedicados (`buscandoCep`, `erroCep`) e tratamento para CEPs inválidos (`dados.erro === true`).

### Interação 3 — Apoio na Formatação e Redação dos Textos
* **Prompt enviado:**  
  *"Ajude a revisar a escrita dos textos da interface voltada ao cidadão de São Paulo, mantendo linguagem simples e direta sem termos técnicos confusos, e ajude na formatação estrutural da documentação em Markdown (`README.md` e `AI.md`) para entrega aos professores."*
* **Resposta obtida:**  
  A ferramenta estruturou os avisos de emergência de fiação caída de forma acessível, organizou as tabelas de requisitos em Markdown e deixou os textos dos cards e botões objetivos para uso rápido no celular.

---

## 3. Aplicação no Projeto

* **Camada de Serviços (`src/services/api.js` e `viaCepService.js`):** Estruturação das funções `getIncidents`, `createIncident`, `updateIncident`, `deleteIncident` e `buscarEnderecoPorCep`.
* **Custom Hooks (`src/hooks/`):** Implementação dos 3 hooks personalizados (`useIncidents`, `useViaCep`, `useGeolocation`) que desacoplam regras de negócio e efeitos colaterais da camada de interface.
* **Componentização (`src/components/`):** Desenvolvimento de 11 componentes reutilizáveis (`Header`, `CitizenBanner`, `DistrictOverview`, `FilterBar`, `IncidentForm`, `IncidentCard`, `IncidentModal`, `StatusBadge`, `RiskIndicator`, `ToastNotification`, `Footer`) com responsividade em Tailwind CSS.
* **Lógica de Risco (`src/utils/riskCalculator.js`):** Conexão com a regra de classificação de urgência (níveis 1 a 5) e avaliação territorial (GPCT) criada nas disciplinas de Python e Matemática.

---

## 4. Validação das Respostas pelo Grupo

1. **Adaptação Território e Anti-Clichê:** O grupo rejeitou modelos visuais genéricos em tema escuro com contadores fictícios. Definimos um tema claro cívico com contraste adequado, incorporamos os bairros prioritários reais do projeto (**Jabaquara, Vila Mariana, Saúde, Bela Vista, Mooca e Vila Mascote**) e fizemos os contadores refletirem estritamente o estado dinâmico dos dados carregados.
2. **Testes Manuais de Fluxo CRUD:** Testamos a criação de um chamado preenchendo um CEP real via ViaCEP, o acionamento do botão **Apoiar** (verificando o incremento da contagem via `PUT`), a atualização de status no modal de vistoria e a confirmação em dois cliques no botão **Excluir** (`DELETE`).
3. **Verificação de Build de Produção:** Executamos `npm run build` com o Vite para garantir ausência de erros de sintaxe, imports quebrados ou avisos do Tailwind CSS.

---

## 5. Análise Crítica

* **Benefícios:** O uso da IA reduziu drasticamente o tempo gasto com código repetitivo de formulários, estados de carregamento e estilização responsiva no Tailwind CSS, permitindo que a equipe focasse nas regras de negócio contra chamados duplicados e na experiência do cidadão.
* **Limitações e Dificuldades:** Modelos de IA tendem a acoplar chamadas `fetch` diretamente dentro de `useEffect` nos componentes visuais ou sugerir interfaces visuais clichês desconectadas do contexto urbano real. Foi necessário o direcionamento contínuo do grupo para garantir a separação limpa entre camadas, a acessibilidade das cores e o funcionamento fiel do fluxo de apoio comunitário.
