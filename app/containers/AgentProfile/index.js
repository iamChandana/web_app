/**
 *
 * AgentProfile
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import UserImage from 'components/UserImage';

import { RowGridLeft, ColumnGridLeft, ColumnGridCenter } from 'components/GridContainer';
import Text from 'components/Text';

import injectSaga from 'utils/injectSaga';
import makeSelectAgentProfile from './selectors';
import reducer from './reducer';
import saga from './saga';
import BackIcon from './back.svg';

import { UnPaddedGrid, Container, StyledLink, AvatarGrid, StyledBackImage } from './styles';
import InputValue from 'components/InputValue';

export class AgentProfile extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Container>
        <Grid container spacing={24} justify="flex-start" alignItems="flex-start">
          <Grid item xs={12}>
            <StyledLink to="/dashboard">
              <StyledBackImage src={BackIcon} />Back to Dashboard
            </StyledLink>
          </Grid>
          <Grid item xs={12}>
            <Text size="18px" color="#1d1d26" weight="600">
              Agent Profile
            </Text>
          </Grid>
          <AvatarGrid item xs={12}>
            <UserImage />
          </AvatarGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="FULL NAME" value="Test Foo" />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="USER NUMBER" value="A0245D41" />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="ID TYPE" value="NRIC" odd />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="ID NUMBER" value="791218145483" odd />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="GENDER" value="Male" />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="Mobile Number" value="+60 11 956 2459" />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="EMAIL ADDRESS" value="paulthomas79@email.com" odd />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="COUNTRY OF RESIDENCE" value="Malaysia" odd />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="ADDRESS" value="34, JALAN BEKA" />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="STATE" value="W.P.Kuala Lumpur" />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="POSTCODE" value="54110" odd />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6} />
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="POSITION" value="Agency Manager" />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="SUPERVISING MANAGER" value="Lim Tek Wei" />
          </UnPaddedGrid>
          <UnPaddedGrid item xs={12} sm={6}>
            <InputValue label="OFFICE REGION" value="Damansara" odd />
          </UnPaddedGrid>
        </Grid>
      </Container>
    );
  }
}

AgentProfile.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  agentProfile: makeSelectAgentProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'agentProfile', saga });

export default compose(withSaga, withConnect)(AgentProfile);
