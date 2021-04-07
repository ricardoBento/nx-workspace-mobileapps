/// <reference types="cypress" />

context('Login test', () => {
  const email = 'ricardo@flowhospitalitytraining.co.uk';
  const wrong_email = 'wrong@flowhospitalitytraining.co.uk';
  const pass = 'Rwbento123';
  const wrong_pass = 'wrong123';
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login tests', () => {
    it('should login to dashboard', () => {
      cy.visit('/');
      cy.url().should('include', '192.168.56.1:3000/');
      cy.get('#email-input').type(email, { force: true });
      cy.get('#password-input').type(pass);
      cy.get('#submit').click();
      cy.visit('192.168.56.1:3000/#new-dashboard');
      cy.wait(2000);
    });
  });
});
