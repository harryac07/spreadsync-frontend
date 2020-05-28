import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { startCase, toLower } from 'lodash';
import jwt from 'jsonwebtoken';
import { Switch, Route } from 'react-router-dom';
import { checkUserAuth } from './action';

import { Button, Paper, Divider } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { MainWrapper } from 'components/common/MainWrapper';
import WrapperWithNavigation from 'components/WrapperWithNavigation';
import Projects from 'containers/Projects';
import ProjectDetail from 'containers/ProjectDetail';

import logo from '../../utils/spreadsync_logo_black.png';
import Background from '../../utils/bgnew.png';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      selectedAccount: '',
    };
  }
  componentDidMount() {
    const token = localStorage.getItem('token');
    const selectedAccount = localStorage.getItem('account_id');

    const tokenPayload = jwt.decode(token) || {};
    const { exp = 0, user = {} } = tokenPayload;

    if (moment(exp * 1000).isSameOrBefore(moment().format()) || !user.id) {
      this.props.history.push('/logout');
      return;
    }
    localStorage.setItem('user_id', user.id);
    if (selectedAccount) {
      this.props.history.push('/projects');
    }
  }
  selectAccount = ({ id, name }) => {
    console.log('account selected ', id);
    if (id) {
      localStorage.setItem('account_id', id);
      localStorage.setItem('account_name', name);
      this.props.history.push('/projects');
    }
  };
  render() {
    const { classes } = this.props;

    const selectedAccount = localStorage.getItem('account_id');
    if (!selectedAccount) {
      return (
        <div className={classes.accountSwitcherWrapper}>
          <Paper className={classes.paper} elevation={3}>
            <div className={classes.logoWrapper}>
              <img className={classes.logo} src={logo} alt={'spreadsync logo'} height={70} />
            </div>
            <div className={classes.header}>Select Account</div>
            <Divider light className={classes.divider} />
            <div>
              {[
                {
                  id: '1',
                  name: 'Marimekko',
                },
                {
                  id: '2',
                  name: 'Test account 1',
                },
                {
                  id: '3',
                  name: 'Test account 2',
                },
                {
                  id: '4',
                  name: 'Test account for Vainu',
                },
              ].map((each) => {
                const accountName = startCase(toLower(each.name));
                return (
                  <Button
                    key={each.id}
                    fullWidth
                    onClick={() => this.selectAccount(each)}
                    variant="contained"
                    className={classes.button}
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
        <MainWrapper>
          <Switch>
            <Route path="/projects/:id" component={ProjectDetail} />
            <Route path="/projects" component={Projects} />
            <Route path="/integrations">Integrations</Route>
            <Route path="/teams">Teams</Route>
            <Route path="/profile">Profile and Account</Route>
            <Route path="/setting">Setting</Route>
          </Switch>
        </MainWrapper>
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
    backgroundColor: '#fff',
    color: '#627284',
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
  checkUserAuth,
})(withStyles(styles)(Main));
