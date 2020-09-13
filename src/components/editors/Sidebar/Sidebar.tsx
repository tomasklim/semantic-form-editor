import { Drawer, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import useStyles from './Sidebar.styles';
import React, { useContext, useEffect, useState } from 'react';
import { CustomiseItemContext } from '@contexts/CustomiseItemContext';
import { Constants, FormUtils } from 's-forms';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { getId } from '@utils/itemHelpers';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';

// Header + Stepper
const INITIAL_TOP = 60 + 88;

const Sidebar = () => {
  const classes = useStyles();

  const [drawerTop, setDrawerTop] = useState<number>(INITIAL_TOP);
  const { formStructure } = useContext(FormStructureContext);
  const { onSaveCallback, itemData, reset, setItemData, isNew } = useContext(CustomiseItemContext);

  // sidebar top position
  useEffect(() => {
    document.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;

      if (scrollTop >= 0) {
        const drawerTop = INITIAL_TOP - scrollTop;
        setDrawerTop(drawerTop > 0 ? drawerTop : 0);
      }
    });
  }, []);

  const handleChange = (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    // @ts-ignore
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === 'label') {
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
    }

    if (name === 'layout') {
      setItemData({ ...itemData!, [Constants.LAYOUT_CLASS]: [value] });
    }
  };

  const onSave = () => {
    const newItem = { ...itemData! };

    onSaveCallback && onSaveCallback(newItem);
    reset();
  };

  const onCancel = () => {
    reset();
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      anchor="right"
      classes={{
        paper: classes.drawerPaper
      }}
      style={{
        top: `${drawerTop}px`
      }}
    >
      {itemData && (
        <form className={classes.newItemDataContainer}>
          <TextField name="id" label="Identification" variant="outlined" value={itemData['@id'] || ' '} disabled />
          <TextField
            name="label"
            label="Label"
            variant="outlined"
            value={itemData[Constants.RDFS_LABEL] || ''}
            onChange={handleChange}
            autoComplete={'off'}
          />
          {!FormUtils.isWizardStep(itemData) && (
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Layout type</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                name="layout"
                value={itemData[Constants.LAYOUT_CLASS]![0] || ''}
                onChange={handleChange}
                label="Layout type"
              >
                <MenuItem value={'type-ahead'}>Typeahead</MenuItem>
                <MenuItem value={'textarea'}>Textarea</MenuItem>
                <MenuItem value={'textfield'}>Text Input</MenuItem>
                <MenuItem value={'section'}>Section</MenuItem>
                <MenuItem value={'date'}>Date</MenuItem>
                <MenuItem value={'time'}>Time</MenuItem>
                <MenuItem value={'datetime'}>Datetime</MenuItem>
                <MenuItem value={'masked-input'}>Masked Input</MenuItem>
                <MenuItem value={'checkbox'}>Checkbox</MenuItem>
              </Select>
            </FormControl>
          )}
          <div className={classes.sidebarButtons}>
            <CustomisedButton onClick={onSave} size={'large'}>
              Save
            </CustomisedButton>
            <CustomisedLinkButton onClick={onCancel} size={'large'} className={''}>
              Cancel
            </CustomisedLinkButton>
          </div>
        </form>
      )}
    </Drawer>
  );
};

export default Sidebar;
