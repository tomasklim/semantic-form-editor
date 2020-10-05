import React, { useContext, useEffect } from 'react';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import SidebarCreateQuestionTab, {
  TabPanel
} from '@components/sidebars/SidebarCreateQuestionTab/SidebarCreateQuestionTab';
import SidebarCustomiseQuestion from '@components/sidebars/SidebarCustomiseQuestion/SidebarCustomiseQuestion';
import SidebarCreateQuestions from '@components/sidebars/SidebarCreateQuestions/SidebarCreateQuestions';
import useStyles from './SidebarItemForm.styles';
import classNames from 'classnames';

interface SidebarItemFormProps {}

const SidebarItemForm: React.FC<SidebarItemFormProps> = ({}) => {
  const classes = useStyles();

  const { customisingQuestion, isNewQuestion } = useContext(CustomiseQuestionContext);

  useEffect(() => {
    return setActiveTab(0);
  }, [customisingQuestion]);

  const [activeTab, setActiveTab] = React.useState(0);

  const handleChangeTab = (_: any, activateTab: number) => {
    setActiveTab(activateTab);
  };

  return (
    <>
      {isNewQuestion && <SidebarCreateQuestionTab activeTab={activeTab} handleChange={handleChangeTab} />}

      {customisingQuestion && (
        <div
          className={classNames(classes.questionContainer, { [classes.noBorderTopRadius]: isNewQuestion })}
          id="question-container"
        >
          <TabPanel value={activeTab} index={0}>
            <SidebarCustomiseQuestion />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <SidebarCreateQuestions handleChangeTab={handleChangeTab} />
          </TabPanel>
        </div>
      )}
    </>
  );
};

export default SidebarItemForm;
