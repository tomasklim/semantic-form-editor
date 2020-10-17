export const getStepper = () => {
  return cy.get('.MuiStepper-root');
};

export const getJsonEditor = () => {
  return cy.get('.jsoneditor');
};

export const getNewFormButton = () => {
  return cy.get('#new-form-button');
};

export const getImportFormButton = () => {
  return cy.get('#import-form-button');
};

export const getContinueButton = () => {
  return cy.get('#continue-button');
};

export const getEmptyItemForm = () => {
  return cy.get('#empty-form');
};

export const getIdInput = () => {
  return cy.get('#identification-input');
};

export const getForm = () => {
  return cy.get('#form');
};

export const switchFormType = () => {
  cy.contains('Wizard form').click();
};

export const addNewWizardStepButton = () => {
  return cy.get('#add-new-wizard-step-button');
};

export const closeConfigModal = () => {
  cy.get('#close-config-modal').click();
};

export const openConfigModal = () => {
  cy.get('#config-modal-button').click();
};

export const getLabelInput = () => {
  return cy.get('[data-testid="non-localised-label-input"]').first();
};

export const getHelpInput = () => {
  return cy.get('[data-testid="non-localised-label-input"]').last();
};

export const getLayoutClassInput = () => {
  return cy.get('[data-testid="layout-class-input"]');
};

export const saveSidebarForm = () => {
  cy.get('#save-question').click();
};

export const getSidebarQuestionForm = () => {
  return cy.get('#customise-question-form');
};

export const addUnorderedFormSubquestion = (id) => {
  cy.get(`#${id}`).find('[data-testid="add-subquestion-unordered"]').click();
};

export const addUnorderedFormQuestion = () => {
  cy.get(`#add-new-question`).click();
};

export const createSimpleQuestion = (label, layout) => {
  getLabelInput().type(label);
  getLayoutClassInput().click();
  cy.contains(new RegExp(`^${layout}$`)).click();
};

export const createEmptyForm = () => {
  cy.visit('/');
  cy.get('#new-form-button').click();
  cy.get('#continue-button').click();
};

export const createFormFromFile = (file) => {
  cy.visit('/');
  cy.get('#import-form-button').attachFile(file);
  cy.get('#continue-button').click();
};
