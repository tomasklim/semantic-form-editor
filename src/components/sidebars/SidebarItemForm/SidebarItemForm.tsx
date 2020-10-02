import React, { useContext } from 'react';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import SidebarCreateQuestionTab, {
  TabPanel
} from '@components/sidebars/SidebarCreateQuestionTab/SidebarCreateQuestionTab';
import SidebarCustomiseQuestion from '@components/sidebars/SidebarCustomiseQuestion/SidebarCustomiseQuestion';
import SidebarCreateQuestions from '@components/sidebars/SidebarCreateQuestions/SidebarCreateQuestions';
import { isUndefined } from 'lodash';
import { FormStructureContext } from '@contexts/FormStructureContext';
// import useStyles from './SidebarItemForm.styles';

interface SidebarItemFormProps {}

const SidebarItemForm: React.FC<SidebarItemFormProps> = ({}) => {
  // const classes = useStyles();

  const { customisingQuestion, isNewQuestion } = useContext(CustomiseQuestionContext);
  const { isWizardless } = useContext(FormStructureContext);

  const [value, setValue] = React.useState(0);

  const handleChangeTab = (_: any, newValue: number) => {
    setValue(newValue);
  };

  const [isWizardlessFormType, setIsWizardlessFormType] = React.useState<boolean>(true);

  const handleFormTypeChange = () => {
    setIsWizardlessFormType(!isWizardlessFormType);
  };

  //isUndefined(isWizardless)
  return (
    <>
      {isNewQuestion && <SidebarCreateQuestionTab activeTab={value} handleChange={handleChangeTab} />}

      {customisingQuestion && (
        <>
          <TabPanel value={value} index={0}>
            <SidebarCustomiseQuestion
              isWizardlessFormType={isWizardlessFormType}
              handleFormTypeChange={handleFormTypeChange}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SidebarCreateQuestions
              handleChangeTab={handleChangeTab}
              isWizardlessFormType={isWizardlessFormType}
              handleFormTypeChange={handleFormTypeChange}
            />
          </TabPanel>
        </>
      )}
    </>
  );
};

export default SidebarItemForm;
