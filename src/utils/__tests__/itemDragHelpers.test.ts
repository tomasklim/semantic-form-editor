import FormStructureNode from '@model/FormStructureNode';
import { GRAND_CHILD_1, QUESTION } from '../../../__mock__';
import { isSectionOrWizardStep } from '@utils/itemDragHelpers';
import { Constants } from 's-forms';

describe('isSectionOrWizardStep', () => {
  it('returns true for section ', () => {
    const sectionNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.LAYOUT_CLASS]: [Constants.LAYOUT.QUESTION_SECTION]
    });

    expect(isSectionOrWizardStep(sectionNode)).toBeTruthy();
  });

  it('returns true for wizard-step ', () => {
    const wizardStepNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.LAYOUT_CLASS]: [Constants.LAYOUT.WIZARD_STEP, Constants.LAYOUT.QUESTION_SECTION]
    });

    expect(isSectionOrWizardStep(wizardStepNode)).toBeTruthy();
  });

  it('returns false for non-section and non-wizard-step questions ', () => {
    const textNode = new FormStructureNode(null, { ...GRAND_CHILD_1 });
    const maskedInputNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.LAYOUT_CLASS]: [Constants.LAYOUT.MASKED_INPUT]
    });
    const checkboxInputNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.LAYOUT_CLASS]: [Constants.LAYOUT.CHECKBOX]
    });
    const textareaNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.LAYOUT_CLASS]: [Constants.LAYOUT.TEXTAREA]
    });
    const collapsedNode = new FormStructureNode(null, {
      ...QUESTION,
      [Constants.LAYOUT_CLASS]: [Constants.LAYOUT.COLLAPSED]
    });

    expect(isSectionOrWizardStep(textNode)).toBeFalsy();
    expect(isSectionOrWizardStep(maskedInputNode)).toBeFalsy();
    expect(isSectionOrWizardStep(checkboxInputNode)).toBeFalsy();
    expect(isSectionOrWizardStep(textareaNode)).toBeFalsy();
    expect(isSectionOrWizardStep(collapsedNode)).toBeFalsy();
  });
});
