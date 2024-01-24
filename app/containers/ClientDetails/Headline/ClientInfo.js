/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-script-url */
/**
 *
 * ClientDetails
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Grid from 'material-ui/Grid';
import moment from 'moment';
import Tooltip from 'material-ui/Tooltip';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';

import Text from 'components/Text';
import Dialog from 'components/Dialog';
import Color from 'utils/StylesHelper/color';
import Chip from 'components/Chip';
import defaultFont from 'utils/StylesHelper/font';
import { ColumnGridCenter, RowGridCenter, RowGridSpaceBetween, ColumnGridLeft } from 'components/GridContainer';
import EmailVerification from 'components/Dialog/EmailVerification';

import CashIcon from '../images/cash.svg';
import KWSPIcon from '../images/kwsp.svg';
import InfoLogo from '../images/info-logo.svg';
import Avatar from '../Avatar';
import BackToClient from '../BackToClient';
import LastUpdated from '../LastUpdated';
import NameAndStatus from '../NameAndStatus';
import UserInfo from '../UserInfo';
import EmailIcon from '../images/email.svg';
import CardIcon from '../images/id-card.svg';
import PhoneIcon from '../images/telephone.svg';
import InfoIcon from '../images/info.png';
import BellIcon from '../images/bell.svg';
import { getAccountType, getNetAssetValues, getToolTipWidth } from '../utils/getAccountHolderType';

import {
  ProfileInfoContainer,
  InvestmentDataContainer,
  StyledNumberFormat,
  TotalNetInvestedWrapper,
  StatusGrid,
  DetailsText,
  SubText,
} from '../styles';
import { makeSelectProcessing, makeSelectClientDetails, makeSelectError, makeSelectClientAccDetail } from '../selectors';

// const TITLE = 'Includes fees';

const Icon = styled.img`
  margin-left: 3px;
`;

const StyledChip = styled(Chip)`
  height: 24px;
  border-radius: 14px;
  margin-left: 5px;
`;

const CustomTooltip = styled.div`
  display: inline-block;
  position: relative;
  text-align: left;

  & > .bottom {
    min-width: ${(props) => (props.minWidth ? props.minWidth : '300px')};
    top: 25px;
    left: 55%;
    transform: translate(-50%, 0);
    padding: 10px 10px;
    color: #000000;
    background-color: #ffffff;
    border-radius: 8px;
    position: absolute;
    z-index: 99999999;
    box-sizing: border-box;
    box-shadow: 0;
    display: none;
    text-align: left;
  }

  &:hover > .bottom {
    display: block;
  }

  &:active > .bottom {
    display: block;
  }

  & > .bottom > i {
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -12px;
    width: 24px;
    height: 12px;
    overflow: hidden;
  }

  & > .bottom > i:after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    left: 50%;
    transform: translate(-50%, 50%) rotate(45deg);
    background-color: #ffffff;
    box-shadow: 0 1px 8px #ffffff;
  }
`;

const StatusContainer = styled.div`
display : "flex"
padding-right: "10px"
`;

const StatusIcon = styled.img`
  margin-right: 7px;
  margin-bottom: 7px;
  vertical-align: bottom;
  cursor: pointer;
`;

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.7px;
  background-color: ${(props) => props.btnBgColor};
  border: 1px solid ${Color.C_LIGHT_BLUE};
  margin-top: 32px;
  color: ${(props) => props.btnFontColor};
  font-family: ${defaultFont.primary.name};
  outline: none;
  cursor: pointer;
`;

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #676775 !important;
  padding: 15px !important;
  opacity: 0.85 !important;
  margin-right: 50px !important;
  width: 260px !important;
`;

const SuspendedStyle = styled.div`
  width: 5px;
  height: 5px;
  background-color: #f57059;
  margin-bottom: -7px;
  margin-left: 10px;
  border-radius: 10px;
`;

const CustomText = styled.div`
  display: inline;
  text-decoration: underline;
  color: ${Color.C_LIGHT_BLUE};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? '0.7' : '1')};
  margin-left: 2px;
`;

export class ClientInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDialogConfirmEmailResend: false,
      isOpenDialogResentEmail: false,
      isOpenDialogQuestion: false,
      isResendEmailEnabled: false,
    };
    this.submitResendConfirmationEmail = this.submitResendConfirmationEmail.bind(this);
    this.openDialogConfirmEmailResend = this.openDialogConfirmEmailResend.bind(this);
    this.openDialogResentEmail = this.openDialogResentEmail.bind(this);
    this.submitDialogQuestion = this.submitDialogQuestion.bind(this);
    this.openDialogQuesion = this.openDialogQuesion.bind(this);
    this.checkIfEmailSentWithinCertainTime = this.checkIfEmailSentWithinCertainTime.bind(this);
    this.getExpiryTime = this.getExpiryTime.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.messageResentConfirmationEmailStatus && nextProps.messageResentConfirmationEmailStatus === 'SUCCESS') {
      this.setState(() => ({
        isOpenDialogResentEmail: true,
      }));
    }
    if (
      !this.props.messageResentConfirmationEmailStatus &&
      nextProps.messageResentConfirmationEmailStatus &&
      nextProps.messageResentConfirmationEmailStatus !== 'SUCCESS'
    ) {
      this.setState(() => ({
        isOpenDialogResentEmail: true,
        errorMessageInResendingConfirmationEmail: nextProps.messageResentConfirmationEmailStatus,
      }));
    }
  }

  submitResendConfirmationEmail() {
    this.props.resendConfirmationEmailToClient();
    this.setState(() => ({
      isOpenDialogConfirmEmailResend: false,
    }));
  }

  openDialogConfirmEmailResend() {
    this.setState((prevState) => ({
      isOpenDialogConfirmEmailResend: !prevState.isOpenDialogConfirmEmailResend,
    }));
  }

  openDialogResentEmail() {
    this.setState((prevState) => ({
      isOpenDialogResentEmail: !prevState.isOpenDialogResentEmail,
    }));
    this.props.clearStateOfConfirmationEmailResent();
  }

  // getAccountStatus = (status) => {
  //   if (status === 'CS') return 'CASH';
  //   if (status === 'KW') return 'KWSP';
  //   return '';
  // };

  // getchipBackgroundColor = (status) => {
  //   if (status === 'active') return Color.C_GREEN;
  //   if (status === 'suspended') return 'orange';
  //   return '#f5a623';
  // };

  openDialogQuesion() {
    this.setState((prevState) => ({
      isOpenDialogQuestion: !prevState.isOpenDialogQuestion,
    }));
  }

  submitDialogQuestion() {
    this.props.getRiskProfiles();
    this.props.retakeQuestions();
    this.props.redirect('/retake/risk-profile');
    this.setState(() => ({
      isOpenDialogQuestion: false,
    }));
  }

  checkIfEmailSentWithinCertainTime(customerId) {
    const unParsedData = localStorage.getItem('emailSentInfo');
    let flag = false;
    if (unParsedData) {
      const parsedData = JSON.parse(unParsedData);
      const currentCustomerTime = parsedData[customerId];
      if (currentCustomerTime) flag = new Date() < new Date(currentCustomerTime);
    }

    this.setState({
      isResendEmailEnabled: flag,
    });
  }

  getExpiryTime() {
    const { lov } = this.props;
    if (_isEmpty(lov)) return 0;

    const expiryTimeLOV = lov.Dictionary[37].datadictionary;
    return expiryTimeLOV[0].codevalue / 1000 / 60;
  }

  render() {
    const {
      clientDetails: { info, portfolio },
    } = this.props;
    if (_isEmpty(info.account) || _isEmpty(portfolio)) return null;
    const account = info.account[0];
    // let isCashAvailable;
    // let cashTotalValue = 0;
    // let isKWSPAvailable;
    // let kwspTotalValue = 0;
    if (portfolio && portfolio.length && info && info.account && info.account.length) {
      if (_findIndex(portfolio, ['partnerAccountType', 'CS']) !== -1) {
        // isCashAvailable = true;
        info.account.forEach((item) => {
          if (item.UTRACCOUNTTYPE === 'CS') {
            // cashTotalValue += item.totalNetAssetValue;
          }
        });
      }
      if (_findIndex(portfolio, ['partnerAccountType', 'KW']) !== -1) {
        // isKWSPAvailable = true;
        info.account.forEach((item) => {
          if (item.UTRACCOUNTTYPE === 'KW') {
            // kwspTotalValue += item.totalNetAssetValue;
          }
        });
      }
    }
    const assessmentDate = info.ISAF_PERFORMANCE_DATE;
    const currentDate = moment(new Date());
    const diff = currentDate.diff(assessmentDate, 'months', true);
    let message;
    let doShowRetakeRiskAssessment;
    if (!info.ISAF_SCORE || info.ISAF_SCORE === '' || !info.ISAF_PERFORMANCE_DATE || info.ISAF_PERFORMANCE_DATE === '') {
      doShowRetakeRiskAssessment = true;
      message = 'EXPIRED';
    } else if (diff >= 11 && diff < 12) {
      doShowRetakeRiskAssessment = true;
      message = 'EXPIRING SOON';
    } else if (diff >= 12) {
      doShowRetakeRiskAssessment = true;
      message = 'EXPIRED';
    }

    let accounts = [];

    if (info && info.account && info.account.length) {
      accounts = info.account.filter((item) => item.UTRACCOUNTTYPE === 'CS');
      info.account.forEach((item) => {
        if (item.UTRACCOUNTTYPE === 'KW') accounts.push(item);
      });
    }

    const { isResendEmailEnabled } = this.state;
    return (
      <React.Fragment>
        <ProfileInfoContainer container direction="column">
          <Grid item>
            <RowGridSpaceBetween>
              <Grid item>
                <BackToClient />
              </Grid>
              <Grid item>
                <LastUpdated data={info} />
              </Grid>
            </RowGridSpaceBetween>
          </Grid>
          <Grid item>
            <RowGridCenter>
              <Grid item>
                <Avatar />
              </Grid>
              <Grid item>
                <ColumnGridLeft>
                  <Grid item>
                    <NameAndStatus data={info.account} portfolio={portfolio} />
                  </Grid>
                  <Grid item>
                    <DetailsText size="10px" color="#fff">
                      DETAILS
                    </DetailsText>
                  </Grid>
                  <Grid item>
                    <RowGridSpaceBetween>
                      <Grid item style={{ paddingTop: '8px', paddingRight: '7px' }}>
                        <UserInfo icon={EmailIcon} name={account.AccEmail} />
                      </Grid>
                      {/*
                        !account.isEmailVerified &&
                          <Grid item>
                            <a data-tip data-for="tootltipEmailUnverified">
                              <Icon src={BellIcon} />
                            </a>
                            <ReactTooltip1 id='tootltipEmailUnverified' effect='solid' place='bottom' eventOff='click' delayHide={2000} clickable={true}>
                              <Text size="14px">Pending Email Verification</Text>
                              <Text size="14px" fontStyle="italic" color={Color.C_GRAY} display="inline">Didn’t get the email verification?</Text>
                              <Text decoration="underline" color={Color.C_LIGHT_BLUE} display="inline"><a href="javascript:void(0);" onClick={this.resendConfirmationEmail}> Resend</a></Text>
                            </ReactTooltip1>
                        </Grid>
                        */}
                      {(!_isEmpty(this.props.newEmail) || !account.isEmailVerified) && (
                        <CustomTooltip
                          minWidth="300px"
                          onMouseEnter={() => this.checkIfEmailSentWithinCertainTime(account.customerId)}>
                          <Icon src={BellIcon} />
                          {!this.state.isOpenDialogConfirmEmailResend && (
                            <div className="bottom">
                              <Text size="14px" align="left">
                                Pending Email Verification
                              </Text>
                              <Text size="14px" align="left" fontStyle="italic" color={Color.C_GRAY} display="inline">
                                Didn’t get the email verification?{' '}
                              </Text>
                              <CustomText
                                disabled={isResendEmailEnabled}
                                onClick={() => !isResendEmailEnabled && this.openDialogConfirmEmailResend()}>
                                Resend
                              </CustomText>

                              {isResendEmailEnabled && (
                                <React.Fragment>
                                  <Text size="12px" align="left" fontStyle="italic">
                                    (Resend request will be enabled after {this.getExpiryTime()} minutes from the previous
                                    attempt)
                                  </Text>
                                </React.Fragment>
                              )}
                            </div>
                          )}
                        </CustomTooltip>
                      )}
                    </RowGridSpaceBetween>
                  </Grid>
                  <Grid item>
                    <UserInfo icon={PhoneIcon} name={account.AccMobileNo} />
                  </Grid>
                  <Grid item>
                    <UserInfo icon={CardIcon} name={account.MainHolderlDNo} />
                  </Grid>
                </ColumnGridLeft>
              </Grid>
              <Grid item>
                <StatusGrid item>
                  <ColumnGridLeft>
                    {/* <Grid item>
                      <DetailsText size="10px" color="#fff">
                        STATUS
                      </DetailsText>
                    </Grid> */}
                    <Grid item>
                      <RowGridSpaceBetween>
                        <Grid item style={{ paddingTop: '8px', paddingRight: '7px' }}>
                          <DetailsText size="10px" color="#fff">
                            ACCOUNT NO.
                          </DetailsText>
                        </Grid>
                        {accounts &&
                          accounts.map((fund) => (
                            <StatusContainer style={{ paddingRight: '10px' }}>
                              <CustomTooltip minWidth={getToolTipWidth(fund)}>
                                {fund.AccountStatus === 'S' && <SuspendedStyle />}
                                <StatusIcon src={fund.UTRACCOUNTTYPE === 'CS' ? CashIcon : KWSPIcon} />
                                <div className="bottom">
                                  <Text display="inline">Account Type: </Text>
                                  <Text display="inline" cursor="pointer" weight="bolder">
                                    {' '}
                                    {getAccountType(fund)}
                                  </Text>
                                  {fund.AccountStatus === 'S' ? (
                                    <div>
                                      <Text cursor="pointer" size="14px" align="left" color={Color.C_GRAY} display="inline">
                                        <img
                                          style={{ verticalAlign: 'sub', marginRight: '5px' }}
                                          width="16"
                                          height="16"
                                          src={InfoLogo}
                                          className="info"
                                          alt="Info"
                                        />
                                        Please contact{' '}
                                        <span style={{ color: Color.C_LIGHT_BLUE, marginLeft: 3, textDecoration: 'underline' }}>
                                          <a data-tip data-for="customerCare" style={{ opacity: 0.9 }}>
                                            customer care.{' '}
                                          </a>
                                        </span>
                                        <ReactTooltip1 id="customerCare" effect="solid" place="right">
                                          <Text size="14px" weight="bold" color="#fff" align="left">
                                            Agency Hotline
                                          </Text>
                                          <Text size="12px" color="#fff" align="left">
                                            03-77237261
                                          </Text>
                                          <Text size="12px" color="#fff" align="left">
                                            Monday to Friday: 8:45 am to 5:45 pm
                                          </Text>
                                          <Text size="12px" weight="bold" color="#fff" align="left">
                                            (except on Kuala Lumpur and national public holidays)
                                          </Text>
                                        </ReactTooltip1>
                                      </Text>
                                    </div>
                                  ) : null}
                                </div>
                              </CustomTooltip>
                              <Text display="inline-block" color="white" size="14px">
                                {fund.partnerAccountMappingId}
                              </Text>
                            </StatusContainer>
                          ))}
                      </RowGridSpaceBetween>
                    </Grid>

                    <Grid item>
                      <RowGridSpaceBetween>
                        <Grid item style={{ paddingTop: '8px', paddingRight: '7px' }}>
                          <DetailsText size="10px" color="#fff">
                            RISK PROFILE
                          </DetailsText>
                        </Grid>
                        <SubText size="15px" color="#fff">
                          {info && info.riskAppetite}
                        </SubText>
                      </RowGridSpaceBetween>
                    </Grid>
                    <React.Fragment>
                      <Grid item>
                        <RowGridSpaceBetween>
                          <Grid item style={{ paddingTop: '8px', paddingRight: '7px' }}>
                            <DetailsText size="10px" color="#fff">
                              ASSESMENT DATE
                            </DetailsText>
                          </Grid>

                          <SubText size="15px" color="#fff">
                            {moment(assessmentDate)
                              .format('DD-MM-YYYY')
                              .toString() === 'Invalid date'
                              ? ''
                              : moment(assessmentDate)
                                  .format('DD-MM-YYYY')
                                  .toString()}
                          </SubText>
                          {doShowRetakeRiskAssessment && (
                            <StyledChip name={message} color={message === 'EXPIRED' ? '#F57059' : '#f5a623'} opacity={1} />
                          )}
                        </RowGridSpaceBetween>
                      </Grid>
                      <Grid item>
                        <Text
                          size="15px"
                          cursor="pointer"
                          color="#3b94a6"
                          fontStyle="italic"
                          decoration="underline"
                          onClick={this.openDialogQuesion}>
                          Retake Suitability Assessment Test
                        </Text>
                      </Grid>
                    </React.Fragment>
                  </ColumnGridLeft>
                </StatusGrid>
              </Grid>
            </RowGridCenter>
          </Grid>
        </ProfileInfoContainer>
        <InvestmentDataContainer>
          <ColumnGridCenter>
            <Grid item lg={3} md={4} xs={4}>
              <ColumnGridCenter>
                <TotalNetInvestedWrapper item>
                  <Text className="label"></Text>
                </TotalNetInvestedWrapper>
                <Grid item>
                  <StyledNumberFormat
                    // value={portfolio?portfolio.totalInvested?portfolio.totalInvested.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] : '0' : '0'}
                    // value={portfolio ? (portfolio.totalInvested ? portfolio.totalInvested : '0') : '0'}
                    value={''}
                    displayType={'text'}
                    thousandSeparator
                    prefix={''}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Grid>
              </ColumnGridCenter>
            </Grid>
            {info.account.map((accountItem) => (
              <Grid item lg={3} md={3} xs={4}>
                <Text className="label">{getNetAssetValues(accountItem).accountType}</Text>
                <TotalNetInvestedWrapper item>
                  <Text className="label">TOTAL NAVs</Text>
                  <Tooltip id="tooltip-fab" title={'Total investment at market value'} placement="top">
                    <img src={InfoIcon} className="info" alt="Info" />
                  </Tooltip>
                </TotalNetInvestedWrapper>
                <Grid item style={{ textAlign: 'center' }}>
                  <StyledNumberFormat
                    value={getNetAssetValues(accountItem).netAssetValues}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Grid>
              </Grid>
            ))}
            <Grid item lg={3} md={4} xs={4}>
              <ColumnGridCenter>
                <Grid item>
                  <Text className="label"></Text>
                </Grid>
                <Grid item>
                  <StyledNumberFormat
                    // value={account.profitAndLossAmount?account.profitAndLossAmount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] : '-'}
                    // value={account.profitAndLossAmount ? account.profitAndLossAmount : '-'}
                    value={''}
                    displayType={'text'}
                    thousandSeparator
                    prefix={''}
                    // suffix={account.proftAndLossPercent ? ` (${ Math.abs(account.proftAndLossPercent.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]) } %)` : ' (0.00%)'}
                    // suffix={portfolio.profitAndLossPercentage ? ` (${ Math.abs(portfolio.profitAndLossPercentage.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]) * 100 } %)` : ' (0.00%)'}
                    // suffix={portfolio.profitAndLossPercentage ? ` (${(portfolio.profitAndLossPercentage * 100).toFixed(2)}%)` : ' (0.00%)'}
                    suffix={''}
                    // suffix={!isNaN(account.proftAndLossPercent) ? ` (${ account.proftAndLossPercent } %)` : ''}
                    // suffix={` (${ profitAndLoss } %)`}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Grid>
              </ColumnGridCenter>
            </Grid>
          </ColumnGridCenter>
        </InvestmentDataContainer>

        <EmailVerification
          isOpenDialogConfirmEmailResend={this.state.isOpenDialogConfirmEmailResend}
          openDialogConfirmEmailResend={this.openDialogConfirmEmailResend}
          account={account}
          newEmail={this.props.newEmail}
          submitResendConfirmationEmail={this.submitResendConfirmationEmail}
        />

        <Dialog
          open={this.state.isOpenDialogResentEmail}
          closeHandler={this.openDialogResentEmail}
          title={this.state.errorMessageInResendingConfirmationEmail ? '' : 'Confirmation Email Resent'}
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 20 }}>
                <Grid item xs={12}>
                  <Text size="14px" fontStyle="italic" weight="bolder">
                    {this.state.errorMessageInResendingConfirmationEmail
                      ? this.state.errorMessageInResendingConfirmationEmail
                      : 'A confirmation email has been sent to'}
                  </Text>
                </Grid>
                {!this.state.errorMessageInResendingConfirmationEmail && (
                  <Grid item xs={12} style={{ marginTop: '17px' }}>
                    <Text size="10px" color={Color.C_GRAY} opacity="0.4">
                      REGISTERED EMAIL ADDRESS
                    </Text>
                    <Text size="14px" weight="bolder" style={{ wordWrap: 'break-word' }}>
                      {this.props.newEmail ? this.props.newEmail : account.AccEmail}
                    </Text>
                  </Grid>
                )}
              </Grid>
            </Grid>
          }
        />

        <Dialog
          open={this.state.isOpenDialogQuestion}
          noClose
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 20 }}>
                <Grid item xs={12}>
                  <Text size="15px">
                    Your client, <span style={{ fontWeight: 'bolder' }}>{account.FullName || '-'}</span>, will now retake
                  </Text>
                </Grid>
                <Grid item xs={12}>
                  <Text size="15px">the Investor Suitability Test.</Text>
                </Grid>
                <Grid item xs={12} style={{ marginTop: 5 }}>
                  <Text size="15px">
                    Does <span style={{ fontWeight: 'bolder' }}>{account.FullName || '-'}</span> want to continue?
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ marginTop: 5 }}>
                  <Grid container justify="center" align="center" alignItems="center">
                    <Grid item xs={6} align="right" style={{ paddingRight: 5 }}>
                      <StyledBtn onClick={this.openDialogQuesion} btnBgColor={Color.C_LIGHT_BLUE} btnFontColor="#ffffff">
                        Back
                      </StyledBtn>
                    </Grid>
                    <Grid item xs={6} align="left" style={{ paddingLeft: 5 }}>
                      <StyledBtn onClick={this.submitDialogQuestion} btnBgColor={Color.C_LIGHT_BLUE} btnFontColor="#ffffff">
                        Continue
                      </StyledBtn>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          }
        />
      </React.Fragment>
    );
  }
}

ClientInfo.propTypes = {
  messageResentConfirmationEmailStatus: PropTypes.any,
  resendConfirmationEmailToClient: PropTypes.func.isRequired,
  clearStateOfConfirmationEmailResent: PropTypes.func.isRequired,
  getRiskProfiles: PropTypes.func,
  retakeQuestions: PropTypes.func,
  redirect: PropTypes.func,
  clientDetails: PropTypes.func,
  newEmail: PropTypes.string,
  lov: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  clientDetails: makeSelectClientDetails(),
  processing: makeSelectProcessing(),
  error: makeSelectError(),
  clientAccDetail: makeSelectClientAccDetail(),
});

function mapDispatchToProps() {
  return {
    // resetError: () => dispatch(resetError()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ClientInfo);
