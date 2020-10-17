import {
  addUnorderedFormSubquestion,
  closeConfigModal,
  createEmptyForm,
  createSimpleQuestion,
  getIdInput,
  getLabelInput,
  saveSidebarForm,
  switchFormType
} from '../helpers';

describe('Create questions on specific places', () => {
  beforeEach(() => {
    createEmptyForm();
  });

  it('allows to create questions on certain places on top level', () => {
    closeConfigModal();

    createSimpleQuestion('Section', 'Section');
    saveSidebarForm();

    cy.get('[data-testid="item-add-0"]').click();

    createSimpleQuestion('Text', 'Text');
    saveSidebarForm();

    cy.get('[data-testid="item-add-0"]').click();

    createSimpleQuestion('Textarea', 'Textarea');
    saveSidebarForm();

    cy.get('[data-testid="item-add-3"]').click();

    createSimpleQuestion('Time', 'Time');
    saveSidebarForm();

    cy.get('[data-testid="item-add-2"]').click();

    createSimpleQuestion('Date', 'Date');
    saveSidebarForm();

    cy.get('li').eq(0).should('have.attr', 'data-testid', 'item-textarea');
    cy.get('li').eq(1).should('have.attr', 'data-testid', 'item-text');
    cy.get('li').eq(2).should('have.attr', 'data-testid', 'item-date');
    cy.get('li').eq(3).should('have.attr', 'data-testid', 'item-section');
    cy.get('li').eq(4).should('have.attr', 'data-testid', 'item-time');
  });

  it('allows to create questions on certain places in section', () => {
    switchFormType();

    closeConfigModal();

    getLabelInput().type('Wizard Step');
    getIdInput()
      .invoke('val')
      .then((wizardStepId) => {
        saveSidebarForm();

        addUnorderedFormSubquestion(wizardStepId);
        createSimpleQuestion('Text', 'Text');
        saveSidebarForm();

        cy.get('[data-testid="item-add-1"]').click();
        createSimpleQuestion('Section', 'Section');
        saveSidebarForm();

        cy.get('[data-testid="item-add-2"]').click();
        createSimpleQuestion('Time', 'Time');
        saveSidebarForm();

        cy.get('[data-testid="item-add-2"]').click();
        createSimpleQuestion('Datetime', 'Datetime');
        saveSidebarForm();

        cy.get(`li#${wizardStepId}`).find('ol').find('li').eq(0).should('have.attr', 'data-testid', 'item-text');
        cy.get(`li#${wizardStepId}`).find('ol').find('li').eq(1).should('have.attr', 'data-testid', 'item-section');
        cy.get(`#${wizardStepId}`).find('ol').find('li').eq(2).should('have.attr', 'data-testid', 'item-datetime');
        cy.get(`#${wizardStepId}`).find('ol').find('li').eq(3).should('have.attr', 'data-testid', 'item-time');
      });
  });
});
