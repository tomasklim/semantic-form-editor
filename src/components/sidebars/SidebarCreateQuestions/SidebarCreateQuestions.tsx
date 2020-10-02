import React, { FormEvent, useContext, useState } from 'react';
import { TextField } from '@material-ui/core';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import useStyles from './SidebarCreateQuestions.styles';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { isBoolean, isUndefined } from 'lodash';
import FormTypeSwitch from '@components/mix/FormTypeSwitch/FormTypeSwitch';
import { Constants } from 's-forms';
import { getId } from '@utils/itemHelpers';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

interface SidebarCreateQuestionsProps {
  handleChangeTab: (_: any, newValue: number) => void;
  isWizardlessFormType: boolean;
  handleFormTypeChange: () => void;
}

const NUMBER_OF_SPACES = 2;

const SidebarCreateQuestions: React.FC<SidebarCreateQuestionsProps> = ({
  handleChangeTab,
  isWizardlessFormType,
  handleFormTypeChange
}) => {
  const classes = useStyles();

  const { isWizardless, formStructure } = useContext(FormStructureContext);

  const [multipleQuestions, setMultipleQuestions] = useState<string>('');

  const handleChange = (e: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = e.target as HTMLTextAreaElement;

    setMultipleQuestions(target.value);
  };

  const { onSaveCallback, customisingQuestion, resetCustomisationProcess } = useContext(CustomiseQuestionContext);

  const usedIds: Array<string> = [];
  const createQuestionTree = (array: Array<preparedArray>, level: number): Array<FormStructureQuestion> | null => {
    const currentSpaces = NUMBER_OF_SPACES * level;

    const splitIndexes = array
      .map((obj, index) => (obj.spaces === currentSpaces ? index : null))
      .filter((index) => index !== null);

    if (!splitIndexes.length) {
      return null;
    }

    // @ts-ignore
    const parsedArray = splitIndexes.map((arrayIndex: number, index) => {
      if (index < splitIndexes.length) {
        // @ts-ignore
        return array.slice(arrayIndex, splitIndexes[index + 1]);
      }
    });

    // @ts-ignore
    return parsedArray.map((array: Array<preparedArray>) => {
      const subquestions = createQuestionTree(array, level + 1);
      let id;
      do {
        id = getId(array[0].label);
      } while (formStructure.getNode(id) || usedIds.includes(id));
      usedIds.push(id);

      const layoutClass =
        !isWizardlessFormType && level === 0
          ? [Constants.LAYOUT.WIZARD_STEP, Constants.LAYOUT.QUESTION_SECTION]
          : subquestions
          ? [Constants.LAYOUT.QUESTION_SECTION]
          : [];

      return {
        '@id': id,
        '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
        [Constants.RDFS_LABEL]: array[0].label,
        [Constants.LAYOUT_CLASS]: layoutClass,
        [Constants.HAS_SUBQUESTION]: subquestions || []
      };
    });
  };

  interface preparedArray {
    label: string;
    spaces: number;
  }

  const prepareQuestions = (): Array<FormStructureQuestion> => {
    let result: Array<preparedArray> = multipleQuestions
      .split(/\r?\n/)
      .filter((label) => label)
      .map((label) => ({
        label: label.trimStart().trimEnd(),
        spaces: label.search(/\S/)
      }));

    // @ts-ignore
    return createQuestionTree(result, 0);
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();

    const questions = prepareQuestions();

    if (questions === null) {
      return;
    }

    // @ts-ignore
    onSaveCallback && onSaveCallback(questions);
    resetCustomisationProcess(true);
    handleChangeTab(null, 0);
  };

  const onCancel = () => {
    resetCustomisationProcess();

    handleChangeTab(null, 0);
  };

  if (!customisingQuestion) {
    return null;
  }

  return (
    <form className={classes.form} onSubmit={onSave}>
      {isUndefined(isWizardless) && (
        <FormTypeSwitch isWizardlessFormType={isWizardlessFormType} handleFormTypeChange={handleFormTypeChange} />
      )}

      <TextField
        name="create-questions"
        label="Create questions"
        multiline
        rowsMax={40}
        rows={20}
        variant="outlined"
        value={multipleQuestions}
        onChange={handleChange}
        autoComplete={'off'}
        required
        autoFocus
      />
      <div className={classes.sidebarButtons}>
        <CustomisedButton type="submit" size={'large'} className={classes.saveButton}>
          Save
        </CustomisedButton>
        {isBoolean(isWizardless) && (
          <CustomisedLinkButton onClick={onCancel} size={'large'}>
            Cancel
          </CustomisedLinkButton>
        )}
      </div>
    </form>
  );
};

export default SidebarCreateQuestions;
