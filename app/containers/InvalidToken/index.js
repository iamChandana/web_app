/**
 *
 * LogoutSummary
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Header from 'components/Header';
import Grid from 'material-ui/Grid';
import moment from 'moment';
import Button from 'components/Button';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import { ColumnGridCenter } from 'components/GridContainer';
import Text from 'components/Text';
import { selectAuthenticated } from 'containers/LoginPage/selectors';
import LogoutIcon from './logout.svg';

const StyledImage = styled.img`
  margin: 48px 0 32px 0;
`;

const StyledButton = styled(Button)`
  margin-top: 40px;
`;

const ItalicText = styled(Text)`
  font-style: italic;
`;
export class InvalidToken extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.state = {
      intervalId: 0,
      currentCount: 0,
    };
    this.redirectToLogin = this.redirectToLogin.bind(this);
  }

  componentWillMount() {
    // redirect to login afte 2 mins
    const intervalId = setInterval(this.redirectToLogin, 120000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  redirectToLogin() {
    this.props.history.push('/login');
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return <Redirect to={from} />;
    }
    const time = moment().format('h:mm A, D MMMM YYYY');
    return (
      <React.Fragment>
        <Header />
        <ColumnGridCenter>
          <Grid item>
            <StyledImage src={LogoutIcon} alt="logout" />
          </Grid>
          <Grid item>
            <Text size="14px" color="#1d1d26">
              Your token is invalid and/or expired.
            </Text>
          </Grid>
          <Grid item>
            <StyledButton primary onClick={this.redirectToLogin}>
              Back To Log In
            </StyledButton>
          </Grid>
        </ColumnGridCenter>
      </React.Fragment>
    );
  }
}

InvalidToken.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: selectAuthenticated(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InvalidToken);
