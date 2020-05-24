import React, { useState } from 'react';
import { TextField, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
const Proptypes = require('prop-types');

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow: 'none',
    padding: theme.spacing(2, 4, 3),
    width: 500,
  },
  modalTitle: {
    textAlign: 'center',
    borderBottom: '2px solid #eee',
  },
}));

const ModalWithButton = (props) => {
  const {
    modalTitle,
    children,
    buttonStyle,
    showButton = false,
    onClose = () => null,
    autoClose = true,
    modalWidth = null,
  } = props;
  const [open, handleOpen] = useState(true);
  const classes = useStyles();

  const handleClose = () => {
    if (autoClose) {
      handleOpen(false);
    }
    onClose();
  };
  return (
    <div>
      {/* {showButton ? (
        <Button style={buttonStyle} type="button" onClick={handleOpen}>
          Open Modal
        </Button>
      ) : null} */}

      <StyledDialogue
        onClose={handleClose}
        aria-labelledby="dialog-title"
        open={open}
        maxWidth={'lg'}
        PaperComponent={Paper}
        PaperProps={{ classes: { root: classes.paper }, elevation: 3 }}
        modalwidth={modalWidth}
      >
        <DialogTitle id="dialog-title" className={classes.modalTitle}>
          {modalTitle}
        </DialogTitle>
        {children}
      </StyledDialogue>
    </div>
  );
};

export default ModalWithButton;

const StyledDialogue = styled(Dialog)`
  .MuiPaper-root {
    width: ${(props) => (props.modalwidth ? props.modalwidth : 'inherit')} !important;
  }
`;
