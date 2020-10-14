import React, { FormEvent, useContext, useState } from 'react';
import { TextField } from '@material-ui/core';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import useStyles from './SidebarCreateQuestions.styles';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import { Constants } from 's-forms';
import { getUniqueId } from '@utils/itemHelpers';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { EditorContext } from '@contexts/EditorContext';
import { createJsonLanguageValue } from '@utils/formHelpers';

interface SidebarCreateQuestionsProps {
  handleChangeTab: (_: any, newValue: number) => void;
}

interface ParsedLabelsWithSpaces {
  label: string;
  spaces: number;
}

const NUMBER_OF_SPACES = 2;

const SidebarCreateQuestions: React.FC<SidebarCreateQuestionsProps> = ({ handleChangeTab }) => {
  const classes = useStyles();

  const { isWizardless, formStructure, isEmptyFormStructure } = useContext(FormStructureContext);
  const { onSaveCallback, customisingQuestion, resetCustomiseQuestionContext } = useContext(CustomiseQuestionContext);
  const { languages } = useContext(EditorContext);

  const [multipleQuestions, setMultipleQuestions] = useState<string>('');

  const handleChange = (e: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = e.target as HTMLTextAreaElement;

    setMultipleQuestions(target.value);
  };

  const usedIds: Array<string> = [];
  // use conquer and divide method to create new questions
  const createQuestionTree = (
    parsedLabels: Array<ParsedLabelsWithSpaces>,
    level: number
  ): Array<FormStructureQuestion> | null => {
    const currentSpaces = NUMBER_OF_SPACES * level;

    // find indexes where to split array to create small arrays of parent and its children (subquestions)
    const splitIndexes = parsedLabels
      .map((obj, index) => (obj.spaces === currentSpaces ? index : null))
      .filter((index) => index !== null);

    if (!splitIndexes.length) {
      return null;
    }

    // split arrays by indexes
    // @ts-ignore
    const splitLabelArrays = splitIndexes.map((arrayIndex: number, index) => {
      if (index < splitIndexes.length) {
        // @ts-ignore
        return parsedLabels.slice(arrayIndex, splitIndexes[index + 1]);
      }
    });

    // @ts-ignore
    return splitLabelArrays.map((array: Array<ParsedLabelsWithSpaces>) => {
      const subquestions = createQuestionTree(array, level + 1);
      let id = getUniqueId(array[0].label, formStructure);

      usedIds.push(id);

      const layoutClass =
        !isWizardless && level === 0
          ? [Constants.LAYOUT.WIZARD_STEP, Constants.LAYOUT.QUESTION_SECTION]
          : subquestions
          ? [Constants.LAYOUT.QUESTION_SECTION]
          : [];

      const label = languages.length ? [createJsonLanguageValue(languages[0], array[0].label)] : array[0].label;

      return {
        '@id': id,
        '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
        [Constants.RDFS_LABEL]: label,
        [Constants.LAYOUT_CLASS]: layoutClass,
        [Constants.HAS_SUBQUESTION]: subquestions || []
      };
    });
  };

  const createQuestions = (): Array<FormStructureQuestion> | null => {
    const parsedLabelsWithSpaces: Array<ParsedLabelsWithSpaces> = multipleQuestions
      .split(/\r?\n/)
      .filter((label) => label)
      .map((label) => ({
        label: label.trimStart().trimEnd(),
        spaces: label.search(/\S/)
      }));

    return createQuestionTree(parsedLabelsWithSpaces, 0);
  };

  const onAdd = (e: FormEvent) => {
    e.preventDefault();

    const questions = createQuestions();

    if (questions === null) {
      return;
    }

    // @ts-ignore
    onSaveCallback && onSaveCallback(questions);
    handleChangeTab(null, 0);

    resetCustomiseQuestionContext();
  };

  const onCancel = () => {
    resetCustomiseQuestionContext();

    handleChangeTab(null, 0);
  };

  if (!customisingQuestion) {
    return null;
  }

  return (
    <form className={classes.form} onSubmit={onAdd}>
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
          Add
        </CustomisedButton>
        {!isEmptyFormStructure && (
          <CustomisedLinkButton onClick={onCancel} size={'large'}>
            Cancel
          </CustomisedLinkButton>
        )}
      </div>
    </form>
  );
};

export default SidebarCreateQuestions;
