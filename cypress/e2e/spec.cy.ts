describe('Sign In Page', () => {
  it('Visits the signin page', () => {
    cy.visit('http://localhost:4100/auth/signin');
  });

  it('Has login buttons', () => {
    cy.visit('http://localhost:4100/auth/signin');

    cy.get('div').contains('카카오로 로그인').should('exist');
    cy.get('div').contains('네이버로 로그인').should('exist');
    cy.get('div').contains('구글로 로그인').should('exist');
    cy.get('div').contains('깃허브로 로그인').should('exist');
  });
});
