import React, { useContext, useEffect } from 'react';
import useStyles from './ConfigModal.styles';
import SettingsIcon from '@material-ui/icons/Settings';
import { Modal, TextField } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import FormTypeSwitch from '@components/mix/FormTypeSwitch/FormTypeSwitch';
import { CustomisedButton } from '@styles/CustomisedButton';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { EditorContext } from '@contexts/EditorContext';
import { union } from 'lodash';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import { NavigationContext } from '@contexts/NavigationContext';
import { CustomiseQuestionContext } from '@contexts/CustomiseQuestionContext';

const filter = createFilterOptions<string>();

const LANGUAGE_OPTIONS = ['cs', 'de', 'en'];

const ConfigModal = () => {
  const classes = useStyles();

  const { isEmptyFormStructure } = useContext(FormStructureContext);
  const { resetCustomiseQuestionContext } = useContext(CustomiseQuestionContext);
  const { languages, setLanguages } = useContext(EditorContext);
  const { showFormConfigurationModal, setShowFormConfigurationModal } = useContext(NavigationContext);

  const [open, setOpen] = React.useState(isEmptyFormStructure && !showFormConfigurationModal);

  const mergedLanguagesOptions = union(LANGUAGE_OPTIONS, languages);

  useEffect(() => setShowFormConfigurationModal(true), []);

  const handleOpenConfigModal = () => {
    setOpen(!open);
    if (!isEmptyFormStructure) {
      resetCustomiseQuestionContext();
    }
  };

  const modalBody = (
    <div className={classes.paper}>
      <h3>Form Configuration</h3>
      <FormTypeSwitch cloneConfigModal={handleOpenConfigModal} />
      <Autocomplete
        multiple
        options={mergedLanguagesOptions}
        value={languages}
        data-testid="languages-autocomplete"
        onChange={(_, value) => setLanguages(value)}
        getOptionLabel={(option) => option}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '' && !options.includes(params.inputValue)) {
            filtered.push(params.inputValue);
          }

          return filtered;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Form languages (optional)"
            placeholder="Choose or type your own language"
          />
        )}
      />
      <div className={classes.buttons}>
        <CustomisedButton type="submit" size={'large'} onClick={handleOpenConfigModal} id="close-config-modal">
          Continue
        </CustomisedButton>
      </div>
    </div>
  );

  return (
    <div>
      <CustomisedOutlineButton
        variant="outlined"
        className={classes.configButton}
        title={'Form configuration'}
        onClick={handleOpenConfigModal}
        id="config-modal-button"
      >
        <SettingsIcon />
      </CustomisedOutlineButton>
      {open && (
        <Modal className={classes.modal} open={open} onClose={handleOpenConfigModal}>
          {modalBody}
        </Modal>
      )}
    </div>
  );
};

export default ConfigModal;
