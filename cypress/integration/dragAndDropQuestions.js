import { createFormFromFile } from '../helpers';

describe('Drag and drop questions', () => {
  beforeEach(() => {
    createFormFromFile('simpleForm.json');
  });

  it('drag and drop', () => {
    cy.get('li#cuttlefish').drag('#which-animals-do-you-know [data-testid="item-add-0"]');
    cy.get('li#cuttlefish').should('have.class', 'highlightQuestion');
    cy.get('li#baobab').drag('#which-animals-do-you-know [data-testid="item-add-1"]');

    cy.get(`li#which-animals-do-you-know`).find('ol').find('li').eq(0).should('have.id', 'cuttlefish');
    cy.get(`li#which-animals-do-you-know`).find('ol').find('li').eq(1).should('have.id', 'baobab');
    cy.get(`li#which-animals-do-you-know`).find('ol').find('li').eq(2).should('have.id', 'antelope');

    cy.get('li#baobab').find('[data-testid="preceding-question-indicator"]').click();

    cy.get('li#cuttlefish').should('have.class', 'highlightQuestion');
  });

  it('allows to unorder questions within its parent question by drag and drop api', () => {
    cy.get('li#cuttlefish').drag('#which-animals-do-you-know [data-testid="item-add-0"]');
    cy.get('li#baobab').drag('#which-animals-do-you-know [data-testid="item-add-1"]');

    cy.get(`li#which-animals-do-you-know`).find('ol').find('li').eq(1).should('have.id', 'baobab');
    cy.get('li#baobab').drag('#which-animals-do-you-know');
    cy.get(`li#which-animals-do-you-know`).find('ol').find('li').eq(0).should('have.id', 'antelope');
    cy.get(`li#which-animals-do-you-know`).find('ol').find('li').eq(1).should('have.id', 'baobab');
  });

  it('allows to unorder questions within its parent question by single click', () => {
    cy.get('li#which-animals-do-you-know').find('[data-testid="preceding-question-indicator"]').should('not.exist');

    cy.get('li#cuttlefish').drag('[data-testid="item-add-0"]');
    cy.get('li#baobab').drag('[data-testid="item-add-0"]');
    cy.get('li#antelope').drag('[data-testid="item-add-1"]');

    cy.get('li#which-animals-do-you-know').find('[data-testid="preceding-question-indicator"]').should('exist');

    cy.get('li#which-animals-do-you-know').find('[data-testid="menu-header"]').first().click();
    cy.get('#menu-list').find('#menu-item-preceding-question').click('top');
    cy.get(`li`).eq(0).should('have.id', 'baobab');

    cy.get(`li`).eq(1).should('have.id', 'antelope');
    cy.get(`li`).eq(2).should('have.id', 'cuttlefish');
    cy.get(`li`).eq(3).should('have.id', 'which-animals-do-you-know');

    cy.get('li#which-animals-do-you-know').find('[data-testid="preceding-question-indicator"]').should('not.exist');
  });
});
