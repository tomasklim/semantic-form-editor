import { FC, useContext, useEffect, useRef, useState } from 'react';
import SForms, { Constants, Intl, SOptions } from 's-forms';
import { exportForm } from '@utils/index';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { FormStructureContext } from '@contexts/FormStructureContext';
import useStyles from './EditorPreview.styles';
import { EditorContext } from '@contexts/EditorContext';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datepicker/dist/react-datepicker.css';
import 's-forms/css/s-forms.min.css';
import PreviewConfig from '@components/mix/PreviewConfig/PreviewConfig';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import { FormStructureQuestion } from '@model/FormStructureQuestion';

const fetchTypeaheadValuesMock = (_: string): Promise<object> => {
  const possibleValues = require('@data/possibleValuesMock.json');

  return new Promise((resolve) => setTimeout(() => resolve(possibleValues), 1500));
};

interface EditorPreviewProps {}

const EditorPreview: FC<EditorPreviewProps> = ({}) => {
  const classes = useStyles();

  // @ts-ignore
  const sforms = useRef<HTMLDivElement>(null);

  const { formContext, getClonedFormStructure, setFormStructure } = useContext(FormStructureContext);
  const { SFormsConfig, intl } = useContext(EditorContext);

  const [form, setForm] = useState<JsonLdObj>();
  const [horizontalWizardNav, setHorizontalWizardNav] = useState<boolean>(true);
  const [intlPreview, setIntlPreview] = useState<Intl>(intl);

  useEffect(() => {
    async function getExportedForm() {
      const formStructure = getClonedFormStructure();

      const exportedForm = await exportForm(formStructure, formContext);

      setForm(exportedForm);
    }

    getExportedForm();
  }, []);

  const handleAddValuesToForm = () => {
    // @ts-ignore
    if (sforms.current?.getFormQuestionsData) {
      const formStructure = getClonedFormStructure();

      const addQuestionAnswer = (question: FormStructureQuestion) => {
        const questionNode = formStructure.getNode(question['@id']);

        if (!questionNode) return;

        if (
          question[Constants.HAS_ANSWER] &&
          question[Constants.HAS_ANSWER].length > 0 &&
          question[Constants.HAS_ANSWER][0][Constants.HAS_DATA_VALUE]
        ) {
          const answer = question[Constants.HAS_ANSWER][0];

          questionNode.data[Constants.HAS_ANSWER] = [
            {
              '@id': 'answer-' + Math.floor(Math.random() * 10000000 + 1),
              '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/answer',
              ...answer,
              [Constants.HAS_DATA_VALUE]: answer[Constants.HAS_DATA_VALUE]
            }
          ];
        }

        if (question[Constants.HAS_SUBQUESTION]) {
          question[Constants.HAS_SUBQUESTION].forEach((subquestion: FormStructureQuestion) => {
            addQuestionAnswer(subquestion);
          });
        }
      };
      // @ts-ignore
      const formData = sforms.current.getFormQuestionsData();

      formData.forEach((question: FormStructureQuestion) => addQuestionAnswer(question));

      setFormStructure(formStructure);
    }
  };
  const options: SOptions = {
    modalView: false,
    horizontalWizardNav,
    wizardStepButtons: false,
    enableForwardSkip: true,
    startingQuestionId: SFormsConfig.startingQuestionId
  };

  if (intl) {
    options.intl = intlPreview;
  }

  if (!form) {
    return null;
  }

  return (
    <div className={classes.previewContainer}>
      <PreviewConfig
        horizontalWizardNav={horizontalWizardNav}
        setHorizontalWizardNav={setHorizontalWizardNav}
        intl={intlPreview}
        setIntl={setIntlPreview}
      />
      <SForms ref={sforms} form={form} options={options} fetchTypeAheadValues={fetchTypeaheadValuesMock} />
      <div className={classes.buttons}>
        <CustomisedOutlineButton variant="outlined" size={'large'} onClick={handleAddValuesToForm}>
          Save values to form
        </CustomisedOutlineButton>
      </div>
    </div>
  );
};

export default EditorPreview;
