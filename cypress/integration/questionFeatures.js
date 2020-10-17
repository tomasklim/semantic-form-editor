import { createFormFromFile } from '../helpers';

describe('Mix of question features', () => {
  beforeEach(() => {
    createFormFromFile('wizzardFormWithAttributes.json');
  });

  it('allows to duplicate question and delete the old one', () => {
    cy.get('li').should('have.length', 7);

    cy.get('#books').find('[data-testid="menu-header"]').first().click();

    cy.contains('Duplicate question').click();

    cy.get('li').should('have.length', 10);

    cy.get(`li[id^="books"]`).should('have.length', 2);

    cy.get('#books').find('[data-testid="menu-header"]').first().click();

    cy.contains('Delete question').click();

    cy.get('li').should('have.length', 7);

    cy.get('#books').should('not.exist');
  });

  it('allows to collapse and expand certain sections', () => {
    cy.get('#author').should('be.visible');

    cy.get('#authors').find('[data-testid="collapse-button"]').click();

    cy.get('#author').should('be.hidden');
    cy.get('#authors').should('be.visible');

    cy.get('#authors').find('[data-testid="collapse-button"]').click();

    cy.get('#author').should('be.visible');
    cy.get('#authors').should('be.visible');
  });

  it('allows to collapse and expand all sections at once', () => {
    cy.get('#authors').should('be.visible');
    cy.get('#do-you-have-favourite-book').should('be.visible');
    cy.get('#author').should('be.visible');

    cy.get('#collapse-all-button').click();

    cy.get('#authors').should('be.hidden');
    cy.get('#do-you-have-favourite-book').should('be.hidden');
    cy.get('#author').should('be.hidden');

    cy.get('#collapse-all-button').click();

    cy.get('#authors').should('be.visible');
    cy.get('#do-you-have-favourite-book').should('be.visible');
    cy.get('#author').should('be.visible');
  });
});
