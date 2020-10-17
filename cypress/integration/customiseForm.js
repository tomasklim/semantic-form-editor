import { Constants } from 's-forms';

const closeConfigModal = () => {
  cy.get('#close-config-modal').click();
};

const openConfigModal = () => {
  cy.get('#config-modal-button').click();
};

const getLabelInput = () => {
  return cy.get('[data-testid="non-localised-label-input"]').first();
};

const getHelpInput = () => {
  return cy.get('[data-testid="non-localised-label-input"]').last();
};

const getLayoutClassInput = () => {
  return cy.get('[data-testid="layout-class-input"]');
};

const saveSidebarForm = () => {
  cy.get('#save-question').click();
};

const getSidebarQuestionForm = () => {
  return cy.get('#customise-question-form');
};

const addUnorderedFormSubquestion = (id) => {
  cy.get(`#${id}`).find('[data-testid="add-subquestion-unordered"]').click();
};

const addUnorderedFormQuestion = () => {
  cy.get(`#add-new-question`).click();
};

const createSimpleQuestion = (label, layout) => {
  getLabelInput().type(label);
  getLayoutClassInput().click();
  cy.contains(new RegExp(`^${layout}$`)).click();
};

describe('Open empty form and customise it', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#new-form-button').click();
    cy.get('#continue-button').click();
  });

  it('creates section in simple form and wizard step is not available', () => {
    closeConfigModal();

    const labelSection = 'Label Section';
    getLabelInput().type(labelSection);

    getLayoutClassInput().click();
    cy.contains('Wizard step').should('not.exist');
    cy.contains('Section').click();

    cy.get('#identification-input')
      .invoke('val')
      .then((val) => {
        const sectionId = val;

        saveSidebarForm();

        getSidebarQuestionForm().should('have.length', 0);

        cy.get(`#${sectionId}`).should('have.length', 1).click();
      });

    getSidebarQuestionForm().should('have.length', 1);
  });

  it('allows to create only wizard steps on top level and section in higher level of form', () => {
    cy.contains('Wizard form').click();
    closeConfigModal();

    const wizardStep1 = 'Label Wizard Step 1';
    getLabelInput().type(wizardStep1);

    getLayoutClassInput().contains('Wizard step');
    getLayoutClassInput().contains('Section');

    cy.get('#identification-input')
      .invoke('val')
      .then((val) => {
        const wizardStepId1 = val;

        saveSidebarForm();

        getSidebarQuestionForm().should('have.length', 0);

        cy.get(`#${wizardStepId1}`).should('have.length', 1).click();

        getSidebarQuestionForm().should('have.length', 1).contains('Label');

        cy.get('#add-new-wizard-step-button').click();

        getLayoutClassInput().contains('Wizard step');
        getLayoutClassInput().contains('Section');

        getLabelInput().type('Wizard');

        cy.get('#identification-input')
          .invoke('val')
          .then((val) => {
            const wizardStepId2 = val;

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

  it('transforms wizard-step to section and vice versa if moved to top level', () => {
    cy.contains('Wizard form').click();
    closeConfigModal();

    getLabelInput().type('Wizard step 1');

    let wizardStepId1;
    let wizardStepId2;
    cy.get('#identification-input')
      .invoke('val')
      .then((val) => {
        wizardStepId1 = val;

        saveSidebarForm();

        cy.get('#add-new-wizard-step-button').click();

        getLabelInput().type('Wizard step 2');

        cy.get('#identification-input')
          .invoke('val')
          .then((val) => {
            wizardStepId2 = val;

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

  it('does not allow to move non-wizard-step question to unordered top level in wizard form type', () => {
    cy.contains('Wizard form').click();
    closeConfigModal();

    getLabelInput().type('Wizard step 1');

    let wizardStepId1;
    let questionId1;
    cy.get('#identification-input')
      .invoke('val')
      .then((val) => {
        wizardStepId1 = val;

        saveSidebarForm();

        addUnorderedFormSubquestion(wizardStepId1);

        createSimpleQuestion('Text Field', 'Text');

        cy.get('#identification-input')
          .invoke('val')
          .then((val) => {
            questionId1 = val;

            saveSidebarForm();

            cy.get(`#${questionId1}`).drag(`#${wizardStepId1}`, { force: true });

            cy.get(`#${wizardStepId1}`).get(`#${questionId1}`).should('exist');
          });
      });
  });

  it('does not allow to move non-wizard-step question to certain place in top level in wizard form type', () => {
    cy.contains('Wizard form').click();
    closeConfigModal();
    //
    getLabelInput().type('Wizard step 1');

    let wizardStepId1;
    let questionId1;
    cy.get('#identification-input')
      .invoke('val')
      .then((val) => {
        wizardStepId1 = val;

        saveSidebarForm();

        addUnorderedFormSubquestion(wizardStepId1);

        createSimpleQuestion('Text Field', 'Text');

        cy.get('#identification-input')
          .invoke('val')
          .then((val) => {
            questionId1 = val;

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

    let sectionStepId;
    let questionId1;
    cy.get('#identification-input')
      .invoke('val')
      .then((val) => {
        sectionStepId = val;

        saveSidebarForm();

        addUnorderedFormSubquestion(sectionStepId);

        createSimpleQuestion('Text Field', 'Text');

        cy.get('#identification-input')
          .invoke('val')
          .then((val) => {
            questionId1 = val;

            saveSidebarForm();

            cy.get(`#${questionId1}`).drag(`#question-drop-area`, { force: true });

            cy.get(`#${sectionStepId}`).contains(`#${questionId1}`).should('not.exist');

            cy.get('#form').get(`#${questionId1}`).should('exist');
          });
      });
  });

  it('allows to move non-wizard-step question to certain place in top level in simple form type', () => {
    closeConfigModal();

    createSimpleQuestion('Section', 'Section');

    let sectionStepId;
    let questionId1;
    cy.get('#identification-input')
      .invoke('val')
      .then((val) => {
        sectionStepId = val;

        saveSidebarForm();

        addUnorderedFormSubquestion(sectionStepId);

        createSimpleQuestion('Text Field', 'Text');

        cy.get('#identification-input')
          .invoke('val')
          .then((val) => {
            questionId1 = val;

            saveSidebarForm();

            cy.get(`#${questionId1}`).drag(`[data-testid="item-add-0"]`, { force: true });

            cy.get(`#${sectionStepId}`).contains(`#${questionId1}`).should('not.exist');

            cy.get('#form').get(`#${questionId1}`).should('exist');
          });
      });
  });

  it('offers to fill labels in selected languages and shows them correctly', () => {
    cy.get('[data-testid="languages-autocomplete"').click();

    cy.contains('cs').click();

    cy.get('[data-testid="languages-autocomplete"] input').type('ue').type('{downarrow}{enter}');

    closeConfigModal();

    cy.get('[data-testid="localised-input-cs"]').first().type('Czech');
    cy.get('[data-testid="localised-input-ue"]').first().type('Ukrainian');

    getLayoutClassInput().click();
    cy.contains(new RegExp(`^Text$`)).click();

    cy.get('#identification-input')
      .invoke('val')
      .then((questionId) => {
        saveSidebarForm();

        cy.get(`#${questionId}`).click();

        cy.get('[data-testid="localised-input-cs"]').first().should('have.value', 'Czech');
        cy.get('[data-testid="localised-input-ue"]').first().should('have.value', 'Ukrainian');
      });
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
    cy.contains('Wizard form').click();

    closeConfigModal();

    getLabelInput().type('Wizard Step');
    cy.get('#identification-input')
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

  it('allows to specify custom attribute of question', () => {
    closeConfigModal();

    createSimpleQuestion('Text', 'Text');

    cy.get('#identification-input')
      .invoke('val')
      .then((textQuestionId) => {
        getHelpInput().type('Heelp!');

        cy.get('[data-testid="add-new-attribute"]').click();
        // saveSidebarForm();
        cy.get('[data-testid="custom-attribute-input"]').click();
        cy.contains('has-unit').click();

        cy.get('#custom-attribute-value').type('mm');

        cy.get('#add-custom-attribute').click();

        saveSidebarForm();

        cy.get(`#${textQuestionId}`).click('top');

        getHelpInput().should('have.value', 'Heelp!');
        cy.get(`[name="${Constants.HAS_UNIT}"]`).should('have.value', 'mm');
      });
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
    cy.contains('Wizard form').click();

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

  it('allows to specify possible values of typeahead question', () => {
    closeConfigModal();

    createSimpleQuestion('Typeahead', 'Typeahead');

    cy.get('#add-options').should('have.text', 'Add options - 0 available');
    cy.get('#add-options').click();
    cy.get('#options-modal').find('#empty-options');

    cy.get('#add-new-option-button').click();

    cy.get('[data-testid="option-0"]').type('Option 1');

    cy.get('#add-new-option-button').click();
    cy.get('#add-new-option-button').click();

    cy.get('[data-testid="option-1"]').type('Option 2');
    cy.get('[data-testid="option-2"]').type('Option 3');

    cy.get('#close-options-modal').click();
    cy.get('#add-options').should('have.text', 'Add options - 3 available');
    cy.get('#add-options').click();

    cy.get('#options-modal').find('[data-testid="option-2"]').should('have.value', 'Option 3');

    cy.get('#options-modal').find('[data-testid="option-2-delete"]').click();
    cy.get('#options-modal').find('[data-testid="option-2"]').should('not.exist');
    cy.get('#close-options-modal').click();

    cy.get('#add-options').should('have.text', 'Add options - 2 available');

    saveSidebarForm();

    cy.get('[data-testid="item-type-ahead"]').click('top');
    cy.get('#add-options').should('have.text', 'Add options - 2 available');
  });

  it('allows to specify possible values of typeahead question in more languages', () => {
    cy.get('[data-testid="languages-autocomplete"').click();

    cy.contains('cs').click();
    cy.get('[data-testid="languages-autocomplete"] input').type('ue').type('{downarrow}{enter}');

    closeConfigModal();

    getLayoutClassInput().click();
    cy.contains(new RegExp(`^Typeahead$`)).click();

    cy.get('#add-options').should('have.text', 'Add options - 0 available');
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
    cy.get('#add-options').should('have.text', 'Add options - 3 available');
    cy.get('#add-options').click();

    cy.get('#options-modal').find('[data-testid="option-2-cs"]').should('have.value', 'Option 3 CS');
    cy.get('#options-modal').find('[data-testid="option-2-ue"]').should('have.value', 'Option 3 UE');

    cy.get('#options-modal').find('[data-testid="option-2-delete"]').click();
    cy.get('#options-modal').find('[data-testid="option-2-ue"]').should('not.exist');
  });

  it('allows to modify source code during customisation of form', () => {
    closeConfigModal();

    cy.get('#edit-in-code').should('be.disabled');

    createSimpleQuestion('Text', 'Text');
    saveSidebarForm();

    cy.get('#edit-in-code').click();

    cy.get('.jsoneditor').should('exist');
    cy.get('#validate-form').should('exist');
    cy.get('#save-changes').should('exist');
    cy.get('#reset-changes').should('exist');
    cy.get('#edit-in-editor-button').click();

    cy.get('#form').should('exist');
  });
});

describe('Open simple form and customise it', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('#import-form-button').attachFile('simpleForm.json');

    cy.get('#continue-button').click();
  });

  it('transforms simple form without non-section questions to wizard form and vice versa', () => {
    openConfigModal();

    cy.get('#transform-form-type').click();

    cy.get('#which-animals-do-you-know').click('top');

    getLayoutClassInput().contains('Wizard step').should('exist');
    getLayoutClassInput().contains('Section').should('exist');

    openConfigModal();
    cy.get('#transform-form-type').click();

    cy.get('#which-animals-do-you-know').click('top');

    getLayoutClassInput().contains('Wizard step').should('not.exist');
    getLayoutClassInput().contains('Section').should('exist');
  });

  it('transforms simple form with non-section questions to wizard form and vice versa', () => {
    addUnorderedFormQuestion();
    createSimpleQuestion('Text', 'Text');
    saveSidebarForm();

    openConfigModal();

    cy.get('#transform-form-type').click();

    cy.get('#which-animals-do-you-know').click('top');

    getLayoutClassInput().contains('Wizard step').should('not.exist');
    getLayoutClassInput().contains('Section').should('exist');

    cy.get('[data-testid="item-wizard-step"').should('exist').click('top');
    getLayoutClassInput().contains('Wizard step').should('exist');
    getLayoutClassInput().contains('Section').should('exist');

    cy.get('#identification-input')
      .invoke('val')
      .then((wizardStepId) => {
        openConfigModal();
        cy.get('#transform-form-type').click();

        cy.get(`#${wizardStepId}`).click('top');

        getLayoutClassInput().contains('Wizard step').should('not.exist');
        getLayoutClassInput().contains('Section').should('exist');
      });
  });

  it('allows to duplicate question and delete the old one', () => {
    cy.get('li').should('have.length', 4);

    cy.get('#which-animals-do-you-know').find('[data-testid="menu-header"]').first().click();

    cy.contains('Duplicate question').click();

    cy.get('li').should('have.length', 8);

    cy.get(`li[id^="which-animals-do-you-know"]`).should('have.length', 2);

    cy.get('#which-animals-do-you-know').find('[data-testid="menu-header"]').first().click();

    cy.contains('Delete question').click();

    cy.get('li').should('have.length', 4);

    cy.get('#which-animals-do-you-know').should('not.exist');
  });

  it('allows to order questions within its parent question by drag and drop api and highlights question on indicator click', () => {
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

describe('Open wizard form and customise it', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('#import-form-button').attachFile('wizzardFormWithAttributes.json');

    cy.get('#continue-button').click();
  });

  it('moves to preview if user clicks on comment indicator', () => {
    cy.get('[data-testid="comment-indicator"]').click();

    cy.get('#preview-form').should('exist');
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

  it('allows to fill values to form', () => {
    cy.get('.MuiStepper-root').contains('Preview').click();

    cy.get('[placeholder="YYYY"]').type('1995');

    cy.get('#add-values-to-form').click();

    cy.get('.MuiStepper-root').contains('Customise').click();
    cy.get('.MuiStepper-root').contains('Preview').click();

    cy.get('[placeholder="YYYY"]').should('have.value', 1995);
  });

  it('allows to configure form language in preview', () => {
    cy.get('.MuiStepper-root').contains('Preview').click();

    cy.get('#form-type-switch').should('exist');

    cy.get('#preview-form').contains('Magazines').should('exist');

    cy.get('#preview-form').contains('Zeitschriften').should('not.exist');

    cy.get('#language-select').select('de');

    cy.get('#preview-form').contains('Zeitschriften').should('exist');

    cy.get('#preview-form').contains('Magazines').should('not.exist');
  });

  it('exports renders correctly', () => {
    cy.get('.MuiStepper-root').contains('Export').click();

    cy.get('#copy-to-clipboard-button').should('exist');
    cy.get('#download-button').should('exist');
    cy.get('.jsoneditor').should('exist');
  });

  it('navigates to first step from export on start over button click', () => {
    cy.get('.MuiStepper-root').contains('Export').click();

    cy.get('#reset-button').click();

    cy.get('.MuiStepper-root').find('button').should('have.length', 4);
    cy.get('.MuiStepper-root').find('button:disabled').should('have.length', 3);
    cy.get('.MuiStepper-root').find('button:not([disabled])').should('have.length', 1).contains('New / Import');
  });
});
