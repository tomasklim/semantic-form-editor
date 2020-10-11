import React, { useContext, useEffect } from 'react';
import useStyles from './TypeaheadOptionsModal.styles';
import {
  Link,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import { CustomisedButton } from '@styles/CustomisedButton';
import { EditorContext } from '@contexts/EditorContext';
import { FormStructureQuestion, LanguageObject } from '@model/FormStructureQuestion';
import { editLocalisedLabel, getIntl } from '@utils/formHelpers';
import { Constants } from 's-forms';
import { createFakeChangeEvent } from '@utils/itemHelpers';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import DeleteIcon from '@material-ui/icons/Delete';
// @ts-ignore
import JsonLdUtils from 'jsonld-utils';
import AddIcon from '@material-ui/icons/Add';

interface TypeaheadOptionsModalProps {
  question: FormStructureQuestion;
  handleChange: (e: React.ChangeEvent | React.ChangeEvent<{ value: unknown }>) => void;
}

interface TypeaheadOption {
  '@id': string;
  // @ts-ignore
  [Constants.RDFS_LABEL]: string | Array<LanguageObject>;
  [key: string]: any;
}

const TypeaheadOptionsModal: React.FC<TypeaheadOptionsModalProps> = ({ question, handleChange }) => {
  const classes = useStyles();

  const { languages } = useContext(EditorContext);

  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpenConfigModal = () => {
    setOpen(!open);
  };

  const options = question[Constants.HAS_OPTION];

  useEffect(() => {
    if (!options) {
      const fakeEvent = createFakeChangeEvent(Constants.HAS_OPTION, []);

      handleChange(fakeEvent);
    }
  }, []);

  if (!options) {
    return null;
  }

  const handleDeleteOption = (options: Array<TypeaheadOption>, option: TypeaheadOption) => {
    const opt = options.filter((optionToCompare: TypeaheadOption) => optionToCompare !== option);

    const fakeEvent = createFakeChangeEvent(Constants.HAS_OPTION, opt);

    handleChange(fakeEvent);
  };

  const getTableLanguageCell = (option: TypeaheadOption, label: string, index: string, lang?: string) => {
    return (
      <TableCell key={index} align={'center'} style={{ color: 'white' }}>
        <TextField
          variant={'outlined'}
          value={label || ''}
          onChange={(e) => {
            const target = e.target;

            if (!lang) {
              option[Constants.RDFS_LABEL] = target.value;
            } else {
              editLocalisedLabel(lang, target.value, option, Constants.RDFS_LABEL);
            }

            const fakeEvent = createFakeChangeEvent(Constants.HAS_OPTION, options);

            handleChange(fakeEvent);
          }}
        />
      </TableCell>
    );
  };

  const modalBody = (
    <div className={classes.paper}>
      <h3>Typeahead options</h3>
      {options.length ? (
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell key="order" align="center">
                  #
                </TableCell>
                {languages.map((lang) => (
                  <TableCell key={lang} align="center">
                    {lang}
                  </TableCell>
                ))}
                {!languages.length && (
                  <TableCell key="label" align="center">
                    Label
                  </TableCell>
                )}
                <TableCell key="actions" align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {options.map((option: TypeaheadOption, index: number) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index + 'row'}>
                    <TableCell style={{ color: 'white' }}>{index + 1}</TableCell>
                    {languages.map((lang) => {
                      const intl = getIntl(lang);

                      const label = JsonLdUtils.getLocalized(option[Constants.RDFS_LABEL], intl);

                      return getTableLanguageCell(option, label, index + lang, lang);
                    })}
                    {!languages.length &&
                      getTableLanguageCell(
                        option,
                        JsonLdUtils.getLocalized(option[Constants.RDFS_LABEL], {}),
                        index + ''
                      )}
                    <TableCell className={classes.delete} onClick={() => handleDeleteOption(options, option)}>
                      <DeleteIcon />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className={classes.emptyOptions}>No options available...</div>
      )}
      <Link
        component="button"
        variant="body1"
        onClick={() => {
          options.push({
            '@id': 'option-' + Math.floor(Math.random() * 10000000 + 1),
            [Constants.RDFS_LABEL]: []
          });

          const fakeEvent = createFakeChangeEvent(Constants.HAS_OPTION, options);

          handleChange(fakeEvent);
        }}
        type="button"
        className={classes.addNewOption}
      >
        <AddIcon />
        &nbsp;Add new option
      </Link>
      <div className={classes.buttons}>
        <CustomisedButton type="submit" size={'large'} onClick={handleOpenConfigModal}>
          Close
        </CustomisedButton>
      </div>
    </div>
  );

  return (
    <div className={classes.addOptionsManually}>
      or
      <CustomisedLinkButton title="Typeahead option values" onClick={handleOpenConfigModal}>
        Add options - {question[Constants.HAS_OPTION].length} available
      </CustomisedLinkButton>
      {open && (
        <Modal className={classes.modal} open={open} onClose={handleOpenConfigModal} id={'typeahead-options-modal'}>
          {modalBody}
        </Modal>
      )}
    </div>
  );
};

export default TypeaheadOptionsModal;
