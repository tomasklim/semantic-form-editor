import {
  addUnorderedFormSubquestion,
  closeConfigModal,
  createEmptyForm,
  createSimpleQuestion,
  getHelpInput,
  getIdInput,
  getLabelInput,
  getLayoutClassInput,
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
    cy.contains(new RegExp(`^Text field$`)).click();

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

    createSimpleQuestion('Text Field', 'Text field');

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

  it('allows to modify subquestion of modified question and does not rollback the data', () => {
    closeConfigModal();

    createSimple Question('Section', 'Section');

    getIdInput()
      .invoke('val')
      .then((sectionQuestionId) => {
        saveSidebarForm();

        addUnorderedFormSubquestion(sectionQuestionId);
        createSimpleQuestion('Text Field', 'Text field');

        getIdInput()
          .invoke('val')
          .then((textQuestionId) => {
            saveSidebarForm();

            cy.get(`#${sectionQuestionId}`).click('top');
            getLabelInput().clear().type('TestSection');
            saveSidebarForm();

            cy.get(`#${textQuestionId}`).click('top');
            getLabelInput().clear().type('TestText');
            saveSidebarForm();

            cy.get(`#${sectionQuestionId}`).click('top');
            getLabelInput().should('have.value', 'TestSection');

            cy.get(`#${textQuestionId}`).click('top');
            getLabelInput().should('have.value', 'TestText');
          });
      });
  });
});
