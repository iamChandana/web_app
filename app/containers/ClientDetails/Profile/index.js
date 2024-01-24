/* eslint-disable import/first */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import { ColumnGridCenter } from 'components/GridContainer';
import pick from 'lodash/pick';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _compact from 'lodash/compact';
import _findIndex from 'lodash/findIndex';
import _get from 'lodash/get';
import Text from 'components/Text';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import { compose } from 'redux';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import LoadingOverlay from 'components/LoadingOverlay';
import AccountExists from 'components/AmlaWarning/AccountExists';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { makeSelectDocReUploadSuccess, makeSelectDocReUploadFailure, makeSelectImage } from 'containers/OnBoarding/selectors';
import {
  getCustomerDetails,
  updateCustomerDetails,
  reset,
  resetError,
  resetClientProfileData,
  initClientProfileChangeOtp,
  clearClientProfileUpdateOtpData,
  updateClientEmail,
  createAccount,
  resendConfirmationEmail,
  clearStateOfConfirmationEmailResent,
  clearNewEmail,
  getRiskQuestionsAnswers,
  createKwspAccount,
  getDocumentsUrl,
  saveDocumentsUrl,
} from 'containers/ClientDetails/actions';
import { reUploadDocument, clearReUploadDocsLogs, getRiskProfiles } from 'containers/OnBoarding/actions';
import {
  makeSelectClientDetails,
  makeSelectProcessing,
  makeSelectisOTPCalled,
  makeSelectError,
  makeSelectInvalidCustomerID,
  makeSelectShowModalClientProfileChangeOtp,
  makeSelectInitClientProfileChangeOtpSuccessData,
  makeSelectInitClientProfileChangeOtpError,
  makeSelectUpdateClientEmailError,
  makeSelectUpdateClientEmailSuccess,
  makeSelectNewEmail,
  makeSelectIsProcessingUpdateClientProfile,
  makeSelectMessageResentConfirmationEmailStatus,
  makeSelectFormDetails,
  makeSelectCreateCashAccountSuccess,
  makeSelectCreateCashAccountError,
  makeSelectCreateCashAccountClientError,
  makeSelectCreateKwspAccountSuccess,
  makeSelectSetAccountCreationFlow,
  makeSelectDocumentsUrl,
} from '../selectors';
import Headline from 'containers/ClientDetails/Headline';
import EditProfileFields from './Profile';
import { FullWidthGrid } from './styles';
import { getLOV } from 'containers/HomePage/actions';
import moment from 'moment';
import Dialog from 'components/Dialog';
// import EmailSentIcon from '../images/email-sent.svg';
import CloseIcon from '../images/close.png';
import ClientUpdateSuccessIcon from './assets/check.svg';
// import ClientUpdateFailureIcon from '../images/close.svg';
import OtpBox from 'components/OtpBox';
import { isValidEmail } from 'utils/Verifier';
import { filterJointAccounts } from '../utils/filterJointAccountParams';
import { formatJointAccountHolderArray } from '../utils/getAccountHolderType';
import extractNumbersFromString from 'utils/extractNumbersFromString';

const maxLengthEmail = 60;

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      editEmail: false,
      isOpenDialogEmailSentForChangingEmail: false,
      email: props.clientDetails ? props.clientDetails.info.account[0].AccEmail : null,
      showModalClientProfileChangeOtp: false,
      isSaving: false,
      isOpenDialogForClientUpdate: false,
      cancelled: true,
      cashAccountCreatedSuccess: false,
      createAccountError: false,
      updateClientError: false,
      rawImagePayload: [],
      kwspAccountCreatedSuccess: false,
    };

    this.edit = this.edit.bind(this);
    this.submit = this.submit.bind(this);
    this.save = this.save.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.handleCloseDialogEmailSentOnlinePayment = this.handleCloseDialogEmailSentOnlinePayment.bind(this);
    this.editField = this.editField.bind(this);
    this.handleCloseOtpModal = this.handleCloseOtpModal.bind(this);
    this.resendEmail = this.resendEmail.bind(this);
    this.cancel = this.cancel.bind(this);
    // this.reUploadDocumentCall = this.reUploadDocumentCall.bind(this);
    this.filterTaxResidents = this.filterTaxResidents.bind(this);
    this.getTaxResidentsCountryJurisdiction = this.getTaxResidentsCountryJurisdiction.bind(this);
    this.checkIncomeTaxInfoAvailable = this.checkIncomeTaxInfoAvailable.bind(this);
    this.checkReasonTINNotAvailable = this.checkReasonTINNotAvailable.bind(this);
    this.getReasonTINNotAvailableExplanation = this.getReasonTINNotAvailableExplanation.bind(this);
    this.getTruthyTaxResidentsValues = this.getTruthyTaxResidentsValues.bind(this);
    this.checkPermanentCorrespondenceAddr = this.checkPermanentCorrespondenceAddr.bind(this);
    this.checkIdentificationNumberAvailable = this.checkIdentificationNumberAvailable.bind(this);
    this.addFunds = this.addFunds.bind(this);
    this.callAddFunds = this.callAddFunds.bind(this);
    this.getDefaultBankDetails = this.getDefaultBankDetails.bind(this);
    this.singleAccountStatus = this.singleAccountStatus.bind(this);
    // this.print = this.print.bind(this);
    this.getEpfDetails = this.getEpfDetails.bind(this);
  }

  toastId = null;

  notify = (msg) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  componentWillMount() {
    this.props.clearReUploadDocsLogs();
    this.props.clearClientProfileUpdateOtpData();
    const idParam = this.props.match.params.id;
    // this.props.resetClientProfileData(); // Not needed
    this.processUrlParam();
    const { clientDetails } = this.props;
    if (!_isEmpty(idParam)) {
      if (clientDetails && clientDetails.info) {
        const currentId = (clientDetails.info && clientDetails.info.id) || '';
        if (currentId != idParam) {
          this.props.resetClientProfileData();
          this.props.getCustomerDetails({ idParam, url: 'profile' });
        }
      }
      if (_isEmpty(clientDetails) || _isEmpty(clientDetails.info) || _isEmpty(clientDetails.portfolio)) {
        this.props.getCustomerDetails({ idParam, url: 'profile' });
      }
    } else {
      this.notifyError('Unable to retrieve customer profile and portfolio due to invalid customer id');
    }
    // this.props.getCustomerDetails({ idParam, url: 'profile' });

    if (_isEmpty(this.props.lov)) {
      this.props.getLOV();
    }
    this.props.clearStateOfConfirmationEmailResent();

    console.log(_isEmpty(this.props.documentsUrl), this.props.documentsUrl, idParam, '****');
    if (_isEmpty(this.props.documentsUrl) || this.props.documentsUrl.customerId !== idParam) {
      this.props.getDocumentsUrl();
    }
  }

  componentWillUnmount() {
    this.props.clearNewEmail();
    this.props.clearReUploadDocsLogs();
  }

  checkPermanentCorrespondenceAddr(addressType1, addressType2) {
    const {
      clientDetails: {
        info: { address },
      },
    } = this.props;

    let permanentAddress = {},
      correspondenceAddress = {};

    permanentAddress = { ...address.filter((addressItem) => addressItem.addresstype === addressType1)[0] };
    correspondenceAddress = { ...address.filter((addressItem) => addressItem.addresstype === addressType2)[0] };

    delete permanentAddress.id;
    delete permanentAddress.addresstype;
    delete permanentAddress.createdAt;
    delete permanentAddress.createdBy;
    delete permanentAddress.modifiedAt;
    delete permanentAddress.modifiedBy;

    delete correspondenceAddress.id;
    delete correspondenceAddress.addresstype;
    delete correspondenceAddress.createdAt;
    delete correspondenceAddress.createdBy;
    delete correspondenceAddress.modifiedAt;
    delete correspondenceAddress.modifiedBy;

    return _isEqual(permanentAddress, correspondenceAddress);
  }

  processUrlParam() {
    if (!this.props.location || !this.props.location.search) {
      return;
    }
    if (this.props.location.pathname.indexOf('profile/otpy') > 0) {
      const locationSearch = this.props.location.search;
      const urlParams = locationSearch.split('?');
      const tokenUpdateEmail = urlParams[1].split('=')[1];
      this.props.updateClientEmail({
        tokenUpdateEmail,
      });
    }
    if (this.props.location.pathname.indexOf('createAccount/otpy') > 0) {
      const locationSearch = this.props.location.search;
      const urlParams = locationSearch.split('?');
      const tokenUpdateEmail = urlParams[1].split('=')[1];
      this.props.createAccount({
        tokenUpdateEmail,
        id: this.props.clientDetails.info.id,
      });
    }
    if (this.props.location.pathname.indexOf('reUploadDocument/otpy') > 0) {
      const locationSearch = this.props.location.search;
      const urlParams = locationSearch.split('?');
      const tokenReUploadDocs = urlParams[1].split('=')[1];
      this.props.reUploadDocument({
        tokenReUploadDocs,
        rawImagePayload: this.props.image,
        id: this.props.clientDetails && this.props.clientDetails.info ? this.props.clientDetails.info.id : null,
      });
    }
    if (
      this.props.location.pathname.indexOf('profile/otpn') > 0 ||
      this.props.location.pathname.indexOf('createAccount/otpn') > 0 ||
      this.props.location.pathname.indexOf('profile/otpn') > 0
    ) {
      this.notify('Otp failed!');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error && !_isEmpty(nextProps.error)) {
      toast(nextProps.error);
      this.props.resetError();
      this.props.history.replace('/clients');
    }

    if (nextProps.invalidCustomerID) {
      this.props.history.replace('/clients');
    } else if (
      !_isEmpty(nextProps.clientDetails) &&
      nextProps.clientDetails !== this.props.clientDetails &&
      _isEmpty(_get(nextProps.clientDetails, ['info'], null))
    ) {
      this.props.history.replace('/clients');
    }

    if (nextProps.initClientProfileChangeOtpSuccessData) {
      this.setState({
        showModalClientProfileChangeOtp: true,
      });
    }

    if (nextProps.updateClientEmailError && this.props.updateClientEmailError !== nextProps.updateClientEmailError) {
      // this.notify(nextProps.initClientProfileChangeOtpError);
      this.setState({
        updateClientError: true,
        isOpenDialogEmailSentForChangingEmail: true,
        message: nextProps.initClientProfileChangeOtpError,
      });
    }

    if (!this.props.clientDetails && nextProps.clientDetails && !this.props.isOTPCalled) {
      this.processUrlParam();
    }

    if (nextProps.updateClientEmailSuccess) {
      this.setState({
        isOpenDialogEmailSentForChangingEmail: true,
      });
    }
    if (nextProps.cashAccountCreatedSuccess) {
      this.setState({
        cashAccountCreatedSuccess: true,
      });
    }
    if (nextProps.kwspAccountCreatedSuccess) {
      this.setState({
        kwspAccountCreatedSuccess: true,
      });
    }
    if (!this.props.updateClientEmailError && nextProps.updateClientEmailError) {
      this.setState({
        updateClientError: true,
        message: nextProps.updateClientEmailError,
        isOpenDialogEmailSentForChangingEmail: true,
      });
      // this.notify(nextProps.updateClientEmailError);
    }

    if (
      nextProps.cashAccountCreationFailed ||
      (this.props.createCashAccountClientError && nextProps.createCashAccountClientError)
    ) {
      this.setState({
        createAccountError: true,
        message: nextProps.createCashAccountClientError,
        isOpenDialogEmailSentForChangingEmail: true,
      });
      // this.notify(nextProps.updateClientEmailError);
    }

    if (nextProps.docReUploadSuccess) {
      this.setState(
        {
          isOpenDialogEmailSentForChangingEmail: true,
          docMessage: 'Document uploaded successfully',
        },
        () => {
          console.log('IS OPEN', nextProps);
        },
      );
    }

    if (nextProps.docReUploadFailure && this.props.docReUploadFailure !== nextProps.docReUploadFailure) {
      this.setState({
        updateClientError: true,
        isOpenDialogEmailSentForChangingEmail: true,
        message: nextProps.docReUploadFailure,
      });
    }

    if (this.props.clientDetails && nextProps.clientDetails && this.props.clientDetails.info && nextProps.clientDetails.info) {
      if (this.props.clientDetails.info.account[0].AccEmail !== nextProps.clientDetails.info.account[0].AccEmail) {
        this.setState({
          email: nextProps.clientDetails.info.account[0].AccEmail,
        });
      }
    }

    return null;
  }

  getInitAccount(account) {
    const suspenedAcc = account.find((accountItem) => accountItem.AccountStatus === 'S');
    return suspenedAcc.partnerAccountMappingId;
  }

  getSuspendedAccountNumber(account) {
    const suspendedAccountsArray = this.suspendedAccountsFilter(account);
    const suspendedCashAccounts = suspendedAccountsArray.filter((accountItem) => accountItem.UTRACCOUNTTYPE === 'CS');
    console.log(suspendedAccountsArray, suspendedCashAccounts);
    if (suspendedCashAccounts.length) {
      return suspendedCashAccounts[0].partnerAccountMappingId;
    }
    return suspendedAccountsArray.length ? suspendedAccountsArray[0].partnerAccountMappingId : this.getInitAccount(account);
  }

  submit(values, isCreatingAccount, isDocUpload) {
    const { clientDetails } = this.props;
    const { account, bank, occupation } = clientDetails.info;

    // * When bankAccountNumber is empty and not updated, then sending a blank bank details.
    if ('bank' in values) {
      const bankClone = [...values.bank];
      let editedBankData = bank.find((item) => item.id === bankClone[0].id);
      if (!editedBankData) {
        editedBankData = { bankAcctNumber: null };
        bankClone[0] = {
          ...bankClone[0],
          default: true,
        };
        values = {
          ...values,
          bank: bankClone,
        };
      }
      if (!bankClone[0].bankAcctNumber && !editedBankData.bankAcctNumber) {
        bankClone[0] = {
          ...bankClone[0],
          bankName: '',
          bankCode: '',
        };
        values = {
          ...values,
          bank: bankClone,
        };
      }
    }

    // Removing string values from monthlySavings value, is exist
    if ('monthlySavings' in values && values.monthlySavings) {
      const monthlySavingsInNumFormat = extractNumbersFromString(values.monthlySavings).join('');
      values = {
        ...values,
        monthlySavings: Number(monthlySavingsInNumFormat),
      };
    }

    if ('noOfDependants' in values) {
      if (values.noOfDependants === '> 10') {
        values = {
          ...values,
          noOfDependants: 11,
        };
      }
    }

    const convertToArr = (e) => e.split(', ');

    if ('investmentExperience' in values) {
      values = {
        ...values,
        investmentExperience: convertToArr(values.investmentExperience),
      };
    }

    if ('existingCommitments' in values) {
      values = {
        ...values,
        existingCommitments: convertToArr(values.existingCommitments),
      };
    }

    let updatedOccupationData = {};
    if ('occupation' in values) {
      updatedOccupationData = {
        ...values.occupation[0],
      };
    }

    const notWorkingValues = ['91', '90', '62', '23'];
    if (notWorkingValues.includes(occupation[0].occupationType) && !(values.occupation && values.occupation[0].occupationType)) {
      updatedOccupationData = {
        ...updatedOccupationData,
        id: occupation[0].id,
        natureofbusiness: '',
      };
    }

    if (isDocUpload) {
      this.setState(
        {
          rawImagePayload: [...values.imagePayload],
        },
        () => {
          this.props.initClientProfileChangeOtp({
            requestOtpType: 'ReUploadDocument',
            data: {
              customerId: account[0].customerId,
              accountNumber: this.getSuspendedAccountNumber(account),
              values: _compact([...values.payload]),
            },
          });
        },
      );
    } else if (!isCreatingAccount) {
      const payloadData = {
        customerId: account[0].customerId,
        ...values,
        occupation: [updatedOccupationData],
      };
      if (!Object.keys(updatedOccupationData).length) {
        delete payloadData.occupation;
      }

      this.props.initClientProfileChangeOtp({
        requestOtpType: 'UpdateProfile',
        data: payloadData,
      });
    } else {
      this.props.initClientProfileChangeOtp({
        requestOtpType: 'CreateAccount',
        data: {
          customerId: account[0].customerId,
          ...values,
        },
      });
    }
  }

  edit(type) {
    this.setState((prevState) => ({
      edit: !prevState.edit,
    }));
  }

  isMultipleAccountDisabled() {
    const {
      clientDetails: { info },
    } = this.props;
    if (info.account.length > 1) {
      return info.account.filter((accountItem) => accountItem.AccountStatus === 'A').length > 0;
    }
    return true;
  }

  editField() {
    const editEmail = true;
    // const edit = this.isMultipleAccountDisabled();
    const edit = true;
    const cancelled = false;
    this.setState((prevState) => ({
      editEmail,
      edit,
      cancelled,
    }));
    this.props.clearNewEmail();
  }

  save() {
    const { clientDetails } = this.props;
    const { account } = clientDetails.info;
    let changedEmail = this.state.email;
    if (changedEmail) {
      changedEmail = changedEmail.trim();
    }
    if (changedEmail === '' || typeof isValidEmail(changedEmail) === 'string') {
      this.notify('Please enter a valid email!');
    } else if ((this.props.newEmail && changedEmail === this.props.newEmail) || changedEmail === account[0].AccEmail) {
      this.notify('Email cannot be the same as current one');
    } else {
      this.props.initClientProfileChangeOtp({
        requestOtpType: 'UpdateEmail',
        data: {
          CustomerId: account[0].customerId,
          email: changedEmail,
        },
      });
    }
  }

  onChangeField(e) {
    if (e.target.value.length <= maxLengthEmail) {
      this.setState({
        email: e.target.value,
      });
    }
  }

  getTruthyTaxResidentsValues(taxResidents) {
    const res = [];
    let filteredTaxArray = [];
    filteredTaxArray = taxResidents.filter((taxResidentItem) => taxResidentItem.no <= 3);
    filteredTaxArray.forEach((item, index) => {
      if (
        !_isEmpty(item.CountryJurisdiction) ||
        (!_isEmpty(item.IncomeTax) || !_isEmpty(item.ReasonTINNotAvailable) || !_isEmpty(item.RemarksReason))
      ) {
        const obj = { ...item };
        // delete obj.no;
        // obj.no = index + 1;
        res.push(obj);
      }
    });

    return res;
  }

  handleCloseDialogEmailSentOnlinePayment() {
    this.setState(
      {
        isOpenDialogEmailSentForChangingEmail: false,
        isSaving: false,
        editEmail: false,
      },
      () => {
        this.props.saveDocumentsUrl({});
        this.props.clearClientProfileUpdateOtpData();
        this.props.clearReUploadDocsLogs();
        const { clientDetails } = this.props;
        if (clientDetails) {
          const { account } = clientDetails.info;
          if (account) {
            this.setState(
              {
                cancelled: true,
              },
              () => {
                window.location.replace(`/clients/${account[0].customerId}/funds`);
              },
            );
          }
        }
      },
    );
  }

  handleCloseOtpModal() {
    this.setState({
      showModalClientProfileChangeOtp: false,
    });
    this.props.clearClientProfileUpdateOtpData();
    this.props.clearNewEmail();
  }

  resendEmail() {
    this.props.resendConfirmationEmail(null);
  }

  cancel() {
    this.setState(
      {
        editEmail: false,
        edit: false,
        originalEmail: this.props.clientDetails.info.account[0].AccEmail,
        email: this.props.clientDetails.info.account[0].AccEmail,
        cancelled: true,
      },
      () => {
        this.setState({
          originalEmail: null,
        });
      },
    );
  }

  filterTaxResidents(taxResidentIndex) {
    const taxResidents = this.getTruthyTaxResidentsValues(this.props.clientDetails.info.taxResidents);
    return taxResidents.filter((taxResidentItem) => taxResidentItem.no === taxResidentIndex);
  }

  getTaxResidentsFields(taxResidentIndex) {
    return (
      this.getTaxResidentsCountryJurisdiction(taxResidentIndex) ||
      this.checkIncomeTaxInfoAvailable(taxResidentIndex) ||
      this.checkReasonTINNotAvailable(taxResidentIndex) ||
      this.getReasonTINNotAvailableExplanation(taxResidentIndex)
    );
  }

  getTaxResidentsCountryJurisdiction(taxResidentIndex) {
    return this.filterTaxResidents(taxResidentIndex).length
      ? this.filterTaxResidents(taxResidentIndex)[0].CountryJurisdiction
      : '';
  }

  checkIncomeTaxInfoAvailable(taxResidentIndex) {
    return this.filterTaxResidents(taxResidentIndex).length ? this.filterTaxResidents(taxResidentIndex)[0].IncomeTax : '';
  }

  checkReasonTINNotAvailable(taxResidentIndex) {
    return this.filterTaxResidents(taxResidentIndex).length
      ? this.filterTaxResidents(taxResidentIndex)[0].ReasonTINNotAvailable
      : '';
  }

  getReasonTINNotAvailableExplanation(taxResidentIndex) {
    return this.filterTaxResidents(taxResidentIndex).length ? this.filterTaxResidents(taxResidentIndex)[0].RemarksReason : '';
  }

  checkIdentificationNumberAvailable(taxResidentIndex) {
    if (this.filterTaxResidents(taxResidentIndex).length) {
      if (
        !this.filterTaxResidents(taxResidentIndex)[0].RemarksReason &&
        !this.filterTaxResidents(taxResidentIndex)[0].IncomeTax &&
        !this.filterTaxResidents(taxResidentIndex)[0].ReasonTINNotAvailable
      ) {
        return null;
      }
      // else if (
      //   this.filterTaxResidents(taxResidentIndex)[0].RemarksReason ||
      //   this.filterTaxResidents(taxResidentIndex)[0].ReasonTINNotAvailable
      // ) {
      //   return false;
      // }
      else if (this.filterTaxResidents(taxResidentIndex)[0].IncomeTax) {
        return true;
      }
      return false;
    }
    return null;
  }

  addFunds(customerDetails, accountType) {
    const { portfolio, info } = this.props.clientDetails;
    const { id } = customerDetails.info;
    let cashIndex;
    if (accountType === 'CS') {
      const jointAccountUnavailableAccountNumber = filterJointAccounts(customerDetails.info.account, 'I');
      cashIndex = _findIndex(portfolio, ['accountId', jointAccountUnavailableAccountNumber]);
    } else {
      cashIndex = _findIndex(info.account, function(accountItem) {
        return accountItem.UTRACCOUNTTYPE === accountType && !accountItem.isEmis;
      });
      cashIndex = _findIndex(portfolio, ['accountId', info.account[cashIndex]['partnerAccountMappingId']]);
    }
    this.props.history.push(`/clients/${id}/add-funds/${portfolio[cashIndex].id}`, {
      accountType,
    });
  }

  callAddFunds(customerDetails, accountType) {
    this.addFunds(customerDetails, accountType);
  }

  suspendedAccountsFilter(account) {
    const accountStatus = account.filter(
      (accountItem) => accountItem && accountItem.AccountStatus === 'S' && !accountItem.jointAccounts.length,
    );
    return accountStatus;
  }

  singleAccountStatus(account) {
    return account[0].UTRACCOUNTTYPE === 'CS' ? account[0].AccountStatus : 'A';
  }

  getEpfDetails(accountDetails) {
    let epfDetails = {};
    const kwspAccount = accountDetails.find((item) => item.UTRACCOUNTTYPE === 'KW'); // EPF only exists for kwsp acc
    if (kwspAccount) {
      epfDetails = {
        doShowEpf: true,
        epfNumber: kwspAccount.EPFMembershipNumber,
      };
    } else {
      epfDetails = {
        doShowEpf: false,
        epfNumber: null,
      };
    }
    return epfDetails;
  }

  getDefaultBankDetails(data, key) {
    if (Array.isArray(data) && data.length) {
      const defaultBank = data.find((item) => Number(item.default));
      if (defaultBank) {
        return defaultBank[key];
      }
      return null;
    }
    return null;
  }

  render() {
    const { lov, clientDetails, processing, isProcessingUpdateClientProfile } = this.props;
    if (_isEmpty(clientDetails) || _isEmpty(clientDetails.info) || _isEmpty(lov)) return <LoadingOverlay show />;

    // disabling when the account is exprired
    let isRiskExpired = false;
    const { info } = clientDetails;
    const assessmentDate = info.ISAF_PERFORMANCE_DATE;
    const currentDate = moment(new Date());
    const diff = currentDate.diff(assessmentDate, 'months', true);
    if (
      diff >= 12 ||
      !info.ISAF_SCORE ||
      info.ISAF_SCORE === '' ||
      !info.ISAF_PERFORMANCE_DATE ||
      info.ISAF_PERFORMANCE_DATE === ''
    ) {
      isRiskExpired = true;
    }

    const { account, address, occupation, bank, identification, customerdocuments, taxResidents } = clientDetails.info;
    const permAddr = address.filter((obj) => {
      if (obj && obj.addresstype) {
        return obj.addresstype.toUpperCase() === 'PERMANENT';
      }
      return '';
    });

    const corrAddr = address.filter((obj) => {
      if (obj && obj.addresstype) {
        return obj.addresstype.toUpperCase() === 'CORRESPONDENCE';
      }
      return '';
    });

    const compAddr = address.filter((obj) => {
      if (obj && obj.addresstype) {
        return obj.addresstype.toUpperCase() === 'COMPANY';
      }
      return '';
    });

    const taxResidentsIDArray = this.getTruthyTaxResidentsValues(taxResidents);

    const {
      addressline1: permanentAddressLine1,
      addressline2: permanentAddressLine2,
      addressline3: permanentAddressLine3,
      postalCode: permanentPostalCode,
      state: permanentState,
      country: permanentCountry,
    } = pick(permAddr[0], ['addressline1', 'addressline2', 'addressline3', 'postalCode', 'state', 'country']);

    const {
      addressline1: companyAddressLine1,
      addressline2: companyAddressLine2,
      addressline3: companyAddressLine3,
      postalCode: companyPostalCode,
      state: companyState,
      country: companyCountry,
    } = pick(compAddr[0], ['addressline1', 'addressline2', 'addressline3', 'postalCode', 'state', 'country']);

    const {
      addressline1: correspondenceAddressLine1,
      addressline2: correspondenceAddressLine2,
      addressline3: correspondenceAddressLine3,
      postalCode: correspondencePostalCode,
      state: correspondenceState,
      country: correspondenceCountry,
    } = pick(corrAddr[0], ['addressline1', 'addressline2', 'addressline3', 'postalCode', 'state', 'country']);
    const permanentAddressId = pick(permAddr[0], ['id']);
    const companyAddressId = pick(compAddr[0], ['id']);
    const correspondenceAddressId = pick(corrAddr[0], ['id']);
    const occupationId = pick(occupation[0], ['id']);
    const bankId = this.getDefaultBankDetails(bank, 'id');
    const idObj = {
      permanentAddressId: permanentAddressId.id,
      correspondenceAddressId: correspondenceAddressId.id,
      companyAddressId: companyAddressId.id,
      occupationId: occupationId.id,
      bankId,
      taxResidentsId: this.getTruthyTaxResidentsValues(this.props.clientDetails.info.taxResidents),
    };

    const cashFunds = [];
    const kwspFunds = [];
    if (clientDetails && clientDetails.info && clientDetails.info.account && clientDetails.info.account.length) {
      clientDetails.info.account.forEach((item) => {
        if (item.UTRACCOUNTTYPE === 'CS') {
          cashFunds.push(item.partnerAccountMappingId);
        } else {
          kwspFunds.push(item.partnerAccountMappingId);
        }
      });
    }

    const PersonalDetails = {
      ...pick(clientDetails.info, [
        'fullName',
        'id',
        'gender',
        'nationality',
        'interests',
        'purposeofinvestment',
        'sourceoffunds',
        'maritalStatus',
        'race',
        'title',
        'motherMaidenName',
        'incomeTaxNo',
      ]),
      ...pick(occupation[0], ['occupationType', 'natureofbusiness']),
      ...pick(identification[0], ['identificationType', 'identificationNumber', 'expiryDate', 'expiryDateVisa']),
      companyName: (occupation.length && occupation[0].companyName) || '',
      yearlyIncome:
        occupation.length && occupation[0].yearlyIncome && occupation[0].yearlyIncome.length > 3
          ? ''
          : (occupation.length && occupation[0].yearlyIncome) || '', // if the the value is not found in the data dictionary, sending the empty values so that the value of the select field will null.
      dateOfBirth: clientDetails.info.birthDate,
      email: this.props.newEmail ? this.props.newEmail : account[0].AccEmail,
      AccMobileNo: account[0].AccMobileNo,
      identificationType: identification.length ? identification[0].identificationType : null,
      identificationNumber: identification.length ? identification[0].identificationNumber : null,
      accountStatus:
        this.suspendedAccountsFilter(account).length > 0
          ? this.suspendedAccountsFilter(account)[0].AccountStatus
          : this.singleAccountStatus(account),
      userNumber: account[0].partnerAccountMappingId,
      permanentAddressLine1,
      permanentAddressLine2,
      permanentAddressLine3,
      permanentPostalCode,
      permanentState,
      permanentCountry,
      companyAddressLine1,
      companyAddressLine2,
      companyAddressLine3,
      companyPostalCode,
      companyCountry,
      companyState,
      correspondenceAddressLine1,
      correspondenceAddressLine2,
      correspondenceAddressLine3,
      correspondencePostalCode,
      correspondenceState,
      correspondenceCountry,
      doesTaxResidentsAvailable: !!(clientDetails.info.taxResidents && clientDetails.info.taxResidents.length),
      taxResidents: clientDetails.info.taxResidents,
      isTaxResidentOfMalaysia: clientDetails.info.isTaxResidentOfMalaysia,
      bankAcctName:
        (clientDetails.info.bank && clientDetails.info.bank.length && clientDetails.info.bank[0].bankAcctName) ||
        clientDetails.info.fullName,
      bankAcctNumber: this.getDefaultBankDetails(clientDetails.info.bank, 'bankAcctNumber'),
      bankName: this.getDefaultBankDetails(clientDetails.info.bank, 'bankName'),
      UTRNumber: clientDetails.info.account[0].partnerAccountMappingId,
      cashUTRNumber: cashFunds && cashFunds.length ? cashFunds.join(', ') : null,
      kwspUTRNumber: kwspFunds && kwspFunds.length ? kwspFunds.join(', ') : null,
      jointAccountOtpSelection: clientDetails.info.jointAccountOtpSelection,
      jointAccountHolderArray: formatJointAccountHolderArray(clientDetails.info),
      mainHolder: clientDetails.info.jointAccountOtpSelection === 'M',
      mainSecondaryHolder: clientDetails.info.jointAccountOtpSelection === 'O',
      isEditable: clientDetails.info.isEditable || false,
      numTaxResidentInfo: null,
      isTaxResidentOfOtherCountry: !!(
        this.getTaxResidentsFields(1) ||
        this.getTaxResidentsFields(2) ||
        this.getTaxResidentsFields(3)
      ),
      PlaceandCountryBirth: clientDetails.info.PlaceandCountryBirth || '',
      taxResidentCountry1: clientDetails.info.taxResidents.length ? this.getTaxResidentsCountryJurisdiction(1) : '',
      taxResidentCountry2: clientDetails.info.taxResidents.length ? this.getTaxResidentsCountryJurisdiction(2) : '',
      taxResidentCountry3: clientDetails.info.taxResidents.length ? this.getTaxResidentsCountryJurisdiction(3) : '',
      isTaxResidentTaxIdentificationNumberAvailable1: clientDetails.info.taxResidents.length
        ? this.checkIdentificationNumberAvailable(1)
        : null,
      isTaxResidentTaxIdentificationNumberAvailable2: clientDetails.info.taxResidents.length
        ? this.checkIdentificationNumberAvailable(2)
        : null,
      isTaxResidentTaxIdentificationNumberAvailable3: clientDetails.info.taxResidents.length
        ? this.checkIdentificationNumberAvailable(3)
        : null,
      taxResidentTaxIdentificationNumber1: clientDetails.info.taxResidents.length ? this.checkIncomeTaxInfoAvailable(1) : '',
      taxResidentTaxIdentificationNumber2: clientDetails.info.taxResidents.length ? this.checkIncomeTaxInfoAvailable(2) : '',
      taxResidentTaxIdentificationNumber3: clientDetails.info.taxResidents.length ? this.checkIncomeTaxInfoAvailable(3) : '',
      taxResidentTaxIdentificationNumberUnAvailableReason1: clientDetails.info.taxResidents.length
        ? this.checkReasonTINNotAvailable(1)
        : '',
      taxResidentTaxIdentificationNumberUnAvailableReason2: clientDetails.info.taxResidents.length
        ? this.checkReasonTINNotAvailable(2)
        : '',
      taxResidentTaxIdentificationNumberUnAvailableReason3: clientDetails.info.taxResidents.length
        ? this.checkReasonTINNotAvailable(3)
        : '',
      taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1: clientDetails.info.taxResidents.length
        ? this.getReasonTINNotAvailableExplanation(1)
        : '',
      taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2: clientDetails.info.taxResidents.length
        ? this.getReasonTINNotAvailableExplanation(2)
        : '',
      taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3: clientDetails.info.taxResidents.length
        ? this.getReasonTINNotAvailableExplanation(3)
        : '',
      ...this.getEpfDetails(clientDetails.info.account),
      monthlySavings: clientDetails.info.monthlySavings ? `RM${clientDetails.info.monthlySavings}` : null,
      // eslint-disable-next-line eqeqeq
      noOfDependants:
        clientDetails.info.noOfDependants && clientDetails.info.noOfDependants == 11
          ? '> 10'
          : clientDetails.info.noOfDependants || null,
      educationLevel: clientDetails.info.educationLevel || null,
      investmentExperience: clientDetails.info.investmentExperience || '',
      existingCommitments: clientDetails.info.existingCommitments || '',
      gender: ['M', 'F'].includes(clientDetails.info.gender) ? clientDetails.info.gender : '',
    };
    PersonalDetails.interests = PersonalDetails.interests ? PersonalDetails.interests.toUpperCase() : '';
    PersonalDetails.occupationType = PersonalDetails.occupationType ? PersonalDetails.occupationType.toUpperCase() : '';
    PersonalDetails.purposeofinvestment = PersonalDetails.purposeofinvestment
      ? PersonalDetails.purposeofinvestment.toUpperCase()
      : '';
    PersonalDetails.natureofbusiness = PersonalDetails.natureofbusiness ? PersonalDetails.natureofbusiness.toUpperCase() : '';
    PersonalDetails.dateOfBirth = moment(PersonalDetails.dateOfBirth, 'YYYY-MM-DD').format('DD/MM/YYYY');
    PersonalDetails.expiryDate = moment(PersonalDetails.expiryDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
    PersonalDetails.expiryDateVisa = moment(PersonalDetails.expiryDateVisa, 'YYYY-MM-DD').format('DD/MM/YYYY');
    if (clientDetails && clientDetails.info) {
      const { gender } = clientDetails.info;
      if (gender && gender.toUpperCase().length > 2) {
        PersonalDetails.gender = gender.toUpperCase()[0];
      }
    }
    return (
      <React.Fragment>
        <LoadingOverlay show={processing || isProcessingUpdateClientProfile} />
        <Headline
          lov={lov}
          clientDetails={clientDetails}
          id={this.props.match.params.id}
          // locationUrl={this.props.location.pathname}
          resendConfirmationEmailToClient={this.resendEmail}
          messageResentConfirmationEmailStatus={this.props.messageResentConfirmationEmailStatus}
          clearStateOfConfirmationEmailResent={this.props.clearStateOfConfirmationEmailResent}
          isProfilePage
          retakeQuestions={this.props.getRiskQuestionsAnswers}
          getRiskProfiles={this.props.getRiskProfiles}
        />
        {/* <center>
          {!this.state.editEmail ? (
            <EditButton onClick={this.editField} />
          ) : (
            <table border="0">
              <tr>
                <td>
                  <SaveButton onClick={this.save} isSaving={this.state.isSaving} />
                </td>
                <td style={{ width: 5 }}></td>
                <td>
                  <CancelButton onClick={this.cancel} />
                </td>
              </tr>
            </table>
          )}
        </center> */}
        <ColumnGridCenter>
          <FullWidthGrid item>
            <EditProfileFields
              handleEdit={this.editField}
              handleCancel={this.cancel}
              isSaving={this.state.isSaving}
              initialValues={PersonalDetails}
              lov={lov}
              edit={!this.state.edit}
              cancelled={this.state.cancelled}
              onSubmit={this.submit}
              bank={bank}
              reUploadDocumentCall={this.reUploadDocumentCall}
              docs={customerdocuments}
              uploadType={PersonalDetails.identificationType}
              onChangeField={this.onChangeField}
              editEmail={this.state.editEmail}
              originalEmail={this.state.originalEmail}
              idObj={idObj}
              isRiskExpired={isRiskExpired}
              clientDetails={clientDetails.info}
              checkPermanentCorrespondenceAddr={this.checkPermanentCorrespondenceAddr}
              entireClientInfo={clientDetails}
              cashAccountCreatedSuccess={this.state.cashAccountCreatedSuccess}
              customerAddFunds={this.callAddFunds}
              history={this.props.history}
              resendConfirmationEmailToClient={this.resendEmail}
              isBankAcctName={_isEmpty(
                clientDetails.info.bank && clientDetails.info.bank.length && clientDetails.info.bank[0].bankAcctName,
              )}
              kwspAccountCreatedSuccess={this.state.kwspAccountCreatedSuccess}
              documentsUrl={this.props.documentsUrl}
            />
          </FullWidthGrid>
          <Divider />
        </ColumnGridCenter>
        <Dialog
          open={this.state.isOpenDialogEmailSentForChangingEmail}
          closeHandler={this.handleCloseDialogEmailSentOnlinePayment}
          maxWidth="sm"
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid container justify="center" align="center" alignItems="center" style={{ marginBottom: 20 }}>
                {this.state.updateClientError || this.state.createAccountError ? (
                  <React.Fragment>
                    <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                      <img src={CloseIcon} width="50px" />
                    </Grid>
                    <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                      {this.state.updateClientError && (
                        <React.Fragment>
                          <Text size="14px" weight="bold">
                            Client Profile update is unsuccessful.
                          </Text>
                          <Grid item xs={12}>
                            <Text size="14px" color="#1d1d26" fontStyle="italic">
                              {this.state.message ? Parser(this.state.message) : 'Something went wrong!'}
                            </Text>
                          </Grid>
                        </React.Fragment>
                      )}
                      {this.state.createAccountError && (
                        <React.Fragment>
                          <Text size="14px" weight="bold" style={{ marginBottom: '15px' }}>
                            {this.state.message && Parser(this.state.message)}
                          </Text>
                          <Text size="14px" color="#1d1d26" fontStyle="italic">
                            <AccountExists />
                          </Text>
                        </React.Fragment>
                      )}
                    </Grid>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                      <img src={ClientUpdateSuccessIcon} />
                    </Grid>
                    <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                      <Text size="14px" weight="bold">
                        {this.state.docMessage || 'Client Profile is successfully updated.'}
                      </Text>
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Grid>
          }
        />
        <OtpBox
          handleClose={this.handleCloseOtpModal}
          openModal={this.state.showModalClientProfileChangeOtp}
          url={
            this.props.initClientProfileChangeOtpSuccessData
              ? this.props.initClientProfileChangeOtpSuccessData.otpiFrameUrl
              : null
          }
          error={this.props.initClientProfileChangeOtpError}
        />
      </React.Fragment>
    );
  }
}

Profile.propTypes = {
  saveDocumentsUrl: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  lov: makeSelectLOV(),
  form: makeSelectFormDetails(),
  clientDetails: makeSelectClientDetails(),
  processing: makeSelectProcessing(),
  isOTPCalled: makeSelectisOTPCalled(),
  error: makeSelectError(),
  docReUploadSuccess: makeSelectDocReUploadSuccess(),
  docReUploadFailure: makeSelectDocReUploadFailure(),
  invalidCustomerID: makeSelectInvalidCustomerID(),
  showModalClientProfileChangeOtp: makeSelectShowModalClientProfileChangeOtp(),
  initClientProfileChangeOtpSuccessData: makeSelectInitClientProfileChangeOtpSuccessData(), // opt frame url
  initClientProfileChangeOtpError: makeSelectInitClientProfileChangeOtpError(),
  updateClientEmailError: makeSelectUpdateClientEmailError(),
  updateClientEmailSuccess: makeSelectUpdateClientEmailSuccess(),
  newEmail: makeSelectNewEmail(),
  isProcessingUpdateClientProfile: makeSelectIsProcessingUpdateClientProfile(),
  messageResentConfirmationEmailStatus: makeSelectMessageResentConfirmationEmailStatus(),
  cashAccountCreatedSuccess: makeSelectCreateCashAccountSuccess(),
  cashAccountCreationFailed: makeSelectCreateCashAccountError(),
  createCashAccountClientError: makeSelectCreateCashAccountClientError(),
  image: makeSelectImage(),
  kwspAccountCreatedSuccess: makeSelectCreateKwspAccountSuccess(),
  accountCreationFlow: makeSelectSetAccountCreationFlow(),
  documentsUrl: makeSelectDocumentsUrl(),
});

function mapDispatchToProps(dispatch) {
  return {
    reUploadDocument: (payload) => dispatch(reUploadDocument(payload)),
    clearReUploadDocsLogs: () => dispatch(clearReUploadDocsLogs()),
    getCustomerDetails: (payload) => dispatch(getCustomerDetails(payload)),
    updateCustomerDetails: (payload) => dispatch(updateCustomerDetails(payload)),
    reset: () => dispatch(reset()),
    resetError: () => dispatch(resetError()),
    getLOV: () => dispatch(getLOV()),
    resetClientProfileData: () => dispatch(resetClientProfileData()),
    initClientProfileChangeOtp: (payload) => dispatch(initClientProfileChangeOtp(payload)),
    clearClientProfileUpdateOtpData: () => dispatch(clearClientProfileUpdateOtpData()),
    updateClientEmail: (payload) => dispatch(updateClientEmail(payload)),
    createAccount: (payload) => dispatch(createAccount(payload)),
    resendConfirmationEmail: (payload) => dispatch(resendConfirmationEmail(payload)),
    clearStateOfConfirmationEmailResent: () => dispatch(clearStateOfConfirmationEmailResent()),
    clearNewEmail: () => dispatch(clearNewEmail()),
    getRiskQuestionsAnswers: () => dispatch(getRiskQuestionsAnswers()),
    getRiskProfiles: () => dispatch(getRiskProfiles()),
    createKwspAccount: (payload) => dispatch(createKwspAccount(payload)),
    getDocumentsUrl: () => dispatch(getDocumentsUrl()),
    saveDocumentsUrl: (payload) => dispatch(saveDocumentsUrl(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// const withSaga = injectSaga({ key: 'clientDetails', saga });

export default compose(withConnect)(Profile);
