import { FormControl, InputLabel, Select } from '@material-ui/core';
import React, { Dispatch, SetStateAction, useContext } from 'react';
import useStyles from './PreviewConfig.styles';
import WizardOrientationSwitch from '@components/mix/WizardOrientationSwitch/WizardOrientationSwitch';
import { FormStructureContext } from '@contexts/FormStructureContext';
import { EditorContext } from '@contexts/EditorContext';
import { IIntl } from '@interfaces/index';
import { getIntl } from '@utils/formHelpers';

interface PreviewConfigProps {
  horizontalWizardNav: boolean;
  setHorizontalWizardNav: Dispatch<SetStateAction<boolean>>;
  intl: IIntl;
  setIntl: Dispatch<SetStateAction<IIntl>>;
}

const PreviewConfig: React.FC<PreviewConfigProps> = ({
  horizontalWizardNav,
  setHorizontalWizardNav,
  intl,
  setIntl
}) => {
  const classes = useStyles();

  const { isWizardless } = useContext(FormStructureContext);
  const { languages } = useContext(EditorContext);

  const handleWizardTypeChange = () => {
    setHorizontalWizardNav(!horizontalWizardNav);
  };

  return (
    <div className={classes.previewConfig}>
      {!isWizardless && (
        <WizardOrientationSwitch
          handleWizardTypeChange={handleWizardTypeChange}
          horizontalWizardNav={horizontalWizardNav}
        />
      )}
      {languages.length && (
        <FormControl>
          <InputLabel>Language</InputLabel>
          <Select native value={intl?.locale} onChange={(e) => setIntl(getIntl((e.target.value as unknown) as string))}>
            {languages.map((language) => (
              <option value={language}>{language.toUpperCase()}</option>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default PreviewConfig;
