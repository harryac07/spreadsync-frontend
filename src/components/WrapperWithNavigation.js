import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
  Hidden,
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import BuildIcon from '@material-ui/icons/Build';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Search from './Search';
import TopNavigation from './TopNavigation';
import Background from '../utils/spreadsync_logo_white.png';
import backgroundImage from '../utils/ss_bg.png';

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

  /* Mobile responsive menu setup */
  const { window } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /* Active tab setup */
  const [activeTab, handleTabChange] = useState(0);
  const { children, location } = props;

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

  const drawer = (
    <div>
      <div className={`${classes.toolbar} ${classes.centerDiv}`}>
        <div className={`${classes.logoDiv}`}></div>
      </div>
      <Divider />
      <List className={classes.leftNavList}>
        {routesWithIcons.map((each, key) => {
          return (
            <Link
              key={each.name}
              onClick={() => handleTabChange(key + 1)}
              className={classes.menu_link}
              to={`/${each.name.toLowerCase()}`}
            >
              <ListItem
                selected={key + 1 === activeTabFinal || toLower(pathname).includes(toLower(each.name))}
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
    </div>
  );
  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* Top Navigation */}
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <span className={classes.searchTop}>
            <Search size="small" />
          </span>
          <TopRightNav>
            <TopNavigation {...props} />
          </TopRightNav>
        </Toolbar>
      </AppBar>

      {/* Left Navigation */}
      <nav className={classes.drawer} aria-label="permanent-nav">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>

      {/* Main container body*/}
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
    width: `100%`,
    marginLeft: drawerWidth,
    backgroundColor: '#fff',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '5px',
    },
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  searchTop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: 'cover',
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
    backgroundColor: '#f6f6f6',
    width: '100%',
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
