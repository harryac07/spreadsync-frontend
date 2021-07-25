import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tabs, Tab, Paper } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import ProfileForm from './Components/ProfileForm';
import ChangePasswordForm from './Components/ChangePasswordForm';
import ContainerWithHeader from 'components/ContainerWithHeader';
import { updateUserById, updateUserPassword } from './api';

type Props = {};
const Profile: React.FC<Props> = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const { currentUser } = useSelector((states: any) => {
    return {
      currentUser: states.app?.currentUser?.[0],
    };
  });

  const handleProfileUpdate = async (reqPayload) => {
    try {
      const userId = localStorage.getItem('user_id');
      await updateUserById(userId, reqPayload);
      toast.success(`User info updated successfully!`);
    } catch (e) {
      console.error(e.response?.data?.message);
      toast.error(`User info update failed! ${e.response?.data?.message ?? ''}`);
    }
  };

  const handleUpdateUserPassword = async (reqPayload) => {
    try {
      const userId = localStorage.getItem('user_id');
      await updateUserPassword(userId, reqPayload);
      toast.success(`Password changed successfully!`);
    } catch (e) {
      console.error(e.response?.data?.message);
      toast.error(`Password change failed! ${e.response?.data?.message ?? ''}`);
    }
  };
  const handleTabChange = (event, newValue) => {
    event.preventDefault();
    setCurrentTab(newValue);
  };

  const defaultProfileData = {
    firstname: currentUser?.firstname,
    lastname: currentUser?.lastname,
    email: currentUser?.email,
    phone: currentUser?.phone,
    company: currentUser?.company,
  };
  return (
    <div className={classes.projectWrapper}>
      <div className={classes.headerWrapper}>
        <div className={classes.headerText}>Profile</div>
      </div>
      <div className={classes.content}>
        <Paper square={true}>
          <Tabs value={currentTab} indicatorColor="primary" textColor="primary" onChange={handleTabChange}>
            <Tab
              className={classes.tab}
              label={<ContainerWithHeader headerRightContent={null} headerLeftContent={'Update info'} />}
            />
            <Tab label={<ContainerWithHeader headerRightContent={null} headerLeftContent={'Change Password'} />} />
          </Tabs>
        </Paper>
        {currentTab === 0 && (
          <ContainerWithHeader padding={20} elevation={1} showHeader={false} square={true}>
            <ProfileForm handleSubmit={handleProfileUpdate} defaultValue={currentUser ? defaultProfileData : {}} />
          </ContainerWithHeader>
        )}
        {currentTab === 1 && (
          <ContainerWithHeader padding={20} elevation={1} showHeader={false} square={true}>
            <ChangePasswordForm handleSubmit={handleUpdateUserPassword} defaultValue={{ email: currentUser?.email }} />
          </ContainerWithHeader>
        )}
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
  content: { padding: 32 },
  tab: {
    padding: 0,
  },
}));

export default Profile;
