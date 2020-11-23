import {
  closeConfigModal,
  createEmptyForm,
  createSimpleQuestion,
  getLayoutClassInput,
  saveSidebarForm
} from '../helpers';

describe("Specify question's possible values", () => {
  beforeEach(() => {
    createEmptyForm();
  });

  it('allows to specify possible values of autocomplete question', () => {
    closeConfigModal();

    createSimpleQuestion('Autocomplete', 'Autocomplete');

    cy.get('#add-options').should('have.text', 'Add answer options - 0 available');
    cy.get('#add-options').click();
    cy.get('#options-modal').find('#empty-options');

    cy.get('#add-new-option-button').click();

    cy.get('[data-testid="option-0"]').type('Option 1');

    cy.get('#add-new-option-button').click();
    cy.get('#add-new-option-button').click();

    cy.get('[data-testid="option-1"]').type('Option 2');
    cy.get('[data-testid="option-2"]').type('Option 3');

    cy.get('#close-options-modal').click();
    cy.get('#add-options').should('have.text', 'Add answer options - 3 available');
    cy.get('#add-options').click();

    cy.get('#options-modal').find('[data-testid="option-2"]').should('have.value', 'Option 3');

    cy.get('#options-modal').find('[data-testid="option-2-delete"]').click();
    cy.get('#options-modal').find('[data-testid="option-2"]').should('not.exist');
    cy.get('#close-options-modal').click();

    cy.get('#add-options').should('have.text', 'Add answer options - 2 available');

    saveSidebarForm();

    cy.get('[data-testid="item-type-ahead"]').click('top');
    cy.get('#add-options').should('have.text', 'Add answer options - 2 available');
  });

  it('allows to specify possible values of autocomplete question in more languages', () => {
    cy.get('[data-testid="languages-autocomplete"').click();

    cy.contains('cs').click();
    cy.get('[data-testid="languages-autocomplete"] input').type('ue').type('{downarrow}{enter}');

    closeConfigModal();

    getLayoutClassInput().click();
    cy.contains(new RegExp(`^Autocomplete`)).click();

    cy.get('#add-options').should('have.text', 'Add answer options - 0 available');
    cy.get('#add-options').click();
    cy.get('#options-modal').find('#empty-options');

    cy.get('#add-new-option-button').click();

    cy.get('[data-testid="option-0-cs"]').type('Option 1 CS');
    cy.get('[data-testid="option-0-ue"]').type('Option 1 UE');

    cy.get('#add-new-option-button').click();
    cy.get('#add-new-option-button').click();

    cy.get('[data-testid="option-1-cs"]').type('Option 2 CS');
    cy.get('[data-testid="option-1-ue"]').type('Option 2 UE');
    cy.get('[data-testid="option-2-cs"]').type('Option 3 CS');
    cy.get('[data-testid="option-2-ue"]').type('Option 3 UE');

    cy.get('#close-options-modal').click();
    cy.get('#add-options').should('have.text', 'Add answer options - 3 available');
    cy.get('#add-options').click();

    cy.get('#options-modal').find('[data-testid="option-2-cs"]').should('have.value', 'Option 3 CS');
    cy.get('#options-modal').find('[data-testid="option-2-ue"]').should('have.value', 'Option 3 UE');

    cy.get('#options-modal').find('[data-testid="option-2-delete"]').click();
    cy.get('#options-modal').find('[data-testid="option-2-ue"]').should('not.exist');
  });
});
