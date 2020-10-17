import { createFormFromFile } from '../helpers';

describe('Export form', () => {
  beforeEach(() => {
    createFormFromFile('wizzardFormWithAttributes.json');
  });

  it('exports renders correctly', () => {
    cy.get('.MuiStepper-root').contains('Export').click();

    cy.get('#copy-to-clipboard-button').should('exist');
    cy.get('#download-button').should('exist');
    cy.get('.jsoneditor').should('exist');
  });

  it('navigates to first step from export on start over button click', () => {
    cy.get('.MuiStepper-root').contains('Export').click();

    cy.get('#reset-button').click();

    cy.get('.MuiStepper-root').find('button').should('have.length', 4);
    cy.get('.MuiStepper-root').find('button:disabled').should('have.length', 3);
    cy.get('.MuiStepper-root').find('button:not([disabled])').should('have.length', 1).contains('New / Import');
  });
});
