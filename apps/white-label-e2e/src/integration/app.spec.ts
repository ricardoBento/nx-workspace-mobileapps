/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />
import { getGreeting } from '../support/app.po';
const Storage = require('@ionic/storage').Storage;
const storage = new Storage();
describe('white-label', () => {
  beforeEach(() => cy.visit('/'));

  describe('Login to Home', () => {
    const email = 'ricardo@flowhospitalitytraining.co.uk';
    const pass = 'Rwbento123';
    it('should visit login page', () => {
      this, storage.clear();
      cy.url().should('include', 'http://localhost:4200/login');
      cy.get('#email-input').type(email);
      cy.get('#password-input').type(pass);
      cy.get('#submit').click();
      // cy.url().should('include', 'http://localhost:4200/');
      cy.visit("http://localhost:4200/home");
      cy.wait(2000);
    });
  });
});
