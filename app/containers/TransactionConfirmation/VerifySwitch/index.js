import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Text from 'components/Text';
import { createStructuredSelector } from 'reselect';
import { get } from 'lodash';
import CheckIc from './assets/check.svg';
import { verifySwitchRequest } from '../actions';
import SwitchSummary from '../components/SwitchSummary';
import {
  selectVerifyTransactionApiError,
  selectVerifyTransactionApiResponse,
  selectVerifyTransactionApiStatus,
} from '../selectors';
import { API_STATUS_TYPES } from '../constants';

const ImgWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const isApiLoading = (apiStatus) => apiStatus === API_STATUS_TYPES.IDLE || apiStatus === API_STATUS_TYPES.PROCESSING;
const isApiFailure = (apiStatus) => apiStatus === API_STATUS_TYPES.FAILURE;

export class VerifySwitch extends React.PureComponent {
  componentDidMount() {
    const {
      history,
      location: { search },
      handleVerifySwitchRequest,
    } = this.props;

    // r is the encoded response message in case there is error
    // when it is success, r will be "Your%20transaction%20has%20been%20verified%20successfully%21"
    const encodedQueryStringMsg = new URLSearchParams(search).get('r');
    const qStrMsgFromEmail = encodedQueryStringMsg ? decodeURIComponent(encodedQueryStringMsg) : '';
    if (qStrMsgFromEmail.includes('expired')) {
      history.replace('/customers/tokenExpired');
    }

    const token = new URLSearchParams(search).get('t');
    // when calling api failed, token will not be available
    handleVerifySwitchRequest({ token, qStrMsgFromEmail });
  }

  render() {
    const { verifyTransactionApiStatus, verifyTransactionApiResponse, verifyTransactionError } = this.props;
    if (isApiLoading(verifyTransactionApiStatus)) {
      return <Text align="center">Verifying transaction ...</Text>;
    }

    if (isApiFailure(verifyTransactionApiStatus)) {
      return <Text align="center">{get(verifyTransactionError, 'message') || 'An error has occurred.'}</Text>;
    }

    return (
      <Grid spacing={24} container>
        <Grid item xs={12}>
          <ImgWrapper>
            <img src={CheckIc} alt="successfully verified" height={48} width={48} />
          </ImgWrapper>
        </Grid>
        <Grid item xs={12}>
          <Text size="18px" weight="bold">
            Transaction is successfully verified.
          </Text>
        </Grid>
        <Grid item xs={12}>
          <SwitchSummary data={verifyTransactionApiResponse} />
        </Grid>
      </Grid>
    );
  }
}

VerifySwitch.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  handleVerifySwitchRequest: PropTypes.func.isRequired,
  verifyTransactionApiStatus: PropTypes.string.isRequired,
  verifyTransactionError: PropTypes.object,
  verifyTransactionApiResponse: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  handleVerifySwitchRequest: (payload) => dispatch(verifySwitchRequest(payload)),
});

const mapStateToProps = createStructuredSelector({
  verifyTransactionApiStatus: selectVerifyTransactionApiStatus,
  verifyTransactionError: selectVerifyTransactionApiError,
  verifyTransactionApiResponse: selectVerifyTransactionApiResponse,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(VerifySwitch);
