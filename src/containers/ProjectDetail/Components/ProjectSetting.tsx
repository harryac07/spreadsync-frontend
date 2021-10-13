import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TextField, Grid, Paper } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import { API_URL } from 'env';
import ContainerWithHeader from 'components/ContainerWithHeader';
import Button from 'components/common/Button';
import Field from 'components/common/Field';
import Modal from 'components/common/ModalWithButton';

import { fetchProjectById } from '../action';

type Props = {
  project: {
    account: string;
    admin: string;
    created_on: string;
    description: string;
    id: string;
    name: string;
    total_members: number;
  };
};

const ProjectSetting: React.FC<Props> = ({ project }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [openProjectUpdateModal, setOpenProjectUpdateModal] = useState(false);
  const [openDeleteProjectModal, setOpenDeleteProjectModal] = useState(false);
  const [deletingProjectName, setDeletingProjectName] = useState('');
  const [verifyDeletingText, setVerifyDeletingText] = useState('');
  const [projectInfo, setProjectInfo] = useState({
    name: project?.name,
    description: project?.description,
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setProjectInfo({
      ...projectInfo,
      [name]: value,
    });
  };

  const resetProjectInfo = () => {
    setProjectInfo({
      name: project?.name,
      description: project?.description,
    });
  };

  const updateProject = async (e) => {
    e.preventDefault();
    const isInfoSame = projectInfo?.name === project?.name && projectInfo?.description === project?.description;
    try {
      if (isInfoSame) {
        toast.info('No Change!. Skipping update!');
        setOpenProjectUpdateModal(false);
      } else {
        await axios.patch(
          `${API_URL}/projects/${project?.id}/`,
          {
            name: projectInfo?.name,
            description: projectInfo?.description,
          },
          {
            headers: {
              Authorization: `bearer ${localStorage.getItem('token')}`,
              account_id: `${localStorage.getItem('account_id')}`,
            },
          }
        );
        dispatch(fetchProjectById(project?.id));
        toast.success('Project name updated successfully!');
        setOpenProjectUpdateModal(false);
      }
    } catch (e) {
      toast.error(`Project name change failed! ${e.response?.data?.message ?? ''}`);
    }
  };

  const deleteProjectPermanently = async (e) => {
    e.preventDefault();
    try {
      if (deletingProjectName && deletingProjectName === project?.name && deletingProjectName === verifyDeletingText) {
        // delete project
        await axios.delete(`${API_URL}/projects/${project?.id}/`, {
          headers: {
            Authorization: `bearer ${localStorage.getItem('token')}`,
            account_id: `${localStorage.getItem('account_id')}`,
          },
        });
        setOpenDeleteProjectModal(false);

        // redirect back to project list view
        history.push(`/projects`);
        toast.success(`Project ${project?.name} deleted successfully!`);
      }
    } catch (e) {
      toast.error(`Project delete failed! ${e.response?.data?.message ?? ''}`);
    }
  };

  return (
    <div className={classes.content}>
      <ContainerWithHeader
        padding={20}
        elevation={0}
        square={true}
        headerLeftContent={'Project detail'}
        headerRightContent={
          <Button size="xs" onClick={() => setOpenProjectUpdateModal(true)}>
            Update project
          </Button>
        }
      >
        <div>
          <TextField value={project?.name} variant="outlined" disabled className={classes.projectNameField} />
          <Paper
            elevation={0}
            style={{
              margin: '12px 0px',
            }}
          >
            {project?.description}
          </Paper>
        </div>
        {openProjectUpdateModal && project?.name && (
          <Modal
            modalTitle={'Update project detail'}
            onClose={() => {
              resetProjectInfo();
              setOpenProjectUpdateModal(false);
            }}
            modalWidth={'50%'}
          >
            <form style={{ padding: '20px 0px 10px 0px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    required={true}
                    size="small"
                    placeholder="Project name"
                    label={'Project name'}
                    name={'name'}
                    onChange={handleChange}
                    defaultValue={project?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    required={true}
                    size="small"
                    placeholder="Project description"
                    label={'Project description'}
                    name={'description'}
                    onChange={handleChange}
                    defaultValue={project?.description}
                    multiline
                    rows={6}
                  />
                </Grid>
              </Grid>

              <Button
                className={classes.submitButton}
                fullWidth
                variant="contained"
                color="primary"
                onClick={updateProject}
              >
                Submit
              </Button>
            </form>
          </Modal>
        )}
      </ContainerWithHeader>
      <br />
      <ContainerWithHeader padding={20} elevation={0} square={true} headerLeftContent={'Danger zone'}>
        <div>
          Deleting the project deletes all jobs and users associated to the project.
          <br />
          <b>There is no going back.</b>
        </div>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Button
              rootStyle={{ display: 'block', height: 40, marginTop: 16 }}
              className={classes.deleteProjectButton}
              variant="outlined"
              color="default"
              onClick={() => setOpenDeleteProjectModal(true)}
              type="submit"
            >
              Delete project
            </Button>
          </Grid>
        </Grid>
        {openDeleteProjectModal && project?.id && (
          <Modal
            modalTitle={'Delete project permanently'}
            onClose={() => setOpenDeleteProjectModal(false)}
            modalWidth={'50%'}
          >
            <form style={{ padding: '20px 0px 10px 0px' }}>
              <div style={{ padding: '16px', marginBottom: 20, background: '#eee', color: '#CB2431' }}>
                Deleting the project deletes all related entities under the project. Jobs, users and integrations setup
                under the project will be deleted. Please think again!
              </div>
              <Field
                required={true}
                size="small"
                placeholder="Type username"
                label={'Project name'}
                onChange={(e) => setDeletingProjectName(e.target.value)}
                defaultValue={''}
                style={{ marginBottom: 12 }}
              />
              <Field
                required={true}
                size="small"
                placeholder="Type project name again"
                label={'Repeat project name'}
                onChange={(e) => setVerifyDeletingText(e.target.value)}
                defaultValue={''}
                style={{ marginBottom: 12 }}
              />
              <Button
                className={classes.submitButton}
                fullWidth
                variant="contained"
                color="primary"
                onClick={deleteProjectPermanently}
                disabled={
                  !deletingProjectName ||
                  deletingProjectName !== project?.name ||
                  deletingProjectName !== verifyDeletingText
                }
              >
                Delete
              </Button>
            </form>
          </Modal>
        )}
      </ContainerWithHeader>
    </div>
  );
};

export default ProjectSetting;

const useStyles = makeStyles((theme) => ({
  deleteProjectButton: {
    minWidth: 100,
    borderRadius: 4,
    backgroundColor: '#fff',
    color: 'red',
  },
  submitButton: {
    margin: '20px auto',
  },
  projectNameField: {
    minWidth: 250,
    '& div': {
      height: 40,
    },
    '& fieldset': {
      borderRadius: 0,
    },
    '&:hover': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23) !important',
      },
    },
  },
  content: { padding: 32 },
  iconSmall: {
    height: 20,
  },
}));
