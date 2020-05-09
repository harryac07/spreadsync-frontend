import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import InfoIcon from '@material-ui/icons/Info';
import AddIcon from '@material-ui/icons/Add';

class TopNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: {},
      currentMenuOpen: null,
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
  renderMenuList = (currentMenuOpen) => {
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
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'left bottom' }}
              >
                <Paper>
                  <MenuList autoFocusItem={Boolean(this.state.anchorEl)}>
                    <MenuItem onClick={(e) => this.closeOpenedMenu(e, 'profile')}>Profile</MenuItem>
                    <MenuItem onClick={(e) => this.closeOpenedMenu(e, 'setting')}>Setting</MenuItem>
                    <MenuItem onClick={(e) => this.closeOpenedMenu(e, 'logout')}>Logout</MenuItem>
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
                <Paper>
                  <MenuList autoFocusItem={Boolean(this.state.anchorEl)}>
                    <MenuItem onClick={this.closeOpenedMenu}>Notification 1</MenuItem>
                    <MenuItem onClick={this.closeOpenedMenu}>Notification 2</MenuItem>
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
          <PersonIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'profile')} />
          <NotificationsNoneIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'notification')} />
          <InfoIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'info')} />
          <AddIcon className={classes.icon} onClick={(e) => this.openMenu(e, 'add')} />

          {/* Render menu list */}
          {this.renderMenuList(currentMenuOpen)}
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
  };
};

export default withStyles(styles)(TopNavigation);

const Wrapper = styled.div`
  background-color: #fff;
`;
