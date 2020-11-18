import {
  addUnorderedFormQuestion,
  createFormFromFile,
  createSimpleQuestion,
  getIdInput,
  getLayoutClassInput,
  openConfigModal,
  saveSidebarForm,
  switchFormType
} from '../helpers';

describe('Transform form type', () => {
  beforeEach(() => {
    createFormFromFile('simpleForm.json');
  });

  it('transforms classic form without non-section questions to wizard form and vice versa', () => {
    openConfigModal();

    switchFormType();

    cy.get('#which-animals-do-you-know').click('top');

    getLayoutClassInput().contains('Wizard step').should('exist');
    getLayoutClassInput().contains('Section').should('exist');

    openConfigModal();
    switchFormType();

    cy.get('#which-animals-do-you-know').click('top');

    getLayoutClassInput().contains('Wizard step').should('not.exist');
    getLayoutClassInput().contains('Section').should('exist');
  });

  it('transforms classic form with non-section questions to wizard form and vice versa', () => {
    addUnorderedFormQuestion();
    createSimpleQuestion('Text Field', 'Text field');
    saveSidebarForm();

    openConfigModal();

    switchFormType();

    cy.get('#which-animals-do-you-know').click('top');

    getLayoutClassInput().contains('Wizard step').should('not.exist');
    getLayoutClassInput().contains('Section').should('exist');

    cy.get('[data-testid="item-wizard-step"').should('exist').click('top');
    getLayoutClassInput().contains('Wizard step').should('exist');
    getLayoutClassInput().contains('Section').should('exist');

    getIdInput()
      .invoke('val')
      .then((wizardStepId) => {
        openConfigModal();
        switchFormType();

        cy.get(`#${wizardStepId}`).click('top');

        getLayoutClassInput().contains('Wizard step').should('not.exist');
        getLayoutClassInput().contains('Section').should('exist');
      });
  });
});
