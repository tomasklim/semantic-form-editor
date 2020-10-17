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
  saveSidebarForm,
  switchFormType
} from '../helpers';
import { Constants } from 's-forms';

describe('create multiple questions', () => {
  beforeEach(() => {
    createEmptyForm();
  });

  it('adds multiple questions correctly in simple form', () => {
    closeConfigModal();

    cy.get('#multiple-questions-tab').click();
    cy.get('#create-questions').type('Section{enter}  Hello{enter}  Hi{enter}Text');

    cy.get('#add-multiple-questions').click();

    cy.get(`li[id^="section"][data-testid="item-section"]`).find(`li[id^="hello"][data-testid="item-"]`);
    cy.get(`li[id^="section"][data-testid="item-section"]`).find(`li[id^="hi"][data-testid="item-"]`);

    cy.get(`li[id^="text"][data-testid="item-"]`);
  });

  it('adds multiple questions correctly in wizard form', () => {
    switchFormType();

    closeConfigModal();

    cy.get('#multiple-questions-tab').click();
    cy.get('#create-questions').type('Wizard step{enter}  Hello{enter}    Haha{enter}  Hi{enter}Wizard');
    cy.get('#add-multiple-questions').click();

    cy.get(`li[id^="wizard-step"][data-testid="item-wizard-step"]`)
      .find(`li[id^="hello"][data-testid="item-section"]`)
      .find(`li[id^="haha"][data-testid="item-"]`);
    cy.get(`li[id^="wizard-step"][data-testid="item-wizard-step"]`).find(`li[id^="hi"][data-testid="item-"]`);

    cy.get(`li[id^="wizard"][data-testid="item-wizard-step"]`);
  });

  it('allows to add multiple questions only in unordered add mode', () => {
    closeConfigModal();

    cy.get('#multiple-questions-tab').click();
    cy.get('#create-questions').type('Section{enter}  Text{enter}');
    cy.get('#add-multiple-questions').click();

    cy.get('#add-new-question').click();
    cy.get('#multiple-questions-tab').should('be.enabled');

    cy.get(`li[id^="text"][data-testid="item-"]`).find('[data-testid="add-subquestion-unordered"]').click();
    cy.get('#multiple-questions-tab').should('be.enabled');

    cy.get(`li[id^="text"][data-testid="item-"]`).click('top');
    cy.get('#multiple-questions-tab').should('not.exist');

    cy.get(`li[id^="section"][data-testid="item-section"]`).find('[data-testid="item-add-0"]').click();
    cy.get('#multiple-questions-tab').should('be.disabled');
  });
});
