import React, { useContext } from 'react';
import useStyles from './ErrorsModal.styles';
import { Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';
import { ValidationContext, ValidationError } from '@contexts/ValidationContext';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const ErrorsModal = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const { questionErrors } = useContext(ValidationContext);

  const handleOpenConfigModal = () => {
    setOpen(!open);
  };

  const modalBody = (
    <div className={classes.paper}>
      <h3>Errors modal</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question ID</TableCell>
              <TableCell align="right">Attribute</TableCell>
              <TableCell align="right">Error</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* @ts-ignore */}
            {Array.from(questionErrors).map(([key, value]: [string, ValidationError]) => {
              return (
                <>
                  {value.map((error) => (
                    <TableRow key={key + error.attribute}>
                      <TableCell component="th" scope="row">
                        {key}&nbsp;
                        <span className={classes.copyIcon}>
                          <FileCopyIcon fontSize="small" onClick={() => navigator.clipboard.writeText(key)} />
                        </span>
                      </TableCell>
                      <TableCell align="right">{error.attribute}</TableCell>
                      <TableCell align="right">{error.error}</TableCell>
                    </TableRow>
                  ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.buttons}>
        <CustomisedButton type="submit" size={'large'} onClick={handleOpenConfigModal}>
          Close
        </CustomisedButton>
      </div>
    </div>
  );

  return (
    <>
      <CustomisedLinkButton onClick={handleOpenConfigModal}>Errors list</CustomisedLinkButton>
      {open && (
        <Modal className={classes.modal} open={open} onClose={handleOpenConfigModal}>
          {modalBody}
        </Modal>
      )}
    </>
  );
};

export default ErrorsModal;
