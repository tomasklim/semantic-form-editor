import { createFormFromFile } from '../helpers';

describe('Preview form', () => {
  beforeEach(() => {
    createFormFromFile('wizzardFormWithAttributes.json');
  });

  it('moves to preview if user clicks on comment indicator', () => {
    cy.get('[data-testid="comment-indicator"]').click();

    cy.get('#preview-form').should('exist');
  });

  it('allows to fill values to form', () => {
    cy.get('.MuiStepper-root').contains('Preview').click();

    cy.get('[placeholder="YYYY"]').type('1995');

    cy.get('#add-values-to-form').click();

    cy.get('.MuiStepper-root').contains('Edit').click();
    cy.get('.MuiStepper-root').contains('Preview').click();

    cy.get('[placeholder="YYYY"]').should('have.value', 1995);
  });

  it('allows to configure form language in preview', () => {
    cy.get('.MuiStepper-root').contains('Preview').click();

    cy.get('#form-type-switch').should('exist');

    cy.get('#preview-form').contains('Magazines').should('exist');

    cy.get('#preview-form').contains('Zeitschriften').should('not.exist');

    cy.get('#language-select').click();
    cy.contains('DE').click();

    cy.get('#preview-form').contains('Zeitschriften').should('exist');

    cy.get('#preview-form').contains('Magazines').should('not.exist');
  });
});
