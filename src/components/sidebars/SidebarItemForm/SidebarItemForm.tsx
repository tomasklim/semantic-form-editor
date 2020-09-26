import React, { FormEvent, useContext } from 'react';
import { Checkbox, FormControl, FormControlLabel, InputLabel, Select, TextField } from '@material-ui/core';
import { Constants, FormUtils } from 's-forms';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import useStyles from './SidebarItemForm.styles';
import { getId } from '@utils/itemHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseItemContext } from '@contexts/CustomiseItemContext';
import { createJsonAttValue, getJsonAttValue } from '@utils/formHelpers';
import FormCustomAttributeList from '@components/sidebars/FormCustomAttributeList/FormCustomAttributeList';

interface SidebarItemFormProps {}

const TEXT_FIELD = 'text';

const layoutTypeOptions = [
  { value: Constants.LAYOUT.QUESTION_SECTION, title: 'Section' },
  { value: TEXT_FIELD, title: 'Text Input' },
  { value: Constants.LAYOUT.QUESTION_TYPEAHEAD, title: 'Typeahead' },
  { value: Constants.LAYOUT.TEXTAREA, title: 'Textarea' },
  { value: Constants.LAYOUT.DATE, title: 'Date' },
  { value: Constants.LAYOUT.TIME, title: 'Time' },
  { value: Constants.LAYOUT.DATETIME, title: 'Datetime' },
  { value: Constants.LAYOUT.MASKED_INPUT, title: 'Masked Input' },
  { value: Constants.LAYOUT.CHECKBOX, title: 'Checkbox' }
];

// no section
const layoutTypeFields = [
  TEXT_FIELD,
  Constants.LAYOUT.QUESTION_TYPEAHEAD,
  Constants.LAYOUT.TEXTAREA,
  Constants.LAYOUT.DATE,
  Constants.LAYOUT.TIME,
  Constants.LAYOUT.DATETIME,
  Constants.LAYOUT.MASKED_INPUT,
  Constants.LAYOUT.CHECKBOX
];

const SidebarItemForm: React.FC<SidebarItemFormProps> = ({}) => {
  const classes = useStyles();

  const { formStructure } = useContext(FormStructureContext);

  const { onSaveCallback, itemData, reset, setItemData, isNew } = useContext(CustomiseItemContext);

  const handleChange = (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    // @ts-ignore
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === ((Constants.RDFS_LABEL as unknown) as string)) {
      let id = itemData!['@id'];
      if (isNew) {
        do {
          id = getId(value);
        } while (formStructure.getNode(id));
      }

      setItemData({
        ...itemData!,
        [Constants.RDFS_LABEL]: value,
        '@id': id
      });
    } else if (name === ((Constants.LAYOUT_CLASS as unknown) as string)) {
      setItemData({ ...itemData!, [Constants.LAYOUT_CLASS]: [value] });
    } else if (name === Constants.LAYOUT.COLLAPSED || name === Constants.LAYOUT.DISABLED) {
      const layoutClass = itemData![Constants.LAYOUT_CLASS]!;

      if (layoutClass.includes(name)) {
        layoutClass.splice(layoutClass.indexOf(name), 1);
      } else {
        layoutClass.push(name);
      }

      setItemData({ ...itemData!, [Constants.LAYOUT_CLASS]: layoutClass });
    } else if (name === ((Constants.REQUIRES_ANSWER as unknown) as string)) {
      if (!value) {
        setItemData({ ...itemData!, [name]: null });
      } else {
        const requiresAttribute = createJsonAttValue(value, Constants.XSD.BOOLEAN);

        setItemData({ ...itemData!, [name]: requiresAttribute });
      }
    } else {
      try {
        const fieldValue = JSON.parse(value);
        setItemData({ ...itemData!, [name]: fieldValue });
      } catch (_) {
        setItemData({ ...itemData!, [name]: value });
      }
    }
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    const newItem = { ...itemData! };

    onSaveCallback && onSaveCallback(newItem);
    reset();
  };

  const onCancel = () => {
    reset();
  };

  const findLayoutTypeOfQuestion = () => {
    let layoutClasses = itemData && itemData[Constants.LAYOUT_CLASS];

    if (isNew && layoutClasses && !layoutClasses.length) {
      return '';
    }

    if (!layoutClasses || !layoutClasses.length) {
      return TEXT_FIELD;
    }

    if (FormUtils.isWizardStep(itemData)) {
      return Constants.LAYOUT.WIZARD_STEP;
    }

    if (layoutClasses.length === 1 && layoutClasses[0] === Constants.LAYOUT.QUESTION_SECTION) {
      return Constants.LAYOUT.QUESTION_SECTION;
    }

    const layoutType = layoutClasses.filter((layoutClass) => layoutTypeFields.includes(layoutClass));

    if (!layoutType.length && FormUtils.isSection(itemData)) {
      return Constants.LAYOUT.QUESTION_SECTION;
    }

    if (!layoutType.length) {
      console.warn(`Question with id: ${itemData?.['@id']} does not have any defined layout type!`);
      return TEXT_FIELD;
    }

    return layoutType[0];
  };

  const layoutType = findLayoutTypeOfQuestion();

  return (
    <>
      {itemData && (
        <form className={classes.newItemDataContainer} onSubmit={onSave}>
          <TextField name="@id" label="Identification" variant="outlined" value={itemData['@id'] || ' '} disabled />
          <TextField
            name={(Constants.RDFS_LABEL as unknown) as string}
            label="Label"
            variant="outlined"
            value={itemData[Constants.RDFS_LABEL] || ''}
            onChange={handleChange}
            autoComplete={'off'}
            autoFocus
            required
          />
          {!FormUtils.isWizardStep(itemData) && (
            <FormControl variant="outlined">
              <InputLabel htmlFor="layout-type">Layout type</InputLabel>
              <Select
                native
                label="Layout type"
                value={layoutType || ''}
                onChange={handleChange}
                inputProps={{
                  name: Constants.LAYOUT_CLASS,
                  id: 'layout-type'
                }}
              >
                <option aria-label="None" value="" />
                {layoutTypeOptions.map((layoutType) => (
                  <option key={layoutType.value} value={layoutType.value}>
                    {layoutType.title}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
          {FormUtils.isMaskedInput(itemData) && (
            <TextField
              name={(Constants.INPUT_MASK as unknown) as string}
              label="Input mask"
              variant="outlined"
              value={itemData[Constants.INPUT_MASK] || ''}
              onChange={handleChange}
              autoComplete={'off'}
              required
            />
          )}
          {FormUtils.isTypeahead(itemData) && (
            <TextField
              name={(Constants.HAS_OPTIONS_QUERY as unknown) as string}
              label="Options query"
              variant="outlined"
              value={itemData[Constants.HAS_OPTIONS_QUERY] || ''}
              onChange={handleChange}
              autoComplete={'off'}
              required
            />
          )}

          <TextField
            name={(Constants.HELP_DESCRIPTION as unknown) as string}
            label="Help description"
            variant="outlined"
            value={itemData[Constants.HELP_DESCRIPTION] || ''}
            onChange={handleChange}
            autoComplete={'off'}
            multiline
          />

          <FormControlLabel
            control={
              <Checkbox
                name={(Constants.REQUIRES_ANSWER as unknown) as string}
                onChange={handleChange}
                checked={getJsonAttValue(itemData, Constants.REQUIRES_ANSWER) || false}
              />
            }
            label="Required"
          />
          {!FormUtils.isWizardStep(itemData) && FormUtils.isSection(itemData) && (
            <FormControlLabel
              control={
                <Checkbox
                  name={Constants.LAYOUT.COLLAPSED}
                  onChange={handleChange}
                  checked={itemData[Constants.LAYOUT_CLASS]?.includes(Constants.LAYOUT.COLLAPSED)}
                />
              }
              label="Collapsed"
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                name={Constants.LAYOUT.DISABLED}
                onChange={handleChange}
                checked={itemData[Constants.LAYOUT_CLASS]?.includes(Constants.LAYOUT.DISABLED)}
              />
            }
            label="Disabled"
          />

          <FormCustomAttributeList itemData={itemData} setItemData={setItemData} handleChange={handleChange} />

          <div className={classes.sidebarButtons}>
            <CustomisedButton type="submit" size={'large'} className={classes.saveButton}>
              Save
            </CustomisedButton>
            <CustomisedLinkButton onClick={onCancel} size={'large'}>
              Cancel
            </CustomisedLinkButton>
          </div>
        </form>
      )}
      {/*!itemData && <div className={classes.newItemDataContainer}>TODO: Hint: Did you know...?</div>*/}
    </>
  );
};

export default SidebarItemForm;
