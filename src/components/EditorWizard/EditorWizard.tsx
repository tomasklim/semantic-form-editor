import React, { FC } from 'react';
import { ENodeData } from '../../model/ENode';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import useStyles from './EditorWizard.styles';

type Props = {
  question: ENodeData;
  buildTreeList: any;
};

const EditorWizard: FC<Props> = ({ question, buildTreeList }) => {
  const classes = useStyles();
  const relatedQuestions = question[Constants.HAS_SUBQUESTION];

  return (
    <React.Fragment>
      {relatedQuestions &&
        relatedQuestions.map((q) => (
          <ExpansionPanel expanded={true} key={q['@id']}>
            <ExpansionPanelSummary
              // expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{q[Constants.RDFS_LABEL]}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.column}>
              {q[Constants.HAS_SUBQUESTION] &&
                q[Constants.HAS_SUBQUESTION].map((q) => (
                  <ul id={q['@id']} key={q['@id']}>
                    {buildTreeList(q)}
                  </ul>
                ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
    </React.Fragment>
  );
};

export default EditorWizard;
