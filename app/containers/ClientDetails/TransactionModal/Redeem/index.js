import React from 'react';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import NumberFormat from 'react-number-format';
import Text from 'components/Text';
import _isEmpty from 'lodash/isEmpty';
import Color from 'utils/StylesHelper/color';
import VerticalDivider from 'components/VerticalDivider';
import { MenuItem } from 'material-ui/Menu';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import IconWarning from '../../images/icon-warning.png';
import Button from 'components/Button';
import styled from 'styled-components';

import Modal from '../Modal';
import Disclaimer from '../Disclaimer';
import CWADisclaimer from '../CWADisclaimer';
import FundToRedeem from './FundToRedeem';
import { PURPOSE_OF_REDEMPTION } from './Constants';
import {
  ModalForCancelRspPopUp,
  StyleButton,
  TotalTopUp,
  NoPadGrid,
  Container,
  DividerGrid,
  StyledSelect,
  StyledField,
  TotalAmountGrid,
  PurposeGrid,
  DisabledStyledField,
} from './styles';
import rspStatuses from '../rspStatuses';
import RedeemVerificationConfirmationModal from '../VerificationOptionModal/RedeemVerificationConfirmationModal';

const initialState = {
  dataToTopUp: [],
  totalTopUp: 0,
  acknowledge: false,
  cwaAcknowledge: false,
  newAccount: false,
  bankAcctNumber: '',
  bankCode: '',
  bankName: '',
  bankNumber: '',
  swift_bic_code: '',
  branchCode: '',
  source: '',
  receivingBank: '',
  purposeOfRedemption: '',
};

const maxLengthBankAccNumber = 18;
const maxLengthBankAccName = 100;
/*
const maxLengthBankCode = 20;
const maxLengthBankIBAN = 30;
const maxLengthBankBranchCode = 20;
const maxLengthBankSwiftCode = 20;
const maxLengthBankSource = 50;
*/

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: -3px;
`;

class Redeem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      ...initialState,
      errorMessagesStatus: [],
      bankAcctName: props.clientDetails.info.fullName,
      errorStatus: false,
      selectedBankAccount: '',
      marginPurposeOfRedeemtion: '0px',
      isCancelRspModalOpen: false,
      isRedeemVerificationConfirmationModalOpen: false,
    };

    this.acknowledge = this.acknowledge.bind(this);
    this.cwaAcknowledge = this.cwaAcknowledge.bind(this);
    this.addNewAccount = this.addNewAccount.bind(this);
    this.onChange = this.onChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleCancellationRspModal = this.toggleCancellationRspModal.bind(this);
    this.handleCancelRSP = this.handleCancelRSP.bind(this);
    this.handleOpenReedemVerificationConfirmationModal = this.handleOpenReedemVerificationConfirmationModal.bind(this);
    this.handleCloseRedeemVerificationConfirmationModal = this.handleCloseRedeemVerificationConfirmationModal.bind(this);
    this.handleRedeemFund = this.handleRedeemFund.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      const rspEnrolledFunds = [];
      if (this.props.data) {
        this.props.data.forEach((fund) => {
          if (fund.rspStatus && fund.FullIndicator) {
            rspEnrolledFunds.push({ fundName: fund.fund.name, rspStatus: fund.rspStatus });
          }
        });
        this.setState({ rspEnrolledFunds });
      }
    }

    if (this.props.open !== prevProps.open && !this.props.open) {
      this.setState({ isRedeemVerificationConfirmationModalOpen: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isRedeemFormCleared) {
      this.clearRedeemValues(false);
    }
  }

  getTotal(data) {
    let total = 0;

    data.forEach((d) => {
      if (d.newAmount) {
        total += parseFloat(d.newAmount) * d.fund.price;
      }
    });
    return total;
  }

  toggleCancellationRspModal() {
    this.setState((prevState) => ({
      isCancelRspModalOpen: !prevState.isCancelRspModalOpen,
    }));
  }

  clearRedeemValues = (shouldCallHandleClose) => {
    this.setState(
      {
        purposeOfRedemption: '',
        bankName: '',
        bankAcctNumber: '',
        newAccount: false,
      },
      () => {
        if (shouldCallHandleClose) {
          this.props.handleClose();
        }
      },
    );
  };
  closeModal() {
    this.setState(
      {
        newAccount: false,
        acknowledge: false,
        cwaAcknowledge: false,
      },
      () => {
        this.clearRedeemValues(true);
      },
    );
  }

  acknowledge() {
    this.setState((prevState) => ({
      acknowledge: !prevState.acknowledge,
    }));
  }

  cwaAcknowledge() {
    this.setState((prevState) => ({
      cwaAcknowledge: !prevState.cwaAcknowledge,
    }));
  }

  addNewAccount() {
    this.setState({
      newAccount: true,
      marginPurposeOfRedeemtion: '-12px',
    });
  }

  onChange(e) {
    const { value, name } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        if (name === 'bankName') {
          this.setState({
            bankCode: value,
          });
        }
      },
    );
  }

  checkErrorMessagesStatus(data) {
    if (
      this.state.rspEnrolledFunds &&
      this.state.rspEnrolledFunds.filter(
        (fundItem) => fundItem.rspStatus === rspStatuses.completed || fundItem.rspStatus === rspStatuses.inProgress,
      ).length
    ) {
      this.toggleCancellationRspModal();
    } else {
      const testVal = data.indexOf('Input units cannot be more than available units in the fund.');
      if (testVal < 0) {
        this.setState({
          errorStatus: false,
        });
        this.handleOpenReedemVerificationConfirmationModal();
      }
    }
  }

  handleRedeemFund(selectedVerificationOption) {
    const { redeemFund } = this.props;

    this.setState(
      {
        errorMessagesStatus: [],
        acknowledge: false,
        cwaAcknowledge: false,
        errorStatus: false,
      },
      () => {
        redeemFund(this.state, selectedVerificationOption);
      },
    );
  }

  handleCancelRSP(data) {
    const testVal = data.indexOf('Input units cannot be more than available units in the fund.');
    if (testVal < 0) {
      this.handleOpenReedemVerificationConfirmationModal();
      this.setState({
        errorStatus: false,
      });
    }
    this.setState({ errorMessagesStatus: [], acknowledge: false, cwaAcknowledge: false, isCancelRspModalOpen: false });
  }

  get fullyRedeemed() {
    const { data } = this.props;
    let fullRedemption = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].FullIndicator) {
        fullRedemption = true;
      }
    }

    return fullRedemption;
  }

  filterCompletedRspFunds(rspEnrolledFunds) {
    return rspEnrolledFunds
      .filter((fundItem) => fundItem.rspStatus === rspStatuses.completed || fundItem.rspStatus === rspStatuses.inProgress)
      .map((fundItem) => fundItem.fundName);
  }

  handleOpenReedemVerificationConfirmationModal() {
    this.setState({
      isRedeemVerificationConfirmationModalOpen: true,
    });
  }

  handleCloseRedeemVerificationConfirmationModal() {
    this.setState({
      isRedeemVerificationConfirmationModalOpen: false,
    });
  }

  render() {
    const {
      open,
      data,
      handleRedeemChange,
      redeemFund,
      clientDetails,
      lov,
      errorMessage,
      changeSelectedBankId,
      selectedRedeemBankId,
      toggleFullRedemption,
    } = this.props;
    const { isRedeemVerificationConfirmationModalOpen } = this.state;
    const total = data.length > 0 ? this.getTotal(data) : 0;
    const DividerHeight = this.state.newAccount ? '150px' : '48px';
    const {
      info: { bank },
    } = clientDetails;
    // const bankNumberDefault = bank?bank[0]?bank[0].bankAcctNumber:'':'';
    const {
      bankAcctNumber,
      // bankCode,
      // branchCode,
      bankName,
      // source,
      bankAcctName,
      // iban,
      // swift_bic_code,
      purposeOfRedemption,
    } = this.state;
    let newAmountIsValid = true;

    for (const obj of data) {
      // const newAmount = parseInt(obj.newAmount, 10);
      const newAmount = parseFloat(obj.newAmount);
      // changes for CIMB-558
      if (
        !newAmount ||
        newAmount < obj.fund.minRedemptionUnits ||
        newAmount > obj.units ||
        (newAmount > obj.units - obj.fund.minHoldingUnits && newAmount < obj.units)
      ) {
        newAmountIsValid = false;
        break;
      }
    }

    const Banks = lov.Dictionary && lov.Dictionary[19].datadictionary;

    let updatedBanks = [];
    if (Banks.length && bank.length) {
      updatedBanks = bank.map((bankItem) => {
        return {
          ...bankItem,
          bankDetails: Banks.find((dictItem) => dictItem.codevalue === bankItem.bankCode) || {},
        };
      });
    }

    return (
      <Modal
        open={open}
        handleClose={this.closeModal}
        title="Redeem"
        subtitle="Submission cutoff time is 4:00 PM. Any successful submission after 4:00 PM or on a non-business day, <div>orders will be processed on the next business day as per next business day NAV.</div>">
        <Grid container direction="column" justify="center" alignItems="center">
          {data.map((item, i) => {
            let filteredError;
            if (typeof errorMessage === 'string') {
              filteredError = errorMessage;
            } else {
              // filteredError =
              //   !_isEmpty(errorMessage) && Array.isArray(errorMessage) && errorMessage.length > 0
              //     ? errorMessage.filter((errorItem) => errorItem.investmentProductId === item.investmentProductId)
              //     : [];
              filteredError =
                !_isEmpty(errorMessage) && Array.isArray(errorMessage) && errorMessage.length > 0
                  ? errorMessage
                      .map((errorItem) => {
                        if (errorItem.ErrorMessage && errorItem.ErrorMessage.length > 0) {
                          return errorItem.ErrorMessage[0].FrontEndErrorMessage;
                        }

                        return null;
                      })
                      .filter((item) => item !== null)
                  : [];
            }
            return (
              <FundToRedeem
                key={item.investmentProductId}
                data={item}
                index={i}
                handleChange={handleRedeemChange}
                toggleFullRedemption={toggleFullRedemption}
                error={filteredError}
              />
            );
          })}
          <TotalAmountGrid container direction="row" justify="flex-start" alignItems="center">
            <Grid item xs={8}>
              <TotalTopUp size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="right">
                TOTAL
              </TotalTopUp>
            </Grid>
            <Grid item xs={4}>
              <Grid container direction="row" justify="flex-start" alignItems="center">
                <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left" style={{ marginLeft: -8 }}>
                  <NumberFormat
                    value={total}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Text>
              </Grid>
            </Grid>
          </TotalAmountGrid>
          <Container>
            <Grid item xs={12}>
              {data.length && data[0].accountType !== 'KW' && (
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item lg={3} xs={3}>
                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <Text size="14px" weight="bold" color={Color.C_GRAY} align="left">
                          Receiving Bank Details
                        </Text>
                        <Text color={Color.C_GRAY} size="10px" fontStyle="italic" lineHeight="1.25" align="left">
                          Strictly NO 3rd party account transfers.
                        </Text>
                      </Grid>
                    </Grid>
                  </Grid>
                  <DividerGrid item lg={1} xs={1}>
                    <VerticalDivider height={DividerHeight} />
                  </DividerGrid>
                  {!this.state.newAccount && (
                    <React.Fragment>
                      <Grid item lg={5} md={5} xs={6}>
                        <Grid container spacing={24}>
                          <Grid item xs={6}>
                            <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                              RECEIVING BANK DETAILS
                            </Text>
                            <StyledSelect value={selectedRedeemBankId} onChange={changeSelectedBankId} fontSize="14px">
                              {updatedBanks.map((item) => (
                                <MenuItem value={item.id}>
                                  {Object.keys(item.bankDetails).length ? item.bankDetails.description : '-'} -{' '}
                                  {item.bankAcctNumber}
                                </MenuItem>
                              ))}
                            </StyledSelect>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={3} md={2} xs={2} style={{ paddingLeft: '10px' }}>
                        <Grid container>
                          <Grid item>
                            <Text
                              size="10px"
                              weight="bold"
                              color={Color.C_LIGHT_BLUE}
                              decoration="underline"
                              onClick={this.addNewAccount}
                              cursor="pointer">
                              Add new account
                            </Text>
                          </Grid>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  )}
                  {this.state.newAccount && (
                    <React.Fragment>
                      <Grid item xs={8}>
                        <Grid container spacing={24}>
                          <NoPadGrid item xs={6} style={{ height: 100, marginTop: '20px' }}>
                            <DisabledStyledField
                              name="bankAcctName"
                              value={bankAcctName}
                              label="RECEIVING ACCOUNT NAME"
                              placeholder="Account name"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  (value &&
                                    value.trim().length > 0 &&
                                    /^[a-zA-Z@&\/.,\"(\)\-'\s]*$/.test(value) &&
                                    value.length <= maxLengthBankAccName) ||
                                  value === ''
                                ) {
                                  this.onChange(e);
                                }
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              margin="normal"
                              disabled
                              autoComplete="off"
                            />
                          </NoPadGrid>
                          <NoPadGrid item xs={6} style={{ height: 100, marginTop: '38px' }}>
                            <Text size="9px" color="#000000" opacity={0.4} align="left">
                              RECEIVING BANK NAME
                            </Text>
                            <StyledSelect
                              select
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => {
                                this.onChange(e);
                                this.setState({ errorText: '', bankAcctNumber: '' });
                              }}
                              label="RECEIVING BANK NAME"
                              margin="normal"
                              name="bankName"
                              fontSize="14px"
                              value={bankName}
                              style={{ marginTop: 5, height: 30 }}>
                              {Banks.map((option) => (
                                <MenuItem key={option.id} value={option.codevalue}>
                                  {option.description}
                                </MenuItem>
                              ))}
                            </StyledSelect>
                          </NoPadGrid>
                        </Grid>
                        <Grid container spacing={24}>
                          <NoPadGrid item xs={6} style={{ height: 100, marginTop: -30 }}>
                            <StyledField
                              name="bankAcctNumber"
                              value={bankAcctNumber}
                              label="RECEIVING ACCOUNT NUMBER"
                              placeholder="Account number"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  (value &&
                                    value.trim().length > 0 &&
                                    /^[0-9a-zA-Z\s]*$/.test(value) &&
                                    value.length <= maxLengthBankAccNumber) ||
                                  value === ''
                                ) {
                                  this.onChange(e);

                                  const selectedBank = Banks.find((b) => b.codevalue === this.state.bankName);
                                  let errorText = '';

                                  if (selectedBank) {
                                    const { HorizonValue, customValue1, customValue2 } = selectedBank;
                                    if (HorizonValue === 'AND') {
                                      if (customValue2) {
                                        if (
                                          !(
                                            value.trim().length >= Number(customValue1) &&
                                            value.trim().length <= Number(customValue2)
                                          )
                                        ) {
                                          errorText = `Account number must be between ${Number(customValue1)} - ${Number(
                                            customValue2,
                                          )} digits`;
                                        }
                                      } else {
                                        if (value.trim().length !== Number(customValue1)) {
                                          errorText = `Account number must be of ${Number(customValue1)} digits`;
                                        }
                                      }
                                    } else if (
                                      !(
                                        value.trim().length === Number(customValue1) ||
                                        value.trim().length === Number(customValue2)
                                      )
                                    ) {
                                      errorText = `Account number must be either ${Number(customValue1)} or ${Number(
                                        customValue2,
                                      )} digits`;
                                    }
                                  }

                                  this.setState({ errorText });
                                }
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              margin="normal"
                              autoComplete="off"
                              disabled={!this.state.bankName}
                            />
                            {this.state.errorText && <ErrorText>{this.state.errorText}</ErrorText>}
                          </NoPadGrid>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>
              )}
            </Grid>
            {/* purpose of redemption */}
            <PurposeGrid item xs={12}>
              <Grid container justify="flex-start" alignItems="center">
                <Grid item xs={3}>
                  <Text size="14px" weight="bold" color={Color.C_GRAY} align="left">
                    Purpose of Redemption
                  </Text>
                </Grid>
                <DividerGrid item xs={1}>
                  <VerticalDivider />
                </DividerGrid>
                <Grid item xs={4}>
                  <Grid container>
                    <Grid item xs={6}>
                      <StyledSelect
                        name="purposeOfRedemption"
                        value={purposeOfRedemption}
                        onChange={(e) => {
                          this.onChange(e);
                        }}
                        fontSize="14px"
                        style={{ marginLeft: `${this.state.marginPurposeOfRedeemtion}` }}>
                        {PURPOSE_OF_REDEMPTION.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </PurposeGrid>
          </Container>
          <Disclaimer acknowledge={this.state.acknowledge} onChange={this.acknowledge} type="redeem" />
          <CWADisclaimer acknowledge={this.state.cwaAcknowledge} onChange={this.cwaAcknowledge} type="redeem" />
          <Grid item xs={12}>
            <StyleButton
              primary
              // onClick={() => {
              //   this.checkErrorMessagesStatus(this.state.errorMessagesStatus, redeemFund);
              // }}
              onClick={this.handleOpenReedemVerificationConfirmationModal}
              disabled={
                this.state.errorStatus ||
                (!newAmountIsValid && !this.fullyRedeemed) ||
                (data[0].accountType !== 'KW' && !this.state.newAccount && !selectedRedeemBankId) ||
                !this.state.acknowledge ||
                !this.state.cwaAcknowledge ||
                (this.state.newAccount && (!bankAcctNumber || !bankAcctName || !bankName)) ||
                !purposeOfRedemption ||
                this.state.errorText
              }>
              Proceed
            </StyleButton>
          </Grid>
        </Grid>
        {isRedeemVerificationConfirmationModalOpen ? (
          <RedeemVerificationConfirmationModal
            open={isRedeemVerificationConfirmationModalOpen}
            handleClose={this.handleCloseRedeemVerificationConfirmationModal}
            handleRedeemFund={this.handleRedeemFund}
          />
        ) : null}
        {/*  Confirmation modal for cancellation of RSP */}
        <ModalForCancelRspPopUp
          width={300}
          height={600}
          open={this.state.isCancelRspModalOpen}
          handleClose={this.toggleCancellationRspModal}>
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item xs={12} style={{ paddingTop: '0px', paddingBottom: '15px' }}>
              <img src={IconWarning} />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '0px', paddingBottom: '20px' }}>
              <Text align="center" size="14px">
                You are about to do a Full Redemption on{' '}
                <span style={{ fontWeight: 'bolder' }}>
                  {this.state.rspEnrolledFunds && this.filterCompletedRspFunds(this.state.rspEnrolledFunds).join(', ')}.
                </span>
                Proceeding with the redemption will result to the cancellation of the RSP.
              </Text>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '0px', paddingBottom: '20px' }}>
              <Text align="center" size="14px" weight="bolder">
                Would you like to proceed?
              </Text>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center" alignContent="center">
            <Grid item xs={6}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Button onClick={this.toggleCancellationRspModal} primary width="80%">
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column" justify="center" alignItems="center">
                <Button onClick={() => this.handleCancelRSP(this.state.errorMessagesStatus)} width="80%">
                  Continue
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ModalForCancelRspPopUp>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  lov: makeSelectLOV(),
});

function mapDispatchToProps() {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Redeem);
