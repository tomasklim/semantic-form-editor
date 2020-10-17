import { getContinueButton, getImportFormButton, getJsonEditor, getNewFormButton, getStepper } from '../helpers';

describe('Import form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders initial page correctly', () => {
    getStepper().find('button').should('have.length', 4);
    getStepper().find('button:disabled').should('have.length', 3);
    getStepper().find('button:not([disabled])').should('have.length', 1).contains('New / Import');

    getNewFormButton().should('have.length', 1);
    getImportFormButton().should('have.length', 1);
    getJsonEditor().should('have.length', 1);
    getContinueButton().should('have.length', 1).and('be.disabled');
  });

  it('should fill jsoneditor with new form on new form button click', () => {
    getJsonEditor().contains('@context').should('not.exist');
    getJsonEditor().contains('"form"').should('not.exist');
    getContinueButton().should('have.length', 1).and('be.disabled');

    getNewFormButton().click();

    getJsonEditor().contains('@context').should('exist');
    getJsonEditor().contains('"form"').should('exist');
    getContinueButton().should('have.length', 1).and('not.be.disabled');
  });

  it('should fill jsoneditor with imported file on import existing form button click', () => {
    getJsonEditor().contains('@context').should('not.exist');
    getJsonEditor().contains('"form"').should('not.exist');
    getContinueButton().should('have.length', 1).and('be.disabled');

    getImportFormButton().attachFile('newForm.json');

    getJsonEditor().contains('@context').should('exist');
    getJsonEditor().contains('"form"').should('exist');
    getContinueButton().should('have.length', 1).and('not.be.disabled');
  });
});
