import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField, Grid } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import ContainerWithHeader from 'components/ContainerWithHeader';
import Button from 'components/common/Button';
import Field from 'components/common/Field';
import Modal from 'components/common/ModalWithButton';
import { updateAccount, deleteAccount, transferAccount } from './api';

import { fetchAllAccountsForUser } from 'containers/Main/action.js';

type Props = {};
const Settings: React.FC<Props> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [openUsernameModal, setOpenUsernameModal] = useState(false);
  const [username, setUsername] = useState('');

  const [openTransferAccountModal, setOpenTransferAccountModal] = useState(false);
  const [transferingAccountEmail, setTransferingAccountEmail] = useState('');

  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
  const [deletingAccountUsername, setDeletingAccountUsername] = useState('');
  const [verifyDeletingText, setVerifyDeletingText] = useState('');
  const { currentAccount } = useSelector((states: any) => {
    return {
      currentAccount: states.app.accounts?.find(({ id }) => id === localStorage.getItem('account_id')),
    };
  });

  const isAccountAdmin = currentAccount?.admin === localStorage.getItem('user_id');

  useEffect(() => {
    if (currentAccount?.name && !username) {
      setUsername(currentAccount?.name);
    }

    if (currentAccount?.name && !isAccountAdmin) {
      history.push(`/projects`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  const handleChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (username && username === currentAccount?.name) {
        toast.info('No username change. Skipping update!');
        setOpenUsernameModal(false);
      } else {
        await updateAccount(currentAccount?.id, {
          name: username,
        });
        dispatch(fetchAllAccountsForUser(currentAccount?.user));
        toast.success('Account username updated successfully!');
        setOpenUsernameModal(false);
        localStorage.setItem('account_name', username);
      }
    } catch (e) {
      toast.error(`Username change failed! ${e.response?.data?.message ?? ''}`);
    }
  };

  const deleteAccountPermanently = async (e) => {
    e.preventDefault();
    try {
      if (
        deletingAccountUsername &&
        deletingAccountUsername === currentAccount?.name &&
        deletingAccountUsername === verifyDeletingText
      ) {
        await deleteAccount(currentAccount?.id);
        dispatch(fetchAllAccountsForUser(currentAccount?.user));
        toast.success(`Account ${currentAccount?.name} deleted successfully!`);
        setOpenDeleteAccountModal(false);
        localStorage.removeItem('account_id');
        localStorage.removeItem('account_name');
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve('ok');
          }, 1000);
        });
      }
    } catch (e) {
      toast.error(`Account delete failed! ${e.response?.data?.message ?? ''}`);
    }
  };

  const transferAccountOwnership = async (e) => {
    e.preventDefault();
    try {
      if (transferingAccountEmail) {
        console.log(`transferingAccountEmail ${transferingAccountEmail}`);
        await transferAccount(currentAccount?.id, { email: transferingAccountEmail });
        dispatch(fetchAllAccountsForUser(currentAccount?.user));
        toast.success(`Account ${currentAccount?.name} transferred successfully!`);
        setOpenTransferAccountModal(false);
        setTransferingAccountEmail('');
        window.location.replace(`/projects`);
      }
    } catch (e) {
      toast.error(`Account delete failed! ${e.response?.data?.message ?? ''}`);
    }
  };

  const isValidEmail = (emailToCheck) => {
    // eslint-disable-next-line no-useless-escape
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(emailToCheck);
  };

  return (
    <div className={classes.projectWrapper}>
      <div className={classes.headerWrapper}>
        <div className={classes.headerText}>Settings</div>
      </div>
      {/* Change username */}
      <div className={classes.content}>
        <ContainerWithHeader padding={20} elevation={1} square={true} headerLeftContent={'Account username'}>
          <div style={{ display: 'flex' }}>
            <TextField
              value={currentAccount?.name}
              variant="outlined"
              color="primary"
              disabled
              className={classes.accountNameField}
            />
            <Button
              rootStyle={{ display: 'block', height: 40, marginLeft: 8 }}
              className={classes.changeUsernameButton}
              variant="contained"
              color="primary"
              onClick={() => setOpenUsernameModal(true)}
              type="submit"
            >
              Change
            </Button>
          </div>
          {openUsernameModal && currentAccount?.name && (
            <Modal
              modalTitle={'Change account username'}
              onClose={() => setOpenUsernameModal(false)}
              modalWidth={'50%'}
            >
              <form style={{ padding: '20px 0px 10px 0px' }}>
                <Field
                  required={true}
                  size="small"
                  placeholder="Change username"
                  label={'name'}
                  onChange={handleChange}
                  defaultValue={currentAccount?.name}
                />
                <Button
                  className={classes.submitButton}
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </form>
            </Modal>
          )}
        </ContainerWithHeader>
      </div>
      {/* Delete account */}
      <div className={classes.content} style={{ paddingTop: 0 }}>
        <ContainerWithHeader padding={20} elevation={1} square={true} headerLeftContent={'Danger zone'}>
          <div>Deleting the account is permanent and there is no going back.</div>
          <Grid container spacing={2}>
            <Grid item xs="auto">
              <Button
                rootStyle={{ display: 'block', height: 40, marginTop: 16 }}
                className={classes.deleteAccountButton}
                variant="outlined"
                color="default"
                onClick={() => setOpenDeleteAccountModal(true)}
                type="submit"
              >
                Delete account
              </Button>
            </Grid>
            <Grid item xs="auto">
              <Button
                rootStyle={{ display: 'block', height: 40, marginTop: 16 }}
                className={classes.transferAccountButton}
                variant="outlined"
                color="primary"
                onClick={() => setOpenTransferAccountModal(true)}
                type="submit"
              >
                Transfer ownership
              </Button>
            </Grid>
          </Grid>
          {openDeleteAccountModal && currentAccount?.id && (
            <Modal
              modalTitle={'Delete account permanently'}
              onClose={() => setOpenDeleteAccountModal(false)}
              modalWidth={'50%'}
            >
              <form style={{ padding: '20px 0px 10px 0px' }}>
                <div style={{ padding: '16px', marginBottom: 20, background: '#eee', color: '#CB2431' }}>
                  Deleting the account deletes all related entities under the account including Projects, Jobs and all
                  integrations. Please think again!
                </div>
                <Field
                  required={true}
                  size="small"
                  placeholder="Type username"
                  label={'Account name'}
                  onChange={(e) => setDeletingAccountUsername(e.target.value)}
                  defaultValue={''}
                  style={{ marginBottom: 12 }}
                />
                <Field
                  required={true}
                  size="small"
                  placeholder="Type account name again"
                  label={'Repeat account name'}
                  onChange={(e) => setVerifyDeletingText(e.target.value)}
                  defaultValue={''}
                  style={{ marginBottom: 12 }}
                />
                <Button
                  className={classes.submitButton}
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={deleteAccountPermanently}
                  disabled={
                    !deletingAccountUsername ||
                    deletingAccountUsername !== currentAccount?.name ||
                    deletingAccountUsername !== verifyDeletingText
                  }
                >
                  Delete
                </Button>
              </form>
            </Modal>
          )}
          {openTransferAccountModal && currentAccount?.name && (
            <Modal
              modalTitle={'Transfer account ownership'}
              onClose={() => setOpenTransferAccountModal(false)}
              modalWidth={'50%'}
            >
              <form
                style={{ padding: '20px 0px 10px 0px' }}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div style={{ padding: '16px', marginBottom: 20, background: '#eee', color: '#CB2431' }}>
                  Transferring the account ownership transfers all rights to another user permanently. You will no
                  longer have full control over the account.
                </div>
                <Field
                  required={true}
                  size="small"
                  placeholder="User email"
                  label={'Email of new account owner'}
                  onChange={(e) => {
                    e.preventDefault();
                    setTransferingAccountEmail(e.target.value);
                  }}
                  defaultValue={''}
                  style={{ marginBottom: 12 }}
                  type="email"
                />
                <Button
                  className={classes.submitButton}
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={transferAccountOwnership}
                  disabled={!transferingAccountEmail || !isValidEmail(transferingAccountEmail)}
                >
                  Transfer
                </Button>
              </form>
            </Modal>
          )}
        </ContainerWithHeader>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  projectWrapper: {
    border: 0,
    borderRadius: 3,
    color: '#000',
    margin: '0 auto',
    position: 'relative',
    marginBottom: 0,
  },
  headerWrapper: {
    backgroundColor: '#fff',
    padding: '5px 32px 5px 32px',
    boxShadow: '0px 0px 1px 0px #888888',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
  },
  changeUsernameButton: {
    minWidth: 100,
    borderRadius: 4,
  },
  deleteAccountButton: {
    minWidth: 100,
    borderRadius: 4,
    backgroundColor: '#fff',
    color: 'red',
  },
  transferAccountButton: {
    minWidth: 100,
    borderRadius: 4,
  },
  submitButton: {
    margin: '20px auto',
  },
  accountNameField: {
    minWidth: 250,
    '& div': {
      height: 40,
    },
    '& fieldset': {
      borderRadius: 0,
    },
  },
  content: { padding: 32 },
  userNameCTA: {
    fontSize: 12,
    paddingTop: 6,
    marginBottom: 10,
  },
  field: {
    borderRadius: 0,
  },
}));

export default Settings;
