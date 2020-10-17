describe('Import form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders initial page correctly', () => {
    cy.get('.MuiStepper-root').find('button').should('have.length', 4);
    cy.get('.MuiStepper-root').find('button:disabled').should('have.length', 3);
    cy.get('.MuiStepper-root').find('button:not([disabled])').should('have.length', 1).contains('New / Import');

    cy.get('#new-form-button').should('have.length', 1);
    cy.get('#import-form-button').should('have.length', 1);
    cy.get('.jsoneditor').should('have.length', 1);
    cy.get('#continue-button').should('have.length', 1).and('be.disabled');
  });

  it('should fill jsoneditor with new form content on new form button click', () => {
    cy.get('.jsoneditor').contains('@context').should('not.exist');
    cy.get('.jsoneditor').contains('"form"').should('not.exist');
    cy.get('#continue-button').should('have.length', 1).and('be.disabled');

    cy.get('#new-form-button').click();

    cy.get('.jsoneditor').contains('@context').should('exist');
    cy.get('.jsoneditor').contains('"form"').should('exist');
    cy.get('#continue-button').should('have.length', 1).and('not.be.disabled');
  });

  it('should fill jsoneditor with imported file content on import existing form button click', () => {
    cy.get('.jsoneditor').contains('@context').should('not.exist');
    cy.get('.jsoneditor').contains('"form"').should('not.exist');
    cy.get('#continue-button').should('have.length', 1).and('be.disabled');

    cy.get('#import-form-button').attachFile('newForm.json');

    cy.get('.jsoneditor').contains('@context').should('exist');
    cy.get('.jsoneditor').contains('"form"').should('exist');
    cy.get('#continue-button').should('have.length', 1).and('not.be.disabled');
  });
});

describe('Import form from formUrl', () => {
  it('should start in customise step with empty form downloaded from formUrl', () => {
    cy.server();
    cy.route('GET', 'http://example.com/newForm.json', 'fixture:newForm.json');

    cy.visit('/?formUrl=http://example.com/newForm.json');

    cy.get('#close-config-modal').click();

    cy.get('.MuiStepper-root').find('button').should('have.length', 4);
    cy.get('.MuiStepper-root').find('button:disabled').should('have.length', 3);
    cy.get('.MuiStepper-root').find('button:not([disabled])').should('have.length', 1).contains('Customise');

    cy.get('#empty-form').should('have.length', 1);
  });

  it('should call backend after an update of form when draftUpdate param is true', () => {
    cy.server();
    cy.route('GET', 'http://example.com/newForm.json', 'fixture:newForm.json');
    cy.route('PUT', 'http://example.com/newForm.json', { status: 200 }).as('draftUpdate');

    cy.visit('/?formUrl=http://example.com/newForm.json&draftUpdate=true');

    cy.get('#close-config-modal').click();

    cy.get('[data-testid="non-localised-label-input"]').type('test');
    cy.get('[data-testid="layout-class-input"]').click();

    cy.contains('Section').click();

    cy.get('#save-question').click();

    cy.wait('@draftUpdate');

    cy.get('@draftUpdate.all').should('have.length', 1);
  });

  it('should start in customise step with empty form downloaded from formUrl', () => {
    cy.server();
    cy.route('GET', 'http://example.com/simpleForm.json', 'fixture:simpleForm.json');
    cy.visit('/?formUrl=http://example.com/simpleForm.json');

    cy.get('.MuiStepper-root').find('button').should('have.length', 4);
    cy.get('.MuiStepper-root').find('button:disabled').should('have.length', 1);
    cy.get('.MuiStepper-root').find('button:disabled').should('have.length', 1).contains('Load');

    cy.get('#empty-form').should('have.length', 0);
    cy.get('li[data-testid="item"]').should('have.length', 3);
    cy.get('li[data-testid="item-section"]').should('have.length', 1);
  });

  it('should start in customise step with empty form downloaded from formUrl', () => {
    cy.server();
    cy.route('GET', 'http://example.com/simpleForm.json', 'fixture:simpleForm.json');
    cy.visit('/?formUrl=http://example.com/simpleForm.json');

    cy.get('#empty-form').should('have.length', 0);
    cy.get('li[data-testid="item"]').should('have.length', 3);
    cy.get('li[data-testid="item-section"]').should('have.length', 1);
  });

  it('should start in customise step with empty form downloaded from formUrl', () => {
    cy.server();
    cy.route('GET', 'http://example.com/simpleForm.json', 'fixture:simpleForm.json');
    cy.route('POST', 'http://example.com/simpleForm.json', { status: 200 }).as('publish');

    cy.visit('/?formUrl=http://example.com/simpleForm.json');

    cy.get('.MuiStepper-root').contains('Publish').click();

    cy.get('#publish-button').click();

    cy.wait('@publish');

    cy.get('@publish.all').should('have.length', 1);
  });
});
