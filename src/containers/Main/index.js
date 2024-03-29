import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';
import { startCase, toLower } from 'lodash';
import { toast } from 'react-toastify';
import jwt from 'jsonwebtoken';
import { Switch, Route } from 'react-router-dom';
import { fetchAllAccountsForUser, fetchCurrentUser, setSearchKeyword, createAccount } from './action';

import { Button, Paper, Divider, Fade, Chip } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { MainWrapper } from 'components/common/MainWrapper';
import WrapperWithNavigation from 'components/WrapperWithNavigation';
import Projects from 'containers/Projects';
import ProjectDetail from 'containers/ProjectDetail';
import JobDetails from 'containers/ProjectJobDetails';
import Profile from 'containers/Profile';
import Workflow from 'containers/ProjectDetail/Components/Workflow';
import Settings from 'containers/Settings';
import SelectAccountForm from 'containers/Auth/Components/SelectAccountForm';

import logo from '../../utils/spreadsync_logo_black.png';
import Background from '../../utils/bgnew.png';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      selectedAccount: '',
      isCreateNewAccountRequested: false,
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
        this.props.fetchCurrentUser(user.id);
      }
    } else {
      // Fetch all accounts for user
      this.props.fetchAllAccountsForUser(user.id);
      this.props.fetchCurrentUser(user.id);
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
  handleSwitchAccount = (each) => {
    this.setState({ isCreateNewAccountRequested: false });
    this.selectAccount(each);
    this.redirectToProjectPage();
  };
  handleCreateAccount = ({ account_name }) => {
    this.props.createAccount({
      name: account_name,
      admin: localStorage.getItem('user_id'),
    });
  };
  componentDidUpdate(prevProps) {
    const { accounts, accountCreated } = this.props.app;
    const { search } = this.props.location;
    const { history } = this.props;
    const { isCreateNewAccountRequested } = this.state;
    const { accounts: prevAccounts, accountCreated: prevAccountCreated } = prevProps.app;

    const isUserHaveOwnAccount = accounts.find(({ admin }) => {
      return admin === localStorage.getItem('user_id');
    });

    /* Redirect to /projects if user is engage to only one account */
    if (accounts !== prevAccounts && accounts.length === 1) {
      this.handleSwitchAccount(accounts[0]);
    }

    if (accountCreated !== prevAccountCreated && accountCreated) {
      this.setState({ isCreateNewAccountRequested: false });
      toast.success(`User owned new account has been created successfully!`);
      localStorage.removeItem('account_id');
      localStorage.removeItem('account_name');
      history.push('/');
    }

    if (search?.includes('?create_new_account=true') && !isUserHaveOwnAccount && !isCreateNewAccountRequested) {
      this.setState({ isCreateNewAccountRequested: true }, () => {
        history.push({
          pathname: '/',
          search: '',
        });
      });
    }
  }
  render() {
    const { isCreateNewAccountRequested } = this.state;
    const { classes, app, setSearchKeyword, history } = this.props;
    const { accounts = [], isAccountFetchSucceed } = app;
    const selectedAccount = localStorage.getItem('account_id');
    const isUserHaveOwnAccount = accounts.find(({ admin }) => {
      return admin === localStorage.getItem('user_id');
    });

    /* Render loader? */
    if ((!selectedAccount && accounts.length === 0) || isCreateNewAccountRequested) {
      if (isAccountFetchSucceed) {
        return (
          <Fade in timeout={{ enter: 800 }}>
            <div className={classes.accountSwitcherWrapper}>
              <div style={{ position: 'absolute', top: 20, right: 20 }}>
                {isCreateNewAccountRequested ? (
                  <Button
                    fullWidth
                    onClick={() => {
                      this.setState({ isCreateNewAccountRequested: false });
                      if (accounts?.length) {
                        history.push('/projects');
                      }
                    }}
                    variant="contained"
                    className={classes.button}
                    color="secondary"
                    size="small"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    onClick={() => history.push('/logout')}
                    variant="contained"
                    className={classes.button}
                    color="secondary"
                    size="small"
                  >
                    Logout
                  </Button>
                )}
              </div>
              <div>
                <Paper className={classes.paper} elevation={3}>
                  <div className={classes.header}>You do not have your own active account!</div>
                  <LoadingProject>Please create a new one to begin!</LoadingProject>
                </Paper>
                <br />
                <Paper className={classes.paper} elevation={3}>
                  <SelectAccountForm handleSubmit={this.handleCreateAccount} submitButtonText={'Submit'} />
                </Paper>
              </div>
            </div>
          </Fade>
        );
      }
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
              {accounts.map((each) => {
                const accountName = each.name;
                const isOwner = each?.admin === localStorage.getItem('user_id');
                return (
                  <Button
                    key={each.id}
                    fullWidth
                    onClick={() => this.handleSwitchAccount(each)}
                    variant="contained"
                    className={classes.button}
                    color="secondary"
                  >
                    {accountName} {isOwner && <Chip color="secondary" label="Owner" size="small" variant="outlined" />}
                  </Button>
                );
              })}
            </div>
            {!isUserHaveOwnAccount && (
              <div>
                <p>Or</p>
                <Button
                  onClick={() => this.setState({ isCreateNewAccountRequested: true })}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Create new account
                </Button>
              </div>
            )}
          </Paper>
        </div>
      );
    }
    const currentAccount = accounts?.find(({ id }) => id === selectedAccount);
    const isAccountAdmin = currentAccount?.admin === localStorage.getItem('user_id');

    return (
      <WrapperWithNavigation
        handleMainSearch={(text) => setSearchKeyword(text)}
        isAccountAdmin={isAccountAdmin}
        isUserHaveOwnAccount={isUserHaveOwnAccount}
      >
        <Switch>
          <Route
            path="/projects/:id/job/new"
            render={(props) => (
              <MainWrapper nopadding>
                <JobDetails {...{ ...props, isAccountAdmin }} />
              </MainWrapper>
            )}
          />
          <Route
            path="/projects/:id/job/:jobid"
            render={(props) => (
              <MainWrapper nopadding>
                <JobDetails {...{ ...props, isAccountAdmin }} />
              </MainWrapper>
            )}
          />
          <Route
            path="/projects/:project_id/workflow/new"
            render={(props) => (
              <MainWrapper nopadding>
                <Workflow {...{ ...props, isAccountAdmin }} />
              </MainWrapper>
            )}
          />
          <Route
            path="/projects/:project_id/workflow/:workflow_id"
            render={(props) => (
              <MainWrapper nopadding>
                <Workflow {...{ ...props, isAccountAdmin }} />
              </MainWrapper>
            )}
          />
          <Route
            path="/projects/:id"
            render={(props) => (
              <MainWrapper nopadding>
                <ProjectDetail {...{ ...props, isAccountAdmin }} />
              </MainWrapper>
            )}
          />
          <Route
            path="/projects"
            render={(props) => (
              <MainWrapper>
                <Projects {...{ ...props, isAccountAdmin }} />
              </MainWrapper>
            )}
          />
          <Route
            path="/profile"
            render={(props) => (
              <MainWrapper nopadding>
                <Profile {...{ ...props, isAccountAdmin }} />
              </MainWrapper>
            )}
          />
          <Route path="/statistics">Account statistics</Route>
          <Route
            path="/setting"
            render={(props) => (
              <MainWrapper nopadding>
                <Settings {...props} />
              </MainWrapper>
            )}
          />
        </Switch>
      </WrapperWithNavigation>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app,
  };
};

const styles = (theme) => ({
  button: {
    backgroundColor: '#eee',
    // color: '#627284',
    color: theme.palette.primary.main,
    margin: '15px auto',
    textTransform: 'none',
    display: 'block',
  },
  accountSwitcherWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    overflow: 'scroll',
    textAlign: 'center',
    backgroundImage: `url('${Background}')`,
  },
  paper: {
    padding: 20,
    width: 450,
    textAlign: 'center',
    margin: '0px auto',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '70%',
    },
  },
  header: {
    fontWeight: 'bold',
    fontSize: 22,
    color: theme.palette.primary.main,
  },
  divider: {
    margin: '20px auto',
  },
  logoWrapper: {
    margin: 10,
  },
  logo: {
    userDrag: 'none',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    MsUserSelect: 'none',
  },
});

export default connect(mapStateToProps, {
  fetchAllAccountsForUser,
  setSearchKeyword,
  fetchCurrentUser,
  createAccount,
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
