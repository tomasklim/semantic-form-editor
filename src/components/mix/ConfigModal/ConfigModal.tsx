import React from 'react';
import useStyles from './ConfigModal.styles';
import SettingsIcon from '@material-ui/icons/Settings';
import { Modal, TextField } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import FormTypeSwitch from '@components/mix/FormTypeSwitch/FormTypeSwitch';
import { CustomisedButton } from '@styles/CustomisedButton';

const filter = createFilterOptions<string>();

const ConfigModal = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleOpenConfigModal = () => {
    setOpen(!open);
  };

  const modalBody = (
    <div className={classes.paper}>
      <h2>Configure your form</h2>
      <Autocomplete
        multiple
        id="tags-standard"
        options={['cs', 'de', 'en']}
        getOptionLabel={(option) => option}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push(params.inputValue);
          }

          return filtered;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Form languages (optional)"
            placeholder="Choose or type your own language"
          />
        )}
      />
      <FormTypeSwitch />
      <div className={classes.buttons}>
        <CustomisedButton type="submit" size={'large'} onClick={handleOpenConfigModal}>
          Close
        </CustomisedButton>
      </div>
    </div>
  );

  return (
    <div>
      <SettingsIcon className={classes.config} onClick={handleOpenConfigModal} />
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleOpenConfigModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {modalBody}
      </Modal>
    </div>
  );
};

export default ConfigModal;
