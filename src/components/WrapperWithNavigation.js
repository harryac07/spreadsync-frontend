import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { toLower } from 'lodash';
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import BuildIcon from '@material-ui/icons/Build';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import Search from './Search';
import TopNavigation from './TopNavigation';
import Background from '../utils/spreadsync_logo_white.png';

const drawerWidth = 240;

const routesWithIcons = [
  {
    name: 'Projects',
    icon: <AssignmentIcon />,
  },
  {
    name: 'Teams',
    icon: <PeopleIcon />,
  },
  {
    name: 'Integrations',
    icon: <BuildIcon />,
  },
];
const Navigition = (props) => {
  const classes = useStyles();
  const [activeTab, handleTabChange] = useState(0);

  const { children, location } = props;

  /* Active tab setup */
  const pathname = location.pathname.replace('/', '');
  let activeTabOnPageLoad = 0;
  if (pathname === 'projects') {
    activeTabOnPageLoad = 1;
  }
  if (pathname === 'teams') {
    activeTabOnPageLoad = 2;
  }
  if (pathname === 'integrations') {
    activeTabOnPageLoad = 3;
  }
  const activeTabFinal = activeTab > 0 ? activeTab : activeTabOnPageLoad;

  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* Top Navigation */}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Search size="small" />
          <TopRightNav>
            <TopNavigation {...props} />
          </TopRightNav>
        </Toolbar>
      </AppBar>

      {/* Left Navigation */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={`${classes.toolbar} ${classes.centerDiv}`}>
          <div className={`${classes.logoDiv}`}></div>
        </div>
        <Divider />
        <List className={classes.leftNavList}>
          {routesWithIcons.map((each, key) => {
            if (toLower(each.name) !== toLower(pathname) && toLower(pathname).includes(toLower(each.name))) {
              return (
                <ListItem
                  selected={true}
                  button
                  key={each.name}
                  classes={{ selected: classes.active }}
                  onClick={() => props.history.goBack()}
                >
                  <ListItemIcon style={{ color: key + 1 === activeTabFinal ? '#7ED7DA' : '#fff' }}>
                    {each.icon}
                  </ListItemIcon>
                  <KeyboardArrowLeftIcon className={classes.backIcon} /> Back
                </ListItem>
              );
            }
            return (
              <Link
                key={each.name}
                onClick={() => handleTabChange(key + 1)}
                className={classes.menu_link}
                to={`/${each.name.toLowerCase()}`}
              >
                <ListItem
                  selected={key + 1 === activeTabFinal}
                  button
                  key={each.name}
                  classes={{ selected: classes.active }}
                >
                  <ListItemIcon style={{ color: key + 1 === activeTabFinal ? '#7ED7DA' : '#fff' }}>
                    {each.icon}
                  </ListItemIcon>
                  <ListItemText primary={each.name} />
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Drawer>

      {/* Container */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: '#fff',
    padding: '5px',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#3A3C67',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  centerDiv: {
    textAlign: 'right',
    position: 'relative',
    margin: '5px',
  },
  logoDiv: {
    position: 'absolute',
    top: 2,
    left: '30%',
    backgroundImage: `url('${Background}')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: '70%',
    height: '60px',
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#eee',
    padding: theme.spacing(3),
  },
  menu_link: {
    textDecoration: 'none',
    color: '#fff',
  },
  active: {
    backgroundColor: `#7D84AC !important`,
    color: theme.palette.secondary.main,
  },
  menuIcon: {
    cursor: 'pointer',
  },
  backIcon: {
    marginLeft: -10,
  },
}));

export default withRouter(Navigition);

const TopRightNav = styled.div`
  position: absolute;
  right: 15px;
`;
