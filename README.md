# Aplicação To-Do List (Frontend Vue.js)

Este é o repositório do frontend para a aplicação To-Do List, desenvolvido com Vue.js. Esta interface de utilizador (UI) interativa e reativa consome uma API RESTful em Laravel para fornecer uma experiência de gestão de tarefas completa e segura.

## ✨ Funcionalidades

* **Interface Reativa:** Construído com Vue 3 e a Composition API para uma experiência de utilizador fluida e rápida.
* **Autenticação de Utilizador:** Páginas de Login e Registo que comunicam com a API para autenticar utilizadores e gerir sessões através de tokens.
* **Gestão de Estado Centralizada:** Utiliza um "store" reativo simples para gerir o estado de autenticação do utilizador em toda a aplicação.
* **Roteamento Protegido:** Utiliza o Vue Router para proteger rotas, garantindo que apenas utilizadores autenticados possam aceder ao dashboard de tarefas.
* **CRUD de Tarefas Completo:**
    * Visualização de tarefas pendentes e concluídas.
    * Marcar tarefas como concluídas com atualização instantânea na UI.
    * Apagar tarefas com diálogo de confirmação.
* **Interface Baseada em Cargos (Roles):**
    * O formulário para criar novas tarefas só é visível para utilizadores com o cargo de **administrador**.
* **Testes End-to-End:** Suite de testes automatizados com Cypress para validar os fluxos críticos da aplicação, como login e gestão de tarefas.

## 🚀 Tecnologias Utilizadas

* **Frontend:** Vue.js 3 (com Composition API)
* **Build Tool:** Vite
* **Roteamento:** Vue Router
* **Requisições HTTP:** Axios
* **Testes E2E:** Cypress

## 📋 Pré-requisitos

Antes de começar, garanta que você tem as seguintes ferramentas instaladas na sua máquina:

* [Node.js](https://nodejs.org/) (versão 18.x ou superior)
* [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

## ⚙️ Instalação e Configuração

Siga os passos abaixo para clonar e configurar o projeto em sua máquina local.

**1. Clone o Repositório**

```bash
git clone [https://github.com/davicz/todo-frontend.git](https://github.com/davicz/todo-frontend.git)
cd todo-frontend
```

*(Substitua pela URL do seu repositório frontend no GitHub, se for diferente)*

**2. Instale as Dependências**

Este comando irá descarregar e instalar todas as bibliotecas necessárias para o projeto.

```bash
npm install
```

**3. Conecte-se ao Backend (Passo Crucial!)**

Esta aplicação frontend **requer que a API backend esteja a rodar** para funcionar. Certifique-se de que seguiu as instruções de instalação do repositório do backend e que ele está acessível em `http://localhost:8000`.

* **Repositório do Backend:** [davicz/todo-list](https://github.com/davicz/todo-list)

**4. Inicie o Servidor de Desenvolvimento**

Este comando irá iniciar a aplicação Vue.js em modo de desenvolvimento com hot-reloading.

```bash
npm run dev
```

🎉 **Pronto!** A sua aplicação frontend está agora a rodar e acessível, geralmente em `http://localhost:5173`.

## 🧪 Rodando os Testes End-to-End

Para garantir que todas as funcionalidades críticas da interface estão a operar corretamente, você pode rodar a suíte de testes automatizados com o Cypress.

**1. Abra a Interface do Cypress**

Certifique-se de que tanto o servidor do backend como o do frontend estão a rodar. Depois, execute:

```bash
npx cypress open
```

**2. Execute os Testes**

Na janela do Cypress que abrir, escolha "E2E Testing" e depois clique nos ficheiros de teste (`login.cy.js`, `tasks.cy.js`) para os executar.
