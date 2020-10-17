import { FormControl, InputLabel, Select } from '@material-ui/core';
import React, { Dispatch, SetStateAction, useContext } from 'react';
import useStyles from './PreviewConfig.styles';
import WizardOrientationSwitch from '@components/mix/WizardOrientationSwitch/WizardOrientationSwitch';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { EditorContext } from '@contexts/EditorContext';

import { getIntl } from '@utils/formHelpers';
import { Constants, Intl } from 's-forms';

interface PreviewConfigProps {
  horizontalWizardNav: boolean;
  setHorizontalWizardNav: Dispatch<SetStateAction<boolean>>;
  intl: Intl;
  setIntl: Dispatch<SetStateAction<Intl>>;
}

const PreviewConfig: React.FC<PreviewConfigProps> = ({
  horizontalWizardNav,
  setHorizontalWizardNav,
  intl,
  setIntl
}) => {
  const classes = useStyles();

  const { isWizardless, formStructure } = useContext(FormStructureContext);
  const { languages } = useContext(EditorContext);

  const handleWizardTypeChange = () => {
    setHorizontalWizardNav(!horizontalWizardNav);
  };

  return (
    <div className={classes.previewConfig}>
      {!isWizardless && formStructure.getRoot().data[Constants.HAS_SUBQUESTION].length > 1 && (
        <WizardOrientationSwitch
          handleWizardTypeChange={handleWizardTypeChange}
          horizontalWizardNav={horizontalWizardNav}
        />
      )}
      {languages.length > 1 ? (
        <FormControl>
          <InputLabel>Language</InputLabel>
          <Select
            native
            value={intl?.locale}
            onChange={(e) => setIntl(getIntl((e.target.value as unknown) as string))}
            id="language-select"
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {language.toUpperCase()}
              </option>
            ))}
          </Select>
        </FormControl>
      ) : null}
    </div>
  );
};

export default PreviewConfig;
