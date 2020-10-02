import useStyles from './SidebarCreateQuestionTab.styles';
import { Tab, Tabs, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';

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
    {value === index && <Typography>{children}</Typography>}
  </div>
);

const SidebarCreateQuestionTab: React.FC<SidebarCreateQuestionTabProps> = ({ activeTab, handleChange }) => {
  const styles = useStyles();

  const { isSpecificPosition } = useContext(CustomiseQuestionContext);

  return (
    <Tabs className={styles.appBar} variant="fullWidth" value={activeTab} onChange={handleChange}>
      <Tab label="question" />
      <Tab label="Multiple questions" disabled={isSpecificPosition} />
    </Tabs>
  );
};

export default SidebarCreateQuestionTab;
