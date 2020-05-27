import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Divider, Button } from '@material-ui/core/';

import Background from '../../utils/signup_bg.svg';
import logo from '../../utils/spreadsync_logo_black.png';
import GoogleIcon from './icons/googleIcon';

import { test } from './action';
import { HeaderText, ParaText } from './style';
import SignupForm from './Components/SignupForm';
import LoginForm from './Components/LoginForm';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSignupView = () => {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.headerWrapper}>
          <StyledLogo src={logo} alt={'spreadsync logo'} height={70} />
          <HeaderText fontsize={'32px'}>Sign up for free</HeaderText>
          <ParaText center color="#627284">
            &#8226; No credit card required &#8226; Free forever
          </ParaText>
        </div>
        <SignupForm />
        <SignUpSocialMedia>
          <div className="line-with-text-center">
            <span>Or sign up with</span>
          </div>
          <Button variant="contained" className={classes.buttonSocial}>
            <GoogleIcon />
            Google
          </Button>
          <p>
            Already have an account? <StyledLink to="/login">log in</StyledLink>
          </p>
        </SignUpSocialMedia>
      </React.Fragment>
    );
  };

  renderLoginView = () => {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.headerWrapper}>
          <StyledLogo src={logo} alt={'spreadsync logo'} height={70} />
          <HeaderText fontsize={'32px'}>Log in to your account</HeaderText>
          <ParaText center color="#627284">
            &#8226; Welcome back
          </ParaText>
        </div>
        <LoginForm />
        <SignUpSocialMedia>
          <div className="line-with-text-center">
            <span>Or login with</span>
          </div>
          <Button variant="contained" className={classes.buttonSocial}>
            <GoogleIcon />
            Google
          </Button>
          <p>
            Don't have an account yet? <StyledLink to="/signup">sign up</StyledLink>
          </p>
        </SignUpSocialMedia>
      </React.Fragment>
    );
  };
  render() {
    const { path } = this.props.match;
    const { classes } = this.props;
    const view = path.replace('/', '');
    return (
      <div className={classes.wrapper}>
        <Paper elevation={3} className={classes.paperWrapper}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={6} className={classes.leftWrapper}>
              <div>
                <HeaderText fontsize={'32px'}>Automate your data flow with Spreadsync.</HeaderText>
                <Divider light className={classes.divider} />
                <ParaText center>
                  Smart export powered by modern techs to keep your Marketing or Analytics platform up-to-date
                </ParaText>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6} className={classes.rightWrapper}>
              {view === 'signup' ? this.renderSignupView() : this.renderLoginView()}
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    app: state.app,
  };
};

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '100vh',
    fontFamily: 'Lato, sans-serif',
  },
  divider: {
    backgroundColor: '#fff',
    margin: '20px auto',
    width: '50%',
  },

  paperWrapper: {
    margin: '0px auto',
    width: '60%',
  },
  leftWrapper: {
    padding: 30,
    backgroundImage: `url('${Background}')`,
    // backgroundSize: 'cover',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  rightWrapper: {
    padding: 30,
    lineHeight: 'normal',
  },
  headerWrapper: {
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonSocial: {
    backgroundColor: '#fff',
    color: '#627284',
    fontSize: 14,
    textTransform: 'none',
    margin: '20px auto !important',
  },
};
export default connect(mapStateToProps, {
  test,
})(withStyles(styles)(Auth));

const StyledLogo = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

const SignUpSocialMedia = styled.div`
  text-align: center;
  div.line-with-text-center {
    width: 80%;
    height: 10px;
    margin: 10px auto;
    border-bottom: 1px solid #ccc;
    text-align: center;
    span {
      font-size: 14px;
      background-color: #fff;
      padding: 0 15px;
      color: #627284;
    }
  }
  button {
    margin: 10px auto;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #7ed7da;
`;
