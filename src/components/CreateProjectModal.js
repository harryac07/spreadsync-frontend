import React, { useState } from 'react';
import { startCase, toLower } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from 'components/common/ModalWithButton';
import Field from 'components/common/Field';
import { Divider } from '@material-ui/core';

const CreateProjectModal = (props) => {
  const classes = useStyles();
  const { handleSubmit, onModalClose } = props;
  const [inputObj, handleInputChange] = useState({});
  const [error, handleError] = useState({});
  const [inviteCount, handleInviteMoreCount] = useState(1); // counting number of users to render Input element
  const [invitedUsers, handleAddInvitationUserChange] = useState([]); // Collecting users to be invited
  const [selectedCount, handleSelectedCount] = useState(0); // Collecting users to be invited

  const addUser = (index, value) => {
    invitedUsers[index] = value;
    handleAddInvitationUserChange(invitedUsers);
    handleSelectedCount(invitedUsers.filter((each) => each).length);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange({
      ...inputObj,
      [name]: value,
    });
    handleError({
      ...error,
      [name]: !value ? `${startCase(toLower(name))} is required` : '',
    });
  };

  const isError = () => {
    const { name, description } = inputObj;
    if (name && description) {
      return false;
    }
    handleError({
      ...error,
      name: name ? '' : 'Name is required',
      description: description ? '' : 'Description is required',
    });
    return true;
  };

  const submitCreateProject = () => {
    const { name, description } = inputObj;
    const projectPayload = {
      name,
      description,
    };
    const payload = {
      invitedUsers: invitedUsers.filter((each) => each),
      projectPayload,
    };
    const errorExists = isError();
    if (!errorExists) {
      handleSubmit(payload);
    } else {
      console.error('All fields required');
    }
  };
  return (
    <div>
      <Modal onClose={onModalClose} modalTitle={'Create Project'} modalWidth={'50%'}>
        <form>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={12} md={12}>
              <p className={classes.header}>Project Detail</p>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12}>
                  <Field
                    required={true}
                    // helperText={'Project name is required'}
                    label={'Name'}
                    placeholder="Name"
                    name="name"
                    error={error.name ? true : false}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Field
                    required={true}
                    label={'Description'}
                    placeholder="Description"
                    name="description"
                    error={error.description ? true : false}
                    onChange={handleChange}
                    className={classes.inviteMoreField}
                    multiline={true}
                    rows={6}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button
            className={classes.submitButton}
            fullWidth
            variant="contained"
            color="primary"
            onClick={submitCreateProject}
          >
            Submit
          </Button>
        </form>
      </Modal>
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

export default CreateProjectModal;
