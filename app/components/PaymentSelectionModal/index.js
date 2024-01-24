import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniq from 'lodash/uniq';
import _isEmpty from 'lodash/isEmpty';
import update from 'immutability-helper';
import moment from 'moment';
import Modal from 'components/Modal';
import LoadingOverlay from 'components/LoadingOverlay';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { makeSelectClientDetails, makeSelectProcessing } from 'containers/ClientDetails/selectors';
import { makekwspCashIntroDetails, makeSelectAddFundsTrxRequestId } from 'containers/OnBoarding/selectors';
import { initFundTransactionOtp } from 'containers/ClientDetails/actions';
import { createPaymentDocs } from 'containers/OnBoarding/actions';
import VerificationOptionModal from 'containers/ClientDetails/TransactionModal/VerificationOptionModal';
import JointAccountOtpModal from '../../containers/ClientDetails/Funds/JointAccountOtpConsentModal';
import KwspConfirmationPopUp from '../../components/Kwsp/Modal/kwspConfirmationModal';
import PaymentContent from './PaymentContent';
import { findOtpSelectedAccounts } from '../../containers/ClientDetails/utils/filterJointAccountParams';

const FUND_DETAILS = {
  docs: {},
  BankName: '',
  ChequeOrDDAmount: '',
  ChequeOrDDNumber: '',
};

class PaymentSelection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.selectedFundAccountNumber = null;
    this.state = {
      data: props.data,
      selectedFilter: props.customer && props.customer.UTRACCOUNTTYPE === 'KW' ? '9N' : 'Select',
      dataToPaymentSelection: [],
      totalPaymentSelection: 0,
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
    this.onChangeKwspApplicationNumber = this.onChangeKwspApplicationNumber.bind(this);
    this.onChangeKwspApplicationDate = this.onChangeKwspApplicationDate.bind(this);
    this.handleJointAccountOtpConsentPopUp = this.handleJointAccountOtpConsentPopUp.bind(this);
    this.closeJointAccountOtpSelectionModal = this.closeJointAccountOtpSelectionModal.bind(this);
    this.toggleKwspConfirmationPopUp = this.toggleKwspConfirmationPopUp.bind(this);
    this.handleOpenVerificationOpenModal = this.handleOpenVerificationOpenModal.bind(this);
    this.initOtp = this.initOtp.bind(this);
    this.handleCloseVerificationOpenModal = this.handleCloseVerificationOpenModal.bind(this);
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

  addFunds() {
    const currentFunds = [...this.state.transferDetails];
    currentFunds.push(FUND_DETAILS);
    this.setState({
      transferDetails: currentFunds,
    });
  }
  changeFilter(e) {
    const { customer } = this.props;
    let updatedTransferDetails = { ...FUND_DETAILS };
    if (e.target.value === 'VA' && customer && customer.partnerAccountMappingId) {
      updatedTransferDetails = {
        ...FUND_DETAILS,
        ChequeOrDDNumber: `99${customer.partnerAccountMappingId}`,
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
  handleChange(e, i) {
    const { value, name } = e.target;
    this.setState({
      transferDetails: update(this.state.transferDetails, {
        [i]: { [name]: { $set: value } },
      }),
    });
  }

  onChangeChequeAmount(e, i) {
    const { value, name } = e.target;
    const { selectedFilter } = this.state;
    let paymentTypeText = selectedFilter === 'CQ' ? 'Cheque' : 'Remittance';
    if (selectedFilter === 'BD') {
      paymentTypeText = '';
    }
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
    const initialInvestment = (!_isEmpty(this.props.transactions) && this.props.transactions.transactionRequestAmount) || 0;
    const fixedInitAmount = initialInvestment.toFixed(2);
    if (isNum || enteredValue === '') {
      const amount = parseFloat(enteredValue);
      this.setState(
        {
          transferDetails: update(this.state.transferDetails, { [i]: { [name]: { $set: enteredValue } } }),
        },
        () => {
          if (parseFloat(amount) !== parseFloat(fixedInitAmount)) {
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

  submit() {
    const paymentRequestData = [];
    const { clientDetails, transactions, selectedFunds, customer } = this.props;
    const { effectiveDate, kwspApplicationNumber } = this.state;

    const { portfolio, info } = clientDetails;
    let totalPayment = 0;
    const arrAssetclass = selectedFunds ? selectedFunds.map((o) => o.assetclass) : [];
    let UTRAccountNO;
    let CustomerId;
    if (
      this.isFundPartOfJointAccount(customer.partnerAccountMappingId) &&
      findOtpSelectedAccounts(info.jointAccountOtpSelection, customer.partnerAccountMappingId)
    ) {
      this.handleJointAccountOtpConsentPopUp(customer.partnerAccountMappingId);
    } else {
      if (this.props.type === 'CREATE_NEW') {
        UTRAccountNO = clientDetails.info.account[0].partnerAccountMappingId;
        CustomerId = clientDetails.info.account[0].customerId;
      } else {
        // UTRAccountNO = portfolio.accountId;
        // CustomerId = portfolio.customerId;
        UTRAccountNO = transactions.partnerAccountNO;
        CustomerId = transactions.customerId;
      }

      this.state.transferDetails.map((data) => {
        const { ChequeOrDDNumber, BankName, ChequeOrDDAmount, docs } = data;
        totalPayment += parseInt(ChequeOrDDAmount, 10);

        let onlinePaymentAmount = 0;

        if (!ChequeOrDDAmount) {
          // online payment
          for (const txn of transactions.transactions) {
            onlinePaymentAmount = onlinePaymentAmount + txn.transactionAmount;
          }
        }

        const objData = {
          UTRAccountNO,
          CustomerId,
          RequestStatus: 'Created',
          ChequeDDStatus: 'New',
          ChequeOrDDNumber,
          PaymentType: this.selectedPaymentMethod,
          ChequeOrDDAmount: ChequeOrDDAmount ? ChequeOrDDAmount : onlinePaymentAmount,
          TransactionRequestId: transactions.id,
          ChequeOrBDFileName: docs.fileName,
          BankName,
          TransactionDocId: docs.TransactionDocId,
          assetclass: JSON.stringify(_uniq(arrAssetclass)),
        };
        paymentRequestData.push(objData);
      });
      this.setState({
        totalPayment,
      });

      if (this.props.type === 'CREATE_NEW') {
        this.props.createPaymentDocs({ PaymentRequest: paymentRequestData });
      } else {
        const kwsp9NDetails = {
          serialNumber: kwspApplicationNumber,
          applicationDate: moment(effectiveDate).format('DD/MM/YYYY'),
        };
        const investmentPartnerProductIds = transactions.transactions.map((item) => item.investmentPartnerProductId);
        this.setState(
          {
            initFundTransactionOtpPayload: {
              requestOtpType: 'FUND_ADD',
              data: {
                CustomerId: portfolio.customerId,
                PortfolioId: portfolio.id,
                PaymentRequest: paymentRequestData,
                accountType: customer.UTRACCOUNTTYPE,
                ...kwsp9NDetails,
                investmentPartnerProductIds,
                createOrder: true,
              },
            },
          },
          () => {
            if (customer.UTRACCOUNTTYPE === 'KW') {
              this.toggleKwspConfirmationPopUp(false);
            } else {
              // this.initOtp();
              this.handleOpenVerificationOpenModal();
            }
          },
        );
      }
    }
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

  handleJointAccountOtpConsentPopUp(accountNumber) {
    this.setState({
      showTransactionOtpModal: true,
      selectedFundAccountNumber: accountNumber,
    });
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

  closeJointAccountOtpSelectionModal() {
    this.setState({
      showTransactionOtpModal: false,
      selectedFundAccountNumber: null,
    });
  }

  initOtp() {
    this.props.initFundTransactionOtp({
      ...this.state.initFundTransactionOtpPayload,
    });
  }

  toggleKwspConfirmationPopUp(isContinue) {
    this.setState(
      {
        showKwspDataConfirmationPopUp: !this.state.showKwspDataConfirmationPopUp,
      },
      () => {
        if (isContinue) {
          // this.initOtp();
          this.handleOpenVerificationOpenModal();
        }
      },
    );
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
    const {
      open,
      handleClose,
      transactions,
      type,
      processing,
      lov,
      customer,
      clientDetails,
      kwspCashIntroDetails,
      trxRequestId,
    } = this.props;
    const { isVerificationOptionModalOpen } = this.state;

    let selectedPaymentMethod;
    if (customer && customer.UTRACCOUNTTYPE === 'KW') {
      selectedPaymentMethod = '9N';
    } else {
      selectedPaymentMethod = this.state.selectedFilter;
    }
    this.selectedPaymentMethod = selectedPaymentMethod;

    return (
      <React.Fragment>
        <KwspConfirmationPopUp
          open={this.state.showKwspDataConfirmationPopUp}
          toggleKwspConfirmationPopUp={this.toggleKwspConfirmationPopUp}
          epfMembershipNumber={customer.EPFMembershipNumber}
        />
        <Modal open={open} handleClose={handleClose} zIndexModal={10}>
          <LoadingOverlay show={processing} />
          {this.state.showTransactionOtpModal && (
            <JointAccountOtpModal
              clientName={customer.FullName}
              customerId={customer.customerId}
              accountNumber={customer.partnerAccountMappingId}
              handleClose={this.closeJointAccountOtpSelectionModal}
            />
          )}
          <PaymentContent
            initialInvestment={0}
            value={selectedPaymentMethod}
            onChange={this.changeFilter}
            onChangeChequeAmount={this.onChangeChequeAmount}
            data={this.state.transferDetails}
            addFunds={this.addFunds}
            onInputChange={this.handleChange}
            onSubmit={this.submit}
            updateDocs={this.updateDocs}
            transactions={transactions}
            customer={customer}
            type={type}
            lov={lov}
            errorMessage={this.state.chequeErrorMessage}
            account={clientDetails ? clientDetails.info.account[0] : {}} // any account works, we just have to check for email verification
            kwspCashIntroDetails={kwspCashIntroDetails}
            onChangeKwspApplicationNumber={this.onChangeKwspApplicationNumber}
            onChangeKwspApplicationDate={this.onChangeKwspApplicationDate}
            kwspApplicationNumber={this.state.kwspApplicationNumber}
            effectiveDate={this.state.effectiveDate}
            showListOfFunds={type === 'ADD_FUNDS'}
            selectedFunds={this.props.selectedFunds}
          />
        </Modal>
        {isVerificationOptionModalOpen ? (
          <VerificationOptionModal
            open={isVerificationOptionModalOpen}
            handleSubmitViaOtp={this.initOtp}
            handleClose={this.handleCloseVerificationOpenModal}
            trxRequestId={trxRequestId}
            trxPayload={this.state.initFundTransactionOtpPayload}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

PaymentSelection.propTypes = {
  clientDetails: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  transactions: PropTypes.object,
  type: PropTypes.string,
  data: PropTypes.object,
  initFundTransactionOtp: PropTypes.func,
  processing: PropTypes.bool,
  selectedFunds: PropTypes.array,
  trxRequestId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  createPaymentDocs: PropTypes.func.isRequired,
  lov: PropTypes.object,
  customer: PropTypes.object,
};
const mapStateToProps = createStructuredSelector({
  clientDetails: makeSelectClientDetails(),
  processing: makeSelectProcessing(),
  lov: makeSelectLOV(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
  trxRequestId: makeSelectAddFundsTrxRequestId(),
});

function mapDispatchToProps(dispatch) {
  return {
    initFundTransactionOtp: (payload) => dispatch(initFundTransactionOtp(payload)),
    createPaymentDocs: (payload) => dispatch(createPaymentDocs(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PaymentSelection);
