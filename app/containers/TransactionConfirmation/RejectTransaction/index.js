import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import get from 'lodash/get';

import Text from 'components/Text';
import FailedIc from './assets/failed-icon.png';
import TransactionSummary from '../components/TransactionSummary';
import RspSummary from '../components/RspSummary';
import { decodeRejectedTransactionRequest } from '../actions';

//  reuse the selectors
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

export class RejectTransaction extends React.PureComponent {
  componentDidMount() {
    const {
      history,
      location: { search },
      handleDecodeRejectedTransactionRequest,
    } = this.props;

    const encodedQueryStringMsg = new URLSearchParams(search).get('r');
    const qStrMsgFromEmail = encodedQueryStringMsg ? decodeURIComponent(encodedQueryStringMsg) : '';

    if (qStrMsgFromEmail.includes('expired')) {
      history.replace('/customers/tokenExpired');
    }
    handleDecodeRejectedTransactionRequest(search);
  }

  render() {
    const { verifyTransactionApiStatus, verifyTransactionApiResponse, verifyTransactionError, isRsp } = this.props;
    if (isApiLoading(verifyTransactionApiStatus)) return 'Rejecting transaction ...';
    if (isApiFailure(verifyTransactionApiStatus)) return get(verifyTransactionError, 'message') || 'An error has occurred.';

    return (
      <Grid spacing={24} container>
        <Grid item xs={12}>
          <ImgWrapper>
            <img src={FailedIc} alt="successfully rejecte4d" height={48} width={48} />
          </ImgWrapper>
        </Grid>
        <Grid item xs={12}>
          <Text size="18px" weight="bold">
            Transaction is successfully rejected.
          </Text>
        </Grid>
        <Grid item xs={12}>
          {isRsp ? (
            <RspSummary data={verifyTransactionApiResponse} />
          ) : (
            <TransactionSummary data={verifyTransactionApiResponse} hideFundsDetails />
          )}
        </Grid>
      </Grid>
    );
  }
}

RejectTransaction.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  handleDecodeRejectedTransactionRequest: PropTypes.func.isRequired,
  verifyTransactionApiStatus: PropTypes.string.isRequired,
  verifyTransactionError: PropTypes.object,
  verifyTransactionApiResponse: PropTypes.object,
  isRsp: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  verifyTransactionApiStatus: selectVerifyTransactionApiStatus,
  verifyTransactionError: selectVerifyTransactionApiError,
  verifyTransactionApiResponse: selectVerifyTransactionApiResponse,
});

const mapDispatchToProps = (dispatch) => ({
  handleDecodeRejectedTransactionRequest: (payload) => dispatch(decodeRejectedTransactionRequest(payload)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(RejectTransaction);
