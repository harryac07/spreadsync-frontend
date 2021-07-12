import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Modal from 'components/common/ModalWithButton';
import Button from 'components/common/Button';
import Field from 'components/common/Field';
import MultiSelectDropdown from './MultiSelectDropdown';

import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { permissions } from 'utils/permissions';

const InviteUsersWithPermissions = (props) => {
  const classes = useStyles();
  const { onSubmit, onModalClose, forceClose } = props;

  const [modelOpen, setModalOpen] = useState(false);
  const [inviteCount, handleInviteMoreCount] = useState(1); // counting number of users to render Input element
  const [invitedUsers, handleAddInvitationUserChange] = useState({}); // Collecting users to be invited
  const [selectedCount, handleSelectedCount] = useState(0); // Counting users to be invited
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    if (forceClose && modelOpen) {
      handleModalClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceClose]);

  const addUserOrPermission = (index, key, value) => {
    let userObj = {};
    userObj[index] = {
      ...invitedUsers[index],
      [key]: value,
    };
    const payload = {
      ...invitedUsers,
      ...userObj,
    };
    handleAddInvitationUserChange(payload);
    handleSelectedCount(Object.keys(payload)?.length);
  };

  const handleSubmit = () => {
    const fitleredInvitedUsers = Object.values(invitedUsers)?.filter(({ email }) => email);

    if (!fitleredInvitedUsers?.length) {
      handleModalClose(true);
    } else {
      onSubmit(fitleredInvitedUsers);
      setIsSubmitDisabled(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    onModalClose();
    handleAddInvitationUserChange({});
    handleInviteMoreCount(1);
    handleSelectedCount(0);
    setIsSubmitDisabled(false);
  };

  return (
    <div>
      <Button
        onClick={() => setModalOpen(true)}
        startIcon={<GroupAddIcon className={classes.iconSmall} color="white" />}
        size="xs"
      >
        Invite user
      </Button>
      {modelOpen && (
        <Modal modalTitle={'Invite users to the project'} onClose={() => handleModalClose()} modalWidth={'60%'}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <div>
                  <p className={classes.header}>
                    Invite Users <span className={classes.selectedCountSpan}>({selectedCount})</span>
                  </p>
                  {Array.from(Array(inviteCount).keys()).map((each) => {
                    return (
                      <Grid container spacing={2} key={each}>
                        <Grid item xs={6}>
                          <Field
                            required={false}
                            size="small"
                            placeholder="Invite email"
                            label={'Email'}
                            className={classes.inviteMoreField}
                            onChange={(e) => {
                              e.preventDefault();
                              const { value } = e.target;
                              addUserOrPermission(each, 'email', value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MultiSelectDropdown
                            onChange={(permissionList) => {
                              addUserOrPermission(each, 'permission', permissionList);
                            }}
                            options={permissions}
                            fullWidth
                            defaultLabel="Permissions"
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon fontSize={'small'} color="primary" />}
                    size="small"
                    onClick={() => {
                      let prevCount = inviteCount;
                      handleInviteMoreCount(prevCount + 1);
                    }}
                    className={classes.inviteMoreUserButton}
                  >
                    Invite more
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Button
              className={classes.submitButton}
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Submit
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inviteMoreUserButton: {
    fontSize: 12,
    paddingTop: 6,
    marginBottom: 10,
  },
  inviteMoreField: {
    marginBottom: 10,
  },
  submitButton: {
    margin: '20px auto',
  },
  selectedCountSpan: {
    fontWeight: 500,
  },
}));

export default InviteUsersWithPermissions;
