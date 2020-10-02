import useStyles from './SidebarCreateQuestionTab.styles';
import { AppBar, Tab, Tabs, Typography } from '@material-ui/core';
import React from 'react';

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

  return (
    <AppBar className={styles.appBar} position="static">
      <Tabs variant="fullWidth" value={activeTab} onChange={handleChange}>
        <Tab label="question" />
        <Tab label="Multiple questions" />
      </Tabs>
    </AppBar>
  );
};

export default SidebarCreateQuestionTab;
