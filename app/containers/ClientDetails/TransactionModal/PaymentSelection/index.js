/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import update from 'immutability-helper';
import _uniq from 'lodash/uniq';
import _isEmpty from 'lodash/isEmpty';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { makekwspCashIntroDetails } from 'containers/OnBoarding/selectors';
import { createPaymentDocs, initFundTransactionOtp } from 'containers/ClientDetails/actions';
import Modal from 'components/Modal';
import PaymentContent from './PaymentContent';
import VerificationOptionModal from '../VerificationOptionModal';
import JointAccountOtpModal from '../../Funds/JointAccountOtpConsentModal';
import KwspConfirmationPopUp from '../../../../components/Kwsp/Modal/kwspConfirmationModal';
import { findOtpSelectedAccounts } from '../../utils/filterJointAccountParams';
import getSalesCharge from 'utils/getSalesCharge';
import { makeSelectTransactions, makeSelectClientDetails, makeSelectTrxRequestId, makeSelectSalesCharges } from '../../selectors';

const FUND_DETAILS = {
  docs: {},
  BankName: '',
  ChequeOrDDAmount: '',
  ChequeOrDDNumber: '',
};

class PaymentSelection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.selectedPaymentMethod = null;
    this.state = {
      selectedFilter: props.data[0] && props.data[0].accountType === 'KW' ? '9N' : 'Select',
      dataToPaymentSelection: [],
      totalPaymentSelection: 0,
      showTransactionOtpModal: false,
      transferDetails: [
        {
          docs: {},
          BankName: '',
          ChequeOrDDAmount: '',
          ChequeOrDDNumber: '',
        },
      ],
      chequeErrorMessage: '',
      isVerificationOptionModalOpen: false,
    };

    this.changeFilter = this.changeFilter.bind(this);
    this.addFunds = this.addFunds.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateDocs = this.updateDocs.bind(this);
    this.onChangeChequeAmount = this.onChangeChequeAmount.bind(this);
    this.getAssetClass = this.getAssetClass.bind(this);
    this.onChangeKwspApplicationNumber = this.onChangeKwspApplicationNumber.bind(this);
    this.onChangeKwspApplicationDate = this.onChangeKwspApplicationDate.bind(this);
    this.closeJointAccountOtpSelectionModal = this.closeJointAccountOtpSelectionModal.bind(this);
    this.toggleKwspConfirmationPopUp = this.toggleKwspConfirmationPopUp.bind(this);
    this.handleOpenVerificationOpenModal = this.handleOpenVerificationOpenModal.bind(this);
    this.initOtp = this.initOtp.bind(this);
    this.handleCloseVerificationOpenModal = this.handleCloseVerificationOpenModal.bind(this);
  }

  onChangeChequeAmount(e, i) {
    const {
      transactions,
      transactionRoute,
      transactionRequest, // only use for subscribe flow
    } = this.props;
    const { selectedFilter } = this.state;
    let paymentTypeText = selectedFilter === 'CQ' ? 'Cheque' : 'Remittance';
    if (selectedFilter === 'BD') {
      paymentTypeText = '';
    }
    const { value, name } = e.target;
    let enteredValue = value;
    if ((enteredValue.toString().match(/\./g) || []).length > 1) {
      // if user enter more than 1 period
      return;
    }
    const isNum = /^[0-9.]+$/.test(enteredValue);
    if (!isNum) {
      this.setState({
        chequeErrorMessage: `No comma separator allowed for entered ${paymentTypeText} amount`,
      });
      enteredValue = enteredValue.replace(/,/g, '');
    } else {
      this.setState({
        chequeErrorMessage: '',
      });
    }
    const initialInvestment =
      transactionRoute === 'subscribe'
        ? !_isEmpty(transactionRequest) && transactionRequest.transactionRequestAmount
        : !_isEmpty(transactions) && transactions.transactionRequestAmount;

    const fixedInitialInvestment = initialInvestment ? initialInvestment.toFixed(2) : 0;
    if (isNum || enteredValue === '') {
      const amount = parseFloat(enteredValue);
      this.setState(
        {
          transferDetails: update(this.state.transferDetails, { [i]: { [name]: { $set: enteredValue } } }),
        },
        () => {
          if (parseFloat(amount) !== parseFloat(fixedInitialInvestment)) {
            this.setState({
              chequeErrorMessage: `${paymentTypeText} amount should be equal to investment amount`,
            });
          } else {
            this.setState({
              chequeErrorMessage: '',
            });
          }
        },
      );
    }
  }

  onChangeKwspApplicationNumber(element) {
    this.setState({
      kwspApplicationNumber: element.target.value,
    });
  }

  onChangeKwspApplicationDate(dateValue) {
    this.setState({
      effectiveDate: dateValue,
    });
  }

  getAccount(transactionRequest) {
    const { clientDetails } = this.props;
    return clientDetails.info.account.find(
      (accountItem) => accountItem.partnerAccountMappingId === transactionRequest.partnerAccountNO,
    );
  }

  getAssetClass() {
    return this.props.data.map((item) => item.fund.assetbreakdown[0].class);
  }

  getAccountType(data, transactionRequest) {
    const {
      clientDetails: {
        info: { account },
      },
    } = this.props;
    if (data && data.length) {
      return data[0].accountType;
    }

    return account.find((accountItem) => accountItem.partnerAccountMappingId === transactionRequest.partnerAccountNO)
      .UTRACCOUNTTYPE;
  }

  toggleKwspConfirmationPopUp(isContinue) {
    this.setState(
      {
        showKwspDataConfirmationPopUp: !this.state.showKwspDataConfirmationPopUp,
      },
      () => {
        if (isContinue) {
          this.handleOpenVerificationOpenModal();
        }
      },
    );
  }

  closeJointAccountOtpSelectionModal() {
    this.setState({
      showTransactionOtpModal: false,
      selectedFundAccountNumber: null,
    });
  }

  renderPaymentContent() {
    const { data, transactions, clientDetails, lov, transactionRoute, transactionRequest, kwspCashIntroDetails } = this.props;
    const selectedAcc = this.getAccount(transactionRequest);
    const transactionAccountType = selectedAcc ? selectedAcc.UTRACCOUNTTYPE : '';
    let selectedPaymentMethod;

    const selectedFunds = [];

    if (transactionRoute === 'topup') {
      const salesChargeInfo = this.props.salesCharges.map((item) => ({
        salesCharge: getSalesCharge(item.campaignCodeSalesCharge, item.RATE),
        fundCode: item.NEWFUNDCODE.trim(),
      }));

      for (let i = 0; i < data.length; i += 1) {
        for (let j = 0; j < salesChargeInfo.length; j += 1) {
          if (data[i].fund.fundcode === salesChargeInfo[j].fundCode) {
            selectedFunds.push({
              campaignCodeSalesCharge: salesChargeInfo[j].salesCharge,
              fundcode: salesChargeInfo[j].fundCode,
              name: data[i].fund.name,
              initialInvestment: data[i].newAmount,
            });
          }
        }
      }
    }

    if (transactionRoute === 'subscribe') {
      for (let i = 0; i < transactionRequest.transactions.length; i += 1) {
        const transaction = transactionRequest.transactions[i];
        selectedFunds.push({
          fundcode: transaction.fund.fundcode,
          name: transaction.fund.name,
          initialInvestment: transaction.transactionAmount,
          campaignCodeSalesCharge: getSalesCharge(transaction.campaignCodeSalesCharge, transaction.hzFundSARate),
        });
      }
    }

    if ((data[0] && data[0].accountType === 'KW') || transactionAccountType === 'KW') {
      selectedPaymentMethod = '9N';
    } else {
      selectedPaymentMethod = this.state.selectedFilter;
    }
    this.selectedPaymentMethod = selectedPaymentMethod;

    if (transactionRoute === 'subscribe') {
      return (
        <PaymentContent
          initialInvestment={0}
          value={selectedPaymentMethod}
          onChange={this.changeFilter}
          data={this.state.transferDetails}
          addFunds={this.addFunds}
          onInputChange={this.handleChange}
          onChangeChequeAmount={this.onChangeChequeAmount}
          account={clientDetails ? clientDetails.info.account[0] : {}} // any account works, we just have to check for email verification
          onSubmit={this.submit}
          updateDocs={this.updateDocs}
          transactions={transactionRequest}
          lov={lov}
          clientDetails={clientDetails}
          errorMessage={this.state.chequeErrorMessage}
          transactionRoute={transactionRoute}
          kwspCashIntroDetails={kwspCashIntroDetails}
          onChangeKwspApplicationNumber={this.onChangeKwspApplicationNumber}
          onChangeKwspApplicationDate={this.onChangeKwspApplicationDate}
          kwspApplicationNumber={this.state.kwspApplicationNumber}
          effectiveDate={this.state.effectiveDate}
          transactionAccountType={transactionAccountType}
          showListOfFunds
          selectedFunds={selectedFunds}
        />
      );
    }

    return (
      <PaymentContent
        initialInvestment={0}
        value={this.state.selectedFilter}
        onChange={this.changeFilter}
        data={this.state.transferDetails}
        addFunds={this.addFunds}
        onInputChange={this.handleChange}
        onChangeChequeAmount={this.onChangeChequeAmount}
        onSubmit={this.submit}
        updateDocs={this.updateDocs}
        transactions={transactions}
        lov={lov}
        account={clientDetails ? clientDetails.info.account[0] : {}} // any account works, we just have to check for email verification
        clientDetails={clientDetails}
        errorMessage={this.state.chequeErrorMessage}
        kwspCashIntroDetails={kwspCashIntroDetails}
        onChangeKwspApplicationNumber={this.onChangeKwspApplicationNumber}
        onChangeKwspApplicationDate={this.onChangeKwspApplicationDate}
        kwspApplicationNumber={this.state.kwspApplicationNumber}
        effectiveDate={this.state.effectiveDate}
        fundDetails={data[0]}
        showListOfFunds={transactionRoute === 'topup'}
        selectedFunds={selectedFunds}
      />
    );
  }

  submit() {
    const paymentRequestData = [];
    const { clientDetails, transactions, transactionRoute, transactionRequest, data } = this.props;
    const { portfolio } = clientDetails;
    const fundDetails = [...data];
    const otpTypeSubscribe = 'FUND_ADD';
    const otpTypeToUp = 'FUND_TOPUP';
    let requestOtpType;
    let totalPayment = 0;
    const assetclass = this.getAssetClass();
    const accountType = this.getAccountType(data, transactionRequest) || '';
    let investmentPartnerProductIds = [];
    if (transactionRoute === 'subscribe') {
      investmentPartnerProductIds = transactionRequest
        ? transactionRequest.transactions.map((item) => item.investmentPartnerProductId)
        : [];
      requestOtpType = otpTypeSubscribe;
    } else if (transactionRoute === 'topup') {
      investmentPartnerProductIds = data.length ? data.map((item) => item.partnerProductId) : [];
      requestOtpType = otpTypeToUp;
    }

    this.state.transferDetails.forEach((details) => {
      const { ChequeOrDDNumber, BankName, ChequeOrDDAmount, docs } = details;
      totalPayment += parseInt(ChequeOrDDAmount, 10);
      let onlinePaymentAmount = 0;

      if (!ChequeOrDDAmount && requestOtpType === otpTypeToUp) {
        // online payment
        // eslint-disable-next-line no-restricted-syntax
        for (const txn of transactions.transactions) {
          onlinePaymentAmount += txn.transactionAmount;
        }
      } else if (!ChequeOrDDAmount && requestOtpType === otpTypeSubscribe) {
        onlinePaymentAmount = transactionRequest.transactionRequestAmount;
      }

      const objData = {
        UTRAccountNO: transactionRequest ? transactionRequest.partnerAccountNO : fundDetails[0].partnerAccountNo,
        CustomerId: transactionRequest ? transactionRequest.customerId : fundDetails[0].customerId,
        RequestStatus: 'Created',
        ChequeDDStatus: 'New',
        ChequeOrDDNumber,
        PaymentType: this.selectedPaymentMethod,
        ChequeOrDDAmount: ChequeOrDDAmount || onlinePaymentAmount,
        assetclass: JSON.stringify(_uniq(assetclass)),
        TransactionRequestId: transactionRoute === 'subscribe' ? transactionRequest.id : transactions.id,
        ChequeOrBDFileName: docs.fileName,
        BankName,
        TransactionDocId: docs.TransactionDocId,
      };
      paymentRequestData.push(objData);
    });
    const genericData = {
      CustomerId: portfolio.customerId,
      PaymentRequest: paymentRequestData,
      investmentPartnerProductIds,
      createOrder: true,
      accountType,
    };
    const payload =
      accountType === 'CS'
        ? genericData
        : {
            ...genericData,
            serialNumber: this.state.kwspApplicationNumber,
            applicationDate: moment(this.state.effectiveDate).format('DD/MM/YYYY'),
          };

    this.setState(
      {
        totalPayment,
        transactionPayload: {
          requestOtpType,
          data: payload,
        },
      },
      () => {
        let accountNumber;
        if (requestOtpType === otpTypeToUp) {
          accountNumber = fundDetails[0].partnerAccountNo;
        } else {
          accountNumber = transactionRequest.partnerAccountNO;
        }
        if (
          this.isFundPartOfJointAccount(accountNumber) &&
          findOtpSelectedAccounts(clientDetails.info.jointAccountOtpSelection, accountNumber)
        ) {
          this.setState({
            showTransactionOtpModal: true,
            selectedFundAccountNumber: accountNumber,
          });
        } else if (accountType === 'KW') {
          this.toggleKwspConfirmationPopUp(false);
        } else {
          this.handleOpenVerificationOpenModal();
        }
      },
    );
  }

  isFundPartOfJointAccount(selectedFundAccountNumber) {
    const { clientDetails } = this.props;
    return clientDetails.info.account.filter(
      (accountItem) =>
        accountItem.partnerAccountMappingId === selectedFundAccountNumber &&
        accountItem.jointAccounts &&
        accountItem.jointAccounts.length,
    ).length;
  }

  handleChange(e, i) {
    const { value, name } = e.target;
    this.setState({
      transferDetails: update(this.state.transferDetails, {
        [i]: { [name]: { $set: value } },
      }),
    });
  }

  changeFilter(e) {
    const { data, transactionRequest, transactionRoute } = this.props;
    let accountNumber = '';
    if (transactionRoute === 'subscribe') {
      accountNumber = transactionRequest.partnerAccountNO;
    } else {
      accountNumber = data && data[0].partnerAccountNo;
    }

    let updatedTransferDetails = { ...FUND_DETAILS };
    if (e.target.value === 'VA') {
      updatedTransferDetails = {
        ...FUND_DETAILS,
        ChequeOrDDNumber: `99${accountNumber}`,
      };
    } else {
      updatedTransferDetails = { ...FUND_DETAILS };
    }

    this.setState({
      transferDetails: [updatedTransferDetails],
      selectedFilter: e.target.value,
      chequeErrorMessage: '',
    });
  }

  addFunds() {
    const currentFunds = [...this.state.transferDetails];
    currentFunds.push(FUND_DETAILS);
    this.setState({
      transferDetails: currentFunds,
    });
  }

  updateDocs(data, i) {
    if (_isEmpty(data)) {
      this.setState({
        transferDetails: update(this.state.transferDetails, { [i]: { docs: { $set: {} } } }),
      });
    } else if (data.fileName) {
      this.setState({
        transferDetails: update(this.state.transferDetails, {
          [i]: { docs: { $set: data } },
        }),
      });
    } else if (data.TransactionDocId) {
      this.setState({
        transferDetails: update(this.state.transferDetails, {
          [i]: { docs: { TransactionDocId: { $set: data.TransactionDocId } } },
        }),
      });
    }
  }

  initOtp() {
    this.props.initFundTransactionOtp({
      ...this.state.transactionPayload,
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

  render() {
    const { open, handleClose, clientDetails, lov, trxRequestId } = this.props;
    const { isVerificationOptionModalOpen } = this.state;

    if (clientDetails && lov) {
      return (
        <React.Fragment>
          <KwspConfirmationPopUp
            open={this.state.showKwspDataConfirmationPopUp}
            toggleKwspConfirmationPopUp={this.toggleKwspConfirmationPopUp}
          />
          {this.state.showTransactionOtpModal && (
            <JointAccountOtpModal
              customerId={clientDetails.info.id}
              clientName={clientDetails.info.fullName}
              accountNumber={this.state.selectedFundAccountNumber}
              handleClose={this.closeJointAccountOtpSelectionModal}
            />
          )}
          <Modal open={open} handleClose={handleClose}>
            {this.renderPaymentContent()}
          </Modal>
          {isVerificationOptionModalOpen ? (
            <VerificationOptionModal
              open={isVerificationOptionModalOpen}
              handleSubmitViaOtp={this.initOtp}
              handleClose={this.handleCloseVerificationOpenModal}
              trxPayload={this.state.transactionPayload}
              trxRequestId={trxRequestId}
            />
          ) : null}
        </React.Fragment>
      );
    }
    return null;
  }
}

PaymentSelection.propTypes = {
  clientDetails: PropTypes.object,
  transactions: PropTypes.object,
  open: PropTypes.func,
  handleClose: PropTypes.func,
  initFundTransactionOtp: PropTypes.func,
  data: PropTypes.array,
  transactionRoute: PropTypes.string,
  transactionRequest: PropTypes.object,
  lov: PropTypes.object,
  kwspCashIntroDetails: PropTypes.object,
  trxRequestId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  salesCharges: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  transactions: makeSelectTransactions(),
  clientDetails: makeSelectClientDetails(),
  lov: makeSelectLOV(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
  trxRequestId: makeSelectTrxRequestId(),
  salesCharges: makeSelectSalesCharges(),
});

function mapDispatchToProps(dispatch) {
  return {
    createPaymentDocs: (payload) => dispatch(createPaymentDocs(payload)),
    initFundTransactionOtp: (payload) => dispatch(initFundTransactionOtp(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PaymentSelection);
