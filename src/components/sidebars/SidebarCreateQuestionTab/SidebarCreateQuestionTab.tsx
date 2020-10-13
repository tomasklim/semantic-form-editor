import useStyles from './SidebarCreateQuestionTab.styles';
import { Tab, Tabs, Tooltip } from '@material-ui/core';
import React, { useContext } from 'react';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';
import HelpIcon from '@material-ui/icons/Help';

interface SidebarCreateQuestionTabProps {
  activeTab: number;
  handleChange: (_: React.ChangeEvent<{}>, newValue: number) => void;
}

interface TabPanelProps {
  children: JSX.Element;
  value: number;
  index: number;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`nav-tabpanel-${index}`}>
    {value === index && children}
  </div>
);

const SidebarCreateQuestionTab: React.FC<SidebarCreateQuestionTabProps> = ({ activeTab, handleChange }) => {
  const styles = useStyles();

  const { isSpecificPosition } = useContext(CustomiseQuestionContext);

  return (
    <Tabs className={styles.appBar} variant="fullWidth" value={activeTab} onChange={handleChange}>
      <Tab label="one question" />
      <Tab
        tabIndex={0}
        label={
          <>
            <span>Multiple questions</span>&nbsp;
            <Tooltip
              title={
                isSpecificPosition ? (
                  'To be able to add multiple questions, choose to add unordered question'
                ) : (
                  <>
                    Add multiple questions to the form.
                    <br />
                    To create questions, type each question label on a new line.
                    <br /> For subquestion use 2 spaces. Multiple nesting is allowed.
                  </>
                )
              }
              enterDelay={500}
            >
              <HelpIcon fontSize={'small'} />
            </Tooltip>
          </>
        }
        disabled={isSpecificPosition}
      />
    </Tabs>
  );
};

export default SidebarCreateQuestionTab;
