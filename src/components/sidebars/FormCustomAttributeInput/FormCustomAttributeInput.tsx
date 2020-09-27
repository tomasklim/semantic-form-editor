import React, { Dispatch, SetStateAction, useContext, useRef } from 'react';
import useStyles from './FormCustomAttributeInput.styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { FORM_STRUCTURE_QUESTION_ATTRIBUTES } from '@model/FormStructureQuestion';
import { createFakeChangeEvent, createJsonAttIdValue } from '@utils/formHelpers';
import { isString } from 'lodash';

interface FormCustomAttributeInputProps {
  handleChange: (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => void;
  setShowCustomAttribute: Dispatch<SetStateAction<boolean>>;
}

const FormCustomAttributeInput: React.FC<FormCustomAttributeInputProps> = ({
  handleChange,
  setShowCustomAttribute
}) => {
  const classes = useStyles();

  const [customAttributeName, setCustomAttributeName] = React.useState<JsonLdContextAttribute | null>(null);
  const [customAttributeValue, setCustomAttributeValue] = React.useState<string>('');

  const customAttValueName = useRef<HTMLInputElement>(null);
  const customAttValueEl = useRef<HTMLInputElement>(null);

  const { formContext } = useContext(FormStructureContext);

  const parseContextAttributes = () => {
    return Object.entries(formContext)
      .filter(([_, value]) => value['@id'] && !FORM_STRUCTURE_QUESTION_ATTRIBUTES.includes(value['@id']))
      .map(([key, value]) => ({
        title: key,
        id: value['@id']
      }));
  };

  const contextAttributes: JsonLdContextAttribute[] = parseContextAttributes();

  const handleChangeCustomAttributeName = (
    _: React.ChangeEvent<{}>,
    customAttribute: string | { id: string; title: string }
  ) => {
    if (isString(customAttribute)) {
      setCustomAttributeName({
        id: customAttribute
      });
    } else if (customAttribute && customAttribute.id) {
      setCustomAttributeName({
        id: customAttribute.id,
        title: customAttribute.title
      });
    }
  };

  const addGenericAttribute = () => {
    // check HTML5 required validation
    if (!customAttValueEl.current!.checkValidity() || !customAttValueName.current!.checkValidity()) {
      customAttValueEl.current!.reportValidity();
      customAttValueName.current!.reportValidity();
      return;
    }

    let value: any = customAttributeValue;
    if (customAttributeName?.title) {
      // @ts-ignore
      const contextAttribute = formContext[customAttributeName?.title];
      if (contextAttribute && contextAttribute['@type'] && contextAttribute['@type'] === '@id') {
        value = createJsonAttIdValue(customAttributeValue);
      }
    }

    const fakeEvent: any = createFakeChangeEvent(customAttributeName!.id, value);

    handleChange(fakeEvent);
    setShowCustomAttribute(false);
  };

  return (
    <div className={classes.customAttributeContainer}>
      <span className={classes.addNewAttributeTitle}>New custom attribute</span>
      <Autocomplete
        // @ts-ignore
        value={customAttributeName}
        // @ts-ignore
        onChange={handleChangeCustomAttributeName}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={contextAttributes}
        getOptionLabel={(option) => option.id}
        renderOption={(option) => option.title}
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus
            required
            label="Custom attribute"
            variant="outlined"
            inputRef={customAttValueName}
          />
        )}
        disableClearable
      />
      <TextField
        label="Custom attribute value"
        variant="outlined"
        onChange={(e) => {
          setCustomAttributeValue(e.target.value);
        }}
        inputRef={customAttValueEl}
        value={customAttributeValue}
        required
      />
      <div className={classes.addNewAttributeButtons}>
        <CustomisedButton type="submit" size={'small'} onClick={addGenericAttribute}>
          Add
        </CustomisedButton>
        <CustomisedLinkButton
          onClick={(e) => {
            e.preventDefault();
            setShowCustomAttribute(false);
          }}
          size={'small'}
        >
          Close
        </CustomisedLinkButton>
      </div>
    </div>
  );
};

interface JsonLdContextAttribute {
  title?: string;
  id: string;
}

export default FormCustomAttributeInput;
