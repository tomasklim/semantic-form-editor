import { closeConfigModal, createSimpleQuestion, getEmptyItemForm, getStepper, saveSidebarForm } from '../helpers';

describe('Import form from server', () => {
  it('should start in customise step with empty form downloaded from formUrl', () => {
    cy.server();
    cy.route('GET', 'http://example.com/newForm.json', 'fixture:newForm.json');

    cy.visit('/?formUrl=http://example.com/newForm.json');

    closeConfigModal();

    getStepper().find('button').should('have.length', 4);
    getStepper().find('button:disabled').should('have.length', 3);
    getStepper().find('button:not([disabled])').should('have.length', 1).contains('Customise');

    cy.get('#empty-form').should('have.length', 1);
  });

  it('should call backend after an update of form when draftUpdate param is true', () => {
    cy.server();
    cy.route('GET', 'http://example.com/newForm.json', 'fixture:newForm.json');
    cy.route('PUT', 'http://example.com/newForm.json', { status: 200 }).as('draftUpdate');

    cy.visit('/?formUrl=http://example.com/newForm.json&draftUpdate=true');

    closeConfigModal();

    createSimpleQuestion('Section', 'Section');
    saveSidebarForm();

    cy.wait('@draftUpdate');
    cy.get('@draftUpdate.all').should('have.length', 1);
  });

  it('should start in customise step with empty form downloaded from formUrl', () => {
    cy.server();
    cy.route('GET', 'http://example.com/simpleForm.json', 'fixture:simpleForm.json');
    cy.visit('/?formUrl=http://example.com/simpleForm.json');

    getStepper().find('button').should('have.length', 4);
    getStepper().find('button:disabled').should('have.length', 1);
    getStepper().find('button:disabled').should('have.length', 1).contains('Load');

    getEmptyItemForm().should('have.length', 0);
    cy.get('li[data-testid="item-checkbox"]').should('have.length', 3);
    cy.get('li[data-testid="item-section"]').should('have.length', 1);
  });

  it('should start in customise step with empty form downloaded from formUrl', () => {
    cy.server();
    cy.route('GET', 'http://example.com/simpleForm.json', 'fixture:simpleForm.json');
    cy.visit('/?formUrl=http://example.com/simpleForm.json');

    getEmptyItemForm().should('have.length', 0);
    cy.get('li[data-testid="item-checkbox"]').should('have.length', 3);
    cy.get('li[data-testid="item-section"]').should('have.length', 1);
  });

  it('should start in customise step with empty form downloaded from formUrl', () => {
    cy.server();
    cy.route('GET', 'http://example.com/simpleForm.json', 'fixture:simpleForm.json');
    cy.route('POST', 'http://example.com/simpleForm.json', { status: 200 }).as('publish');

    cy.visit('/?formUrl=http://example.com/simpleForm.json');

    getStepper().contains('Publish').click();

    cy.get('#publish-button').click();

    cy.wait('@publish');

    cy.get('@publish.all').should('have.length', 1);
  });
});
