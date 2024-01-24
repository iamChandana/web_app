import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _find from 'lodash/find';
import Tooltip from 'material-ui/Tooltip';
import Chip from 'components/Chip';
import Grid from 'material-ui/Grid';
import Checkbox from 'components/Checkbox';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import ReactTooltip from 'react-tooltip';
import Text from 'components/Text';
import _has from 'lodash/has';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Color from 'utils/StylesHelper/color';
import Button from 'components/Button';
import Dialog from 'components/Dialog';
import Modal from 'components/Modal';
import { StyledDiv2ColumnParent, StyledDiv2ColumnChildLeft, StyledDiv2ColumnChildRight } from 'utils/StylesHelper/common';

import { FundName, FundInfoSubText, CancelImageGrid, CancelMessageGrid } from './styles';
import Details from './Details';
import { CancelVerificationModal, CancelRspVerificationModal, CancelOnlinePaymentModal } from './Modals';
import IconWarning from '../images/icon-warning.png';
// import ProfitLossIndicator from './ProfileLossIndicator';

import DownIcon from '../images/down-arrow.svg';
import UpIcon from '../images/up-arrow.svg';

import InfoIcon from '../images/info-grey.svg';
import IconRSPEdit from '../images/rsp-edit.png';
import IconRSPStop from '../images/rsp-stop.png';
import Bell from './assets/bell.png';
import Transaction from './assets/transaction.png';
import CashSchemeIcon from './assets/cash_scheme_blue.svg';
import KWSPSchemeIcon from './assets/KWSP_scheme_blue.svg';
import { AccountNumber } from './AccountNumber';

import rspStatuses from '../../ClientDetails/TransactionModal/rspStatuses';
import {
  StyledExpansionPanelDetailsForCancelledRSP,
  StyledExpansionPanelDetailsForRejectedRSP,
  StyledExpansionPanelDetailsGreen,
  StyledExpansionPanelDetailsP,
  StyledExpansionPanelDetailsWarning,
} from '../../../components/FundWrapper/NotificationWrapper';
import { makeSelectPendingVerificationTrxRequestsFundCode, makeSelectIsRiskAssessmentExpired } from '../selectors';

const StyledText = styled(Text)`
  @media (min-width: 850px) {
    font-size: 18px;
  }
  font-size: 14px;
`;

const StyledExpansionPanelDetails = styled.div`
  padding: 0 !important;
`;

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #fff !important;
  padding: 7px !important;
  opacity: 0.75 !important;
  border-bottom: 1px solid #5d6d7e;
`;

const BolderText = styled.span`
  font-weight: bolder !important;
`;

const ArrowImage = styled.img`
  cursor: pointer;
  width: 20px;
  float: right;
`;
const StyledPanel = styled.div`
  margin-bottom: 16px;
  border-radius: 5px !important;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  padding: 16px;
  &::before {
    background-color: transparent !important;
  }
`;

export const TotalNetInvestedWrapper = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 10px;
    width: 10px;
    margin-left: 5px;
    cursor: pointer;
  }
`;

const RSPFund = styled.div`
  background-color: #035781;
  color: #ffffff;
  width: ${(props) => (props.extended ? '330px' : '225px')};
  font-size: 14px;
  float: right;
  padding: 8px;
  margin-left: 8px;
`;

const NotificationWrapper = styled.div`
  width: 35px;
  height: 35px;
  background: #d65e5e;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  margin: 3px 14px;
  cursor: pointer;
  position: absolute;
  right: 225px;
`;

const ErrorDescWrapper = styled.div`
  width: 250px;
  background: #f2f2f2;
`;

const ErrorDescBodyWrapper = styled.div`
  padding: 14px;
`;

const FlexBox = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 1024px) {
    span {
      line-height: normal !important;
    }
  }
`;

const CANCEL_PENDING_RSP_STATUS = ['Pending', 'Edit Pending'];

const stopPropagation = (e) => e.stopPropagation();
const InputWrapper = ({ children }) => <div onClick={stopPropagation}>{children}</div>;
class FundWrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      doShowStatus: true,
      isNotificationOpen: false,
      isCancelVerificationModalOpen: false,
      isCancelRspVerificationModalOpen: false,
      isCancelPaymentModalOpen: false,
      isRspPayment: false, // for cancel online payment transaction
    };
    this.handleNotificationModal = this.handleNotificationModal.bind(this);
    this.checkIfAccSuspended = this.checkIfAccSuspended.bind(this);
    this.toggleUnSubscribeModal = this.toggleUnSubscribeModal.bind(this);
    this.onClickOfUnsubscribe = this.onClickOfUnsubscribe.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleToggleCancelVerificationModal = this.handleToggleCancelVerificationModal.bind(this);
    this.handleToggleCancelRspVerificationModal = this.handleToggleCancelRspVerificationModal.bind(this);
    this.handleToggleCancelOnlinePaymentModal = this.handleToggleCancelOnlinePaymentModal.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ doShowStatus: false });
    }, 600000);
  }

  handleNotificationModal() {
    this.setState({ isNotificationOpen: !this.state.isNotificationOpen });
  }

  onClickOfUnsubscribe(fund) {
    this.props.callGetGroupedFunds(fund);
  }

  toggleUnSubscribeModal() {
    this.props.clearGroupedFunds();
  }

  checkIfAccSuspended(fund) {
    const { accountDetails } = this.props;
    const cashFundIndex = _findIndex(accountDetails.account, ['partnerAccountMappingId', fund.partnerAccountNo]);
    if (cashFundIndex !== -1) {
      if (accountDetails.account[cashFundIndex].AccountStatus !== 'A') {
        return true;
      }
    }
    return false;
  }

  closeNotification(customerId, investProductName, investmentProductId) {
    this.props.closeRspNotifications(customerId, investProductName, investmentProductId);
  }

  checkEmis(fundItem) {
    const { accountDetails } = this.props;
    return accountDetails.account.find((accountItem) => accountItem.partnerAccountMappingId === fundItem.partnerAccountNo).isEmis;
  }

  handleToggleCancelVerificationModal() {
    this.setState((prevState) => ({
      isCancelVerificationModalOpen: !prevState.isCancelVerificationModalOpen,
    }));
  }

  handleToggleCancelRspVerificationModal() {
    this.setState((prevState) => ({
      isCancelRspVerificationModalOpen: !prevState.isCancelRspVerificationModalOpen,
    }));
  }

  handleToggleCancelOnlinePaymentModal(isRspPayment) {
    this.setState((prevState) => ({
      isCancelPaymentModalOpen: !prevState.isCancelPaymentModalOpen,
      isRspPayment,
    }));
  }

  render() {
    const {
      expand,
      select,
      data,
      selected,
      switchFundSuccessData,
      transactionRequest,
      dataTransaction,
      toggleModelRSP,
      isTxnDoneUsingOnlinePayment,
      investmentPartnerProductIdsFromSubscriptionAfterOnBoarding,
      isSuspended,
      accountSelected,
      accountDetails,
      pendingTrxRequestsFundCode,
      isRiskAssessmentExpired,
    } = this.props;

    const customerId = accountDetails.id;
    const selectedMatch = _find(selected, { partnerProductId: data.partnerProductId, partnerAccountNo: data.partnerAccountNo });
    const isMatch = selectedMatch ? selectedMatch.investmentProductId === data.investmentProductId : false;
    const ToggleIcon = data.expanded ? UpIcon : DownIcon;
    let displaySuccessSwitchFund = false,
      displaySuccessRedeemFund = false,
      displaySuccessTopupFund = false,
      displaySuccessOnlinePayment = false,
      isPartOfNextTransactionRequest = false;

    if (switchFundSuccessData && switchFundSuccessData.transactions && switchFundSuccessData.transactions.length > 0) {
      for (const transactions of switchFundSuccessData.transactions) {
        if (transactions.switchorredeemPartnerProductId === data.partnerProductId) {
          displaySuccessSwitchFund = true;
          break;
        }
      }
    }
    if (!_isEmpty(transactionRequest) && !_isEmpty(transactionRequest.transactions)) {
      transactionRequest.transactions.map((item) => {
        if (data.partnerProductId === item.investmentPartnerProductId) {
          isPartOfNextTransactionRequest = true;
        }
      });
    }

    if (!_has(data, 'fund')) {
      return null;
    }

    if (dataTransaction && dataTransaction.transactionType) {
      if (dataTransaction.transactionType.toLowerCase() !== 'sa') {
        for (const transaction of dataTransaction.transactions) {
          if (transaction.switchorredeemPartnerProductId === data.partnerProductId) {
            if (
              dataTransaction.transactionType.toLowerCase() === 'sw' &&
              transaction.transactionPartnerProductId === data.partnerProductId &&
              data.partnerAccountNo === dataTransaction.partnerAccountNO
            ) {
              displaySuccessSwitchFund = true;
            }
            if (
              dataTransaction.transactionType.toLowerCase() === 'rd' &&
              transaction.transactionPartnerProductId === data.partnerProductId &&
              data.partnerAccountNo === dataTransaction.partnerAccountNO
            ) {
              displaySuccessRedeemFund = true;
            }
            break;
          }
        }
      } else if (dataTransaction.transactionType.toLowerCase() === 'sa') {
        for (const transaction of dataTransaction.transactions) {
          if (
            transaction.investmentPartnerProductId === data.partnerProductId &&
            data.partnerAccountNo === dataTransaction.partnerAccountNO
          ) {
            displaySuccessTopupFund = true;
          }
        }
      } else if (dataTransaction.transactionType.toLowerCase() === 'op') {
        for (const transaction of dataTransaction.transactions) {
          if (transaction.investmentPartnerProductId === data.partnerProductId) {
            displaySuccessOnlinePayment = true;
          }
        }
      }
    }

    if (
      investmentPartnerProductIdsFromSubscriptionAfterOnBoarding &&
      investmentPartnerProductIdsFromSubscriptionAfterOnBoarding.length > 0
    ) {
      for (const investmentPartnerProductId of investmentPartnerProductIdsFromSubscriptionAfterOnBoarding) {
        if (investmentPartnerProductId === data.partnerProductId) {
          displaySuccessTopupFund = true;
        }
      }
    }

    const checkIfFundIsPendingVerification = () => {
      const pendingTrxForSelectedFund = pendingTrxRequestsFundCode.filter(
        (item) => item.partnerAccountNO === data.partnerAccountNo,
      );
      if (pendingTrxForSelectedFund.length > 0) {
        const trxFunds = pendingTrxForSelectedFund.map((portfolio) => portfolio.transactionPartnerProductId);
        return trxFunds.includes(data.fund.fundcode);
      }
      return false;
    };

    const isPendingVerification = checkIfFundIsPendingVerification();

    const isRspPendingVerification =
      data.rspStatus === rspStatuses.pendingVerification ||
      data.rspStatus === rspStatuses.editPendingVerification ||
      data.rspStatus === rspStatuses.terminatePendingVerification;

    const statusChip = (data) => {
      const disableRSPStyle = {
        opacity: 0.7,
        pointerEvents: 'none',
      };
      if (data.fund.assetbreakdown.length > 0) {
        if (data.status === 'partial') {
          let displayNotSubscribeChip = true;
          if (
            displaySuccessSwitchFund == true ||
            displaySuccessRedeemFund == true ||
            displaySuccessTopupFund == true ||
            displaySuccessOnlinePayment == true
          ) {
            displayNotSubscribeChip = false;
          }

          return (
            <React.Fragment>
              <StyledDiv2ColumnParent>
                <StyledDiv2ColumnChildLeft>
                  <Chip name={data.fund.assetbreakdown[0].class} />
                  {//! isTxnDoneUsingOnlinePayment && displayNotSubscribeChip && <Chip color={'red'} name={'Not subscribed'} />
                  displayNotSubscribeChip && <Chip color={'red'} name={'Not subscribed'} />}
                  <AccountNumber partnerAccountNo={data.partnerAccountNo} accountType={data.accountType} />
                </StyledDiv2ColumnChildLeft>
                <StyledDiv2ColumnChildRight>
                  {data.status === 'partial' && (
                    <Text align="right" size="12px" display="inline-block" style={{ lineHeight: '41px' }}>
                      Fund is unsubscribed.{' '}
                      <span
                        style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => this.onClickOfUnsubscribe(data)}>
                        Cancel
                      </span>
                    </Text>
                  )}
                </StyledDiv2ColumnChildRight>
              </StyledDiv2ColumnParent>
              {/* Modal for unsubscribe */}
              <Modal
                width={600}
                height={600}
                open={this.props.unsubscribeModal}
                handleClose={this.toggleUnSubscribeModal}
                modalImage={IconWarning}
                title="Pending Transactions">
                <React.Fragment>
                  <Grid container direction="column" justify="center" alignItems="center" style={{ padding: '10px 0' }}>
                    <CancelImageGrid item xs={12}>
                      <Text align="center" size="18px" weight="bolder">
                        You have initiated the Cancellation for the following funds for
                        <br />
                        account{' '}
                        <img src={data.accountType === 'CS' ? CashSchemeIcon : KWSPSchemeIcon} alt="Account type" width="17px" />
                        {this.props.selectedFund && this.props.selectedFund.partnerAccountNo}.
                        <br />
                      </Text>
                    </CancelImageGrid>
                    <CancelImageGrid item xs={12}>
                      <ul>
                        {this.props.groupedFunds &&
                          this.props.groupedFunds.map((item) => (
                            <li>
                              <Text align="left" size="16px" weight="bolder">
                                • {item.fundCode} {item.fundName}
                              </Text>
                            </li>
                          ))}
                      </ul>
                    </CancelImageGrid>
                    <CancelMessageGrid item xs={12}>
                      <Text align="center" size="14px" weight="bolder">
                        Would you like to proceed?
                      </Text>
                    </CancelMessageGrid>
                  </Grid>
                  <Grid container direction="row" justify="center" alignItems="center" alignContent="center">
                    <Grid item xs={6}>
                      <Grid container direction="column" justify="center" alignItems="center">
                        <Button
                          onClick={() => {
                            this.props.callUnSubscribeApi();
                          }}
                          width="80%">
                          Yes
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid container direction="column" justify="center" alignItems="center">
                        <Button onClick={this.toggleUnSubscribeModal} primary width="80%">
                          No
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </React.Fragment>
              </Modal>
            </React.Fragment>
          );
        }

        let doShowNotification = false;
        if (
          data.rspPaymentDefault &&
          data.rspPaymentDefault.REJECTIONBILLINGDATE &&
          data.rspPaymentDefault.RSPRejectionReason &&
          data.rspPaymentDefault.RSPRejectionReason.trim().length
        ) {
          doShowNotification = true;
        }
        let isRspOffline = false;
        const { rspStatus } = data;
        if (
          rspStatus !== rspStatuses.pending &&
          rspStatus !== rspStatuses.inProgress &&
          rspStatus !== rspStatuses.editPending &&
          rspStatus !== rspStatuses.editInProgress &&
          rspStatus !== rspStatuses.terminationInProgress &&
          rspStatus !== rspStatuses.cancelled &&
          rspStatus !== rspStatuses.rejected &&
          rspStatus !== rspStatuses.completed &&
          rspStatus !== rspStatuses.pendingVerification &&
          rspStatus !== rspStatuses.editPendingVerification &&
          rspStatus !== rspStatuses.terminatePendingVerification &&
          rspStatus !== null
        ) {
          isRspOffline = true;
        }

        const isRspDisabled =
          this.props.selected.length > 1 ||
          data.rspStatus === 'Pending' ||
          (this.props.rspSuccessId &&
            this.props.rspSuccessId.id &&
            this.props.rspSuccessId.id.includes(data.investmentProductId)) ||
          data.isNonPDA ||
          isSuspended ||
          isPendingVerification ||
          isRspPendingVerification ||
          isRiskAssessmentExpired;

        return (
          <React.Fragment>
            <StyledDiv2ColumnParent>
              <StyledDiv2ColumnChildLeft>
                <Chip name={data.fund.assetbreakdown[0].class} />
                {isPendingVerification || isRspPendingVerification ? (
                  <Chip name="Not Verified" color="#ffff8e" textColor="#77777c" />
                ) : null}
                {/* {this.props.schemeType === 'all' && ( */}
                <AccountNumber partnerAccountNo={data.partnerAccountNo} accountType={data.accountType} />
                {/* )} */}
              </StyledDiv2ColumnChildLeft>
              <StyledDiv2ColumnChildRight>
                <FlexBox>
                  {doShowNotification && (
                    <NotificationWrapper onClick={this.handleNotificationModal}>
                      <img src={Bell} height="21px" style={{ marginTop: '6px' }} />
                    </NotificationWrapper>
                  )}
                  {(data.rspStatus === null || data.rspStatus === 'Cancelled' || data.rspStatus === 'Rejected') &&
                    Number(data.units) > 0 &&
                    !data.isKWSP &&
                    data.rspStatus !== rspStatuses.completed &&
                    data.rspStatus !== rspStatuses.terminationInProgress &&
                    data.rspStatus !== rspStatuses.editPending &&
                    data.rspStatus !== rspStatuses.pending &&
                    data.rspStatus !== rspStatuses.editRejected &&
                    data.rspStatus !== rspStatuses.editInProgress &&
                    data.rspStatus !== rspStatuses.terminationInProgress &&
                    data.rspStatus !== rspStatuses.inProgress &&
                    !this.checkEmis(data) && (
                      <Text align="right" size="12px" display="inline-block" style={{ lineHeight: '41px' }}>
                        Regular Savings not set.{' '}
                        <span
                          style={{
                            pointerEvents: isRspDisabled ? 'none' : 'auto',
                            color: isRspDisabled ? '#999999' : 'blue',
                            textDecoration: isRspDisabled ? '' : 'underline',
                            textDecorationColor: 'blue',
                            cursor: 'pointer',
                          }}
                          onClick={() => this.props.setUpRsp(data)}>
                          Set now
                        </span>
                      </Text>
                    )}
                  {(data.rspStatus === rspStatuses.completed ||
                    data.rspStatus === rspStatuses.editRejected ||
                    data.rspStatus === rspStatuses.editPending ||
                    data.rspStatus === rspStatuses.terminationInProgress ||
                    data.rspStatus === rspStatuses.editInProgress ||
                    isRspOffline) && (
                    <RSPFund
                      extended={isRspOffline}
                      style={
                        (this.props.rspSuccessId &&
                          this.props.rspSuccessId.id &&
                          this.props.rspSuccessId.id.includes(data.investmentProductId)) ||
                        Number(data.units) <= 0 ||
                        data.rspStatus === rspStatuses.editInProgress ||
                        data.rspStatus === rspStatuses.terminationInProgress ||
                        data.rspStatus === rspStatuses.editPending ||
                        data.isKWSP ||
                        data.isNonPDA ||
                        isSuspended ||
                        isPendingVerification ||
                        isRspPendingVerification ||
                        isRiskAssessmentExpired
                          ? disableRSPStyle
                          : {}
                      }>
                      <span style={{ marginRight: 5 }}>{isRspOffline ? rspStatus : 'Regular Savings Plan'}</span>{' '}
                      {!isRspOffline ? (
                        <React.Fragment>
                          <img
                            src={IconRSPEdit}
                            style={{ cursor: 'pointer' }}
                            alt="Change RSP"
                            data-tip
                            data-for="editRsp"
                            onClick={() => this.props.editRSP(data)}
                          />{' '}
                          <ReactTooltip1 id="editRsp" effect="solid" place="top" clickable>
                            <Text size="12px" color="#000" align="left">
                              Edit RSP
                            </Text>
                          </ReactTooltip1>
                        </React.Fragment>
                      ) : null}
                      <img
                        src={IconRSPStop}
                        style={{ cursor: 'pointer' }}
                        alt="Cancel RSP"
                        data-tip
                        data-for="cancelRsp"
                        onClick={() => this.props.toggleDialogCancelRSP(data)}
                      />
                      <ReactTooltip1 id="cancelRsp" effect="solid" place="top" clickable>
                        <Text size="12px" color="#000" align="left">
                          Cancel RSP
                        </Text>
                      </ReactTooltip1>
                    </RSPFund>
                  )}
                  {isPendingVerification ? (
                    <Text align="right" size="12px" display="inline-block" style={{ lineHeight: '41px' }}>
                      <span
                        style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={this.handleToggleCancelVerificationModal}>
                        Cancel Verification
                      </span>
                    </Text>
                  ) : null}
                  {isRspPendingVerification ? (
                    <Text align="right" size="12px" display="inline-block" style={{ lineHeight: '41px' }}>
                      <span
                        style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={this.handleToggleCancelRspVerificationModal}>
                        Cancel RSP Verification
                      </span>
                    </Text>
                  ) : null}
                  {data.isOnlinePaymentPending > 0 ? (
                    <Text align="right" size="12px" display="inline-block" style={{ lineHeight: '41px' }}>
                      <span
                        style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => this.handleToggleCancelOnlinePaymentModal(false)}>
                        Cancel Online Payment Link
                      </span>
                    </Text>
                  ) : null}
                  {CANCEL_PENDING_RSP_STATUS.includes(data.rspStatus) ? (
                    <Text align="right" size="12px" display="inline-block" style={{ lineHeight: '41px' }}>
                      <span
                        style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => this.handleToggleCancelOnlinePaymentModal(true)}>
                        Cancel {data.rspStatus.toLowerCase() === 'pending' ? 'Setup' : 'Edit'} RSP Link
                      </span>
                    </Text>
                  ) : null}
                </FlexBox>
              </StyledDiv2ColumnChildRight>
            </StyledDiv2ColumnParent>
            <Dialog
              open={this.state.isNotificationOpen}
              closeHandler={this.handleNotificationModal}
              maxWidth="sm"
              content={
                <Grid container direction="column" justify="center" alignItems="center">
                  <Grid container justify="center" align="center" alignItems="center" style={{ marginBottom: 20 }}>
                    <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                      <img src={Transaction} height="48px" />
                    </Grid>
                    <Grid item xs={12} style={{ paddingBottom: '5px' }}>
                      <Text size="14px" weight="bold">
                        RSP Transaction error
                      </Text>
                    </Grid>
                    <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                      <Text size="12px" color="#1d1d26" fontStyle="italic">
                        Please inform your Client that their recent RSP
                      </Text>
                      <Text size="12px" color="#1d1d26" fontStyle="italic">
                        transaction is unsuccessful.
                      </Text>
                    </Grid>
                    <Grid item xs={12}>
                      <ErrorDescWrapper>
                        <ErrorDescBodyWrapper>
                          <Text size="14px" size="14px" fontStyle="italic">
                            Error:{' '}
                            <span style={{ fontWeight: 'bolder' }}>
                              {data.rspPaymentDefault && data.rspPaymentDefault.RSPRejectionReason}
                            </span>
                          </Text>
                          <Text size="14px" size="14px" fontStyle="italic">
                            Date:{' '}
                            <span style={{ fontWeight: 'bolder' }}>
                              {data.rspPaymentDefault && moment(data.rspPaymentDefault.REJECTIONBILLINGDATE).format('YYYY-MM-DD')}
                            </span>
                          </Text>
                        </ErrorDescBodyWrapper>
                      </ErrorDescWrapper>
                    </Grid>
                  </Grid>
                </Grid>
              }
            />
          </React.Fragment>
        );
      }
      return null;
    };
    /*
  const onlinePaymentPendingSection = (data) => {
    let arr = [];
    for (let i=0;i<data.isOnlinePaymentPending;i++) {
      arr.push(
        <StyledExpansionPanelDetailsWarning showClose handleClose={() => this.closeNotification(customerId, data.fund.name, data.fund.isin)}>
          <Text align="left" style={{ marginLeft: 5 }}>
            Pending for payment.
          </Text>
       </StyledExpansionPanelDetailsWarning>
      );
    }
    return arr;
  }

  const onlinePaymentProgressSection = (data) => {
    let arr = [];
    for (let i=0;i<data.isOnlinePaymentInProgress;i++) {
      arr.push(
        <StyledExpansionPanelDetailsGreen showClose handleClose={() => this.closeNotification(customerId, data.fund.name, data.fund.isin)}>
          <Text align="left" style={{ marginLeft: 5 }}>
            The payment has been received. Order is now being processed. Units will be updated within 2 business days.
          </Text>
        </StyledExpansionPanelDetailsGreen>
      );
    }
    return arr;
  }
*/
    let doShowFund = true;
    if (data.status === 'resubscribe' && data.totalPurchase === null) {
      doShowFund = false;
    }

    const isEmailVerified = this.props.emailVerifiedIds.find(
      (
        item, // item will only hold single object ex. { '894212': '005' }
      ) => Object.keys(item)[0] === data.partnerAccountNo && Object.values(item)[0] === data.fund.fundcode,
    );

    return (
      <React.Fragment>
        <InputWrapper>
          {doShowFund && (
            <StyledPanel
              style={{
                border: isPartOfNextTransactionRequest ? `2px solid ${Color.C_LIGHT_BLUE}` : '0',
              }}>
              {statusChip(data, toggleModelRSP)}
              <Grid container direction="row" spacing={24} justify="flex-start">
                <Grid item lg={4} xs={3} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                  <Grid container direction="row" justify="flex-start">
                    <Grid item xs={2}>
                      <Checkbox
                        checked={isMatch}
                        value
                        onChange={() => select(data, isMatch)}
                        disabled={
                          this.checkEmis(data) ||
                          (_isEmpty(accountSelected) ? false : data.partnerAccountNo !== accountSelected) ||
                          (data.status && data.status.toLowerCase() === 'resubscribe') ||
                          (!data.isTopUpEnabled && (data.status && data.status.toLowerCase() === 'pending')) ||
                          // (data.status && data.status.toLowerCase() === 'pending') ||
                          (data.status && data.status.toLowerCase() === 'partial') ||
                          (data.status && data.status.toLowerCase() === 'pending verification') ||
                          this.checkIfAccSuspended(data) ||
                          data.hasDisabled ||
                          data.isNonPDA ||
                          isPendingVerification ||
                          isRspPendingVerification ||
                          isRiskAssessmentExpired
                        }
                        style={{
                          width: '20px',
                          opacity:
                            this.checkEmis(data) ||
                            (_isEmpty(accountSelected) ? false : data.partnerAccountNo !== accountSelected) ||
                            (data.status && data.status.toLowerCase() === 'resubscribe') ||
                            (!data.isTopUpEnabled && (data.status && data.status.toLowerCase() === 'pending')) ||
                            // (data.status && data.status.toLowerCase() === 'pending') ||
                            (data.status && data.status.toLowerCase() === 'partial') ||
                            (data.status && data.status.toLowerCase() === 'pending verification') ||
                            this.checkIfAccSuspended(data) ||
                            data.hasDisabled ||
                            data.isNonPDA ||
                            isPendingVerification ||
                            isRspPendingVerification ||
                            isRiskAssessmentExpired
                              ? 0.3
                              : 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <FundName weight="bold" align="left">
                        {data.fund.name}
                      </FundName>
                      <FundInfoSubText size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                        ISN CODE {data.fund.isin}
                      </FundInfoSubText>
                      <FundInfoSubText size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                        FUND CODE {data.fund.fundcode}
                      </FundInfoSubText>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={7} xs={8} style={{ paddingRight: 0, paddingLeft: 0 }}>
                  <Grid container direction="row" justify="space-between">
                    <Grid item lg={3} xs={3}>
                      <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4">
                        RSP AMOUNT
                      </Text>
                      <StyledText weight="bold" color={Color.C_GRAY}>
                        <NumberFormat
                          value={data.rspMaxAmount || '-'}
                          displayType={'text'}
                          thousandSeparator
                          prefix={'RM '}
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </StyledText>
                    </Grid>
                    <Grid item lg={3} xs={3}>
                      <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4">
                        Unit Price
                      </Text>
                      <StyledText weight="bold" color={Color.C_GRAY}>
                        <NumberFormat
                          value={data.fund.price || '-'}
                          displayType={'text'}
                          thousandSeparator
                          prefix={'RM '}
                          decimalScale={4}
                          fixedDecimalScale
                        />
                      </StyledText>
                    </Grid>
                    <Grid item lg={3} xs={3} style={{ paddingRight: '5px' }}>
                      <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4">
                        No. of Units
                      </Text>
                      <StyledText weight="bold" color={Color.C_GRAY}>
                        <NumberFormat
                          value={data.units || '-'}
                          displayType={'text'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </StyledText>
                    </Grid>
                    <Grid item lg={3} xs={3} style={{ paddingRight: '5px' }}>
                      <TotalNetInvestedWrapper item>
                        <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4">
                          Total Value
                        </Text>
                        <Tooltip id="tooltip-fab" title={'Due to rounding, values may vary'} placement="top">
                          <img src={InfoIcon} className="info" alt="Info" />
                        </Tooltip>
                      </TotalNetInvestedWrapper>
                      <StyledText weight="bold" color={Color.C_GRAY}>
                        <NumberFormat
                          value={data.totalNetAssetValue ? data.totalNetAssetValue : '-'}
                          displayType={'text'}
                          thousandSeparator
                          prefix={'RM '}
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </StyledText>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={1} xs={1} style={{ paddingLeft: 0 }}>
                  <ArrowImage src={ToggleIcon} onClick={() => expand(data)} alt="test" />
                </Grid>
              </Grid>
              {/* {!expanded && <TransactionStatus />} */}
              {/* </ExpansionPanelSummary> */}
              {data.expanded && (
                <StyledExpansionPanelDetails>
                  <Details data={data} />
                </StyledExpansionPanelDetails>
              )}
              {!this.props.rspNotificationDisabled && (
                <div>
                  {(displaySuccessSwitchFund || isEmailVerified) && (
                    <StyledExpansionPanelDetailsGreen>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        Authorisation Successful for Switching Fund. New fund and unit will be updated within the next business
                        day.
                      </Text>
                    </StyledExpansionPanelDetailsGreen>
                  )}
                  {displaySuccessRedeemFund && (
                    <StyledExpansionPanelDetailsGreen>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        Redemption Successful. The amount will be transferred within 10 business days.
                      </Text>
                    </StyledExpansionPanelDetailsGreen>
                  )}
                  {displaySuccessTopupFund && (!isTxnDoneUsingOnlinePayment || isTxnDoneUsingOnlinePayment == false) && (
                    <StyledExpansionPanelDetailsGreen>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        Units will be reflected accordingly once the payment is cleared.
                      </Text>
                    </StyledExpansionPanelDetailsGreen>
                  )}
                  {data.isOnlinePaymentPending > 0 ? (
                    <StyledExpansionPanelDetailsWarning>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        {data.isOnlinePaymentPending} pending for payment.
                      </Text>
                    </StyledExpansionPanelDetailsWarning>
                  ) : null}
                  {data.isOnlinePaymentInProgress > 0 ? (
                    <StyledExpansionPanelDetailsGreen>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        {data.isOnlinePaymentInProgress} payment has been received. Order is now being processed. Units will be
                        updated within 2 business days.
                      </Text>
                    </StyledExpansionPanelDetailsGreen>
                  ) : null}
                  {data.rspStatus ? (
                    data.rspStatus === 'Pending' ? (
                      <StyledExpansionPanelDetailsP>
                        <Text align="left" style={{ marginLeft: 5 }}>
                          <BolderText>Pending for enrolment.</BolderText>
                        </Text>
                      </StyledExpansionPanelDetailsP>
                    ) : (
                      data.rspStatus === 'Edit Pending' && (
                        <StyledExpansionPanelDetailsP>
                          <Text align="left" style={{ marginLeft: 5 }}>
                            <BolderText>Pending for edit enrolment.</BolderText>
                          </Text>
                        </StyledExpansionPanelDetailsP>
                      )
                    )
                  ) : null}
                  {!data.rspStatus &&
                  this.props.rspSuccessId &&
                  this.props.rspSuccessId.id &&
                  this.props.rspSuccessId.id.includes(data.investmentProductId) ? (
                    this.props.rspSuccessId.type === 'setUp' ? (
                      <StyledExpansionPanelDetailsP>
                        <Text align="left" style={{ marginLeft: 5 }}>
                          <BolderText>Pending for enrolment.</BolderText>
                        </Text>
                      </StyledExpansionPanelDetailsP>
                    ) : (
                      this.props.rspSuccessId.type === 'edit' && (
                        <StyledExpansionPanelDetailsP>
                          <BolderText>Pending for Edit enrolment.</BolderText>
                        </StyledExpansionPanelDetailsP>
                      )
                    )
                  ) : null}
                  {data.rspStatus === rspStatuses.completed && this.state.doShowStatus ? (
                    <StyledExpansionPanelDetailsGreen
                      showClose
                      handleClose={() => this.closeNotification(customerId, data.fund.name, data.fund.isin)}>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        The processing of the <BolderText>Enrolment/Update</BolderText> for the Regular Savings Plan is now{' '}
                        <BolderText>Completed.</BolderText>
                      </Text>
                    </StyledExpansionPanelDetailsGreen>
                  ) : null}
                  {data.rspStatus === rspStatuses.inProgress ? (
                    <StyledExpansionPanelDetailsGreen>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        The processing of the <BolderText>Enrolment</BolderText> for <BolderText>Regular Savings Plan</BolderText>{' '}
                        is currently <BolderText>{rspStatuses.inProgress}.</BolderText>
                      </Text>
                    </StyledExpansionPanelDetailsGreen>
                  ) : null}
                  {data.rspStatus === rspStatuses.editInProgress ? (
                    <StyledExpansionPanelDetailsGreen>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        The processing of the <BolderText>Update</BolderText> for <BolderText>Regular Savings Plan</BolderText> is
                        currently <BolderText>{rspStatuses.inProgress}.</BolderText>
                      </Text>
                    </StyledExpansionPanelDetailsGreen>
                  ) : null}
                  {data.rspStatus === rspStatuses.terminationInProgress ? (
                    <StyledExpansionPanelDetailsP>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        The processing of the <BolderText>Termination</BolderText> for{' '}
                        <BolderText>Regular Savings Plan</BolderText> is currently{' '}
                        <BolderText>{rspStatuses.inProgress}.</BolderText>
                      </Text>
                    </StyledExpansionPanelDetailsP>
                  ) : null}
                  {data.rspStatus === 'Edit Completed' && this.state.doShowStatus ? (
                    <StyledExpansionPanelDetailsGreen
                      showClose
                      handleClose={() => this.closeNotification(customerId, data.fund.name, data.fund.isin)}>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        The processing of the <BolderText>Update</BolderText> for <BolderText>Regular Savings Plan</BolderText> is
                        now <BolderText>Completed.</BolderText>
                      </Text>
                    </StyledExpansionPanelDetailsGreen>
                  ) : null}
                  {data.rspStatus === 'Rejected' && this.state.doShowStatus ? (
                    <StyledExpansionPanelDetailsForRejectedRSP
                      showClose
                      handleClose={() => this.closeNotification(customerId, data.fund.name, data.fund.isin)}>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        The subscription for the <BolderText>Regular Savings Plan</BolderText> is{' '}
                        <BolderText>Terminated/Rejected.</BolderText>
                      </Text>
                    </StyledExpansionPanelDetailsForRejectedRSP>
                  ) : null}
                  {data.rspStatus === 'Edit Rejected' && this.state.doShowStatus ? (
                    <StyledExpansionPanelDetailsForRejectedRSP>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        The processing of the <BolderText>Update</BolderText> for <BolderText>Regular Savings Plan</BolderText>{' '}
                        was <BolderText>Rejected.</BolderText>
                      </Text>
                    </StyledExpansionPanelDetailsForRejectedRSP>
                  ) : null}
                  {data.rspStatus === 'Cancelled' && this.state.doShowStatus ? (
                    <StyledExpansionPanelDetailsForCancelledRSP
                      showClose
                      handleClose={() => this.closeNotification(customerId, data.fund.name, data.fund.isin)}>
                      <Text align="left" style={{ marginLeft: 5 }}>
                        The subscription for the <BolderText>Regular Savings Plan</BolderText> is{' '}
                        <BolderText>Terminated/Rejected.</BolderText>
                      </Text>
                    </StyledExpansionPanelDetailsForCancelledRSP>
                  ) : null}
                </div>
              )}
            </StyledPanel>
          )}
        </InputWrapper>
        {this.state.isCancelVerificationModalOpen ? (
          <CancelVerificationModal
            open={this.state.isCancelVerificationModalOpen}
            handleClose={this.handleToggleCancelVerificationModal}
            partnerAccountNo={data.partnerAccountNo}
            accountType={data.accountType}
            fundCode={data.fund.fundcode}
          />
        ) : null}
        {this.state.isCancelRspVerificationModalOpen ? (
          <CancelRspVerificationModal
            open={this.state.isCancelRspVerificationModalOpen}
            handleClose={this.handleToggleCancelRspVerificationModal}
            partnerAccountNo={data.partnerAccountNo}
            accountType={data.accountType}
            fund={data.fund}
            rspStatus={data.rspStatus}
            rspRefNo={data.rspRefNo}
          />
        ) : null}
        {this.state.isCancelPaymentModalOpen ? (
          <CancelOnlinePaymentModal
            open={this.state.isCancelPaymentModalOpen}
            handleClose={this.handleToggleCancelOnlinePaymentModal}
            partnerAccountNo={data.partnerAccountNo}
            accountType={data.accountType}
            fundCode={data.fund.fundcode}
            isRspPayment={this.state.isRspPayment}
            rspRefNo={data.rspRefNo}
            rspStatus={data.rspStatus}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

FundWrapper.propTypes = {
  expand: PropTypes.func,
  select: PropTypes.func,
  data: PropTypes.object,
  selected: PropTypes.array,
  switchFundSuccessData: PropTypes.object,
  closeRspNotifications: PropTypes.func,
  pendingTrxRequestsFundCode: PropTypes.array,
  isRiskAssessmentExpired: PropTypes.bool.isRequired,
  emailVerifiedIds: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  pendingTrxRequestsFundCode: makeSelectPendingVerificationTrxRequestsFundCode(),
  isRiskAssessmentExpired: makeSelectIsRiskAssessmentExpired(),
});

const withConnect = connect(mapStateToProps);

export default withConnect(FundWrapper);
