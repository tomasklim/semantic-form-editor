/// <reference types="cypress" />
describe('11ty', () => {
  it('navigates', () => {
    // find more Cypress commands at
    // https://on.cypress.io/api
    cy.visit('/');
    cy.contains('Customise');
  });
});
