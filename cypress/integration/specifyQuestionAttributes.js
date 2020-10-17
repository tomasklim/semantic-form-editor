import {
  addUnorderedFormQuestion,
  closeConfigModal,
  createEmptyForm,
  createFormFromFile,
  createSimpleQuestion,
  getForm,
  getHelpInput,
  getIdInput,
  getLayoutClassInput,
  openConfigModal,
  saveSidebarForm
} from '../helpers';
import { Constants } from 's-forms';

describe('Specify question attributes', () => {
  beforeEach(() => {
    createEmptyForm();
  });

  it('offers to fill labels in selected languages and shows them correctly', () => {
    cy.get('[data-testid="languages-autocomplete"').click();

    cy.contains('cs').click();

    cy.get('[data-testid="languages-autocomplete"] input').type('ue').type('{downarrow}{enter}');

    closeConfigModal();

    cy.get('[data-testid="localised-input-cs"]').first().type('Czech');
    cy.get('[data-testid="localised-input-ue"]').first().type('Ukrainian');

    getLayoutClassInput().click();
    cy.contains(new RegExp(`^Text$`)).click();

    getIdInput()
      .invoke('val')
      .then((questionId) => {
        saveSidebarForm();

        cy.get(`#${questionId}`).click();

        cy.get('[data-testid="localised-input-cs"]').first().should('have.value', 'Czech');
        cy.get('[data-testid="localised-input-ue"]').first().should('have.value', 'Ukrainian');
      });
  });

  it('allows to specify custom attribute of question', () => {
    closeConfigModal();

    createSimpleQuestion('Text', 'Text');

    getIdInput()
      .invoke('val')
      .then((textQuestionId) => {
        getHelpInput().type('Heelp!');

        cy.get('[data-testid="add-new-attribute"]').click();
        // saveSidebarForm();
        cy.get('[data-testid="custom-attribute-input"]').click();
        cy.contains('has-unit').click();

        cy.get('#custom-attribute-value').type('mm');

        cy.get('#add-custom-attribute').click();

        saveSidebarForm();

        cy.get(`#${textQuestionId}`).click('top');

        getHelpInput().should('have.value', 'Heelp!');
        cy.get(`[name="${Constants.HAS_UNIT}"]`).should('have.value', 'mm');
      });
  });
});
