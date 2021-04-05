import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';
import { startCase, toLower } from 'lodash';
import jwt from 'jsonwebtoken';
import { Switch, Route } from 'react-router-dom';
import { fetchAllAccountsForUser } from './action';

import { Button, Paper, Divider } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { MainWrapper } from 'components/common/MainWrapper';
import WrapperWithNavigation from 'components/WrapperWithNavigation';
import Projects from 'containers/Projects';
import ProjectDetail from 'containers/ProjectDetail';
import CreateNewJob from 'containers/ProjectJobs';
// import AuthCallback from 'containers/AuthCallback';

import logo from '../../utils/spreadsync_logo_black.png';
import Background from '../../utils/bgnew.png';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      selectedAccount: ''
    };
  }
  componentDidMount() {
    const token = localStorage.getItem('token');
    const selectedAccount = localStorage.getItem('account_id');
    const { accounts } = this.props.app;

    const tokenPayload = jwt.decode(token) || {};
    const { exp = 0, user = {} } = tokenPayload;

    if (moment(exp * 1000).isSameOrBefore(moment().format()) || !user.id) {
      this.props.history.push('/logout');
      return;
    }
    localStorage.setItem('user_id', user.id);
    if (selectedAccount) {
      this.redirectToProjectPage();
      if (accounts.length === 0) {
        this.props.fetchAllAccountsForUser(user.id);
      }
    } else {
      // Fetch all accounts for user
      this.props.fetchAllAccountsForUser(user.id);
    }
  }
  redirectToProjectPage = () => {
    const { pathname } = this.props.location;
    if (pathname === '/') {
      this.props.history.push('/projects');
    }
  };
  selectAccount = ({ id, name }) => {
    if (id) {
      localStorage.setItem('account_id', id);
      localStorage.setItem('account_name', name);
    }
  };
  handleSwitchAccount = each => {
    this.selectAccount(each);
    this.redirectToProjectPage();
  };
  componentDidUpdate(prevProps) {
    const { accounts } = this.props.app;
    const { accounts: prevAccounts } = prevProps.app;
    /* Redirect to /projects if user is engage to only one account */
    if (accounts !== prevAccounts && accounts.length === 1) {
      this.handleSwitchAccount(accounts[0]);
    }
  }
  render() {
    const { classes, app } = this.props;
    const { accounts = [] } = app;
    const selectedAccount = localStorage.getItem('account_id');

    /* Render loader? */
    if (!selectedAccount && accounts.length === 0) {
      return (
        <div className={classes.accountSwitcherWrapper}>
          <Paper className={classes.paper} elevation={3}>
            <LoadingProject>
              Fetching user data &nbsp;
              <span>&#8226;</span>
              <span>&#8226;</span>
              <span>&#8226;</span>
            </LoadingProject>
          </Paper>
        </div>
      );
    }

    if (!selectedAccount && accounts.length > 1) {
      return (
        <div className={classes.accountSwitcherWrapper}>
          <Paper className={classes.paper} elevation={3}>
            <div className={classes.logoWrapper}>
              <img className={classes.logo} src={logo} alt={'spreadsync logo'} height={70} />
            </div>
            <div className={classes.header}>Select Account</div>
            <Divider light className={classes.divider} />
            <div>
              {accounts.map(each => {
                const accountName = startCase(toLower(each.name));
                return (
                  <Button
                    key={each.id}
                    fullWidth
                    onClick={() => this.handleSwitchAccount(each)}
                    variant="contained"
                    className={classes.button}
                    color="secondary"
                  >
                    {accountName}
                  </Button>
                );
              })}
            </div>
          </Paper>
        </div>
      );
    }
    return (
      <WrapperWithNavigation>
        <Switch>
          <Route
            path="/projects/:id/job/new"
            render={props => (
              <MainWrapper nopadding>
                <CreateNewJob {...props} />
              </MainWrapper>
            )}
          />
          <Route
            path="/projects/:id/job/:jobid"
            render={props => <MainWrapper nopadding>Job detail view</MainWrapper>}
          />
          <Route
            path="/projects/:id"
            render={props => (
              <MainWrapper nopadding>
                <ProjectDetail {...props} />
              </MainWrapper>
            )}
          />
          <Route
            path="/projects"
            render={props => (
              <MainWrapper>
                <Projects {...props} />
              </MainWrapper>
            )}
          />
          <Route path="/integrations">Integrations</Route>
          <Route path="/teams">
            <MainWrapper>Teams</MainWrapper>
          </Route>
          <Route path="/profile">Profile and Account</Route>
          <Route path="/setting">Setting</Route>
        </Switch>
      </WrapperWithNavigation>
    );
  }
}

const mapStateToProps = state => {
  return {
    app: state.app
  };
};

const styles = theme => ({
  button: {
    backgroundColor: '#eee',
    // color: '#627284',
    color: theme.palette.primary.main,
    margin: '15px auto',
    textTransform: 'none',
    display: 'block'
  },
  accountSwitcherWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    overflow: 'scroll',
    textAlign: 'center',
    backgroundImage: `url('${Background}')`
  },
  paper: {
    padding: 20,
    width: 450,
    textAlign: 'center',
    margin: '0px auto',
    [theme.breakpoints.down('md')]: {
      width: '50%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '70%'
    }
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
    color: theme.palette.primary.main
  },
  divider: {
    margin: '20px auto'
  },
  logoWrapper: {
    margin: 10
  },
  logo: {
    userDrag: 'none',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    MsUserSelect: 'none'
  }
});

export default connect(mapStateToProps, {
  fetchAllAccountsForUser
})(withStyles(styles)(Main));

const LoadingProject = styled.p`
  @keyframes blink {
    /**
   * At the start of the animation the dot
   * has an opacity of .2
   */
    0% {
      opacity: 0.2;
    }
    /**
   * At 20% the dot is fully visible and
   * then fades out slowly
   */
    20% {
      opacity: 1;
    }
    /**
   * Until it reaches an opacity of .2 and
   * the animation can start again
   */
    100% {
      opacity: 0.2;
    }
  }

  span {
    /**
   * Use the blink animation, which is defined above
   */
    animation-name: blink;
    /**
   * The animation should take 1.4 seconds
   */
    animation-duration: 1.5s;
    /**
   * It will repeat itself forever
   */
    animation-iteration-count: infinite;
    /**
   * This makes sure that the starting style (opacity: .2)
   * of the animation is applied before the animation starts.
   * Otherwise we would see a short flash or would have
   * to set the default styling of the dots to the same
   * as the animation. Same applies for the ending styles.
   */
    animation-fill-mode: both;
    padding-right: 5px;
  }

  span:nth-child(2) {
    /**
   * Starts the animation of the third dot
   * with a delay of .2s, otherwise all dots
   * would animate at the same time
   */
    animation-delay: 0.4s;
  }

  span:nth-child(3) {
    /**
   * Starts the animation of the third dot
   * with a delay of .4s, otherwise all dots
   * would animate at the same time
   */
    animation-delay: 0.8s;
  }
`;
