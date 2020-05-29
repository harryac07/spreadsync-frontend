import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { startCase, toLower } from 'lodash';

import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

import PersonIcon from '@material-ui/icons/Person';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import InfoIcon from '@material-ui/icons/Info';
import AddIcon from '@material-ui/icons/Add';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import SwapAccountIcon from '@material-ui/icons/SwapHoriz';

import CreateProjectModal from './CreateProjectModal';

import { createProject } from 'containers/Projects/action';
import { fetchAllAccountsForUser } from 'containers/Main/action';

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
    const userId = localStorage.getItem('user_id');
    if (!localStorage.getItem('account_id')) {
      this.props.fetchAllAccountsForUser(userId);
      this.props.history.push('/');
    }
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
    const { accounts } = this.props.app;
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
                    {accounts.length > 1 ? (
                      <MenuItem className={classes.popperMenuItem} onClick={this.switchAccount}>
                        <SwapAccountIcon fontSize={'small'} className={classes.popperIcon} /> Switch Account
                      </MenuItem>
                    ) : null}
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
    const accountNameRaw = toLower(localStorage.getItem('account_name') || '');
    const accountName = accountNameRaw.charAt(0).toUpperCase() + accountNameRaw.substr(1);
    return (
      <ClickAwayListener onClickAway={this.closeOpenedMenu}>
        <Wrapper>
          <AddIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'add')} />
          <NotificationsNoneIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'notification')} />
          <InfoIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'info')} />
          <SettingsIcon className={classes.icon} onClick={(e) => this.closeOpenedMenu(e, 'setting')} />
          <span className={classes.verticalBar} />
          <div className={classes.accountMenuWrapper}>
            <div onClick={(e) => this.openMenu(e, 'profile')} className={classes.accountMenu}>
              <AccountCircle />
              <span>&nbsp;{accountName}</span>
              <ArrowDropDownIcon />
            </div>
          </div>

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
      backgroundColor: theme.palette.primary.main,
      height: 40,
      width: 40,
      cursor: 'pointer',
    },
    accountMenuWrapper: {
      display: 'inline-block',
      marginRight: 10,
    },
    accountMenu: {
      margin: '5px 5px 0px 5px',
      height: 40,
      color: theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      '& svg:first-child': {
        fontSize: 40,
      },
      '& svg:last-child': {
        fontSize: 30,
      },
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
    verticalBar: {
      color: '#000',
      height: 40,
      width: 1,
      marginLeft: 5,
      display: 'inline-block',
      borderRight: `1px solid #627284`,
    },
  };
};

const mapStateToProps = (state) => {
  return {
    store: state.project,
    app: state.app,
  };
};

export default connect(mapStateToProps, { createProject, fetchAllAccountsForUser })(withStyles(styles)(TopNavigation));

const Wrapper = styled.div`
  background-color: #fff;
`;
