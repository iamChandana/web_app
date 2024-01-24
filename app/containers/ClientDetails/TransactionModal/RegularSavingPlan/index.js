import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import Button from 'components/Button';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';
import Modal from '../Modal';
import IconWarning from '../../images/icon-warning.png';
import Dialog from 'components/Dialog';
import Disclaimer from '../Disclaimer';
import CWADisclaimer from '../CWADisclaimer';
import { StyledDivRounded, StyledDivVerticalLine } from 'utils/StylesHelper/common';
import Select from 'components/Select';
import WholeSaleDisclaimer from '../WholeSaleDisclaimer';
import { findJointAccountHolderNames, getSelectedFundAccountDetails } from '../../utils/getAccountHolderType';
import RspVerificationConfirmationModal from '../VerificationOptionModal/RspVerificationConfirmationModal';

export const StyledSelect = styled(Select)`
  margin: 0;
`;

const StyleButton = styled(Button)`
  margin-top: 16px;
`;

const CustomText = styled(Text)`
  margin: 10px 0px;
`;

const StyledNumberFormat = styled(NumberFormat)`
  border-bottom: solid 1px #cacaca;
  outline: none;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.43;
  text-align: left;
  color: ${Color.C_GRAY};
`;

const arrDaysOfTheMonth = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];

class RegularSavingPlan extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: props.isEdit ? 'Edit Regular Savings Plan' : 'Set Regular Savings Plan',
      data: props.data,
      dataForRSP: [],
      totalRSP: 0,
      acknowledge: false,
      cwaAcknowledge: false,
      selectedDayOfTheMonth: -1,
      isVerificationOptionModalOpen: false,
    };
    this.acknowledge = this.acknowledge.bind(this);
    this.cwaAcknowledge = this.cwaAcknowledge.bind(this);
    this.onChangeDaysOfTheMonth = this.onChangeDaysOfTheMonth.bind(this);
    this.submit = this.submit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenVerificationOpenModal = this.handleOpenVerificationOpenModal.bind(this);
    this.handleCloseVerificationOpenModal = this.handleCloseVerificationOpenModal.bind(this);
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

  onChangeDaysOfTheMonth(e) {
    this.setState({
      selectedDayOfTheMonth: e.target.value,
    });
  }

  handleOpenVerificationOpenModal() {
    this.setState({
      isVerificationOptionModalOpen: true,
    });
  }

  handleCloseVerificationOpenModal() {
    this.setState({
      isVerificationOptionModalOpen: false,
    });
  }

  submit(selectedVerificationOption) {
    this.setState({ acknowledge: false, cwaAcknowledge: false }, () => {
      this.props.handleDisclaimerChange();

      const accountNo = this.props.isEdit
        ? this.props.currentEditingFundForRSP[0].partnerAccountNo
        : this.props.data[0].partnerAccountNo;
      this.props.handleRSPSubmit(accountNo, selectedVerificationOption);
    });
  }

  handleClose() {
    this.setState({ acknowledge: false, cwaAcknowledge: false });
    this.props.handleClose();
  }

  isSelectedFundWholeSale() {
    const { data } = this.props;
    return data.filter((fundItem) => fundItem.fund.fundSubType === 'W').length > 0;
  }

  render() {
    const { handleClose, clientDetails, data, open, handleRSPAmount, currentEditingFundForRSP, serverErrorMessage } = this.props;
    const { isVerificationOptionModalOpen } = this.state;

    let allRSPAmountInputed = true;
    for (const data1 of data) {
      if (data1.newAmount === '' || data1.errorMessage !== '') {
        allRSPAmountInputed = false;
      }
    }
    let editValidation = true;
    if (currentEditingFundForRSP.length) {
      for (const data1 of currentEditingFundForRSP) {
        if (data1.newAmount === '' || data1.errorMessage !== '') {
          editValidation = false;
        }
      }
    }

    // in edit, checking the same value as earlier
    const hasSameValues = [];
    // let hasChanged = false;
    if (currentEditingFundForRSP && currentEditingFundForRSP.length) {
      currentEditingFundForRSP.forEach((fund) => {
        const fundObj = {};
        if (fund.newAmount == fund.rspMaxAmount) {
          fundObj.id = fund.investmentProductId;
          fundObj.name = fund.fund.name;
          hasSameValues.push(fundObj);
          // hasChanged = true;
        }
      });
    }

    // To check the total amount is greater than 300,000
    // let isGreaterThan30 = false;
    // if (data && data.length) {
    //   const amount = data.map((fund) => fund.newAmount);
    //   const totalAmount = amount.reduce((total, sum) => Number(total) + Number(sum));
    //   if (totalAmount > 30000) {
    //     isGreaterThan30 = true;
    //   }
    // }

    return (
      <React.Fragment>
        <Modal open={open} handleClose={this.handleClose} title={this.state.title}>
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 10 }}>
              <Grid item xs={1}>
                <StyledDivRounded>
                  <Text size="14px" color="#ffffff">
                    1
                  </Text>
                </StyledDivRounded>
              </Grid>
              <Grid item xs={11}>
                <Text size="14px" align="left">
                  Step 1 - Input Investment Details
                </Text>
              </Grid>
            </Grid>
            <Grid container justify="left" style={{ border: '0 solid #000' }}>
              <Grid item xs={1} style={{ border: '0 solid green' }}></Grid>
              {currentEditingFundForRSP.length > 0 &&
                currentEditingFundForRSP.map((item) => (
                  <React.Fragment>
                    <Grid item xs={3} style={{ border: '0 solid red' }}>
                      <Text size="14px" align="left" weight="bold">
                        {item.fund.fundcode} &nbsp; {item.fund.name}
                      </Text>
                    </Grid>
                    <Grid item xs={1} style={{ backgroundColor: '#ffffff' }}></Grid>
                  </React.Fragment>
                ))}
              {!currentEditingFundForRSP.length &&
                data.map((item) => (
                  <React.Fragment>
                    <Grid item xs={3} style={{ border: '0 solid red' }}>
                      <Text size="14px" align="left" weight="bold">
                        {item.fund.fundcode} &nbsp; {item.fund.name}
                      </Text>
                    </Grid>
                    <Grid item xs={1} style={{ backgroundColor: '#ffffff' }}></Grid>
                  </React.Fragment>
                ))}
            </Grid>
            <Grid container justify="left" alignItems="left" style={{ marginTop: 20, marginBottom: 20 }}>
              <Grid item xs={1}></Grid>
              {currentEditingFundForRSP.length
                ? currentEditingFundForRSP.map((item) => (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <Text size="10px" weight="bold" color={Color.C_LIGHT_BLUE} opacity="1" align="left">
                          REGULAR SAVINGS AMOUNT
                        </Text>
                        <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left" style={{ marginTop: 10 }}>
                          <StyledNumberFormat
                            allowNegative={false}
                            thousandSeparator
                            prefix={'RM '}
                            decimalScale={2}
                            autoComplete="off"
                            isAllowed={(values) => {
                              const { value } = values;
                              if (value > item.fund.maxAdditionalInvestmentAmt) {
                                handleRSPAmount(item, item.fund.maxAdditionalInvestmentAmt, 'edit');
                                return false;
                              }
                              handleRSPAmount(item, value, 'edit');
                              return true;
                            }}
                            value={item.newAmount}
                          />
                        </Text>
                        {item.errorMessage && (
                          <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
                            {item.errorMessage}
                          </Text>
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        <StyledDivVerticalLine />
                      </Grid>
                    </React.Fragment>
                  ))
                : null}

              {!currentEditingFundForRSP.length
                ? data.map((item) => (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <Text size="10px" weight="bold" color={Color.C_LIGHT_BLUE} opacity="1" align="left">
                          REGULAR SAVINGS AMOUNT
                        </Text>
                        <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left" style={{ marginTop: 10 }}>
                          <StyledNumberFormat
                            allowNegative={false}
                            thousandSeparator
                            prefix={'RM '}
                            decimalScale={2}
                            autoComplete="off"
                            isAllowed={(values) => {
                              const { value } = values;
                              if (value > item.fund.maxAdditionalInvestmentAmt) {
                                handleRSPAmount(item, item.fund.maxAdditionalInvestmentAmt);
                                return false;
                              }
                              handleRSPAmount(item, value);
                              return true;
                            }}
                            // onChange={(e) => handleRSPAmount(item, e.target.value)}
                            value={item.newAmount}
                          />
                        </Text>
                        {item.errorMessage && (
                          <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
                            {item.errorMessage}
                          </Text>
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        <StyledDivVerticalLine />
                      </Grid>
                    </React.Fragment>
                  ))
                : null}
              {/*
                <Grid item xs={6}>
                  <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                    Monthly Contribution Date (Day of every month)
                  </Text>
                  <StyledSelect value={this.state.selectedDayOfTheMonth} onChange={this.onChangeDaysOfTheMonth} fontSize="14px" style={{ width: '150px'}}>
                    {arrDaysOfTheMonth.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </StyledSelect>
                </Grid>
              */}
            </Grid>

            {/* <Grid container style={{ marginTop: '17px', marginBottom: '-17px' }}>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}>
                {isGreaterThan30 && (
                  <Text color={Color.C_RED} size="12px" lineHeight="1.25" align="left">
                    The daily limit for Online Transaction is RM 300,000.
                  </Text>
                )}
              </Grid>
            </Grid> */}

            <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 10 }}>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}>
                {serverErrorMessage && (
                  <Text color={Color.C_RED} size="12px" lineHeight="1.25" align="left">
                    {serverErrorMessage}
                  </Text>
                )}
              </Grid>
            </Grid>

            <Grid container justify="center" align="left" alignItems="center" style={{ marginTop: 25, marginBottom: 10 }}>
              <Grid item xs={1}>
                <StyledDivRounded>
                  <Text size="14px" color="#ffffff">
                    2
                  </Text>
                </StyledDivRounded>
              </Grid>
              <Grid item xs={11}>
                <Text size="14px" align="left">
                  Step 2 - Confirm Email Address for Payment Link.
                </Text>
              </Grid>
            </Grid>
            <Grid container justify="center" align="left" alignItems="center">
              <Grid item xs={1}></Grid>
              <Grid item xs={11}>
                <Text size="14px" display="block" align="left">
                  The client’s registered email address is as below. Payment link and confirmation details will be sent to this
                  email account. You can choose to update the email address through the{' '}
                  <span style={{ fontWeight: 'bolder', fontSize: '15px' }}>Customer Profile</span> before submitting the
                  transaction. Note that the updating of the client’s email address will go through an{' '}
                  <span style={{ fontWeight: 'bolder', fontSize: '15px' }}>email verification process.</span>
                </Text>
                <CustomText size="14px" display="block" align="left">
                  Upon successful registration of the client’s regular savings plan (RSP), an administrative fee of RM 1.00 will
                  be debited from the client’s selected account.
                </CustomText>
                <Text size="14px" display="block" align="left">
                  Reminder: Please take note that Principal does not accept any payments and/or enrolments from 3rd party account.
                  RSP registered using 3rd party account will be rejected and/or cancelled by Principal, and the RM1.00
                  administrative fee will not be refunded. Any other payments deducted will be refunded to the 3rd party account.
                </Text>
                {/* <Text size="14px" display="block" align="left">
                  The daily limit for Online Transaction is RM 300,000.
                </Text> */}
              </Grid>
            </Grid>
            <Grid container justify="left" style={{ marginTop: 20, marginBottom: 20 }}>
              <Grid item xs={1}></Grid>
              <Grid item xs={3}>
                <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                  PAYMENT METHOD
                </Text>
                <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left" style={{ marginTop: 10 }}>
                  Online Bank Transfer
                </Text>
              </Grid>
              <Grid item xs={1}>
                <StyledDivVerticalLine />
              </Grid>
              <Grid item xs={6}>
                <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                  REGISTERED EMAIL ADDRESS
                </Text>
                <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left" style={{ marginTop: 10 }}>
                  {clientDetails.info.account[0].AccEmail}
                </Text>
              </Grid>
            </Grid>

            <Disclaimer acknowledge={this.state.acknowledge} onChange={this.acknowledge} type="rsp" />
            <CWADisclaimer acknowledge={this.state.cwaAcknowledge} onChange={this.cwaAcknowledge} type="rsp" />
            {this.isSelectedFundWholeSale() && (
              <WholeSaleDisclaimer
                secondaryHolderNameIfAvailable={findJointAccountHolderNames(
                  getSelectedFundAccountDetails(data[0].partnerAccountNo, clientDetails.info),
                )}
                acknowledge={this.props.wholeSaleAcknowledge}
                onChange={this.props.handleDisclaimerChange}
                fullName={clientDetails.info.fullName}
              />
            )}
            <Grid item xs={12}>
              {!currentEditingFundForRSP.length ? (
                <StyleButton
                  primary
                  onClick={this.handleOpenVerificationOpenModal}
                  disabled={
                    !this.state.acknowledge ||
                    !this.state.cwaAcknowledge ||
                    (this.isSelectedFundWholeSale() && !this.props.wholeSaleAcknowledge) ||
                    !allRSPAmountInputed
                  }>
                  Set Regular Savings
                </StyleButton>
              ) : (
                <StyleButton
                  primary
                  onClick={() => {
                    // eslint-disable-next-line no-unused-expressions
                    hasSameValues.length === currentEditingFundForRSP.length
                      ? this.setState({ open: true })
                      : this.handleOpenVerificationOpenModal();
                  }}
                  disabled={
                    !this.state.acknowledge ||
                    !this.state.cwaAcknowledge ||
                    (this.isSelectedFundWholeSale() && !this.props.wholeSaleAcknowledge) ||
                    !editValidation
                  }>
                  Edit Regular Savings
                </StyleButton>
              )}
            </Grid>
          </Grid>
        </Modal>

        <Dialog
          open={this.state.open}
          closeHandler={() => this.setState({ open: false })}
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="center" alignItems="center" style={{ marginBottom: 20 }}>
                <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                  <img src={IconWarning} />
                </Grid>
                <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                  <Text size="14px" weight="bold">
                    The RSP value is same as previous for the below funds,
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                  {hasSameValues.length &&
                    hasSameValues.map((fund) => (
                      <Text size="15px" color="#1d1d26" weight={'bolder'}>
                        {fund.name}
                      </Text>
                    ))}
                </Grid>
                <Grid item xs={12} style={{ marginBottom: '26px' }}>
                  <Text size="14px" size="14px">
                    Please do change any of the values
                  </Text>
                </Grid>
                <Grid item xs={6}>
                  <Grid container direction="column" justify="center" alignItems="center">
                    <Button
                      onClick={() => {
                        this.setState({ open: false });
                      }}
                      width="80%">
                      Back
                    </Button>
                  </Grid>
                </Grid>
                {/* <Grid item xs={6}>
                  <Grid container direction="column" justify="center" alignItems="center">
                    <Button onClick={this.submit} primary width="80%">
                      Yes
                    </Button>
                  </Grid>
                </Grid> */}
              </Grid>
            </Grid>
          }
        />
        {isVerificationOptionModalOpen ? (
          <RspVerificationConfirmationModal
            open={isVerificationOptionModalOpen}
            handleClose={this.handleCloseVerificationOpenModal}
            handleSubmitRsp={this.submit}
            isRsp
          />
        ) : null}
      </React.Fragment>
    );
  }
}

RegularSavingPlan.propTypes = {
  data: PropTypes.object,
  errorMessage: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleRSPSubmit: PropTypes.func,
};
export default RegularSavingPlan;
