describe('Fluxo de Gestão de Tarefas (Admin)', () => {
  beforeEach(() => {
    // Intercetamos todas as requisições de rede no início para maior robustez
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.intercept('GET', '**/api/tasks').as('tasksRequest');
    cy.intercept('POST', '**/api/tasks').as('createTaskRequest');
    cy.intercept('PUT', '**/api/tasks/*').as('updateTaskRequest');
    cy.intercept('DELETE', '**/api/tasks/*').as('deleteTaskRequest');

    // Faz o login
    cy.visit('http://localhost:5173/login');
    cy.get('input#email').type('admin@exemplo.com');
    cy.get('input#password').type('password123');
    cy.get('button.login-button').click();
    cy.wait('@loginRequest');
    cy.wait('@tasksRequest');
    cy.get('[data-cy="welcome-message"]').should('be.visible');
  });

  it('um admin consegue criar, concluir e apagar uma tarefa', () => {
    const taskTitle = 'Tarefa de Teste Final e Definitiva';
    const userIdForTask = 2;

    // --- 1. CRIAR A TAREFA ---
    cy.get('[data-cy="add-task-title-input"]').type(taskTitle);
    cy.get('[data-cy="add-task-user-id-input"]').type(userIdForTask);
    cy.get('[data-cy="add-task-submit-button"]').click();
    cy.wait('@createTaskRequest');

    // --- NOVA ABORDAGEM: Encontramos a tarefa específica e guardamo-la num "alias" ---
    cy.contains('[data-cy="task-item"]', taskTitle).as('theTask');
    
    cy.get('@theTask').should('be.visible');

    // --- 2. CONCLUIR A TAREFA ---
    // Agora agimos diretamente no elemento que guardámos
    cy.get('@theTask').find('[data-cy="task-checkbox"]').click();
    cy.wait('@updateTaskRequest');
    cy.get('@theTask').should('have.class', 'task-completed');

    // --- 3. APAGAR A TAREFA ---
    cy.on('window:confirm', () => true);
    cy.get('@theTask').find('[data-cy="task-delete-button"]').click();
    cy.wait('@deleteTaskRequest');

    // --- VERIFICAÇÃO FINAL E ROBUSTA ---
    // Agora, verificamos se o elemento que guardámos já não existe no DOM.
    cy.get('@theTask').should('not.exist');
  });
});
