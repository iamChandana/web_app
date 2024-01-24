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
import { isIE } from 'react-device-detect';
import axios from 'axios';
import BaseUrl from 'utils/getDomainUrl';
import Config from 'config';
import PropTypes from 'prop-types';

import CheckIcon from './check.svg';
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

    // eslint-disable-next-line one-var
    let decodedData,
      isRedirectedFromIPay88 = false;
    let value = param.split('?');
    value = value[1].split('=');
    const key = value[0];
    let value1 = value[1];
    if (key === 'r') {
      isRedirectedFromIPay88 = true;
    }
    value1 = decodeURIComponent(value1); // value1.replace(/%3D/g, '');
    try {
      decodedData = JSON.parse(base64.decode(value1));
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

    if (decodedData.type === 'rsp') {
      this.setState({
        showIcon: true,
        message: decodedData.message,
        datePayment: moment().format('DD-MMM-YYYY'),
        decodedData,
        isRSP: true,
        totalAmount: decodedData.funds.map((item) => item.maxAmount).reduce((prev, next) => Number(prev) + Number(next)),
        showLoading: false,
      });
      return;
    }

    if (decodedData.errDesc) {
      this.setState({
        message: decodedData.errDesc,
        showLoading: false,
        rspErr: true,
      });
      return;
    }

    if (isRedirectedFromIPay88 && !decodedData.status) {
      this.setState({
        message: 'Invalid online payment parameters!',
        showLoading: false,
      });
      return;
    }

    if (!isRedirectedFromIPay88) {
      const { data } = decodedData;
      let url;
      // const url = `${BaseUrl}/api/TRs/${data.RefNo}/isValidTransaction`.replace('/api/api', '/api');
      if (BaseUrl === Config.API_ROOT_URL_UAT2_TEST) {
        url = `${BaseUrl}/api/TRs/${data.RefNo}/isValidTransaction`;
      } else {
        url = `${BaseUrl}/TRs/${data.RefNo}/isValidTransaction`;
      }

      axios
        .get(url)
        .then((response) => {
          if (response.data.isValidTransaction) {
            this.setState(
              {
                Url: decodedData.url,
                MerchantCode: data.MerchantCode,
                PaymentId: data.PaymentId,
                RefNo: data.RefNo,
                Amount: data.Amount,
                Currency: data.Currency,
                ProdDesc: data.ProdDesc,
                UserName: data.UserName,
                UserEmail: data.UserEmail,
                UserContact: data.UserContact,
                Remark: data.Remark,
                SignatureType: data.SignatureType,
                Signature: data.Signature,
                ResponseURL: data.ResponseURL,
                BackendURL: data.BackendURL,
              },
              () => {
                setTimeout(() => {
                  document.getElementById('formIpay88').submit();
                }, 800);
              },
            );
          } else {
            this.setState({
              isPaymentLinkExpired: true,
              showLoading: false,
              message: response.data.message,
            });
          }
        })
        .catch((error) => {
          this.setState({
            message: error,
            showLoading: false,
          });
          // eslint-disable-next-line no-console
          console.error(error);
        });
      // eslint-disable-next-line eqeqeq
    } else if (decodedData.status == 1 && !decodedData.errDesc) {
      this.setState({
        showIcon: true,
        message: 'Payment is successful.',
        decodedData,
        isRedirectedFromIPay88: true,
        datePayment: moment().format('DD-MMM-YYYY'),
        totalAmount: decodedData.transactions
          .map((item) => item.transactionAmount)
          .reduce((prev, next) => Number(prev) + Number(next)),
        showLoading: false,
      });
    } else {
      this.setState({
        message: decodedData.errDesc,
        showLoading: false,
      });
    }
  }

  redirectToAccount() {
    this.props.history.push('/clients');
  }

  render() {
    return (
      <React.Fragment>
        <LoadingOverlay show={this.state.showLoading} />
        <Header hideActionItem />
        <ColumnGridCenter style={{ marginTop: '50px' }}>
          {!isIE && this.state.showIcon ? (
            <Grid item xs={12} style={{ marginBottom: '20px' }}>
              <Icon src={CheckIcon} alt="Tick Icon" />
            </Grid>
          ) : (
            this.state.showIcon && (
              <React.Fragment>
                <Grid item xs={12} style={{ marginBottom: '20px' }}>
                  <Icon src={CheckIcon} alt="Tick Icon" />
                </Grid>
                <Grid item xs={12} style={{ marginBottom: '30px' }}></Grid>
              </React.Fragment>
            )
          )}

          {!this.state.showLoading && !this.state.rspErr && this.state.message}

          <Grid item xs={12}>
            <Text size="18px" weight="bold">
              {!this.state.showLoading && this.state.rspErr ? (
                <center>
                  <div style={{ marginTop: 30 }}>
                    <img src={AlertIcon} alt="alert" />
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Text size="18px" weight="bold">
                      {this.state.message}
                    </Text>
                  </div>
                  <div style={{ marginTop: 15 }}>
                    <Text size="14px" display="block">
                      Please contact your Agent for another enrolment/maintenance link.
                    </Text>
                  </div>
                </center>
              ) : null}
            </Text>
          </Grid>

          {this.state.isRSP && this.state.decodedData && (
            <React.Fragment>
              <Grid item xs={12} style={{ marginTop: 21, marginLeft: 10, marginRight: 10 }}>
                <Table border="0" style={{ maxWidth: '800px' }}>
                  <tr>
                    <td align="left" width="70%">
                      <Text size="16px" weight="bold" align="left">
                        Date
                      </Text>
                    </td>
                    <td align="left" width="30%">
                      <Text align="left">: {this.state.datePayment}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" width="70%">
                      <Text size="16px" weight="bold" align="left">
                        Reference No.
                      </Text>
                    </td>
                    <td align="left" width="30%">
                      : {this.state.decodedData.RefNo}
                    </td>
                  </tr>
                  <tr>
                    <td align="left" width="70%">
                      <Text size="16px" weight="bold" align="left">
                        Fund Name
                      </Text>
                    </td>
                    <td align="left" width="30%">
                      <Text size="16px" weight="bold" align="left">
                        Amount
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <Text style={{ paddingBottom: 10 }}></Text>
                    </td>
                  </tr>
                  {this.state.decodedData.funds.map((item) => (
                    <React.Fragment>
                      <tr style={{ borderTop: '1px solid #ccc' }}>
                        <td colSpan="2">
                          <Text style={{ paddingBottom: 10 }}></Text>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" width="70%">
                          <Text align="left">{item.name}</Text>
                        </td>
                        <td align="left" width="30%">
                          <Text align="left" weight="bold">
                            RM {currencyFormatter.format(item.maxAmount, { code: 'RM' })}
                          </Text>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <Text style={{ paddingBottom: 10 }}></Text>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr>
                    <td align="right" width="70%">
                      <Text size="16px" weight="bold" align="right" style={{ paddingRight: 5 }}>
                        Total Amount
                      </Text>
                    </td>
                    <td align="left" width="30%">
                      <Text align="left" weight="bold">
                        RM {currencyFormatter.format(this.state.totalAmount, { code: 'RM' })}
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <Text style={{ paddingBottom: 10 }}></Text>
                    </td>
                  </tr>
                </Table>
              </Grid>
              <Grid item xs={12} style={{ maxWidth: '650px', marginTop: 25 }}>
                <Text align="center">
                  If you did not make this request and believe an unauthorized person has accessed your account, please email us
                  on service@principal.com.my or contact our Customer Care Hotline on +(603) 7718 3000.
                </Text>
              </Grid>
            </React.Fragment>
          )}

          {this.state.isRedirectedFromIPay88 && this.state.decodedData && (
            <React.Fragment>
              <Grid item xs={12} style={{ marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                <Table border="0" style={{ maxWidth: '800px' }}>
                  <tr>
                    <td align="left" width="70%">
                      <Text size="16px" weight="bold" align="left">
                        Date
                      </Text>
                    </td>
                    <td align="left" width="30%">
                      <Text align="left">: {this.state.datePayment}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" width="70%">
                      <Text size="16px" weight="bold" align="left">
                        Reference No.
                      </Text>
                    </td>
                    <td align="left" width="30%">
                      : {this.state.decodedData.refNo}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <Text style={{ paddingBottom: 10 }}></Text>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" width="70%">
                      <Text size="16px" weight="bold" align="left">
                        Fund Name
                      </Text>
                    </td>
                    <td align="left" width="30%">
                      <Text size="16px" weight="bold" align="left">
                        Amount
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <Text style={{ paddingBottom: 10 }}></Text>
                    </td>
                  </tr>
                  {this.state.decodedData.transactions.map((item) => (
                    <React.Fragment>
                      <tr style={{ borderTop: '1px solid #ccc' }}>
                        <td colSpan="2">
                          <Text style={{ paddingBottom: 10 }}></Text>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" width="70%">
                          <Text align="left">{item.FundName}</Text>
                        </td>
                        <td align="left" width="30%">
                          <Text align="left" weight="bold">
                            RM {currencyFormatter.format(item.transactionAmount, { code: 'RM' })}
                          </Text>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <Text style={{ paddingBottom: 10 }}></Text>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr>
                    <td align="right" width="70%">
                      <Text size="16px" weight="bold" align="right" style={{ paddingRight: 5 }}>
                        Total Amount
                      </Text>
                    </td>
                    <td align="left" width="30%">
                      <Text align="left" weight="bold">
                        RM {currencyFormatter.format(this.state.totalAmount, { code: 'RM' })}
                      </Text>
                    </td>
                  </tr>
                </Table>
              </Grid>
              <Grid item xs={12} style={{ maxWidth: '650px', marginTop: 25 }}>
                <Text align="center">
                  If you did not make this request and believe an unauthorized person has accessed your account, please email us
                  on service@principal.com.my or contact our Customer Care Hotline on +(603) 7718 3000.
                </Text>
              </Grid>
            </React.Fragment>
          )}
          {this.state.isPaymentLinkExpired && (
            <center>
              <div style={{ marginTop: 30 }}>
                <img src={AlertIcon} alt="alert" />
              </div>
              <div style={{ marginTop: 20 }}>
                <Text size="18px" weight="bold">
                  {this.state.message}
                </Text>
              </div>
              <div style={{ marginTop: 15 }}>
                <Text size="14px" display="block">
                  Please contact your Agent for another payment link.
                </Text>
                <Text size="14px" display="block">
                  For initial investments, request for the Fund/s to be added again to your Account.
                </Text>
                <Text size="14px" display="block">
                  For top up transactions, request for a new transaction to be created.
                </Text>
              </div>
            </center>
          )}
        </ColumnGridCenter>
        <form id="formIpay88" action={this.state.Url} method="post">
          <input type="hidden" name="MerchantCode" id="MerchantCode" hidden value={this.state.MerchantCode} />
          <input type="hidden" name="PaymentId" id="PaymentId" value={this.state.PaymentId} />
          <input type="hidden" name="RefNo" id="RefNo" value={this.state.RefNo} />
          <input type="hidden" name="Amount" id="Amount" value={this.state.Amount} />
          <input type="hidden" name="Currency" id="Currency" value={this.state.Currency} />
          <input type="hidden" name="ProdDesc" id="ProdDesc" value={this.state.ProdDesc} />
          <input type="hidden" name="UserName" id="UserName" value={this.state.UserName} />
          <input type="hidden" name="UserEmail" id="UserEmail" value={this.state.UserEmail} />
          <input type="hidden" name="UserContact" id="UserContact" value={this.state.UserContact} />
          <input type="hidden" name="Remark" id="Remark" value={this.state.Remark} />
          <input type="hidden" name="SignatureType" id="SignatureType" value={this.state.SignatureType} />
          <input type="hidden" name="Signature" id="Signature" value={this.state.Signature} />
          <input type="hidden" name="ResponseURL" id="ResponseURL" value={this.state.ResponseURL} />
          <input type="hidden" name="BackendURL" id="BackendURL" value={this.state.BackendURL} />
        </form>
      </React.Fragment>
    );
  }
}

OnlinePayment.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default OnlinePayment;
