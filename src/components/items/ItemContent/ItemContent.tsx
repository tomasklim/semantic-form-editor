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
        <input
          type="text"
          value={'Autocomplete'}
          data-disabled="true"
          readOnly
          tabIndex={-1}
          data-testid="autocomplete"
        />
        <div className={classes.typeaheadArrow} />
      </>
    );
  } else if (FormUtils.isCalendar(question)) {
    if (FormUtils.isDateTime(question)) {
      content = (
        <input
          type="datetime-local"
          defaultValue={'dd/mm/yyyy, --:--'}
          data-disabled="true"
          tabIndex={-1}
          data-testid="datetime-local"
        />
      );
    } else if (FormUtils.isDate(question)) {
      content = <input type="date" defaultValue={'dd/mm/yyyy'} data-disabled="true" tabIndex={-1} data-testid="date" />;
    } else if (FormUtils.isTime(question)) {
      content = <input type="time" defaultValue={'--:--'} data-disabled="true" tabIndex={-1} data-testid="time" />;
    }
  } else if (FormUtils.isCheckbox(question)) {
    content = (
      <div className={classes.checkbox} data-disabled="true" data-testid="checkbox">
        <div />
        Checkbox
      </div>
    );
  } else if (FormUtils.isMaskedInput(question)) {
    content = (
      <input type="text" value={'Masked text'} data-disabled="true" readOnly tabIndex={-1} data-testid="masked-text" />
    );
  } else if (FormUtils.isTextarea(question, '')) {
    content = (
      <textarea rows={2} value={'Text area'} data-disabled="true" readOnly tabIndex={-1} data-testid="text-area" />
    );
  } else {
    content = (
      <input type="text" value={'Text field'} data-disabled="true" readOnly tabIndex={-1} data-testid="text-field" />
    );
  }

  return <CustomisedCardContent className={classes.itemContent}>{content}</CustomisedCardContent>;
};

export default ItemContent;
