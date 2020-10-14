import {
  buildFormStructure,
  createJsonAttIdValue,
  createJsonAttValue,
  createJsonLocalisedValue,
  editLocalisedLabel,
  exportForm,
  findFormLanguages,
  getIntl,
  sortRelatedQuestions,
  transformToSimpleForm,
  transformToWizardForm
} from '@utils/formHelpers';
import { Constants } from 's-forms';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { QUESTION } from '../../../__mock__';

describe('buildFormStructure', () => {
  it('builds correct form structure from file consisting of two questions and root', async () => {
    const form = require('../../../__mock__/wizardStepForm.json');

    const formStructure = await buildFormStructure(form);

    expect(formStructure.getRoot().data['@id']).toEqual('root');
    expect(formStructure.structure.size).toBe(3);

    const textQuestion = {
      '@id': 'text',
      '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
      [Constants.HAS_SUBQUESTION]: [],
      [Constants.LAYOUT_CLASS]: ['text'],
      [Constants.RDFS_LABEL]: 'Test text'
    };

    const wizardStepQuestion = {
      '@id': 'wizard-step',
      '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
      [Constants.HAS_SUBQUESTION]: [textQuestion],
      [Constants.LAYOUT_CLASS]: ['wizard-step', 'section'],
      [Constants.RDFS_LABEL]: 'Test section'
    };

    const formQuestion = {
      '@id': 'root',
      '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
      [Constants.HAS_SUBQUESTION]: [wizardStepQuestion],
      [Constants.LAYOUT_CLASS]: ['form'],
      [Constants.RDFS_LABEL]: 'form'
    };

    expect(formStructure.getNode('root')!.data).toEqual(formQuestion);

    expect(formStructure.getNode('wizard-step')!.data).toEqual(wizardStepQuestion);

    expect(formStructure.getNode('text')!.data).toEqual(textQuestion);
  });
});

describe('exportForm', () => {
  it('exports correct form build from two questions and root', async () => {
    const form = require('../../../__mock__/wizardStepForm.json');

    const formStructure = await buildFormStructure(form);

    const exportedForm = await exportForm(formStructure, form['@context']);

    expect(exportedForm).toEqual(form);
  });
});

describe('findFormLanguages', () => {
  it('finds no languages in form without languages', async () => {
    const form = require('../../../__mock__/wizardStepForm.json');

    const formStructure = await buildFormStructure(form);

    const languages = findFormLanguages(formStructure);

    expect(languages.length).toEqual(0);
  });

  it('finds english and czech languages in form', async () => {
    const localisedForm = require('../../../__mock__/localisedSimpleForm.json');

    const formStructure = await buildFormStructure(localisedForm);

    const languages = findFormLanguages(formStructure);

    expect(languages.length).toEqual(2);
    expect(languages).toEqual(['en', 'cs']);
  });
});

describe('sortRelatedQuestions', () => {
  it('sorts correctly questions non-localised questions', async () => {
    const form = require('../../../__mock__/simpleForm.json');

    const formStructure = await buildFormStructure(form);

    const section = formStructure.getNode('which-animals-do-you-know')?.data;

    const sortedQuestions = sortRelatedQuestions(section![Constants.HAS_SUBQUESTION], {});

    expect(sortedQuestions.length).toEqual(3);

    expect(sortedQuestions[0]['@id']).toEqual('antelope');
    expect(sortedQuestions[1]['@id']).toEqual('baobab');
    expect(sortedQuestions[2]['@id']).toEqual('cuttlefish');
  });

  it('sorts correctly questions with preceding questions', async () => {
    const form = require('../../../__mock__/simpleFormPrecedingQuestions.json');

    const formStructure = await buildFormStructure(form);

    const section = formStructure.getNode('which-animals-do-you-know')?.data;

    const sortedQuestions = sortRelatedQuestions(section![Constants.HAS_SUBQUESTION], {});

    expect(sortedQuestions.length).toEqual(3);

    expect(sortedQuestions[2]['@id']).toEqual('antelope');
    expect(sortedQuestions[1]['@id']).toEqual('baobab');
    expect(sortedQuestions[0]['@id']).toEqual('cuttlefish');
  });

  it('sorts correctly localised question', async () => {
    const form = require('../../../__mock__/localisedSimpleForm.json');

    const formStructure = await buildFormStructure(form);

    const section = formStructure.getNode('which-animals-do-you-know')?.data;

    const sortedQuestions = sortRelatedQuestions(section![Constants.HAS_SUBQUESTION], getIntl('cs'));

    expect(sortedQuestions.length).toEqual(3);

    expect(sortedQuestions[2]['@id']).toEqual('antelope');
    expect(sortedQuestions[1]['@id']).toEqual('baobab');
    expect(sortedQuestions[0]['@id']).toEqual('cuttlefish');
  });
});

describe('createJsonAttValue', () => {
  it('returns json with attribute value', () => {
    const result = createJsonAttValue('Test', 'xsd:boolean');

    expect(result).toEqual({
      '@type': 'xsd:boolean',
      '@value': 'Test'
    });
  });
});

describe('createJsonAttIdValue', () => {
  it('returns json with attribute value', () => {
    const result = createJsonAttIdValue('test-id');

    expect(result).toEqual({
      '@id': 'test-id'
    });
  });
});

describe('createJsonLocalisedValue', () => {
  it('returns json with localised value', () => {
    const result = createJsonLocalisedValue('en', 'test');

    expect(result).toEqual({
      '@language': 'en',
      '@value': 'test'
    });
  });
});

describe('getIntl', () => {
  it('returns empty object if language is not defined', () => {
    const result = getIntl('');

    expect(result).toEqual({});
  });

  it('returns intl object', () => {
    const result = getIntl('en');

    expect(result).toEqual({
      locale: 'en'
    });
  });
});

describe('transformToSimpleForm', () => {
  it('transforms wizard form to simple form', async () => {
    const wizardForm = require('../../../__mock__/wizardStepForm.json');

    const formStructure = await buildFormStructure(wizardForm);

    transformToSimpleForm(formStructure);

    const section = formStructure.getNode('wizard-step');

    expect(section?.data[Constants.LAYOUT_CLASS]).toEqual([Constants.LAYOUT.QUESTION_SECTION]);
  });
});

describe('transformToWizardForm', () => {
  it('transforms simple form with only section question on top level position to wizard', async () => {
    const form = require('../../../__mock__/simpleForm.json');

    const formStructure = await buildFormStructure(form);

    transformToWizardForm(formStructure);

    formStructure.structure.forEach((node) => {
      if (node.data['@id'] === 'which-animals-do-you-know') {
        expect(node?.data[Constants.LAYOUT_CLASS]).toEqual([
          Constants.LAYOUT.WIZARD_STEP,
          Constants.LAYOUT.QUESTION_SECTION
        ]);
      } else {
        expect(node?.data[Constants.LAYOUT_CLASS]).not.toEqual([
          Constants.LAYOUT.WIZARD_STEP,
          Constants.LAYOUT.QUESTION_SECTION
        ]);
      }
    });
  });

  it('transforms simple form with simple question on top level position to wizard', async () => {
    const form = require('../../../__mock__/localisedSimpleForm.json');

    const formStructure = await buildFormStructure(form);

    transformToWizardForm(formStructure);

    const wizardStepQuestion = formStructure.getRoot().data[Constants.HAS_SUBQUESTION][0];

    wizardStepQuestion[Constants.HAS_SUBQUESTION].forEach((question: FormStructureQuestion) => {
      expect(question[Constants.LAYOUT_CLASS].includes(Constants.LAYOUT.WIZARD_STEP)).toBeFalsy();
    });

    expect(wizardStepQuestion[Constants.LAYOUT_CLASS]).toEqual([
      Constants.LAYOUT.QUESTION_SECTION,
      Constants.LAYOUT.WIZARD_STEP
    ]);
  });
});

describe('editLocalisedLabel', () => {
  it('edits localised label correctly if was not defined before', async () => {
    const question = { ...QUESTION };

    editLocalisedLabel('en', 'Test', question, Constants.RDFS_LABEL);

    expect(question[Constants.RDFS_LABEL]).toEqual([{ '@language': 'en', '@value': 'Test' }]);
  });

  it('edits localised label correctly if was defined before', async () => {
    const question = { ...QUESTION };

    editLocalisedLabel('en', 'Test', question, Constants.RDFS_LABEL);
    editLocalisedLabel('de', 'Test!', question, Constants.RDFS_LABEL);

    expect(question[Constants.RDFS_LABEL]).toEqual([
      { '@language': 'en', '@value': 'Test' },
      { '@language': 'de', '@value': 'Test!' }
    ]);

    editLocalisedLabel('de', 'label', question, Constants.RDFS_LABEL);

    expect(question[Constants.RDFS_LABEL]).toEqual([
      { '@language': 'en', '@value': 'Test' },
      { '@language': 'de', '@value': 'label' }
    ]);
  });
});
