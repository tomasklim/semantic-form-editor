import { Drawer, FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import useStyles from './Sidebar.styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
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

  const sidebarContainer = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // @ts-ignore
      if (!sidebarContainer.current?.contains(e.target)) {
        reset();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarContainer, reset]);

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
      ref={sidebarContainer}
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
              <InputLabel htmlFor="layout-type">Layout type</InputLabel>
              <Select
                native
                name="layout"
                label="Layout type"
                value={itemData[Constants.LAYOUT_CLASS]![0] || ''}
                onChange={handleChange}
                inputProps={{
                  name: 'layout',
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
          <div className={classes.sidebarButtons}>
            <CustomisedButton onClick={onSave} size={'large'} className={classes.saveButton}>
              Save
            </CustomisedButton>
            <CustomisedLinkButton onClick={onCancel} size={'large'} className={''}>
              Cancel
            </CustomisedLinkButton>
          </div>
        </form>
      )}
      {!itemData && <div className={classes.emptySidebar}>Hint: Did you know...?</div>}
    </Drawer>
  );
};

export default Sidebar;
