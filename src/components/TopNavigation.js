import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';

import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import PersonIcon from '@material-ui/icons/Person';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import InfoIcon from '@material-ui/icons/Info';
import AddIcon from '@material-ui/icons/Add';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import CreateProjectModal from './CreateProjectModal';

import { createProject } from 'containers/Projects/action';

class TopNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: {},
      currentMenuOpen: null,
      showCreateProjectModal: false,
    };
  }
  openMenu = (e, optionName) => {
    e.preventDefault();
    this.setState({
      anchorEl: {
        [optionName]: e.currentTarget,
      },
      currentMenuOpen: optionName,
    });
  };
  closeOpenedMenu = (e, redirectUrl = '') => {
    e.preventDefault();
    const { currentMenuOpen } = this.state;

    if (redirectUrl) {
      console.log(this.props);
      this.props.history.push(`/${redirectUrl}`);
    }

    this.setState({
      currentMenuOpen: null,
      anchorEl: {
        [currentMenuOpen]: null,
      },
    });
  };
  toggleCreateProjectModal = (open = true) => {
    this.setState({
      showCreateProjectModal: open,
    });
  };
  createProject = (payload) => {
    this.props.createProject(payload);
  };
  renderCreateProjectModal = () => {
    if (!this.state.showCreateProjectModal) {
      return null;
    }
    return (
      <CreateProjectModal handleSubmit={this.createProject} onModalClose={() => this.toggleCreateProjectModal(false)} />
    );
  };
  switchAccount = () => {
    localStorage.removeItem('account_id');
    localStorage.removeItem('account_name');
    this.props.history.push('/');
  };
  componentDidUpdate(prevProps, prevState) {
    const { store } = this.props;
    const {
      success: { CREATE_PROJECT: currentCreateProjectSuccess = false },
      error: { CREATE_PROJECT: currentCreateProjectError = null },
    } = store;
    const {
      success: { CREATE_PROJECT: prevCreateProjectSuccess = false },
      error: { CREATE_PROJECT: prevCreateProjectError = null },
    } = prevProps.store;
    if (currentCreateProjectSuccess !== prevCreateProjectSuccess && currentCreateProjectSuccess) {
      this.toggleCreateProjectModal(false);
      toast.info(`Project created successfully.`);
    }
    if (currentCreateProjectError !== prevCreateProjectError && currentCreateProjectError) {
      toast.error(`Error while creating a project. Please try again!`);
    }
  }
  renderMenuList = (currentMenuOpen) => {
    const { classes } = this.props;
    switch (currentMenuOpen) {
      case 'profile':
        return (
          <Popper
            open={Boolean(this.state.currentMenuOpen)}
            anchorEl={this.state.anchorEl[currentMenuOpen]}
            role={undefined}
            transition
            disablePortal
            placement={'bottom-end'}
            modifiers={{
              flip: {
                enabled: false,
              },
              preventOverflow: {
                enabled: true,
                boundariesElement: 'scrollParent',
              },
            }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'left bottom' }}
              >
                <Paper className={classes.popperWrapper} elevation={4}>
                  <MenuList autoFocusItem={Boolean(this.state.anchorEl)}>
                    <MenuItem className={classes.popperMenuItem} onClick={(e) => this.closeOpenedMenu(e, 'profile')}>
                      <PersonIcon fontSize={'small'} className={classes.popperIcon} /> Profile
                    </MenuItem>
                    <MenuItem className={classes.popperMenuItem} onClick={(e) => this.closeOpenedMenu(e, 'setting')}>
                      <SettingsIcon fontSize={'small'} className={classes.popperIcon} /> Setting
                    </MenuItem>
                    <MenuItem className={classes.popperMenuItem} onClick={this.switchAccount}>
                      <SettingsIcon fontSize={'small'} className={classes.popperIcon} /> Switch Account
                    </MenuItem>
                    <MenuItem className={classes.popperMenuItem} onClick={(e) => this.closeOpenedMenu(e, 'logout')}>
                      <LogoutIcon fontSize={'small'} className={classes.popperIcon} /> Logout
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        );
      case 'notification':
        return (
          <Popper
            open={Boolean(this.state.currentMenuOpen)}
            anchorEl={this.state.anchorEl[currentMenuOpen]}
            role={undefined}
            transition
            disablePortal
            placement={'bottom-end'}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'left bottom' }}
              >
                <Paper className={classes.popperWrapper} elevation={4}>
                  <MenuList autoFocusItem={Boolean(this.state.anchorEl)}>
                    <MenuItem className={classes.popperMenuItem} onClick={this.closeOpenedMenu}>
                      Notification 1
                    </MenuItem>
                    <MenuItem className={classes.popperMenuItem} onClick={this.closeOpenedMenu}>
                      Notification 2
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        );
      case 'info':
        return (
          <Popper
            open={Boolean(this.state.currentMenuOpen)}
            anchorEl={this.state.anchorEl[currentMenuOpen]}
            role={undefined}
            transition
            disablePortal
            placement={'bottom-end'}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'left bottom' }}
              >
                <Paper className={classes.popperWrapper} elevation={4}>
                  <MenuList autoFocusItem={Boolean(this.state.anchorEl)}>
                    <MenuItem className={classes.popperMenuItem} onClick={this.closeOpenedMenu}>
                      Notification 1
                    </MenuItem>
                    <MenuItem className={classes.popperMenuItem} onClick={this.closeOpenedMenu}>
                      Notification 2
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        );
      case 'add':
        return (
          <Popper
            open={Boolean(this.state.currentMenuOpen)}
            anchorEl={this.state.anchorEl[currentMenuOpen]}
            role={undefined}
            transition
            disablePortal
            placement={'bottom-end'}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'left bottom' }}
              >
                <Paper className={classes.popperWrapper} elevation={4}>
                  <MenuList autoFocusItem={Boolean(this.state.anchorEl)}>
                    <MenuItem
                      className={classes.popperMenuItem}
                      onClick={(e) => {
                        this.toggleCreateProjectModal();
                        this.closeOpenedMenu(e);
                      }}
                    >
                      <AssignmentIcon fontSize={'small'} className={classes.popperIcon} />
                      Create project
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        );
      default:
        return null;
    }
  };
  render() {
    const { classes } = this.props;
    const { currentMenuOpen } = this.state;
    return (
      <ClickAwayListener onClickAway={this.closeOpenedMenu}>
        <Wrapper>
          <AddIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'add')} />
          <NotificationsNoneIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'notification')} />
          <InfoIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'info')} />
          <PersonIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'profile')} />

          {/* Render menu list */}
          {this.renderMenuList(currentMenuOpen)}

          {/* Modals */}
          {this.renderCreateProjectModal()}
        </Wrapper>
      </ClickAwayListener>
    );
  }
}

const styles = (theme) => {
  return {
    icon: {
      margin: '5px 5px 0px 5px',
      backgroundColor: '#3A3C67',
      height: 40,
      width: 40,
      cursor: 'pointer',
    },
    popperWrapper: {
      marginTop: 10,
      textAlign: 'center',
      minWidth: 200,
    },
    popperMenuItem: {
      fontSize: 16,
    },
    popperIcon: {
      marginRight: 10,
    },
    popperTitle: {
      display: 'inline-block',
      textAlign: 'center',
      fontSize: 'bold',
      margin: '0 auto',
      padding: '10px 10px 10px 10px',
      width: '100%',
      borderBottom: '1px solid #eee',
    },
    createProjectPaper: {
      padding: 20,
      minHeight: `100vh`,
    },
  };
};

const mapStateToProps = (state) => {
  return {
    store: state.project,
  };
};

export default connect(mapStateToProps, { createProject })(withStyles(styles)(TopNavigation));

const Wrapper = styled.div`
  background-color: #fff;
`;
