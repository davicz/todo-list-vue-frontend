describe('Fluxo de Autenticação', () => {
  it('um utilizador consegue fazer login e ver o dashboard', () => {
    cy.intercept('POST', '**/api/login').as('loginRequest');
    cy.intercept('GET', '**/api/tasks').as('tasksRequest');

    cy.visit('http://localhost:5173/login');

    cy.get('input#email').type('user@exemplo.com');
    cy.get('input#password').type('password123');

    cy.get('button.login-button').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.wait('@tasksRequest').its('response.statusCode').should('eq', 200);

    cy.get('[data-cy="welcome-message"]')
      .should('be.visible')
      .and('contain.text', 'Olá, Regular User!');
  });
});
