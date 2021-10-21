import React, { useState, useEffect } from 'react';
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
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import StatisticsIcon from '@material-ui/icons/Equalizer';
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileIcon from '@material-ui/icons/Person';

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
    name: 'Workflow',
    icon: <AssignmentIcon />,
  },
  {
    name: 'Statistics',
    icon: <StatisticsIcon />,
  },
  {
    name: 'Profile',
    icon: <ProfileIcon />,
  },
  {
    name: 'Setting',
    icon: <SettingsIcon />,
  },
];
const Navigition = (props) => {
  const classes = useStyles();

  /* Mobile responsive menu setup */
  const { window, isAccountAdmin, isUserHaveOwnAccount } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /* Active tab setup */
  const [activeTab, handleTabChange] = useState(0);
  const { children, location, handleMainSearch } = props;

  const pathname = location.pathname.replace('/', '');
  let activeTabOnPageLoad = 0;

  if (pathname.includes('projects')) {
    activeTabOnPageLoad = 1;
  }
  if (pathname.includes('workflow')) {
    activeTabOnPageLoad = 2;
  }
  if (pathname.includes('statistics')) {
    activeTabOnPageLoad = 3;
  }
  if (pathname.includes('profile')) {
    activeTabOnPageLoad = 4;
  }
  if (pathname.includes('setting')) {
    activeTabOnPageLoad = 5;
  }
  const activeTabFinal = activeTab > 0 && activeTab === activeTabOnPageLoad ? activeTab : activeTabOnPageLoad;

  const getSearchBarLabel = () => {
    if (pathname === 'projects' || pathname === 'projects/') {
      return 'Search projects';
    }
    if (pathname.includes('projects')) {
      return 'Search jobs';
    }
    return 'Search';
  };
  const onlyAccountAdminTabs = ['Setting', 'Profile', 'Statistics'];

  const drawer = (
    <div>
      <div className={`${classes.toolbar} ${classes.centerDiv}`}>
        <div className={`${classes.logoDiv}`}></div>
      </div>
      <Divider />
      <List className={classes.leftNavList}>
        {routesWithIcons.map((each, key) => {
          if (!isAccountAdmin && onlyAccountAdminTabs?.includes(each.name)) {
            return null;
          }
          const isSelected = key + 1 === activeTabFinal;
          return (
            <Link
              key={each.name}
              onClick={() => handleTabChange(key + 1)}
              className={classes.menu_link}
              to={`/${each.name.toLowerCase()}`}
            >
              <ListItem selected={isSelected} button key={each.name} classes={{ selected: classes.active }}>
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
            <Search
              size="small"
              handleSearch={(e) => {
                e.preventDefault();
                handleMainSearch(e.target.value);
              }}
              placeholder={getSearchBarLabel()}
            />
          </span>
          <TopRightNav>
            <TopNavigation {...props} isUserHaveOwnAccount={isUserHaveOwnAccount} />
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
