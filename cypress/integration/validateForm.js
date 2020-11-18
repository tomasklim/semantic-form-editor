import {
  addUnorderedFormQuestion,
  createFormFromFile,
  createSimpleQuestion,
  getIdInput,
  getLabelInput,
  getLayoutClassInput,
  openConfigModal,
  saveSidebarForm,
  switchFormType
} from '../helpers';

describe('Validate form', () => {
  beforeEach(() => {
    createFormFromFile('formWithValidationErrors.json');
  });

  it('finds validation errors', () => {
    cy.get('.MuiSnackbar-root').should('not.have.exist');

    cy.get('#validate-form').click();
    cy.get('.MuiSnackbar-root').should('have.exist');
    cy.get('#errors-list-button').click();

    cy.get('#validation-result-window').should('have.exist');

    cy.get('#validation-result-window').should('contain.text', 'http://www.w3.org/2000/01/rdf-schema#label');
    cy.get('#validation-result-window').should(
      'contain.text',
      'http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class'
    );

    cy.get('#close-validation-result-window').click();

    cy.get('#no-label').click();
    getLabelInput().type('Label');
    saveSidebarForm();

    cy.get('#no-layout-class').click();
    createSimpleQuestion('Text', 'Text field');
    saveSidebarForm();

    cy.get('#validate-form').click();
    cy.get('#errors-list-button').should('not.have.exist');
  });
});
