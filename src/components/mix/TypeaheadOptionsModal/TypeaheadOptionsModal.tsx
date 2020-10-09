import React, { useContext } from 'react';
import useStyles from './TypeaheadOptionsModal.styles';
import { Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import { CustomisedButton } from '@styles/CustomisedButton';
import { EditorContext } from '@contexts/EditorContext';
import { CustomisedOutlineButton } from '@styles/CustomisedOutlineButton';
import { FormStructureQuestion, LanguageObject } from '@model/FormStructureQuestion';
import { createJsonLanguageValue, getIntl } from '@utils/formHelpers';
import { Constants } from 's-forms';
// @ts-ignore
import JsonLdUtils from 'jsonld-utils';
import { createFakeChangeEvent } from '@utils/itemHelpers';

// TODO
interface TypeaheadOptionsModalProps {
  question: FormStructureQuestion;
  handleChange: any;
}

const TypeaheadOptionsModal: React.FC<TypeaheadOptionsModalProps> = ({ question, handleChange }) => {
  const classes = useStyles();

  const { languages } = useContext(EditorContext);

  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpenConfigModal = () => {
    setOpen(!open);
  };

  const languagesOptions = [...languages];
  if (!languagesOptions.length) {
    languagesOptions.push('default');
  }

  const options = question[Constants.HAS_OPTION];

  if (!options) {
    const fakeEvent = createFakeChangeEvent(Constants.HAS_OPTION, []);

    handleChange(fakeEvent);

    return null;
  }

  const modalBody = (
    <div className={classes.paper}>
      <h3>Typeahead options</h3>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell key={'none'} align="center">
                #
              </TableCell>
              {languagesOptions.map((lang) => (
                <TableCell key={lang} align="center">
                  {lang}
                </TableCell>
              ))}
              <TableCell key={'delete'} align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell style={{ color: 'white' }}>{index + 1}</TableCell>
                  {languagesOptions.map((lang) => {
                    const intl = getIntl(lang);
                    let optionLabel = option[Constants.RDFS_LABEL];

                    const value = JsonLdUtils.getLocalized(optionLabel, intl);

                    return (
                      <TableCell key={lang} align={'center'} style={{ color: 'white' }}>
                        <TextField
                          variant={'outlined'}
                          value={value}
                          onChange={(e) => {
                            const target = e.target;

                            if (lang === 'default') {
                              option[Constants.RDFS_LABEL] = target.value;
                            } else {
                              const availableLanguage =
                                Array.isArray(optionLabel) &&
                                optionLabel.find((language: LanguageObject) => language['@language'] === lang);

                              // field already have value in this language
                              if (availableLanguage) {
                                availableLanguage['@value'] = target.value;
                              } else {
                                // language have to be added
                                if (!Array.isArray(optionLabel)) {
                                  optionLabel = [];
                                }

                                const languageObject = createJsonLanguageValue(lang!, target.value);

                                optionLabel.push(languageObject);
                              }
                            }

                            const fakeEvent = createFakeChangeEvent(Constants.HAS_OPTION, options);

                            handleChange(fakeEvent);
                          }}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell
                    style={{ color: 'white' }}
                    onClick={() => {
                      const opt = options.filter((optionI) => optionI !== option);

                      const fakeEvent = createFakeChangeEvent(Constants.HAS_OPTION, opt);

                      handleChange(fakeEvent);
                    }}
                  >
                    DELETE
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <span
          onClick={() => {
            options.push({
              '@id': Math.floor(Math.random() * 10000000 + 1) + '',
              [Constants.RDFS_LABEL]: []
            });

            const fakeEvent = createFakeChangeEvent(Constants.HAS_OPTION, options);

            handleChange(fakeEvent);
          }}
        >
          Add new option
        </span>
      </TableContainer>
      <div className={classes.buttons}>
        <CustomisedButton type="submit" size={'large'} onClick={handleOpenConfigModal}>
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
      >
        Add options manually
      </CustomisedOutlineButton>
      {open && (
        <Modal className={classes.modal} open={open} onClose={handleOpenConfigModal} id={'typeahead-modal'}>
          {modalBody}
        </Modal>
      )}
    </div>
  );
};

export default TypeaheadOptionsModal;
