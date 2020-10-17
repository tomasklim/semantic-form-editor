import { closeConfigModal, createEmptyForm, createSimpleQuestion, getForm, saveSidebarForm } from '../helpers';

describe('code customisation', () => {
  beforeEach(() => {
    createEmptyForm();
  });

  it('allows to modify source code during customisation of form', () => {
    closeConfigModal();

    cy.get('#edit-in-code').should('be.disabled');

    createSimpleQuestion('Text', 'Text');
    saveSidebarForm();

    cy.get('#edit-in-code').click();

    cy.get('.jsoneditor').should('exist');
    cy.get('#validate-form').should('exist');
    cy.get('#save-changes').should('exist');
    cy.get('#reset-changes').should('exist');
    cy.get('#edit-in-editor-button').click();

    getForm().should('exist');
  });
});
