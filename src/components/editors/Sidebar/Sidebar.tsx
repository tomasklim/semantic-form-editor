import { Button, Drawer, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import useStyles from './Sidebar.styles';
import React, { useContext, useEffect, useState } from 'react';
import { CustomiseItemContext } from '@contexts/CustomiseItemContext';
import { Constants } from 's-forms';

// Header + Stepper
const INITIAL_TOP = 60 + 88;

const Sidebar = () => {
  const classes = useStyles();

  const [drawerTop, setDrawerTop] = useState<number>(INITIAL_TOP);

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

  const { onSaveCallback, itemData, reset, setItemData } = useContext(CustomiseItemContext);

  const handleChange = (event: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    // @ts-ignore
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === 'label') {
      setItemData({
        ...itemData,
        [Constants.RDFS_LABEL]: value,
        '@id': value + Math.floor(Math.random() * 10000)
      });
    }

    if (name === 'layout') {
      setItemData({ ...itemData, [Constants.LAYOUT_CLASS]: [value] });
    }
  };

  const onSave = () => {
    const newItem = { ...itemData };

    onSaveCallback(newItem);
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
          <TextField name="id" label="Identification" variant="outlined" value={itemData['@id'] || ''} disabled />
          <TextField
            name="label"
            label="Label"
            variant="outlined"
            value={itemData[Constants.RDFS_LABEL] || ''}
            onChange={handleChange}
          />
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">Layout type</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              name="layout"
              value={itemData[Constants.LAYOUT_CLASS][0] || ''}
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
          <Button onClick={onSave}>Save</Button>
        </form>
      )}
    </Drawer>
  );
};

export default Sidebar;
