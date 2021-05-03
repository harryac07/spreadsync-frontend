import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

type Props = {
  ctaToOpenModal?: any;
  header: string | React.ReactNode;
  bodyContent: string;
  cancelText: string;
  cancelCallback: () => void;
  confirmText: string;
  confirmCallback: () => void;
};
const SimpleConfirmDialog: React.FC<Props> = ({
  ctaToOpenModal,
  header,
  bodyContent,
  cancelText,
  cancelCallback,
  confirmText,
  confirmCallback
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {ctaToOpenModal ? (
        React.cloneElement(ctaToOpenModal, { onClick: handleClickOpen })
      ) : (
        <Button size="small" variant="outlined" color="primary" onClick={handleClickOpen}>
          Open
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ classes: { root: classes.paper }, elevation: 3 }}
      >
        <DialogTitle id="alert-dialog-title" className={classes.modalTitle}>
          <Typography>{header}</Typography>
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          <DialogContentText id="alert-dialog-description">
            <Typography className={classes.text}>{bodyContent}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.modalContent}>
          <Button
            onClick={() => {
              cancelCallback();
              handleClose();
            }}
            color="secondary"
            variant="outlined"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              confirmCallback();
              handleClose();
            }}
            color="primary"
            variant="contained"
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SimpleConfirmDialog;

const useStyles = makeStyles(theme => ({
  paper: {
    boxShadow: 'none',
    width: 500
  },
  modalTitle: {
    textAlign: 'center',
    borderBottom: '2px solid #eee',
    fontSize: 22
  },
  modalContent: {
    padding: '16px 32px'
  },
  title: {
    fontSize: 22
  },
  text: {
    fontSize: 16
  }
}));
