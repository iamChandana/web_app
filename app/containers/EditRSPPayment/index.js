/**
 *
 * OnlinePayment
 *
 */

import React from 'react';
import Header from 'components/Header';
import Grid from 'material-ui/Grid';
import { ColumnGridCenter } from 'components/GridContainer';
import Text from 'components/Text';
import base64 from 'base-64';
import LoadingOverlay from 'components/LoadingOverlay';
import moment from 'moment';
import currencyFormatter from 'currency-formatter';
import styled from 'styled-components';
import CheckIcon from './check.svg';
import { isIE } from 'react-device-detect';
import axios from 'axios';
import BaseUrl from 'utils/getDomainUrl';
import AlertIcon from './alert.png';

const Icon = styled.img`
  width: 48px;
  height: 48px;
  align-self: center;
`;

const Table = styled.table`
  min-height: 0.01%;
  overflow-x: auto;
  width: 650px;

  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

export class OnlinePayment extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      message: null,
      showIcon: false,
      isPaymentLinkExpired: false,
      showLoading: true,
    };
  }

  componentWillMount() {
    const param = this.props.location.search;

    if (!param) {
      this.setState({
        message: 'Invalid email verification parameters!',
        showLoading: false,
      });
      return;
    }

    let decodedData,
      isRedirectedFromIPay88 = false;
    let value = param.split('?');
    value = value[1].split('=');
    let key = value[0];
    let value1 = value[1];
    if (key === 'r') {
      isRedirectedFromIPay88 = true;
    }
    value1 = decodeURIComponent(value1); //value1.replace(/%3D/g, '');
    try {
      decodedData = JSON.parse(base64.decode(value1));
      this.setState(
        {
          url: decodedData.url,
          data: {
            ...decodedData.data,
          },
        },
        () => {
          setTimeout(() => {
            document.getElementById('formEnrolmentIpay88').submit();
          }, 800);
        },
      );
    } catch (e) {
      this.setState({
        message: 'Invalid online payment parameters!',
        showLoading: false,
      });
      return;
    }

    if (!isRedirectedFromIPay88 && (!decodedData.url || !decodedData.data || !decodedData.data.MerchantCode)) {
      this.setState({
        message: 'Invalid online payment parameters!',
        showLoading: false,
      });
      return;
    }

    if (isRedirectedFromIPay88 && !decodedData.status) {
      this.setState({
        message: 'Invalid online payment parameters!',
        showLoading: false,
      });
      // return;
    }

    // if (!isRedirectedFromIPay88) {
    //   const { data } = decodedData;
    //   const url = `${BaseUrl}/TRs/${data.RefNo}/isValidTransaction`;

    //   axios
    //     .get(url)
    //     .then((response) => {
    //       if (response.data.isValidTransaction) {
    //         this.setState(
    //           {
    //             Url: decodedData.url,
    //             MerchantCode: data.MerchantCode,
    //             PaymentId: data.PaymentId,
    //             RefNo: data.RefNo,
    //             Amount: data.Amount,
    //             Currency: data.Currency,
    //             ProdDesc: data.ProdDesc,
    //             UserName: data.UserName,
    //             UserEmail: data.UserEmail,
    //             UserContact: data.UserContact,
    //             Remark: data.Remark,
    //             SignatureType: data.SignatureType,
    //             Signature: data.Signature,
    //             ResponseURL: data.ResponseURL,
    //             BackendURL: data.BackendURL,
    //           },
    //           () => {
    //             setTimeout(() => {
    //               document.getElementById('formIpay88').submit();
    //             }, 800);
    //           },
    //         );
    //       } else {
    //         this.setState({
    //           isPaymentLinkExpired: true,
    //           showLoading: false,
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       this.setState({
    //         message: error,
    //         showLoading: false,
    //       });
    //       console.error(error);
    //       return;
    //     });
    // } else {
    //   if (decodedData.status == 1 && !decodedData.errDesc) {
    //     this.setState({
    //       showIcon: true,
    //       message: 'Payment is successful.',
    //       decodedData: decodedData,
    //       isRedirectedFromIPay88: true,
    //       datePayment: moment().format('DD-MMM-YYYY'),
    //       totalAmount: decodedData.transactions.map((item) => item.transactionAmount).reduce((prev, next) => prev + next),
    //       showLoading: false,
    //     });
    //   } else {
    //     this.setState({
    //       message: decodedData.errDesc,
    //       showLoading: false,
    //     });
    //   }
    // }
  }

  redirectToAccount() {
    this.props.history.push('/clients');
  }

  render() {
    return (
      <React.Fragment>
        <form id="formEnrolmentIpay88" action={this.state.url} method="post">
          <input type="hidden" name="MerchantCode" id="MerchantCode" hidden value={this.state.data.MerchantCode} />
          <input type="hidden" name="RefNo" id="RefNo" value={this.state.data.RefNo} />
          <input type="hidden" name="MaxAmount" id="MaxAmount" value={this.state.data.MaxAmount} />
          <input type="hidden" name="Currency" id="Currency" value={this.state.data.Currency} />
          <input type="hidden" name="UserEmail" id="UserEmail" value={this.state.data.UserEmail} />
          <input type="hidden" name="UserPhone" id="UserPhone" value={this.state.data.UserPhone} />
          <input type="hidden" name="ActionType" id="ActionType" value={this.state.data.ActionType} />
          <input type="hidden" name="Remark" id="Remark" value={this.state.data.Remark} />
          <input type="hidden" name="TokenId" id="TokenId" value={this.state.data.TokenId} />
          <input type="hidden" name="SignatureType" id="SignatureType" value={this.state.data.SignatureType} />
          <input type="hidden" name="Signature" id="Signature" value={this.state.data.Signature} />
          <input type="hidden" name="ResponseURL" id="ResponseURL" value={this.state.data.ResponseURL} />
          <input type="hidden" name="BackendURL" id="BackendURL" value={this.state.data.BackendURL} />
        </form>
      </React.Fragment>
    );
  }
}

export default OnlinePayment;
