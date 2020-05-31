import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button } from '@material-ui/core/';
import logo from '../../utils/spreadsync_logo_black.png';
import { HeaderText } from './style';

import { confirmEmail } from './action';

class EmailConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      error: '',
    };
  }
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get('token');
    if (token) {
      const tokenPayload = jwt.decode(token) || {};
      const { user_id } = tokenPayload;
      if (!user_id) {
        this.setState({ error: 'Token is no longer valid!' });
      } else {
        this.setState({ token });
        /* Dispatch action */
        this.props.confirmEmail(token);
      }
    } else {
      this.props.history.push('/login');
      this.setState({ error: 'Token is no longer valid!' });
    }
  }
  render() {
    const { classes, auth } = this.props;
    const { token, error } = this.state;
    const {
      error: { CONFIRM_EMAIL: confirmEmailError = {} },
    } = auth;
    const message = token && !error ? 'Your email has been confirmed!' : error;
    const errorMessageIfAny = confirmEmailError && confirmEmailError.message ? confirmEmailError.message : null;
    return (
      <div className={classes.wrapper}>
        <Paper elevation={4} className={classes.paperWrapper}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={12} className={classes.gridWrapper}>
              <div className={classes.headerWrapper}>
                <StyledLogo src={logo} alt={'spreadsync logo'} height={70} />
                <HeaderText fontsize={'28px'}>
                  <span className={errorMessageIfAny ? classes.errorMessage : null}>
                    {errorMessageIfAny ? errorMessageIfAny : message}
                  </span>
                </HeaderText>
              </div>

              <Link to="/login" className={classes.loginButton}>
                <Button fullWidth variant="contained" color="secondary">
                  Login
                </Button>
              </Link>
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
    auth: state.auth,
  };
};

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '100vh',
    fontFamily: 'Lato, sans-serif',
  },
  headerWrapper: {
    marginBottom: 30,
    textAlign: 'center',
  },
  gridWrapper: {
    padding: 30,
    lineHeight: 'normal',
  },
  paperWrapper: {
    margin: '0px auto',
    width: '40%',
    [theme.breakpoints.down('md')]: {
      width: '80%',
    },
  },
  loginButton: {
    textDecoration: 'none',
  },
  errorMessage: {
    color: 'red',
  },
});
export default connect(mapStateToProps, {
  confirmEmail,
})(withStyles(styles)(EmailConfirmation));

const StyledLogo = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;
