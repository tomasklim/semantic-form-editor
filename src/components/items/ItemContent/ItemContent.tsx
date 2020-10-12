import React, { FC } from 'react';
import useStyles from './ItemContent.styles';
import { CustomisedCardContent } from '@styles/CustomisedCardContent';
import { FormStructureQuestion } from '@model/FormStructureQuestion';
import { FormUtils } from 's-forms';

type ItemContentProps = {
  question: FormStructureQuestion;
};

const ItemContent: FC<ItemContentProps> = ({ question }) => {
  const classes = useStyles();

  let content;
  if (FormUtils.isTypeahead(question)) {
    content = (
      <>
        <input type="text" value={'Typeahead'} data-disabled="true" readOnly />
        <div className={classes.typeaheadArrow} />
      </>
    );
  } else if (FormUtils.isCalendar(question)) {
    if (FormUtils.isDateTime(question)) {
      content = <input type="datetime-local" defaultValue={'dd/mm/yyyy, --:--'} data-disabled="true" />;
    } else if (FormUtils.isDate(question)) {
      content = <input type="date" defaultValue={'dd/mm/yyyy'} data-disabled="true" />;
    } else if (FormUtils.isTime(question)) {
      content = <input type="time" defaultValue={'--:--'} data-disabled="true" />;
    }
  } else if (FormUtils.isCheckbox(question)) {
    content = (
      <div className={classes.checkbox} data-disabled="true">
        <div />
        Checkbox
      </div>
    );
  } else if (FormUtils.isMaskedInput(question)) {
    content = <input type="text" value={'Masked Input'} data-disabled="true" readOnly />;
  } else if (FormUtils.isTextarea(question, '')) {
    content = <textarea rows={2} value={'Textarea'} data-disabled="true" readOnly />;
  } else {
    content = <input type="text" value={'Text Input'} data-disabled="true" readOnly />;
  }

  return <CustomisedCardContent className={classes.itemContent}>{content}</CustomisedCardContent>;
};

export default ItemContent;
