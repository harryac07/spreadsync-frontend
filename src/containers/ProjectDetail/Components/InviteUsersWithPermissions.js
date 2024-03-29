import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Modal from 'components/common/ModalWithButton';
import Button from 'components/common/Button';
import Field from 'components/common/Field';
import Select from 'components/common/Select';
import MultiSelectDropdown from './MultiSelectDropdown';

import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { permissions, roles, roleBasedDefaultPermissions } from 'utils/permissions';

const InviteUsersWithPermissions = ({
  onSubmit,
  onModalClose,
  forceClose,
  ctaButton = null,
  defaultValue = {},
  customHeader = '',
  ...props
}) => {
  const classes = useStyles();

  const [modelOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [inviteCount, handleInviteMoreCount] = useState(1); // counting number of users to render Input element
  const [invitedUsers, handleAddInvitationUserChange] = useState({}); // Collecting users to be invited
  const [selectedCount, handleSelectedCount] = useState(0); // Counting users to be invited
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [currentFocusInput, setCurrentFocusInput] = useState('');

  useEffect(() => {
    if (forceClose && modelOpen) {
      handleModalClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceClose]);

  useEffect(() => {
    if (!isEmpty(defaultValue) && isEmpty(invitedUsers)) {
      handleAddInvitationUserChange({
        0: defaultValue,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  useEffect(() => {
    if (invitedUsers?.[0]?.role && selectedRole) {
      addUserOrPermission(
        0,
        'permission',
        roleBasedDefaultPermissions?.find((each) => {
          return each?.role === selectedRole;
        })?.permissions ?? defaultValue?.permission
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole, invitedUsers?.[0]?.role]);

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
    const fitleredInvitedUsers = !isEmpty(defaultValue?.email)
      ? [
          {
            ...defaultValue,
            permission: invitedUsers['0']?.permission?.filter((each) => each),
            role: invitedUsers['0']?.role ?? 'Developer',
          },
        ]
      : Object.values(invitedUsers)?.filter(({ email }) => email);

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
    <div {...props}>
      {ctaButton ? (
        React.cloneElement(ctaButton, { onClick: () => setModalOpen(true) })
      ) : (
        <Button
          onClick={() => setModalOpen(true)}
          startIcon={<GroupAddIcon className={classes.iconSmall} color="white" />}
          size="xs"
        >
          Invite user
        </Button>
      )}
      {modelOpen && (
        <Modal
          modalTitle={customHeader || 'Invite users to the project'}
          onClose={() => handleModalClose()}
          modalWidth={'60%'}
        >
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <div>
                  {isEmpty(defaultValue) ? (
                    <p className={classes.header}>
                      Invite Users <span className={classes.selectedCountSpan}>({selectedCount})</span>
                    </p>
                  ) : (
                    <p className={classes.header} />
                  )}
                  {Array.from(Array(inviteCount).keys()).map((each) => {
                    const permissionsDefault = defaultValue?.permission?.length
                      ? defaultValue?.permission
                      : invitedUsers?.[each]?.permission ?? [];
                    return (
                      <Grid container spacing={2} key={each}>
                        <Grid item xs={12}>
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
                            defaultValue={defaultValue?.email}
                            disabled={!!defaultValue?.email}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          onMouseEnter={() => {
                            setCurrentFocusInput('role');
                          }}
                          onMouseLeave={() => {
                            setCurrentFocusInput('');
                          }}
                        >
                          <Select
                            name="role"
                            label="Role"
                            options={roles}
                            onChange={(e) => {
                              const role = e.target.value;
                              addUserOrPermission(each, 'role', role);
                              if (!defaultValue?.permission?.length) {
                                setSelectedRole(role);
                              }
                            }}
                            fullWidth={true}
                            value={invitedUsers?.[each]?.role}
                            className={classes.select}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          key={`${
                            selectedRole
                              ? selectedRole +
                                `${currentFocusInput === 'role' ? permissionsDefault?.join('') : selectedRole}`
                              : ''
                          }`}
                          onMouseEnter={() => {
                            setCurrentFocusInput('permission');
                          }}
                          onMouseLeave={() => {
                            setCurrentFocusInput('');
                          }}
                        >
                          <MultiSelectDropdown
                            onChange={(permissionList) => {
                              const filteredPermission = permissionList?.includes('admin') ? ['admin'] : permissionList;
                              addUserOrPermission(each, 'permission', filteredPermission);
                            }}
                            options={permissions}
                            fullWidth
                            defaultLabel="Permissions"
                            defaultSelectedValues={permissionsDefault}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}

                  {isEmpty(defaultValue) && (
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
                  )}
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
  select: {
    '& fieldset': {
      height: 50,
    },
  },
  submitButton: {
    margin: '20px auto',
  },
  selectedCountSpan: {
    fontWeight: 500,
  },
}));

export default InviteUsersWithPermissions;
