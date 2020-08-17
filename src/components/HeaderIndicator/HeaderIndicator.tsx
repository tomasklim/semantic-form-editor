import useStyles from './HeaderIndicator.styles';
import { Badge, Tooltip } from '@material-ui/core';
import { FormStructureQuestion } from '../../model/FormStructureQuestion';
import { FC } from 'react';
import { Constants } from 's-forms';

type Props = {
  question: FormStructureQuestion;
};

const HeaderIndicator: FC<Props> = ({ question }) => {
  const classes = useStyles();

  return (
    <span className={classes.headerIndicators}>
      {question[Constants.REQUIRES_ANSWER] && (
        <div>
          <Tooltip title="Required" arrow>
            <Badge variant="dot" className={classes.required} />
          </Tooltip>
        </div>
      )}
      {question[Constants.HAS_PRECEDING_QUESTION] && (
        <div>
          <Tooltip title="Preceding question" arrow>
            <Badge variant="dot" className={classes.preceding} />
          </Tooltip>
        </div>
      )}
    </span>
  );
};

export default HeaderIndicator;
