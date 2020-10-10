import React from 'react';
import useStyles from './ErrorsModal.styles';
import { Modal } from '@material-ui/core';
import { CustomisedButton } from '@styles/CustomisedButton';
import { CustomisedLinkButton } from '@styles/CustomisedLinkButton';

const ErrorsModal = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleOpenConfigModal = () => {
    setOpen(!open);
  };

  const modalBody = (
    <div className={classes.paper}>
      <h3>Errors modal</h3>
      <div className={classes.buttons}>
        <CustomisedButton type="submit" size={'large'} onClick={handleOpenConfigModal}>
          Continue
        </CustomisedButton>
      </div>
    </div>
  );

  return (
    <>
      <CustomisedLinkButton onClick={handleOpenConfigModal}>Check errors</CustomisedLinkButton>
      {open && (
        <Modal className={classes.modal} open={open} onClose={handleOpenConfigModal}>
          {modalBody}
        </Modal>
      )}
    </>
  );
};

export default ErrorsModal;
