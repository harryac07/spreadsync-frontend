import React, { useState } from 'react';
import { toLower } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'components/common/Button';
import Field from 'components/common/Field';
import Modal from 'components/common/ModalWithButton';
import { validateEmail } from 'utils/index';

type ButtonProps = {
  color?: 'primary' | 'secondary' | 'white' | 'error';
  size?: 'large' | 'medium' | 'small' | 'xs';
  disabled?: boolean;
  children: any;
  onClick: () => void;
  className: any;
  variant?: 'contained' | 'outlined' | 'text';
  startIcon;
  display;
  float?: string;
  fullWidth: boolean;
  rootStyle?: any;
};
export type Props = {
  title: React.ReactNode;
  alertMessage?: React.ReactNode;
  type?: string;
  label?: string;
  placeholder?: string;
  valueToCheck?: string;
  ctaButtonText: string;
  confirmText: string;
  onConfirm: (input: string) => void;
  buttonProps?: Partial<ButtonProps>;
};
const InputConfirmationDialog: React.FC<Props> = ({
  title,
  alertMessage,
  valueToCheck = '',
  label,
  type = 'text',
  placeholder,
  ctaButtonText,
  confirmText,
  onConfirm,
  buttonProps = {},
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputConfirmationValue, setInputConfirmationValue] = useState('');

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(inputValue);
  };

  return (
    <div>
      <Button className={classes.ctaButton} variant="outlined" onClick={handleOpen} {...buttonProps}>
        {ctaButtonText}
      </Button>
      {open && (
        <Modal modalTitle={title} onClose={handleClose} modalWidth={'50%'}>
          <form className={classes.form}>
            {alertMessage && <div className={classes.alertMessage}>{alertMessage}</div>}
            <Field
              required={true}
              size="small"
              placeholder={placeholder}
              label={label}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <Field
              required={true}
              size="small"
              placeholder={`Type ${toLower(label)} again`}
              label={`Repeat ${toLower(label)}`}
              onChange={(e) => setInputConfirmationValue(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <Button
              className={classes.submitButton}
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="medium"
              disabled={
                !inputValue ||
                inputConfirmationValue !== inputValue ||
                (valueToCheck ? valueToCheck !== inputValue : false) ||
                (type === 'email' ? !validateEmail(inputValue) : false)
              }
            >
              {confirmText}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default InputConfirmationDialog;
const useStyles = makeStyles(() => {
  return {
    form: { padding: '20px 0px 10px 0px' },
    ctaButton: {
      minWidth: 100,
      borderRadius: 4,
    },
    submitButton: {
      margin: '20px auto',
    },
    alertMessage: { padding: '16px', marginBottom: 20, background: '#eee', color: '#CB2431' },
  };
});
