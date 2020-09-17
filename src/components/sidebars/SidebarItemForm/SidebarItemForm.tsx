import React, { FormEvent, useContext } from 'react';
import { Checkbox, FormControl, FormControlLabel, InputLabel, Select, TextField } from '@material-ui/core';
import { Constants, FormUtils } from 's-forms';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import useStyles from './SidebarItemForm.styles';
import { getId } from '@utils/itemHelpers';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { CustomiseItemContext } from '@contexts/CustomiseItemContext';

interface SidebarItemFormProps {}

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
    } else if (name === Constants.LAYOUT.COLLAPSED) {
      const layoutClass = itemData![Constants.LAYOUT_CLASS]!;

      if (layoutClass.includes(Constants.LAYOUT.COLLAPSED)) {
        layoutClass.splice(layoutClass.indexOf(Constants.LAYOUT.COLLAPSED), 1);
      } else {
        layoutClass.push(Constants.LAYOUT.COLLAPSED);
      }

      setItemData({ ...itemData!, [Constants.LAYOUT_CLASS]: layoutClass });
    } else {
      setItemData({ ...itemData!, [name]: value });
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
                value={itemData[Constants.LAYOUT_CLASS]![0] || ''}
                onChange={handleChange}
                inputProps={{
                  name: Constants.LAYOUT_CLASS,
                  id: 'layout-type'
                }}
              >
                <option aria-label="None" value="" />
                <option value={'type-ahead'}>Typeahead</option>
                <option value={'textarea'}>Textarea</option>
                <option value={'textfield'}>Text Input</option>
                <option value={'section'}>Section</option>
                <option value={'date'}>Date</option>
                <option value={'time'}>Time</option>
                <option value={'datetime'}>Datetime</option>
                <option value={'masked-input'}>Masked Input</option>
                <option value={'checkbox'}>Checkbox</option>
              </Select>
            </FormControl>
          )}
          <FormControlLabel
            control={
              <Checkbox
                name={(Constants.REQUIRES_ANSWER as unknown) as string}
                onChange={handleChange}
                checked={itemData[Constants.REQUIRES_ANSWER] || false}
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
          <TextField
            name={(Constants.HELP_DESCRIPTION as unknown) as string}
            label="Help description"
            variant="outlined"
            value={itemData[Constants.HELP_DESCRIPTION] || ''}
            onChange={handleChange}
            autoComplete={'off'}
            multiline
          />

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
      {!itemData && <div className={classes.newItemDataContainer}>TODO: Hint: Did you know...?</div>}
    </>
  );
};

export default SidebarItemForm;
