import {
  addNewWizardStepButton,
  addUnorderedFormSubquestion,
  closeConfigModal,
  createEmptyForm,
  createSimpleQuestion,
  getForm,
  getIdInput,
  getLabelInput,
  getLayoutClassInput,
  getSidebarQuestionForm,
  saveSidebarForm,
  switchFormType
} from '../helpers';

describe('Open empty form and customise it', () => {
  beforeEach(() => {
    createEmptyForm();
  });

  it('creates section in simple form, wizard step is not available', () => {
    closeConfigModal();

    getLabelInput().type('Label Section');

    getLayoutClassInput().click();
    cy.contains('Wizard step').should('not.exist');
    cy.contains('Section').click();

    getIdInput()
      .invoke('val')
      .then((sectionId) => {
        saveSidebarForm();

        getSidebarQuestionForm().should('have.length', 0);

        cy.get(`#${sectionId}`).should('have.length', 1).click();
      });

    getSidebarQuestionForm().should('have.length', 1);
  });

  it('allows to create only wizard steps on top level and sections only in lower level of form', () => {
    switchFormType();
    closeConfigModal();

    const wizardStep1 = 'Label Wizard Step 1';
    getLabelInput().type(wizardStep1);

    getLayoutClassInput().contains('Wizard step');
    getLayoutClassInput().contains('Section');

    getIdInput()
      .invoke('val')
      .then((wizardStepId1) => {
        saveSidebarForm();

        getSidebarQuestionForm().should('have.length', 0);

        cy.get(`#${wizardStepId1}`).should('have.length', 1).click();

        getSidebarQuestionForm().should('have.length', 1).contains('Label');

        addNewWizardStepButton().click();

        getLayoutClassInput().contains('Wizard step');
        getLayoutClassInput().contains('Section');

        getLabelInput().type('Wizard');

        getIdInput()
          .invoke('val')
          .then((wizardStepId2) => {
            saveSidebarForm();

            getSidebarQuestionForm().should('have.length', 0);

            cy.get(`#${wizardStepId2}`).should('have.length', 1).click();

            cy.get('[data-testid="item-wizard-step"]').should('have.length', 2);

            addUnorderedFormSubquestion(wizardStepId2);

            getLayoutClassInput().click();

            cy.contains('Wizard step').should('not.exist');
            cy.contains('Section');
          });
      });
  });

  it('does not allow to move non-wizard-step question to unordered top level in wizard form type', () => {
    switchFormType();
    closeConfigModal();

    getLabelInput().type('Wizard step 1');

    getIdInput()
      .invoke('val')
      .then((wizardStepId1) => {
        saveSidebarForm();

        addUnorderedFormSubquestion(wizardStepId1);

        createSimpleQuestion('Text Field', 'Text');

        getIdInput()
          .invoke('val')
          .then((questionId1) => {
            saveSidebarForm();

            cy.get(`#${questionId1}`).drag(`#${wizardStepId1}`, { force: true });

            cy.get(`#${wizardStepId1}`).get(`#${questionId1}`).should('exist');
          });
      });
  });

  it('does not allow to move non-wizard-step question to certain place in top level in wizard form type', () => {
    switchFormType();
    closeConfigModal();

    getLabelInput().type('Wizard step 1');

    getIdInput()
      .invoke('val')
      .then((wizardStepId1) => {
        saveSidebarForm();

        addUnorderedFormSubquestion(wizardStepId1);

        createSimpleQuestion('Text Field', 'Text');

        getIdInput()
          .invoke('val')
          .then((questionId1) => {
            saveSidebarForm();

            cy.get(`#${questionId1}`).drag(`[data-testid="item-add-0"]`, { force: true });

            cy.get(`#${wizardStepId1}`).get(`#${questionId1}`).should('exist');
          });
      });
  });

  it('allows to move non-wizard-step question to top level in simple form type', () => {
    closeConfigModal();

    getLabelInput().type('Section');

    getLayoutClassInput().click();
    cy.contains('Section').click();

    getIdInput()
      .invoke('val')
      .then((sectionStepId) => {
        saveSidebarForm();

        addUnorderedFormSubquestion(sectionStepId);

        createSimpleQuestion('Text Field', 'Text');

        getIdInput()
          .invoke('val')
          .then((questionId1) => {
            saveSidebarForm();

            cy.get(`#${questionId1}`).drag(`#question-drop-area`, { force: true });

            cy.get(`#${sectionStepId}`).contains(`#${questionId1}`).should('not.exist');

            getForm().get(`#${questionId1}`).should('exist');
          });
      });
  });

  it('allows to move non-wizard-step question to certain place in top level in simple form type', () => {
    closeConfigModal();

    createSimpleQuestion('Section', 'Section');

    let sectionStepId;
    let questionId1;
    getIdInput()
      .invoke('val')
      .then((val) => {
        sectionStepId = val;

        saveSidebarForm();

        addUnorderedFormSubquestion(sectionStepId);

        createSimpleQuestion('Text Field', 'Text');

        getIdInput()
          .invoke('val')
          .then((val) => {
            questionId1 = val;

            saveSidebarForm();

            cy.get(`#${questionId1}`).drag(`[data-testid="item-add-0"]`, { force: true });

            cy.get(`#${sectionStepId}`).contains(`#${questionId1}`).should('not.exist');

            getForm().get(`#${questionId1}`).should('exist');
          });
      });
  });

  it('transforms wizard-step to section and vice versa if moved to top level', () => {
    switchFormType();
    closeConfigModal();

    getLabelInput().type('Wizard step 1');
    getIdInput()
      .invoke('val')
      .then((wizardStepId1) => {
        saveSidebarForm();

        addNewWizardStepButton().click();

        getLabelInput().type('Wizard step 2');

        getIdInput()
          .invoke('val')
          .then((wizardStepId2) => {
            saveSidebarForm();

            cy.get(`#${wizardStepId1}`).drag(`#${wizardStepId2}`);

            cy.get(`#${wizardStepId1}`).click();
            getLayoutClassInput().contains('Wizard step').should('not.exist');
            getLayoutClassInput().contains('Section');

            cy.get(`#${wizardStepId1}`).drag(`#question-drop-area`, { force: true });

            cy.get(`#${wizardStepId1}`).click();
            getLayoutClassInput().contains('Wizard step');
            getLayoutClassInput().contains('Section');
          });
      });
  });
});
