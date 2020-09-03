import React, { FC } from 'react';
import useStyles from './ItemContent.styles';
import { CustomisedCardContent } from '@styles/CustomisedCardContent';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { FormUtils } from 's-forms';
import { Checkbox, InputLabel, Select } from '@material-ui/core';
import { CustomisedTextField } from '@styles/CustomisedTextField';
import { CustomisedFormControl } from '@styles/CustomisedFormControl';
import { CustomisedFormControlLabel } from '@styles/CustomisedFormControlLabel';

type ItemContentProps = {
  questionData: FormStructureQuestion;
};

const ItemContent: FC<ItemContentProps> = ({ questionData }) => {
  const classes = useStyles();

  let content;
  if (FormUtils.isTypeahead(questionData)) {
    content = (
      <CustomisedFormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">Typeahead</InputLabel>
        <Select labelId="demo-simple-select-outlined-label" label="Age" />
      </CustomisedFormControl>
    );
  } else if (FormUtils.isCalendar(questionData)) {
    if (FormUtils.isDateTime(questionData)) {
      content = <CustomisedTextField type="datetime-local" variant="outlined" />;
    } else if (FormUtils.isDate(questionData)) {
      content = <CustomisedTextField type="date" variant="outlined" />;
    } else if (FormUtils.isTime(questionData)) {
      content = <CustomisedTextField type="time" variant="outlined" />;
    }
  } else if (FormUtils.isCheckbox(questionData)) {
    content = <CustomisedFormControlLabel control={<Checkbox />} label="Checkbox" />;
  } else if (FormUtils.isMaskedInput(questionData)) {
    content = <CustomisedTextField variant="outlined" value="Masked Input" />;
  } else if (FormUtils.isTextarea(questionData, '')) {
    content = <CustomisedTextField multiline variant="outlined" rows={2} value="Textarea" />;
  } else {
    content = <CustomisedTextField variant="outlined" value="Text Input" />;
  }

  return <CustomisedCardContent className={classes.itemContent}>{content}</CustomisedCardContent>;
};

export default ItemContent;
