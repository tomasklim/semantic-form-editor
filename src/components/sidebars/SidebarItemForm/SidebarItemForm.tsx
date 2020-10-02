import React, { useContext, useEffect } from 'react';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import SidebarCreateQuestionTab, {
  TabPanel
} from '@components/sidebars/SidebarCreateQuestionTab/SidebarCreateQuestionTab';
import SidebarCustomiseQuestion from '@components/sidebars/SidebarCustomiseQuestion/SidebarCustomiseQuestion';
import SidebarCreateQuestions from '@components/sidebars/SidebarCreateQuestions/SidebarCreateQuestions';
// import useStyles from './SidebarItemForm.styles';

interface SidebarItemFormProps {}

const SidebarItemForm: React.FC<SidebarItemFormProps> = ({}) => {
  // const classes = useStyles();

  const { customisingQuestion, isNewQuestion } = useContext(CustomiseQuestionContext);

  useEffect(() => {
    return setActiveTab(0);
  }, [customisingQuestion]);

  const [activeTab, setActiveTab] = React.useState(0);

  const handleChangeTab = (_: any, activateTab: number) => {
    setActiveTab(activateTab);
  };

  const [isWizardlessFormType, setIsWizardlessFormType] = React.useState<boolean>(true);

  const handleFormTypeChange = () => {
    setIsWizardlessFormType(!isWizardlessFormType);
  };

  return (
    <>
      {isNewQuestion && <SidebarCreateQuestionTab activeTab={activeTab} handleChange={handleChangeTab} />}

      {customisingQuestion && (
        <>
          <TabPanel value={activeTab} index={0}>
            <SidebarCustomiseQuestion
              isWizardlessFormType={isWizardlessFormType}
              handleFormTypeChange={handleFormTypeChange}
            />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
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
