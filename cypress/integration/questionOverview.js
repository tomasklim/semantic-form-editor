import { createFormFromFile } from '../helpers';

describe('Mix of question features', () => {
  beforeEach(() => {
    createFormFromFile('formWithIndicators.json');
  });

  it('indicates form control types correctly', () => {
    cy.get('#autocomplete').get('[data-testid="autocomplete"]').should('have.value', 'Autocomplete');

    cy.get('#checkbox').get('[data-testid="checkbox"]').contains('Checkbox');

    cy.get('#date').get('[data-testid="date"]').should('exist');

    cy.get('#masked-field').get('[data-testid="masked-text"]').should('have.value', 'Masked text');

    cy.get('#time').get('[data-testid="time"]').should('exist');

    cy.get('#text-area').get('[data-testid="text-area"]').should('have.value', 'Text area');

    cy.get('#text-field').get('[data-testid="text-field"]').should('have.value', 'Text field');

    cy.get('#datetime').get('[data-testid="datetime-local"]').should('exist');

    cy.get('#section').get('[data-testid="item-section"]').should('exist');
  });

  it('indicates specific properties correctly', () => {
    cy.get('#section').get('[data-testid="item-section"]').get('[data-testid="collapsed-indicator"]').should('exist');
    cy.get('#text-area').get('[data-testid="preceding-question-indicator"]').should('exist');
    cy.get('#text-field').get('[data-testid="required-indicator"]').should('exist');
    cy.get('#text-field').get('[data-testid="help-indicator"]').should('exist');
    cy.get('#text-field').get('[data-testid="disabled-indicator"]').should('exist');
    cy.get('#text-field').get('[data-testid="comment-indicator"]').should('exist');
  });
});
