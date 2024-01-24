/* eslint-disable indent */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
import React from 'react';
import styled from 'styled-components';
import MenuItem from 'material-ui/Menu/MenuItem';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import { FormControlLabel } from 'material-ui/Form';
import Radio from 'material-ui/Radio';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { Field, reduxForm, change } from 'redux-form';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _isNull from 'lodash/isNull';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import _uniqWith from 'lodash/uniqWith';
import _has from 'lodash/has';
import _orderBy from 'lodash/orderBy';
import moment from 'moment';

// ********************Style Imports*********************
import Color from 'utils/StylesHelper/color';

// *************************Asset Imports***********************************
import downIcon from 'containers/Faq/images/down.svg';
// import NoDocs from '../images/logs.svg';
// import Upload from '../images/shape.svg';

// *************************Selector Imports*********************************
// import { makeSelectImage, makeSelectProcessing } from 'containers/ClientDetails/selectors';

// *************************Action Imports*********************************
import {
  validatePostalCode,
  clearStateFromPostalCode,
  removePhoto,
  processing,
  clearUploadedUnsavedImages,
  saveKWSPandCashDetails,
  uploadPhoto,
  uploadDocPhoto,
} from 'containers/OnBoarding/actions';

// *********************** Container Imports *********************************
import PhotoContainer from 'containers/OnBoarding/PersonalDetails/PhotoContainer';
import { clearCashKwspAccountCreatedStateValue, saveDocumentsUrl } from 'containers/ClientDetails/actions';

// *********************** Components Imports *********************************
import PhotoGuideDialog from 'components/PhotoBox/PhotoGuideDialog';
import HighCategoryMessageModal from 'components/AmlaWarning/HighCategoryMessageModal';
import EmailVerification from 'components/Dialog/EmailVerification';
import LoadingOverlay from 'components/LoadingOverlay';
import Dialog from 'components/Dialog';
import CheckboxField from 'components/FormUtility/FormFields/Checkbox';
import { RowGridLeft } from 'components/GridContainer';
import ReactSelectFieldCustom from 'components/FormUtility/FormFields/ReactSelectFieldCustom';
import CustomReactSelectField from 'components/FormUtility/FormFields/CustomReactSelectField';
import Text from 'components/Text';
import InputField from 'components/FormUtility/FormFields/InputField';
import ErrorModal from 'components/Kwsp/Modal/ErrorModal';
import DateField from 'components/FormUtility/FormFields/DateField';
import Button from 'components/Button';
import KwspAccountTypeModal from 'components/Kwsp/Modal/kwspClientDetailsModal';
import {
  required,
  maxLength,
  zeroOnly,
  validatePassportDate,
  invalidDateFormatCheck,
} from 'components/FormUtility/FormValidators';
import { numberWithCommas } from 'utils/StringUtils';

import DoesHoldPoliticalParty from '../DoesHoldPoliticalParty';
import AccountCreationSuccessComponent from './AccountCreationSuccessComponent';
import { DocumentSection } from './DocumentSection';
import { EmptyDocumentSection } from './EmptyDocumentSection';
import EmptyField from './EmptyField';
import EditButton from './EditButton';
import NewAccountButton from './NewAccount';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';
import Modal from '../TransactionModal/Modal';
import Disclaimer from '../TransactionModal/Disclaimer';
import CWADisclaimer from '../TransactionModal/CWADisclaimer';

// ********************* Non-component functions and constants imports *********************
import checkDocUploadCompletion from './Utility/CheckDocUploadCompletion';
import checkNonEditableFieldsValues from './Utility/CheckNonEditableFieldsValues';
import CheckAgeEligibility from './Utility/CheckAgeEligibility';
import onBoardingConstants from '../../OnBoarding/Utils/constants';
import getDocumentsArray from './Utility/GetDocumentsArray';
import deleteTaxResidentInfo from './Utility/DeleteTaxResidentInfo';
import createAddressArray from './Utility/CreateAddressArray';
import createOccupationObj from './Utility/CreateOccuaptionObj';
import createEmailVerifiedObj from './Utility/CreateEmailVerifiedObj';
import createIdObj from './Utility/CreateIdObj';
import checkIfMandatoryFieldsMissing from './Utility/CheckEmptyFields';
// import { isValidEmail } from 'utils/Verifier';
import JointAccountContainer from './JointAccountField';
// import JointCashAccountModal from './JointCashAccountModal';
import {
  checkExistingAccountTypes,
  checkEmisKWSPAccount,
  filterSuspendedAccountArray,
  checkIfAllAccountsAreSuspended,
} from '../utils/maxTypesOfAccount';
import { getAccountNumbers, getJointAccountFieldName, formatJointAccountHolderArray } from '../utils/getAccountHolderType';

const titleForTermsAndConditionModal = 'Please read and accept the Terms & Conditions below to proceed.';

export const HiddenField = styled(Field)`
  visibility: hidden;
`;

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const StyleButtonForModal = styled(Button)`
  margin-top: 16px;
`;

const CustomIcon = () => <img src={downIcon} alt="test" />;

const BolderText = styled.span`
  font-weight: bolder !important;
`;

const DisplayNoneField = styled(Field)`
  display: none;
`;

const StyledField = styled(Field)`
  margin-top: 12px !important;
  /* > div {
    &::before,
    &::after {
      background-color: #cacaca;
    }
  } */
  background-color: ${(props) => (props.bgColor ? props.bgColor : ' #f5f5f5;')};

  label {
    opacity: 0.4;
    font-size: 11px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.6;
    letter-spacing: normal;
    text-align: left;
    color: #000;
    padding-left: 8px;
    padding-top: 4px;
  }
  input,
  div {
    font-size: 14px;
    font-weight: normal;
    padding-left: 5px;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #1d1d26;
  }
  ,
  input[type='number'] {
    -moz-appearance: textfield;
  }
  ,
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Form = styled.form`
  margin-top: 32px;
`;

const StyledPanel = styled(ExpansionPanel)`
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.17);
`;

export const GridHere = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

const StyledDetails = styled(ExpansionPanelDetails)`
  flex-direction: column;
  border-top: 1px solid #ccc;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`;

const widthOfInputFieldContainer = '1920px';

const ContentItem = styled.div`
  padding: 10px 0 10px 0;
  width: ${widthOfInputFieldContainer};
`;

const TextErrorBold = styled.p`
  font-size: 13px;
  color: ${Color.C_RED};
  text-align: left;
  font-weight: 900;
`;

const maxLengthEmail = 60;
const maxLengthMobile = 20;
const maxLengthEmployeeName = 40;
const maxLengthBankAccountName = 100;
const maxLengthBankAccNumber = 18;
const maxLengthAddressLine = 40;
const codeValueOfTaxResidentReasonToInputExplanation = 'Reason B';
const maxLengthTaxResidentReasonExplanation = 250;
const maxLengthTaxResidentTaxIdentificationNumber = 20;
const accountTypes = ['CS', 'KW'];
const maxMonthlySavingAmount = 1000000000;

class EditProfileFields extends React.Component {
  constructor(props) {
    super(props);

    this.removingTaxResidentArray = [];
    this.radioButton1 = false;
    this.radioButton2 = false;
    this.radioButton3 = false;

    this.state = {
      isNatureOfBusinessDisable: false,
      expandedDocumentSection: null,
      expandedPersonalDetailSection: null,
      expandedAddressSection: null,
      expandedTaxResidentInfoSection: null,
      expandedEmploymentDetailSection: null,
      expandedBankSection: null,
      expandedAdditionalDetailsSection: null,
      activeTableRow: null,
      isModalOpen: false,
      acknowledge: false,
      cwaAcknowledge: false,
      numTaxResidentInfo: props.initialValues ? props.idObj.taxResidentsId.length : 0,
      isAddOrRemoveTaxResidentInfoSectionAction: false,
      checkCheckBoxIsTaxResidentOfOtherCountry: !!(props.idObj && props.idObj.taxResidentsId.length),
      isPermanentCorrespondenceAddress: props.checkPermanentCorrespondenceAddr('PERMANENT', 'CORRESPONDENCE'),
      isTaxResidentOfMalaysia: props.initialValues ? props.initialValues.isTaxResidentOfMalaysia : false,
      isTaxResidentDataUpdated: false,
      occupationCodeChanged: false,
      showReasonInput1: false,
      showReasonInput2: false,
      showReasonInput3: false,
      showReasonExplanation1: false,
      showReasonExplanation2: false,
      showReasonExplanation3: false,
      removingTaxResidentInfo: false,
      isCreatingCashAccount: false,
      isCreatingKwspAccount: false,
      isCustomerPoliticallyRelated: null,
      uploadingPhoto: false,
      isOpenDialogGuideUploadPhoto: false,
      amlaWarningModal: false,
      isOpenDialogConfirmEmailResend: false,
      imagePayload: [],
      uploadedDocsUnsaved: true,
      isNotELigible: false,
      showAgeEligibilityPopUp: false,
      showKwspAccountTypeModal: false,
      kwspAccountType: null,
      isPermmanentAndCompanyAddSame: false,
      doShowPermanentCompanyAddCheckbox: false,
      mainHolder: props.initialValues.mainHolder,
      mainSecondaryHolder: props.initialValues.mainSecondaryHolder,
      jointAccountHolderArray: [...props.initialValues.jointAccountHolderArray],
      accountNoErrMsg: '',
    };
    this.handleExpandCollapseSection = this.handleExpandCollapseSection.bind(this);
    this.onChangeOccupation = this.onChangeOccupation.bind(this);
    this.handleActiveTableRow = this.handleActiveTableRow.bind(this);
    this.submit = this.submit.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addTaxResidentInfo = this.addTaxResidentInfo.bind(this);
    this.validatePostalCode = this.validatePostalCode.bind(this);
    this.removeTaxResidentInfo = this.removeTaxResidentInfo.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.acknowledge = this.acknowledge.bind(this);
    this.cwaAcknowledge = this.cwaAcknowledge.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getOnlyEditedFields = this.getOnlyEditedFields.bind(this);
    this.handleChangeIsTaxResidentOfMalaysia = this.handleChangeIsTaxResidentOfMalaysia.bind(this);
    this.handleChangeIsTaxResidentOfOtherCountry = this.handleChangeIsTaxResidentOfOtherCountry.bind(this);
    this.getUpdatedFields = this.getUpdatedFields.bind(this);
    this.handleHasIncomeTaxNumber = this.handleHasIncomeTaxNumber.bind(this);
    this.getFormErrors = this.getFormErrors.bind(this);
    this.assignInitialValues = this.assignInitialValues.bind(this);
    this.toggleAddressCheckbox = this.toggleAddressCheckbox.bind(this);
    this.verifyReason = this.verifyReason.bind(this);
    this.formatTaxResidentInformation = this.formatTaxResidentInformation.bind(this);
    this.checkTaxResidentNoAndReason = this.checkTaxResidentNoAndReason.bind(this);
    this.clearTaxResidenNumAndReason = this.clearTaxResidenNumAndReason.bind(this);
    this.checkTaxResidentIncomeTaxAndReason = this.checkTaxResidentIncomeTaxAndReason.bind(this);
    this.formFormattedArray = this.formFormattedArray.bind(this);
    this.checkIfMalaysianAndNonMalaysianUnSelected = this.checkIfMalaysianAndNonMalaysianUnSelected.bind(this);
    this.checkTaxResidentsIfAvailable = this.checkTaxResidentsIfAvailable.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.clearImages = this.clearImages.bind(this);
    this.viewClientProfile = this.viewClientProfile.bind(this);
    this.continueAccountInvestment = this.continueAccountInvestment.bind(this);
    this.showDialogGuideUploadPhoto = this.showDialogGuideUploadPhoto.bind(this);
    this.backToCurrentPageClick = this.backToCurrentPageClick.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.openDialogConfirmEmailResend = this.openDialogConfirmEmailResend.bind(this);
    this.submitResendConfirmationEmail = this.submitResendConfirmationEmail.bind(this);
    this.uploadDocPhoto = this.uploadDocPhoto.bind(this);
    this.checkSourceOfFunds = this.checkSourceOfFunds.bind(this);
    this.checkOccupationType = this.checkOccupationType.bind(this);
    this.checkPuposeOfInvestment = this.checkPuposeOfInvestment.bind(this);
    this.checkNatureOfBusiness = this.checkNatureOfBusiness.bind(this);
    this.clearUploadUnsavedImages = this.clearUploadUnsavedImages.bind(this);
    this.checkIfTaxResidentSelected = this.checkIfTaxResidentSelected.bind(this);
    this.toggleCompanyAddress = this.toggleCompanyAddress.bind(this);
    this.handleDocUpload = this.handleDocUpload.bind(this);
    this.getAccountType = this.getAccountType.bind(this);
    this.showAgeEligibilityPopUp = this.showAgeEligibilityPopUp.bind(this);
    this.getKwspAccountDetails = this.getKwspAccountDetails.bind(this);
    this.kwspAccountTypeSelect = this.kwspAccountTypeSelect.bind(this);
    this.isKwspDisabled = this.isKwspDisabled.bind(this);
    this.processKwspDetails = this.processKwspDetails.bind(this);
    this.handleAmlaErrorPopUp = this.handleAmlaErrorPopUp.bind(this);
    this.cashAccountCreationRequirements = this.cashAccountCreationRequirements.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.checkJointCashAccountExistence = this.checkJointCashAccountExistence.bind(this);
    this.toggleJointAccountPopUp = this.toggleJointAccountPopUp.bind(this);
    this.handleJointAccountHolderName = this.handleJointAccountHolderName.bind(this);
    this.convertToHumanReadable = this.convertToHumanReadable.bind(this);
    this.assignJointAccountInitialValues = this.assignJointAccountInitialValues.bind(this);
    this.isAllCashAccountsSuspendedWithZeroUnits = this.isAllCashAccountsSuspendedWithZeroUnits.bind(this);
    this.checkForAccNumValidation = this.checkForAccNumValidation.bind(this);
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

  convertToHumanReadable(value) {
    if (value.toLowerCase() === 'psport') {
      return 'Passport';
    }
    return value;
  }

  showToast(message) {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  checkSourceOfFunds(sofValue) {
    if (this.props) {
      const SourceOfFunds = this.props.lov.Dictionary[8].datadictionary;
      return _isEmpty(_find(SourceOfFunds, { codevalue: sofValue })) ? 'Required' : undefined;
    }
  }

  checkOccupationType(occupationValue) {
    if (this.props) {
      const Occupation = this.props.lov.Dictionary[1].datadictionary;
      return _isEmpty(_find(Occupation, { codevalue: occupationValue })) ? 'Required' : undefined;
    }
  }

  checkPuposeOfInvestment(poiValue) {
    if (this.props) {
      const Purpose = this.props.lov.Dictionary[15].datadictionary;
      const PurposeArray = Purpose.map((purposeItem) => ({
        description: purposeItem.description,
        codevalue: purposeItem.codevalue.toUpperCase(),
      }));
      return _isEmpty(_find(PurposeArray, { codevalue: poiValue.toUpperCase() })) ? 'Required' : undefined;
    }
  }

  checkNatureOfBusiness(nobValue) {
    if (this.props) {
      const Business = this.props.lov.Dictionary[2].datadictionary;
      return _isEmpty(_find(Business, { codevalue: nobValue })) ? 'Required' : undefined;
    }
  }

  clearUploadUnsavedImages() {
    const { uploadedDocsUnsaved, isCreatingCashAccount } = this.state;
    if (uploadedDocsUnsaved && !isCreatingCashAccount) {
      this.props.clearUploadedUnsavedImages();
    }
  }

  componentDidMount() {
    this.assignInitialValues();
    setTimeout(() => {
      this.props.setProcessing(false);
    }, 3000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stateFromPostalCode !== nextProps.stateFromPostalCode && nextProps.stateFromPostalCode) {
      if (_has(nextProps.stateFromPostalCode, 'permanent')) {
        if (_has(nextProps.stateFromPostalCode.permanent, 'error')) {
          this.showToast(`${nextProps.stateFromPostalCode.permanent.errorMsg}`);
          // redundant way but redux-form is not behaving as expected all the time. because redux is superb !
          this.props.formState.values.permanentPostalCode = null;
          this.props.formState.values.permanentState = null;
          this.props.blur('permanentPostalCode');
          this.props.change('permanentPostalCode', null);
          this.props.change('permanentState', null);
        }
        if (!nextProps.stateFromPostalCode || !nextProps.stateFromPostalCode.permanent) {
          this.props.change('permanentState', null);
        } else {
          this.props.change('permanentState', nextProps.stateFromPostalCode.permanent.state);
        }
      }

      if (_has(nextProps.stateFromPostalCode, 'company')) {
        if (_has(nextProps.stateFromPostalCode.company, 'error')) {
          this.showToast(`${nextProps.stateFromPostalCode.company.errorMsg}`);
          // redundant way but redux-form is not behaving as expected all the time
          this.props.formState.values.companyPostalCode = null;
          this.props.formState.values.companyState = null;
          this.props.blur('permanentPostalCode');
          this.props.change('companyPostalCode', null);
          this.props.change('companyState', null);
        }
        if (!nextProps.stateFromPostalCode || !nextProps.stateFromPostalCode.company) {
          this.props.change('companyState', null);
        } else {
          this.props.change('companyState', nextProps.stateFromPostalCode.company.state);
          // if (nextProps.stateFromPostalCode.company.state !== 'SGP') {
          // this.props.formState.values.companyState = nextProps.stateFromPostalCode.company.state;
        }
        // } else {
        //   this.props.formState.values.companyState = null;
        //   this.showToast('No available state on specific postal code!');
        // }
      }

      if (_has(nextProps.stateFromPostalCode, 'correspondence')) {
        // this.props.formState.values.correspondenceState = nextProps.stateFromPostalCode.correspondence.state;
        if (_has(nextProps.stateFromPostalCode.correspondence, 'error')) {
          this.showToast(`${nextProps.stateFromPostalCode.correspondence.errorMsg}`);
          // redundant way but redux-form is not behaving as expected all the time
          this.props.formState.values.correspondencePostalCode = null;
          this.props.formState.values.correspondenceState = null;
          this.props.blur('correspondencePostalCode');
          this.props.change('correspondencePostalCode', null);
          this.props.change('correspondenceState', null);
        }
        if (!nextProps.stateFromPostalCode || !nextProps.stateFromPostalCode.correspondence) {
          this.props.change('correspondenceState', null);
        } else {
          this.props.change('correspondenceState', nextProps.stateFromPostalCode.correspondence.state);
          // if (nextProps.stateFromPostalCode.company.state !== 'SGP') {
          // this.props.formState.values.companyState = nextProps.stateFromPostalCode.company.state;
        }
      }
    }

    if (nextProps.formState && nextProps.formState.values && this.props.formState && this.props.formState.values) {
      // for clearing unsaved uploaded images
      this.clearUploadUnsavedImages();

      //  for clearing reason explanation under tax resident information

      if (
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason1 &&
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason1 !==
          nextProps.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason1
      ) {
        this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1', null);
      }
      if (
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason2 &&
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason2 !==
          nextProps.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason2
      ) {
        this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2', null);
      }
      if (
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason3 &&
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason3 !==
          nextProps.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason3
      ) {
        this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3', null);
      }

      this.setState({
        hideRemoveTaxResidentInfoSection: true,
      });

      // for handling the Create Cash Account OTP box

      // for handling tax resident of malaysia or not on checkbox for display correct number of tax resident input section
      if (!this.state.isAddOrRemoveTaxResidentInfoSectionAction) {
        if (
          this.props.formState.values.isTaxResidentOfOtherCountry === true ||
          (this.props.formState.values.isTaxResidentOfMalaysia &&
            this.props.formState.values.isTaxResidentOfOtherCountry === true)
        ) {
          if (this.props.formState.values.nationality === 'MY' && nextProps.formState.values.taxResidentCountry1 === 'MY') {
            /* if (this.state.numTaxResidentInfo == 1) {
              this.setState({
                numTaxResidentInfo: 2
              });
              this.props.change('numTaxResidentInfo', 2);
            } */
            this.setState({
              hideRemoveTaxResidentInfoSection: true,
            });
          }
        }
      } else {
        this.setState({
          isAddOrRemoveTaxResidentInfoSectionAction: false,
        });
      }
    }
  }

  formatTaxResidentInformation(values) {
    const taxResidents = [];
    // const taxResident1 = values.taxResidents.filter((tr) => tr.no === 1);
    // const taxResident2 = values.taxResidents.filter((tr) => tr.no === 2);
    // const taxResident3 = values.taxResidents.filter((tr) => tr.no === 3);
    taxResidents[0] = values.taxResidents.filter((tr) => tr.no === 1);
    taxResidents[1] = values.taxResidents.filter((tr) => tr.no === 2);
    taxResidents[2] = values.taxResidents.filter((tr) => tr.no === 3);

    // const TaxResidentNoIDReasons = Dictionary[29].datadictionary;

    for (let taxResidentIndex = 1; taxResidentIndex <= 3; taxResidentIndex += 1) {
      const arrayIndex = taxResidentIndex - 1;
      if (taxResidents[taxResidentIndex - 1].length) {
        // set the tax resident country , doesn't matter if it is empty
        this.props.change(`taxResidentCountry${taxResidentIndex}`, taxResidents[arrayIndex][0].CountryJurisdiction);

        // set the remaining fields , doen't matter if they're empty
        this.props.change(`taxResidentTaxIdentificationNumber${taxResidentIndex}`, taxResidents[arrayIndex][0].IncomeTax);
        this.props.change(
          `taxResidentTaxIdentificationNumberUnAvailableReason${taxResidentIndex}`,
          taxResidents[arrayIndex][0].ReasonTINNotAvailable,
        );
        this.props.change(
          `taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${taxResidentIndex}`,
          taxResidents[arrayIndex][0].RemarksReason,
        );

        // check the fields that are set above if they have values and set the radio buttons accordingly
        if (taxResidents[arrayIndex][0].IncomeTax.length) {
          this.props.change(`isTaxResidentTaxIdentificationNumberAvailable${taxResidentIndex}`, true);
        } else if (taxResidents[arrayIndex][0].ReasonTINNotAvailable.length || taxResidents[arrayIndex][0].RemarksReason.length) {
          this.props.change(`isTaxResidentTaxIdentificationNumberAvailable${taxResidentIndex}`, false);
        } else {
          this.props.change(`isTaxResidentTaxIdentificationNumberAvailable${taxResidentIndex}`, null);
        }
      }
    }
    // if (taxResident2.length) {
    //   if (!_isEmpty(taxResident2[0].CountryJurisdiction)) {
    //   }

    //   this.props.change('taxResidentCountry2', taxResident2[0].CountryJurisdiction);

    //   this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason2', taxResident2[0].ReasonTINNotAvailable);
    //   this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2', taxResident2[0].RemarksReason);
    //   this.props.change('taxResidentTaxIdentificationNumber2', taxResident2[0].IncomeTax);

    //   if (taxResident2[0].IncomeTax ? taxResident2[0].IncomeTax.length : null) {
    //     this.props.change('isTaxResidentTaxIdentificationNumberAvailable2', true);
    //   } else if (!taxResident2[0].ReasonTINNotAvailable || !taxResident2[0].ReasonTINNotAvailable.length) {
    //     this.props.change('isTaxResidentTaxIdentificationNumberAvailable2', null);
    //   } else {
    //     this.props.change('isTaxResidentTaxIdentificationNumberAvailable2', false);
    //   }

    //   if (taxResident2[0].ReasonTINNotAvailable) {
    //     const reason = TaxResidentNoIDReasons.filter((reason) => reason.codevalue == taxResident2[0].ReasonTINNotAvailable);
    //   }
    // }

    // if (taxResident3.length) {
    //   if (!_isEmpty(taxResident3[0].CountryJurisdiction)) {
    //   }
    //   this.props.change('taxResidentCountry3', taxResident3[0].CountryJurisdiction);

    //   this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason3', taxResident3[0].ReasonTINNotAvailable);
    //   this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3', taxResident3[0].RemarksReason);
    //   this.props.change('taxResidentTaxIdentificationNumber3', taxResident3[0].IncomeTax);

    //   if (taxResident3[0].IncomeTax ? taxResident3[0].IncomeTax.length : null) {
    //     this.props.change('isTaxResidentTaxIdentificationNumberAvailable3', true);
    //   } else if (!taxResident3[0].ReasonTINNotAvailable || !taxResident3[0].ReasonTINNotAvailable.length) {
    //     this.props.change('isTaxResidentTaxIdentificationNumberAvailable3', null);
    //   } else {
    //     this.props.change('isTaxResidentTaxIdentificationNumberAvailable3', false);
    //   }

    //   if (taxResident3[0].ReasonTINNotAvailable) {
    //     const reason = TaxResidentNoIDReasons.filter((reason) => reason.codevalue == taxResident3[0].ReasonTINNotAvailable);
    //   }
    // }
  }

  checkTaxResidentsIfAvailable(props) {
    const { initialValues } = props;

    if (initialValues.taxResidents.length) {
      initialValues.taxResidents.forEach((item) => {
        if (item.no === 1) {
          if (item.ReasonTINNotAvailable.length || item.IncomeTax.length) this.radioButton1 = true;
          else this.radioButton1 = false;
        }
        if (item.no === 2) {
          if (item.ReasonTINNotAvailable.length || item.IncomeTax.length) this.radioButton2 = true;
          else this.radioButton2 = false;
        }
        if (item.no === 3) {
          if (item.ReasonTINNotAvailable.length || item.IncomeTax.length) this.radioButton3 = true;
          else this.radioButton3 = false;
        }
      });
    }
  }

  getTruthyTaxResidentsValues(taxResidents) {
    const res = [];
    let filteredTaxArray = [];
    filteredTaxArray = taxResidents.filter((taxResidentItem) => taxResidentItem.no <= 3);
    filteredTaxArray.forEach((item) => {
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

  filterTaxResidents(taxResidentIndex) {
    const values = { ...this.props.initialValues };
    const taxResidents = this.getTruthyTaxResidentsValues(values.taxResidents);
    return taxResidents.filter((taxResidentItem) => taxResidentItem.no === taxResidentIndex);
  }

  assignJointAccountInitialValues() {
    const jointAccountHolderArray = formatJointAccountHolderArray(this.props.clientDetails);
    this.setState({
      jointAccountHolderArray,
    });
  }

  assignInitialValues() {
    const {
      lov: { Dictionary },
    } = this.props;
    if (this.props.formState && this.props.formState.values && this.props.formState.values.numTaxResidentInfo) {
      this.setState(
        {
          numTaxResidentInfo: this.props.formState.values.numTaxResidentInfo,
        },
        () => {
          this.clearUploadUnsavedImages();
        },
      );
    }
    if (getAccountNumbers(this.props.clientDetails.account).length) {
      this.assignJointAccountInitialValues();
    }
    if (!_isEmpty(this.props.initialValues)) {
      const { occupationType } = this.props.initialValues;
      let doShowPermanentCompanyAddCheckbox = false;
      if (
        parseInt(occupationType) === 23 ||
        parseInt(occupationType) === 91 ||
        parseInt(occupationType) === 90 ||
        parseInt(occupationType) === 62
      ) {
        doShowPermanentCompanyAddCheckbox = true;
      }
      const values = { ...this.props.initialValues };
      this.checkTaxResidentsIfAvailable(this.props);
      this.setState({
        isNatureOfBusinessDisable: this.checkOccupationTypeValue(this.props.initialValues, Dictionary[1].datadictionary),
        doShowPermanentCompanyAddCheckbox,
      });
      if (this.filterTaxResidents(1).length || this.filterTaxResidents(2).length || this.filterTaxResidents(3).length) {
        // showTaxResidentInfo = true;

        this.props.change('isTaxResidentOfOtherCountry', true);
        this.formatTaxResidentInformation(values);
      } else {
        this.props.change('isTaxResidentOfOtherCountry', false);
      }
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  showAlert(msg) {
    confirmAlert({
      message: msg,
      buttons: [
        {
          label: 'Ok',
          onClick: () => {
            // socket.disconnect();
          },
        },
      ],
      willUnmount: () => {},
      childrenElement: () => <p></p>,
    });
  }

  handleReasonChange() {
    this.setState({
      isTaxResidentDataUpdated: true,
    });
  }

  getFormErrors(errors) {
    const errorsClone = errors || {};
    if (this.props.formState && this.props.formState.values) {
      if (!this.props.formState.values.isTaxResidentOfOtherCountry && errorsClone) {
        delete errorsClone.PlaceandCountryBirth;
        for (let i = 0; i < 3; i += 1) {
          delete errorsClone[`taxResidentCountry${i + 1}`];
          delete errorsClone[`taxResidentTaxIdentificationNumber${i + 1}`];
          delete errorsClone[`taxResidentTaxIdentificationNumberUnAvailableReason${i + 1}`];
          delete errorsClone[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${i + 1}`];
        }
      }
    }

    return !_isEmpty(errorsClone);
  }

  onChange(e, value, prevValue, name) {
    const { values } = this.props.formState;
    let isTaxResidentDataUpdated = false;

    if (name === 'permanentCountry') {
      // the StateFromPostalCode redux store need to be cleared. if not, when change postal code in permanent or company will affect each other.
      this.props.clearStateFromPostalCode();
      if (value !== 'MY') {
        if (this.props.formState && this.props.formState.values && this.props.formState.values.permanentAddressLine1) {
          if (this.props.formState.values.permanentAddressLine1.length > maxLengthAddressLine) {
            this.props.change(
              'permanentAddressLine1',
              this.props.formState.values.permanentAddressLine1.substring(0, maxLengthAddressLine),
            );
          }
        }

        if (this.props.formState && this.props.formState.values && this.props.formState.values.permanentAddressLine2) {
          if (this.props.formState.values.permanentAddressLine2.length > maxLengthAddressLine) {
            this.props.change(
              'permanentAddressLine2',
              this.props.formState.values.permanentAddressLine2.substring(0, maxLengthAddressLine),
            );
          }
        }
      }

      if (value !== prevValue) {
        this.props.change('permanentPostalCode', null);
        this.props.change('permanentState', null);
        // this.props.change('permanentAddressLine1', null);
        // this.props.change('permanentAddressLine2', null);
        // this.props.setCorrespondencePermanentEquality(false);
        this.setState({
          isPermanentCorrespondenceAddress: false,
          // heightPermanentStateField: '135px',
        });
      }
    }

    if (name === 'correspondenceCountry') {
      if (value !== 'MY') {
        if (this.props.formState && this.props.formState.values && this.props.formState.values.correspondenceAddressLine1) {
          if (this.props.formState.values.correspondenceAddressLine1.length > maxLengthAddressLine) {
            this.props.change(
              'correspondenceAddressLine1',
              this.props.formState.values.correspondenceAddressLine1.substring(0, maxLengthAddressLine),
            );
          }
        }
        if (this.props.formState && this.props.formState.values && this.props.formState.values.correspondenceAddressLine2) {
          if (this.props.formState.values.correspondenceAddressLine2.length > maxLengthAddressLine) {
            this.props.change(
              'correspondenceAddressLine2',
              this.props.formState.values.correspondenceAddressLine2.substring(0, maxLengthAddressLine),
            );
          }
        }
      }

      if (value !== prevValue) {
        this.props.change('correspondencePostalCode', null);
        this.props.change('correspondenceState', null);
        // this.props.change('correspondenceAddressLine1', null);
        // this.props.change('correspondenceAddressLine2', null);
      }
    }

    if (name === 'companyCountry') {
      // the StateFromPostalCode redux store need to be cleared. if not, when change postal code in permanent or company will affect each other.
      this.props.clearStateFromPostalCode();
      if (value !== 'MY') {
        if (this.props.formState && this.props.formState.values && this.props.formState.values.companyAddressLine1) {
          if (this.props.formState.values.companyAddressLine1.length > maxLengthAddressLine) {
            this.props.change(
              'companyAddressLine1',
              this.props.formState.values.companyAddressLine1.substring(0, maxLengthAddressLine),
            );
          }
        }
        if (this.props.formState && this.props.formState.values && this.props.formState.values.companyAddressLine2) {
          if (this.props.formState.values.companyAddressLine2.length > maxLengthAddressLine) {
            this.props.change(
              'companyAddressLine2',
              this.props.formState.values.companyAddressLine2.substring(0, maxLengthAddressLine),
            );
          }
        }
      }
      if (value !== prevValue) {
        this.props.change('companyPostalCode', null);
        this.props.change('companyState', null);
      }
    }

    if (name === 'PlaceandCountryBirth') {
      isTaxResidentDataUpdated = true;
    }

    if (name === 'taxResidentCountry1') {
      isTaxResidentDataUpdated = true;
      if (value === values.taxResidentCountry2 || value === values.taxResidentCountry3) {
        this.notify('Please do not select the same country of jurisdiction.');
        e.preventDefault();
        return false;
      }

      this.props.change('taxResidentCountry1', value);

      /* if (value === 'MY' && values.nationality !== 'MY') {
        this.showAlert ('Malaysian nationality only need to declare tax details for countries other than Malaysia.');
      } */
    }

    if (name === 'taxResidentCountry2') {
      isTaxResidentDataUpdated = true;

      if (value === values.taxResidentCountry1 || value === values.taxResidentCountry3) {
        this.notify('Please do not select the same country of jurisdiction.');
        e.preventDefault();
        return false;
      }
    }

    if (name === 'taxResidentCountry3') {
      isTaxResidentDataUpdated = true;

      if (value === values.taxResidentCountry1 || value === values.taxResidentCountry2) {
        this.notify('Please do not select the same country of jurisdiction.');
        e.preventDefault();
        return false;
      }
    }

    this.setState({
      isTaxResidentDataUpdated,
    });

    if (name === 'nationality') {
      this.props.change('isTaxResidentOfMalaysia', false);
      this.props.change('isTaxResidentOfOtherCountry', false);
      this.clearTaxResidentInfo();
    }
  }

  handleHasIncomeTaxNumber(
    isTaxResidentTaxIdentificationNumberAvailableIndex,
    isTaxResidentTaxIdentificationNumberAvailable,
    index,
  ) {
    let showReasonInput1 = false;
    let showReasonInput2 = false;
    let showReasonInput3 = false;

    switch (index) {
      case 1: {
        showReasonInput1 = isTaxResidentTaxIdentificationNumberAvailable;
        break;
      }
      case 2: {
        showReasonInput2 = isTaxResidentTaxIdentificationNumberAvailable;
        break;
      }
      case 3: {
        showReasonInput3 = isTaxResidentTaxIdentificationNumberAvailable;
        break;
      }
      default: {
        // do nothing
        break;
      }
    }
    this.setState(
      {
        showReasonInput1,
        showReasonInput2,
        showReasonInput3,
      },
      () => {
        this.props.change(isTaxResidentTaxIdentificationNumberAvailableIndex, isTaxResidentTaxIdentificationNumberAvailable);
        !isTaxResidentTaxIdentificationNumberAvailable
          ? this.props.formState.values[`taxResidentTaxIdentificationNumberUnAvailableReason${index}`]
            ? this.props.change(
                `taxResidentTaxIdentificationNumberUnAvailableReason${index}`,
                this.props.formState.values[`taxResidentTaxIdentificationNumberUnAvailableReason${index}`],
              )
            : this.props.change(`taxResidentTaxIdentificationNumberUnAvailableReason${index}`, '')
          : null;

        // this.props.change(`taxResidentTaxIdentificationNumber${index}`, '');
        // if(showReasonInput1){

        // }
      },
    );
  }

  clearTaxResidentRadioButtonData(taxResidentIndex) {
    switch (taxResidentIndex) {
      case 1: {
        if (this.radioButton1) {
          return true;
        }
        return false;
      }
      case 2: {
        if (this.radioButton2) {
          return true;
        }
        return false;
      }
      case 3: {
        if (this.radioButton3) {
          return true;
        }
        return false;
      }

      default: {
        this.radioButton1 = true;
        this.radioButton2 = true;
        this.radioButton3 = true;

        return false;
      }
    }
  }

  handleChangeIsTaxResidentTaxIdentificationNumberAvailable(
    taxResidentTaxIdentificationNumber,
    isTaxResidentTaxIdentificationNumberAvailable,
  ) {
    this.setState(
      {
        isTaxResidentDataUpdated: true,
      },
      () => {
        switch (taxResidentTaxIdentificationNumber) {
          case 1:
            this.state.isTaxResidentDataUpdated
              ? this.handleHasIncomeTaxNumber(
                  'isTaxResidentTaxIdentificationNumberAvailable1',
                  isTaxResidentTaxIdentificationNumberAvailable,
                  1,
                )
              : null;
            this.radioButton1 = true;
            break;
          case 2:
            this.state.isTaxResidentDataUpdated
              ? this.handleHasIncomeTaxNumber(
                  'isTaxResidentTaxIdentificationNumberAvailable2',
                  isTaxResidentTaxIdentificationNumberAvailable,
                  2,
                )
              : null;
            this.radioButton2 = true;
            break;
          case 3:
            // hasTaxResidentNumber3 = isTaxResidentTaxIdentificationNumberAvailable;
            this.state.isTaxResidentDataUpdated
              ? this.handleHasIncomeTaxNumber(
                  'isTaxResidentTaxIdentificationNumberAvailable3',
                  isTaxResidentTaxIdentificationNumberAvailable,
                  3,
                )
              : null;
            this.radioButton3 = true;
            break;
          default:
            // do nothing
            break;
        }
      },
    );
  }

  clearTaxResidentInfo() {
    this.props.change('PlaceandCountryBirth', '');
    this.props.change('taxResidentCountry1', '');
    this.props.change('taxResidentCountry2', '');
    this.props.change('taxResidentCountry3', '');
    this.props.change('isTaxResidentTaxIdentificationNumberAvailable1', null);
    this.props.change('isTaxResidentTaxIdentificationNumberAvailable2', null);
    this.props.change('isTaxResidentTaxIdentificationNumberAvailable3', null);
    this.props.change('taxResidentTaxIdentificationNumber1', '');
    this.props.change('taxResidentTaxIdentificationNumber2', '');
    this.props.change('taxResidentTaxIdentificationNumber3', '');
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason1', '');
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason2', '');
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason3', '');
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1', '');
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2', '');
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3', '');

    this.checkTaxResidentNoAndReason(4);
  }

  validatePostalCode(e, type) {
    const { value } = e.target;
    if (
      (type === 'permanent' && ['MY'].indexOf(this.props.formState.values.permanentCountry) > -1) ||
      (type === 'company' && ['MY'].indexOf(this.props.formState.values.companyCountry) > -1) ||
      (type === 'correspondence' && ['MY'].indexOf(this.props.formState.values.correspondenceCountry) > -1)
    ) {
      this.props.validatePostalCode({ value, type });
    } else {
      this.props.clearStateFromPostalCode();
    }

    if (type === 'permanent') {
      this.setState({
        heightPermanentStateField: '140px',
      });
    }
  }

  getOnlyEditedFields() {
    const { initial, values } = this.props.formState;
    const editedFields = {};
    for (const key in initial) {
      if (values[key] !== initial[key]) {
        editedFields[key] = values[key];
      }
    }
    return editedFields;
  }

  handleActiveTableRow(id) {
    this.setState({ activeTableRow: id });
  }

  handleChangeIsTaxResidentOfMalaysia() {
    this.props.change('isTaxResidentOfMalaysia', !this.props.formState.values.isTaxResidentOfMalaysia);
    // this.setState({ isTaxResidentOfMalaysia: !this.state.isTaxResidentOfMalaysia });
  }

  handleChangeIsTaxResidentOfOtherCountry(event) {
    if (!this.props.formState.values.numTaxResidentInfo) {
      this.props.change('numTaxResidentInfo', 1);
      this.setState({
        numTaxResidentInfo: 1,
      });
    }

    if (this.props.formState.values.nationality && this.props.formState.values.nationality !== 'MY') {
      this.setState({ checkCheckBoxIsTaxResidentOfOtherCountry: !this.state.checkCheckBoxIsTaxResidentOfOtherCountry }, () => {
        if (!this.state.checkCheckBoxIsTaxResidentOfOtherCountry) {
          this.clearTaxResidentInfo();
        }

        this.props.change('isTaxResidentOfOtherCountry', this.state.checkCheckBoxIsTaxResidentOfOtherCountry);
        if (!this.state.numTaxResidentInfo) {
          this.props.change('numTaxResidentInfo', this.state.numTaxResidentInfo + 1);
          this.setState({
            numTaxResidentInfo: this.state.numTaxResidentInfo + 1,
          });
        }
      });
    } else {
      this.props.cancelled ? this.clearTaxResidentInfo() : null;
      // this.setState({
      //   numTaxResidentInfo: !this.state.checkCheckBoxIsTaxResidentOfOtherCountry ? 0 : 1,
      // });
      this.props.change('numTaxResidentInfo', this.props.formState.values.isTaxResidentOfOtherCountry ? 0 : 1);
      this.props.change('isTaxResidentOfOtherCountry', !this.props.formState.values.isTaxResidentOfOtherCountry);
      this.setState({ checkCheckBoxIsTaxResidentOfOtherCountry: !this.state.checkCheckBoxIsTaxResidentOfOtherCountry }, () => {
        if (!this.state.checkCheckBoxIsTaxResidentOfOtherCountry) {
          this.clearTaxResidentInfo();
        }
      });

      if (this.props.formState.values.nationality === 'MY' && event.target.checked === true) {
        this.showAlert('Malaysian nationality only need to declare tax details for countries other than Malaysia.');
      }
    }
  }

  handleExpandCollapseSection(section) {
    switch (section) {
      case 'DOC_DETAIL':
        this.setState({
          expandedDocumentSection: !this.expandedDocumentSection,
        });
        break;
      case 'PERSONAL_DETAIL':
        this.setState({
          expandedPersonalDetailSection: !this.state.expandedPersonalDetailSection,
        });
        break;
      case 'ADDR':
        this.setState({
          expandedAddressSection: !this.state.expandedAddressSection,
        });
        break;
      case 'EMPLOYMENT_DETAIL':
        this.setState({
          expandedEmploymentDetailSection: !this.state.expandedEmploymentDetailSection,
        });
        break;
      case 'BANK_DETAIL':
        this.setState({
          expandedBankSection: !this.state.expandedBankSection,
        });
        break;
      case 'TAX_RESIDENT_INFO':
        this.setState({
          expandedTaxResidentInfoSection: !this.state.expandedTaxResidentInfoSection,
        });
        break;
      case 'ADDITIONAL_DETAILS':
        this.setState({
          expandedAdditionalDetailsSection: !this.state.expandedAdditionalDetailsSection,
        });
        break;
      default:
        // do nothing
        break;
    }
  }

  addTaxResidentInfo() {
    this.setState({
      isAddOrRemoveTaxResidentInfoSectionAction: true,
      removingTaxResidentInfo: false,
    });
    if (this.state.numTaxResidentInfo < 3) {
      this.setState(
        {
          numTaxResidentInfo: this.state.numTaxResidentInfo + 1,
        },
        () => {
          this.props.change('numTaxResidentInfo', this.state.numTaxResidentInfo);
        },
      );
    }
  }

  removeTaxResidentInfo() {
    this.setState({
      isAddOrRemoveTaxResidentInfoSectionAction: true,
      removingTaxResidentInfo: true,
    });
    // if (this.state.numTaxResidentInfo < 3 && this.state.hideRemoveTaxResidentInfoSection && this.props.formState.values.taxResidentCountry1 === 'MY') {
    //  this.showToast ('You must enter at least 1 tax resident information of other country');
    //  return;
    // }
    if (this.state.numTaxResidentInfo > 1) {
      this.setState(
        {
          numTaxResidentInfo: this.state.numTaxResidentInfo - 1,
        },
        () => {
          this.props.change('numTaxResidentInfo', this.state.numTaxResidentInfo);
          this.props.change('taxResidentCountry3', '');
          this.props.change('isTaxResidentTaxIdentificationNumberAvailable3', '');
          this.props.change('taxResidentTaxIdentificationNumber3', '');
          this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason3', '');
          this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3', '');
          this.clearTaxResidenNumAndReason(3);

          if (this.state.numTaxResidentInfo < 2) {
            this.props.change('taxResidentCountry2', '');
            this.props.change('isTaxResidentTaxIdentificationNumberAvailable2', '');
            this.props.change('taxResidentTaxIdentificationNumber2', '');
            this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason2', '');
            this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2', '');
            this.clearTaxResidenNumAndReason(2);
          }
        },
      );
    }
  }

  onChangeOccupation(e, value) {
    // 91 is housewife
    // 90 is retiree
    // -33 is unemployed. changed to 62 on 20191101 because CPAM was requesting changes on LOV
    let isNatureOfBusinessDisable;
    const isPrevNOBDisabled = this.state.isNatureOfBusinessDisable;
    const occupationCodeChanged = true;
    let doShowPermanentCompanyAddCheckbox;

    const { formState } = this.props;

    if (parseInt(value) === 23 || parseInt(value) === 91 || parseInt(value) === 90 || parseInt(value) === 62) {
      isNatureOfBusinessDisable = true;
      doShowPermanentCompanyAddCheckbox = true;
    } else {
      isNatureOfBusinessDisable = false;
      doShowPermanentCompanyAddCheckbox = false;
    }

    this.setState(
      {
        isNatureOfBusinessDisable,
        occupationCodeChanged,
        doShowPermanentCompanyAddCheckbox,
      },
      () => {
        if (isNatureOfBusinessDisable) {
          if (this.props.formState && this.props.initialValues) {
            this.props.change('natureofbusiness', '');
          }
          this.props.change('companyAddressLine1', formState.values.permanentAddressLine1);
          this.props.change('companyAddressLine2', formState.values.permanentAddressLine2);
          this.props.change('companyAddressLine3', formState.values.permanentAddressLine3);
          this.props.change('companyPostalCode', formState.values.permanentPostalCode);
          this.props.change('companyState', formState.values.permanentState);
          this.props.change('companyCountry', formState.values.permanentCountry);
          this.props.change('companyName', 'Not Applicable');
        } else if (isPrevNOBDisabled) {
          this.props.change('companyName', '');
        }
      },
    );
  }

  toggleCompanyAddress() {
    const { formState } = this.props;
    this.setState({ isPermmanentAndCompanyAddSame: !this.state.isPermmanentAndCompanyAddSame }, () => {
      if (this.state.isPermmanentAndCompanyAddSame) {
        this.props.change('companyAddressLine1', formState.values.permanentAddressLine1);
        this.props.change('companyAddressLine2', formState.values.permanentAddressLine2);
        this.props.change('companyAddressLine3', formState.values.permanentAddressLine3);
        this.props.change('companyPostalCode', formState.values.permanentPostalCode);
        this.props.change('companyState', formState.values.permanentState);
        this.props.change('companyCountry', formState.values.permanentCountry);
      }
    });
  }

  checkTaxResidentIncomeTaxAndReason(taxResidentsArray) {
    const { values } = this.props.formState;

    let incomeTaxArray = [];
    let incomeTaxObj = {};

    if (values.isTaxResidentTaxIdentificationNumberAvailable1) {
      incomeTaxObj = {
        ...taxResidentsArray.filter((taxItem) => taxItem.no === 1)[0],
        ReasonTINNotAvailable: '',
        RemarksReason: '',
      };
      incomeTaxArray = [...incomeTaxArray, incomeTaxObj];
    } else {
      incomeTaxObj = {
        ...taxResidentsArray.filter((taxItem) => taxItem.no === 1)[0],
        IncomeTax: '',
      };
      incomeTaxArray = [...incomeTaxArray, incomeTaxObj];
    }

    if (values.isTaxResidentTaxIdentificationNumberAvailable2) {
      incomeTaxObj = {
        ...taxResidentsArray.filter((taxItem) => taxItem.no === 2)[0],
        ReasonTINNotAvailable: '',
        RemarksReason: '',
      };
      incomeTaxArray = [...incomeTaxArray, incomeTaxObj];
    } else {
      incomeTaxObj = {
        ...taxResidentsArray.filter((taxItem) => taxItem.no === 2)[0],
        IncomeTax: '',
      };
      incomeTaxArray = [...incomeTaxArray, incomeTaxObj];
    }

    if (values.isTaxResidentTaxIdentificationNumberAvailable3) {
      incomeTaxObj = {
        ...taxResidentsArray.filter((taxItem) => taxItem.no === 3)[0],
        ReasonTINNotAvailable: '',
        RemarksReason: '',
      };
      incomeTaxArray = [...incomeTaxArray, incomeTaxObj];
    } else {
      incomeTaxObj = {
        ...taxResidentsArray.filter((taxItem) => taxItem.no === 3)[0],
        IncomeTax: '',
      };
      incomeTaxArray = [...incomeTaxArray, incomeTaxObj];
    }

    return _uniqWith(incomeTaxArray, _isEqual);
  }

  formFormattedArray(editedFields, initial) {
    const formattedTaxResidents = [];
    const maxTaxResidentLength = 3;

    for (let i = 0; i < maxTaxResidentLength; i += 1) {
      formattedTaxResidents.push({
        no: i + 1,
        CountryJurisdiction: Object.prototype.hasOwnProperty.call(editedFields, `taxResidentCountry${i + 1}`)
          ? editedFields[`taxResidentCountry${i + 1}`]
          : initial[`taxResidentCountry${i + 1}`] || '',
        IncomeTax: Object.prototype.hasOwnProperty.call(editedFields, `taxResidentTaxIdentificationNumber${i + 1}`)
          ? editedFields[`taxResidentTaxIdentificationNumber${i + 1}`]
          : initial[`taxResidentTaxIdentificationNumber${i + 1}`] || '',
        ReasonTINNotAvailable: Object.prototype.hasOwnProperty.call(
          editedFields,
          `taxResidentTaxIdentificationNumberUnAvailableReason${i + 1}`,
        )
          ? editedFields[`taxResidentTaxIdentificationNumberUnAvailableReason${i + 1}`]
          : initial[`taxResidentTaxIdentificationNumberUnAvailableReason${i + 1}`] || '',
        RemarksReason: Object.prototype.hasOwnProperty.call(
          editedFields,
          `taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${i + 1}`,
        )
          ? editedFields[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${i + 1}`]
          : initial[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${i + 1}`] || '',
      });
    }

    // delete editedFields[`taxResidentCountry${i + 1}`];
    // delete editedFields[`isTaxResidentTaxIdentificationNumberAvailable${i + 1}`];
    // delete editedFields[`taxResidentTaxIdentificationNumber${i + 1}`];
    // delete editedFields[`taxResidentTaxIdentificationNumberUnAvailableReason${i + 1}`];
    // delete editedFields[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${i + 1}`];

    return formattedTaxResidents;
  }

  getUpdatedFields(values) {
    const { permanentAddressId, correspondenceAddressId, companyAddressId, occupationId, bankId } = this.props.idObj;
    const { initial } = this.props.formState;
    const {
      lov: { Dictionary },
      isBankAcctName,
    } = this.props;
    let editedFields = {};

    for (const key in initial) {
      if (values[key] !== initial[key]) {
        editedFields[key] = values[key];
      }
    }
    if (
      this.state.jointAccountHolderArray.length &&
      !_isEqual(initial['jointAccountHolderArray'], this.state.jointAccountHolderArray)
    ) {
      editedFields['jointAccountHolderArray'] = this.state.jointAccountHolderArray;
    }

    if (!Object.keys(editedFields).length) return editedFields;

    if (this.state.numTaxResidentInfo && Object.keys(editedFields)) {
      let formattedTaxResidents = [];
      formattedTaxResidents = [...this.formFormattedArray(editedFields, initial)];

      editedFields = {
        ...editedFields,
        taxResidents: formattedTaxResidents,
      };
    }

    if (editedFields.taxResidents && editedFields.taxResidents.length) {
      const deleteObj = {};

      if (this.state.removingTaxResidentInfo) {
        const lastIndex = _findIndex(initial.taxResidents, ['no', this.state.numTaxResidentInfo + 1]);
        deleteObj.no = initial.taxResidents[lastIndex] ? initial.taxResidents[lastIndex].no : this.state.numTaxResidentInfo + 1;
        deleteObj.IncomeTax = '';
        deleteObj.ReasonTINNotAvailable = '';
        deleteObj.RemarksReason = '';
        deleteObj.CountryJurisdiction = '';
        this.removingTaxResidentArray.push(deleteObj);
      }
      editedFields = {
        ...editedFields,
        taxResidents: [...this.checkTaxResidentIncomeTaxAndReason(editedFields.taxResidents)],
      };

      editedFields.taxResidents.forEach((item) => {
        if (!this.state.checkCheckBoxIsTaxResidentOfOtherCountry) {
          item.IncomeTax = '';
          item.ReasonTINNotAvailable = '';
          item.RemarksReason = '';
          item.CountryJurisdiction = '';
        }
      });

      if ((editedFields.taxResidents && editedFields.taxResidents.length) || this.removingTaxResidentArray.length) {
        editedFields = {
          ...editedFields,
          taxResidents: [...editedFields.taxResidents],
          PlaceandCountryBirth:
            this.state.checkCheckBoxIsTaxResidentOfOtherCountry && this.props && this.props.formState
              ? this.props.formState.values.PlaceandCountryBirth
              : null,
        };
      }
    }
    if (_isEqual(initial.taxResidents, editedFields.taxResidents)) {
      delete editedFields.taxResidents;
    }

    if (_isEqual(initial.isTaxResidentOfOtherCountry, editedFields.isTaxResidentOfOtherCountry)) {
      delete editedFields.isTaxResidentOfOtherCountry;
    }

    if (_isEqual(initial.PlaceandCountryBirth, editedFields.PlaceandCountryBirth)) {
      delete editedFields.PlaceandCountryBirth;
    }

    // STRUCTURE FOR BANK FIELDS
    const bankObj = {};
    if (Object.keys(editedFields).includes('bankName')) {
      const bankNameIndex = _findIndex(Dictionary[19].datadictionary, ['description', editedFields.bankName]);
      bankObj.bankName = editedFields.bankName;
      bankObj.bankCode = Dictionary[19].datadictionary[bankNameIndex].codevalue;
      delete editedFields.bankName;
    }
    if (Object.keys(editedFields).includes('bankAcctNumber')) {
      bankObj.bankAcctNumber = editedFields.bankAcctNumber;
      delete editedFields.bankAcctNumber;
    }
    if (Object.keys(editedFields).includes('bankAcctName')) {
      bankObj.bankAcctName = editedFields.bankAcctName;
      delete editedFields.bankAcctName;
    } else if (isBankAcctName) {
      bankObj.bankAcctName = this.props.initialValues.fullName;
    }

    if (Object.keys(bankObj).length) {
      bankObj.id = bankId;
      editedFields.bank = [bankObj];
    }
    // STRUCTURE FOR OCCUPATION FIELDS
    const occupationObj = {};
    if (Object.keys(editedFields).includes('companyName')) {
      occupationObj.companyName = editedFields.companyName;
      delete editedFields.companyName;
    }
    if (Object.keys(editedFields).includes('yearlyIncome')) {
      occupationObj.yearlyIncome = editedFields.yearlyIncome;
      delete editedFields.yearlyIncome;
    }
    if (Object.keys(editedFields).includes('occupation')) {
      occupationObj.occupation = editedFields.occupation;
      delete editedFields.occupation;
    }
    if (Object.keys(editedFields).includes('occupationType')) {
      occupationObj.occupationType = editedFields.occupationType;
      delete editedFields.occupationType;
    }
    if (Object.keys(editedFields).includes('natureofbusiness')) {
      occupationObj.natureofbusiness = editedFields.natureofbusiness;
      delete editedFields.natureofbusiness;
    }
    if (Object.keys(occupationObj).length) {
      occupationObj.id = occupationId;
      editedFields.occupation = [occupationObj];
    }

    editedFields.address = [];

    // STRUCTURE FOR  PERMANENT ADDRESS FIELDS
    const permanentAddressObj = {};
    if (Object.keys(editedFields).includes('permanentAddressLine1')) {
      permanentAddressObj.addressline1 = editedFields.permanentAddressLine1;
      delete editedFields.permanentAddressLine1;
    }
    if (Object.keys(editedFields).includes('permanentAddressLine2')) {
      permanentAddressObj.addressline2 = editedFields.permanentAddressLine2;
      delete editedFields.permanentAddressLine2;
    }
    if (Object.keys(editedFields).includes('permanentAddressLine3')) {
      permanentAddressObj.addressline3 = editedFields.permanentAddressLine3;
      delete editedFields.permanentAddressLine3;
    }
    if (Object.keys(editedFields).includes('permanentPostalCode')) {
      permanentAddressObj.postalCode = editedFields.permanentPostalCode;
      delete editedFields.permanentPostalCode;
    }
    if (Object.keys(editedFields).includes('permanentState')) {
      permanentAddressObj.state = editedFields.permanentState;
      delete editedFields.permanentState;
    }
    if (Object.keys(editedFields).includes('permanentCountry')) {
      permanentAddressObj.country = editedFields.permanentCountry;
      delete editedFields.permanentCountry;
    }
    if (Object.keys(permanentAddressObj).length) {
      permanentAddressObj.id = permanentAddressId;
      permanentAddressObj.addresstype = 'PERMANENT';
      editedFields.address = [...editedFields.address, permanentAddressObj];
    }

    // STRUCTURE FOR  CORRESPONDANCE ADDRESS FIELDS
    const correspondenceAddressObj = {};
    if (Object.keys(editedFields).includes('correspondenceAddressLine1')) {
      correspondenceAddressObj.addressline1 = editedFields.correspondenceAddressLine1;
      delete editedFields.correspondenceAddressLine1;
    }
    if (Object.keys(editedFields).includes('correspondenceAddressLine2')) {
      correspondenceAddressObj.addressline2 = editedFields.correspondenceAddressLine2;
      delete editedFields.correspondenceAddressLine2;
    }
    if (Object.keys(editedFields).includes('correspondenceAddressLine3')) {
      correspondenceAddressObj.addressline3 = editedFields.correspondenceAddressLine3;
      delete editedFields.correspondenceAddressLine3;
    }
    if (Object.keys(editedFields).includes('correspondencePostalCode')) {
      correspondenceAddressObj.postalCode = editedFields.correspondencePostalCode;
      delete editedFields.correspondencePostalCode;
    }
    if (Object.keys(editedFields).includes('correspondenceState')) {
      correspondenceAddressObj.state = editedFields.correspondenceState;
      delete editedFields.correspondenceState;
    }
    if (Object.keys(editedFields).includes('correspondenceCountry')) {
      correspondenceAddressObj.country = editedFields.correspondenceCountry;
      delete editedFields.correspondenceCountry;
    }
    if (Object.keys(correspondenceAddressObj).length) {
      correspondenceAddressObj.id = correspondenceAddressId;
      correspondenceAddressObj.addresstype = 'CORRESPONDENCE';
      editedFields.address = [...editedFields.address, correspondenceAddressObj];
    }

    // STRUCTURE FOR  COMPANY ADDRESS FIELDS
    const companyAddressObj = {};
    if (Object.keys(editedFields).includes('companyAddressLine1')) {
      companyAddressObj.addressline1 = editedFields.companyAddressLine1;
      delete editedFields.companyAddressLine1;
    }
    if (Object.keys(editedFields).includes('companyAddressLine2')) {
      companyAddressObj.addressline2 = editedFields.companyAddressLine2;
      delete editedFields.companyAddressLine2;
    }
    if (Object.keys(editedFields).includes('companyAddressLine3')) {
      companyAddressObj.addressline3 = editedFields.companyAddressLine3;
      delete editedFields.companyAddressLine3;
    }
    if (Object.keys(editedFields).includes('companyPostalCode')) {
      companyAddressObj.postalCode = editedFields.companyPostalCode;
      delete editedFields.companyPostalCode;
    }
    if (Object.keys(editedFields).includes('companyState')) {
      companyAddressObj.state = editedFields.companyState;
      delete editedFields.companyState;
    }
    if (Object.keys(editedFields).includes('companyCountry')) {
      companyAddressObj.country = editedFields.companyCountry;
      delete editedFields.companyCountry;
    }
    if (Object.keys(companyAddressObj).length) {
      companyAddressObj.id = companyAddressId;
      companyAddressObj.addresstype = 'COMPANY';
      editedFields.address = [...editedFields.address, companyAddressObj];
    }

    if (_isEmpty(permanentAddressObj) && _isEmpty(correspondenceAddressObj) && _isEmpty(companyAddressObj)) {
      delete editedFields.address;
    }

    // Structure Joint Account OTP consent object
    if (editedFields.jointAccountHolderArray && editedFields.jointAccountHolderArray.length) {
      editedFields['formattedJointAccountOtpSelection'] = {};
      editedFields.jointAccountHolderArray.forEach((accountItem) => {
        let holderType = '';
        if (!(_isNull(accountItem.mainHolder) || _isNull(accountItem.mainSecondaryHolder))) {
          if (accountItem.mainHolder) {
            holderType = 'M';
          } else {
            holderType = 'O';
          }
          editedFields.formattedJointAccountOtpSelection[`${accountItem.accountNumber}`] = holderType;
          editedFields.jointAccountOtpSelection = JSON.stringify(editedFields.formattedJointAccountOtpSelection);
        }
        delete editedFields[`${accountItem.accountNumber}_mainHolder`];
        delete editedFields[`${accountItem.accountNumber}_mainSecondaryHolder`];
        delete editedFields.jointAccountHolderArray;
      });
      delete editedFields.formattedJointAccountOtpSelection;
    }
    this.editedFields = editedFields;
    return editedFields;
  }

  uploadDocPhoto(imagePayload, index) {
    const docImageArray = this.state.imagePayload;
    const imagePayloadObj = {
      ...imagePayload,
      customerId: this.props.clientDetails.id,
    };

    docImageArray[index] = imagePayload;
    this.setState({ isImageChanged: true, imagePayload: docImageArray, uploadedDocsUnsaved: false }, () => {
      // console.log('The image array is',this.state.imagePayload);
      this.props.uploadDocPhoto(imagePayloadObj);
    });
  }

  uploadPhoto(imagePayload) {
    this.setState({ isImageChanged: true, imagePayload, uploadedDocsUnsaved: false }, () => {
      this.props.uploadPhoto(imagePayload);
    });
  }

  clearImages() {
    if (this.props) {
      Object.keys(this.props.image).forEach((imageItem) => {
        this.props.removePhoto({ id: this.props.image[`${imageItem}`].id, type: this.props.image[`${imageItem}`].type });
      });
    }
  }

  getNewAccountPayload(formValues, AccountType) {
    let formattedFormValue = {};
    const { clientDetails } = this.props;
    const kwspObject =
      AccountType === 'KW'
        ? {
            islamicORConventionalFlag: this.state.kwspAccountType,
            epfMembershipNumber: this.props.kwspFormFields.values.epfMembershipNumber,
          }
        : null;
    formattedFormValue = formValues;
    if (formattedFormValue) {
      formattedFormValue = deleteTaxResidentInfo(formattedFormValue);
      formattedFormValue = createAddressArray(formattedFormValue);
      formattedFormValue = createOccupationObj(formattedFormValue);
      formattedFormValue = createEmailVerifiedObj(formattedFormValue, clientDetails);
      formattedFormValue = {
        ...formattedFormValue,
        birthDate: new Date(moment(formattedFormValue.dateOfBirth, 'DD/MM/YYYY')),
        // birthDate: formattedFormValue.dateOfBirth,
      };
      delete formattedFormValue.dateOfBirth;

      formattedFormValue = {
        ...formattedFormValue,
        MobileNumber: formattedFormValue.AccMobileNo,
        AccountType,
        ...kwspObject,
      };
      delete formattedFormValue.AccMobileNo;
    }

    if (this.props.initialValues && this.props.entireClientInfo) {
      formattedFormValue = createIdObj(formattedFormValue, this.props.initialValues, this.props.entireClientInfo);

      formattedFormValue = {
        ...formattedFormValue,
      };
    }

    if (this.props && this.props.image) {
      formattedFormValue = {
        ...formattedFormValue,
        Docs: getDocumentsArray(this.props.image),
      };
    }
    return formattedFormValue;
  }

  cashAccountCreationRequirements(docsUploading, isCreatingCashAccount) {
    if (docsUploading) {
      this.setState({ isModalOpen: false, acknowledge: false, cwaAcknowledge: false, docsUploading: false });

      const payloadArray = this.state.imagePayload.map((imageItem) => {
        const formattedImageObj = {
          ...imageItem.payload,
          docId: this.props.image[`${imageItem.payload.DocType}`].id,
        };

        delete formattedImageObj.base64img;
        delete formattedImageObj.original;

        return formattedImageObj;
      });
      this.props.onSubmit({ payload: payloadArray, imagePayload: this.state.imagePayload }, false, docsUploading);
    } else {
      const { values } = this.props.formState;
      const editedFields = this.getUpdatedFields(values);
      this.setState({ isModalOpen: false, acknowledge: false, cwaAcknowledge: false });
      this.props.onSubmit(editedFields, isCreatingCashAccount, false);
    }
  }

  handleAmlaErrorPopUp() {
    this.setState({
      amlaWarningModal: this.state.isCustomerPoliticallyRelated,
      isModalOpen: false,
      acknowledge: false,
      cwaAcknowledge: false,
    });
  }
  submit(docsUploading, isCreatingCashAccount, isCreatingKwspAccount) {
    if (!isCreatingCashAccount && !isCreatingKwspAccount) {
      this.cashAccountCreationRequirements(docsUploading, isCreatingCashAccount);
    } else if (!this.state.isCustomerPoliticallyRelated) {
      this.setState({ isModalOpen: false, acknowledge: false, cwaAcknowledge: false, isCustomerPoliticallyRelated: null }, () => {
        const { isCreatingCashAccount, isCreatingKwspAccount } = this.state;
        if (isCreatingCashAccount) {
          this.props.onSubmit(this.getNewAccountPayload(this.props.formState.values, 'CS'), isCreatingCashAccount, false);
        } else if (isCreatingKwspAccount) {
          this.props.onSubmit(
            this.getNewAccountPayload({ ...this.props.initialValues, ...this.props.kwspFormFields.values }, 'KW'),
            isCreatingKwspAccount,
            false,
          ); // Need to be removed later once API is ready
        }
      });
    } else {
      this.handleAmlaErrorPopUp();
    }
  }

  handleCloseModal() {
    this.setState({
      isModalOpen: false,
      acknowledge: false,
      cwaAcknowledge: false,
      isCreatingCashAccount: false,
      isCustomerPoliticallyRelated: null,
    });
  }

  checkIfImageUploaded() {
    const { identificationType } = this.props && this.props.formState ? this.props.formState.values : null;

    if (this.props.image) {
      if (
        Object.keys(this.props.image).length === 2 &&
        Object.prototype.hasOwnProperty.call(this.props.image, `${identificationType}_Front`) &&
        Object.prototype.hasOwnProperty.call(this.props.image, `${identificationType}_Back`)
      ) {
        return (
          _isEmpty(this.props.image[`${identificationType}_Front`]) || _isEmpty(this.props.image[`${identificationType}_Back`])
        );
      }
      return true;
    }
    return _isEmpty(this.props.image);
  }

  handleOpenModal(creatingCashAccount) {
    if (this.state.isCreatingCashAccount) {
      if (this.checkIfImageUploaded()) {
        this.notify('Please upload IC front and back document images.');
        // this.props.removePhoto();
        return false;
      }
    }

    this.setState({ isModalOpen: true, isCreatingCashAccount: creatingCashAccount, uploadingPhoto: false });
  }

  handleCancel() {
    const editedFields = this.getOnlyEditedFields();
    for (const key in editedFields) {
      this.props.change(key, this.props.initialValues[key]);
    }
    this.assignInitialValues();
    this.props.handleCancel();
    this.setState({
      occupationCodeChanged: false,
      checkCheckBoxIsTaxResidentOfOtherCountry: !!(this.props.idObj && this.props.idObj.taxResidentsId.length),
      numTaxResidentInfo: this.props.idObj.taxResidentsId.length,
      isCreatingCashAccount: false,
      uploadedDocsUnsaved: true,
      imagePayload: [],
      mainHolder: this.props.formState.initial.mainHolder,
      mainSecondaryHolder: this.props.formState.initial.mainSecondaryHolder,
    });

    this.clearTaxResidenNumAndReason(null);
    this.checkTaxResidentsIfAvailable(this.props);
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

  // checkIfValid = async (vlidItem) => {
  //   await setTimeout(() => {
  //     this.setState((state) => {
  //       showReasonInput1: state.showReasonInput1,
  //     })
  //   }, 100)

  //   return this.state.showReasonInput1;
  // }
  toggleAddressCheckbox() {
    const { formState } = this.props;
    this.setState(
      () => ({
        isPermanentCorrespondenceAddress: !this.state.isPermanentCorrespondenceAddress,
      }),
      () => {
        if (this.state.isPermanentCorrespondenceAddress) {
          this.props.change('correspondenceAddressLine1', formState.values.permanentAddressLine1);
          this.props.change('correspondenceAddressLine2', formState.values.permanentAddressLine2);
          this.props.change('correspondenceAddressLine3', formState.values.permanentAddressLine3);
          this.props.change('correspondencePostalCode', formState.values.permanentPostalCode);
          // this.props.change('correspondenceState', countryState[0] ? countryState[0].description : formState.values.permanentState);
          this.props.change('correspondenceState', formState.values.permanentState);
          this.props.change('correspondenceCountry', formState.values.permanentCountry);
        } else {
          this.props.change('correspondenceAddressLine1', '');
          this.props.change('correspondenceAddressLine2', '');
          this.props.change('correspondenceAddressLine3', '');
          this.props.change('correspondencePostalCode', '');
          // this.props.change('correspondenceState', countryState[0] ? countryState[0].description : "");
          this.props.change('correspondenceState', '');
          this.props.change('correspondenceCountry', '');
        }
      },
    );
  }

  verifyReason(value) {
    return value === 'null' || !value.length ? 'Required' : undefined;
  }
  checkIfInputValueEmpty(value) {
    return !value.trim().length ? 'Required' : undefined;
  }

  checkTaxResidentNoAndReason(taxResidentIndex) {
    if (this.props.formState) {
      switch (taxResidentIndex) {
        case 1: {
          if (this.radioButton1) {
            return false;
          }
          return true;
        }
        case 2: {
          if (this.radioButton2) {
            return false;
          }
          return true;
        }
        case 3: {
          if (this.radioButton3) {
            return false;
          }
          return true;
        }

        default: {
          this.radioButton1 = false;
          this.radioButton2 = false;
          this.radioButton3 = false;

          return true;
        }
      }
    }
    return null;
  }

  clearTaxResidenNumAndReason(taxResidentIndex) {
    switch (taxResidentIndex) {
      case 2: {
        this.radioButton2 = false;
        break;
      }
      case 3: {
        this.radioButton3 = false;
        break;
      }
      default: {
        this.radioButton1 = false;
        this.radioButton2 = false;
        this.radioButton3 = false;
        break;
      }
    }
  }

  checkIfMalaysianAndNonMalaysianUnSelected() {
    const { isTaxResidentOfMalaysia } = this.props.formState.values;
    const { checkCheckBoxIsTaxResidentOfOtherCountry } = this.state;

    if (!isTaxResidentOfMalaysia && !checkCheckBoxIsTaxResidentOfOtherCountry) return false;

    return true;
  }

  getAccountActiveList(accountType) {
    const { clientDetails } = this.props;
    return clientDetails.account.filter(
      (accountItem) =>
        accountItem.UTRACCOUNTTYPE === accountType && (accountItem.AccountStatus === 'A' || accountItem.totalNetAssetValue > 0),
    );
  }

  checkExistingAccountNetValue(accountType) {
    const { clientDetails } = this.props;
    let suspendedClientWithNullNav;
    if (!this.getAccountActiveList(accountType).length) {
      suspendedClientWithNullNav = filterSuspendedAccountArray(clientDetails.account, accountType);
      return suspendedClientWithNullNav.length > 0;
    }
    return false;
  }

  isAllCashAccountsSuspendedWithZeroUnits() {
    const {
      entireClientInfo: { info, portfolio },
    } = this.props;
    const cashAccounts = info.account.filter((account) => account.UTRACCOUNTTYPE === 'CS');
    const portfolioWithCWDistributorCode = portfolio.filter((portfolioData) => portfolioData.partnerDistributorCode === 'CW');
    const cashAccountsWithPortfolioDetails = [];
    for (let i = 0; i < cashAccounts.length; i += 1) {
      let obj = { ...cashAccounts[i] };
      const index = portfolioWithCWDistributorCode.findIndex(
        (item) => item.accountId === cashAccounts[i].partnerAccountMappingId,
      );
      if (index !== -1) obj = { ...obj, ...portfolioWithCWDistributorCode[index] };
      cashAccountsWithPortfolioDetails.push(obj);
    }
    return cashAccountsWithPortfolioDetails.every(
      (item) => item.AccountStatus === 'S' && item.totalNetAssetValue === 0 && item.partnerDistributorCode === 'CW',
    );
  }

  // eslint-disable-next-line consistent-return
  getAccountType(accountType) {
    const {
      clientDetails: { account },
    } = this.props;

    /** To check the account is NRIC */
    if (checkExistingAccountTypes(accountTypes, account, accountType)) {
      return true;
    } else if (accountType === 'KW') {
      return checkEmisKWSPAccount(account) || checkIfAllAccountsAreSuspended(account);
    } else if (this.checkExistingAccountNetValue(accountType)) {
      return true;
    } else if (accountType === 'CS') {
      return this.isAllCashAccountsSuspendedWithZeroUnits() || this.getJointAccountObject().isIndividualAccount;
    }
  }

  handleDisclaimerRadio(isCustomerPoliticallyRelated) {
    this.setState({
      isCustomerPoliticallyRelated,
    });
  }
  handleOpenPhotoContainerDialog(uploadingPhoto, isCreatingCashAccount) {
    this.setState({
      uploadingPhoto,
      isCreatingCashAccount,
      isCreatingKwspAccount: false,
    });
  }
  handleCloseDialog() {
    this.setState({
      uploadingPhoto: false,
      isCreatingCashAccount: false,
    });
  }
  notify = (msg) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  viewClientProfile() {
    this.props.clearCashKwspAccountCreatedStateValue();
    this.props.history.push(`/clients/${this.props.clientDetails.id}/funds`);
    this.props.saveDocumentsUrl({});
  }

  continueAccountInvestment(accountType) {
    const { entireClientInfo } = this.props;
    const clientInfo = { ...entireClientInfo, accountType };
    this.props.clearCashKwspAccountCreatedStateValue();
    this.props.customerAddFunds(clientInfo, accountType);
    this.props.saveDocumentsUrl({});
  }

  showDialogGuideUploadPhoto() {
    this.setState((prevState) => ({
      isOpenDialogGuideUploadPhoto: !prevState.isOpenDialogGuideUploadPhoto,
    }));
  }

  navigateTo(pathName) {
    this.props.history.push(pathName);
  }

  backToCurrentPageClick(pathName) {
    const { clientDetails } = this.props;
    if (clientDetails) {
      this.props.history.push(`/clients/${clientDetails.id}/${pathName}`);
    }
  }

  openDialogConfirmEmailResend() {
    this.setState((prevState) => ({
      isOpenDialogConfirmEmailResend: !prevState.isOpenDialogConfirmEmailResend,
    }));
  }

  submitResendConfirmationEmail() {
    this.setState(
      {
        isOpenDialogConfirmEmailResend: false,
      },
      () => {
        this.props.resendConfirmationEmailToClient();
      },
    );
  }

  checkOccupationTypeValue(initialValues, Occupation) {
    return (
      initialValues.occupationType === Occupation[35].codevalue ||
      initialValues.occupationType === Occupation[31].codevalue ||
      initialValues.occupationType === Occupation[26].codevalue ||
      initialValues.occupationType === Occupation[16].codevalue
    );
  }

  checkIfTaxResidentSelected() {
    return !this.state.checkCheckBoxIsTaxResidentOfOtherCountry && !this.props.formState.values.isTaxResidentOfMalaysia;
  }

  getNonEditableFormFields(formFields) {
    return checkNonEditableFieldsValues(formFields);
  }

  checkIfTaxResidentRadiosClicked() {
    let isRadioClicked;
    for (let index = 1; index <= 3; index += 1) {
      if (index === 1) {
        isRadioClicked = isRadioClicked || this.checkTaxResidentNoAndReason(index);
      } else {
        isRadioClicked = isRadioClicked || (this.state.numTaxResidentInfo === index && this.checkTaxResidentNoAndReason(index));
      }
    }
    return isRadioClicked;
  }

  shouldSaveButtonBeDisabled() {
    const formValues = { ...this.props.formState.values };
    return (
      _isEmpty(formValues.email) ||
      !_isEmpty(this.getFormErrors(this.props.formState.syncErrors)) ||
      _isEmpty(this.getUpdatedFields(formValues)) ||
      !this.checkIfMalaysianAndNonMalaysianUnSelected() ||
      (this.state.checkCheckBoxIsTaxResidentOfOtherCountry && this.checkIfTaxResidentRadiosClicked())
    );
  }
  handleDocUpload(docs) {
    this.setState(
      {
        docsUploading: true,
      },
      () => {
        if (this.props.docs === 0) {
          const docUploadErrorMessage = 'Please upload all the documents';
          if (this.props.initialValues.identificationType === 'PSPORT' && Object.keys(docs).length < 3) {
            this.showToast(docUploadErrorMessage);
            return null;
          } else if (this.props.initialValues.identificationType !== 'PSPORT' && Object.keys(docs).length < 2) {
            this.showToast(docUploadErrorMessage);
            return null;
          }
        }
        this.handleOpenModal(false);
      },
    );
  }

  showAgeEligibilityPopUp() {
    this.setState({
      isNotELigible: !this.state.isNotELigible,
    });
  }

  getKwspAccountDetails() {
    this.setState({
      showKwspAccountTypeModal: !this.state.showKwspAccountTypeModal,
      kwspAccountType: null,
    });
  }

  handleKwspAccountCreationFlow() {
    if (CheckAgeEligibility(this.props.clientDetails.birthDate) >= 55) {
      this.showAgeEligibilityPopUp();
    } else {
      this.getKwspAccountDetails();
    }
  }

  handleCashAccountCreationFlow() {
    this.handleOpenPhotoContainerDialog(true, true);
  }

  selectAccountCreationFlow(accountType) {
    if (accountType === 'CS') {
      this.handleCashAccountCreationFlow();
    } else {
      this.handleKwspAccountCreationFlow();
    }
  }

  kwspAccountTypeSelect(kwspAccountType) {
    this.setState({
      kwspAccountType,
    });
  }

  processKwspDetails() {
    const { kwspAccountType } = this.state;
    const { effectiveDate, epfMembershipNumber } = this.props.kwspFormFields.values;
    const { dateOfBirth, identificationType } = this.props.initialValues;
    const islamicORConventionalFlag = kwspAccountType;
    this.setState(
      {
        showKwspAccountTypeModal: !this.state.showKwspAccountTypeModal,
        isCreatingKwspAccount: true,
        isCreatingCashAccount: false,
        isModalOpen: true,
      },
      () => {
        this.props.saveKWSPandCashDetails({
          createKwspAccountParams: {
            AccountType: 'KW',
            epfMembershipNumber,
            islamicORConventionalFlag,
            effectiveDate: (kwspAccountType === 'I' && effectiveDate) || null,
          },
          dateOfBirth,
          idType: identificationType,
        });
      },
    );
  }

  isKwspDisabled() {
    const { kwspFormFields } = this.props;
    const { kwspAccountType } = this.state;
    if (kwspFormFields && kwspFormFields.values && kwspFormFields.values.epfMembershipNumber) {
      return !_isEmpty(kwspFormFields.values.epfMembershipNumber) && !_isEmpty(kwspAccountType);
    }
  }

  handleEdit() {
    this.props.handleEdit();
  }

  checkIfJointHolderExists() {
    const { clientDetails } = this.props;
    if (clientDetails && clientDetails.account) {
      return (
        clientDetails.account.filter((accountItem) => accountItem.jointAccounts && accountItem.jointAccounts.length).length > 0
      );
    }
  }

  getJointAccountObject() {
    const { clientDetails } = this.props;
    const jointAccountList = clientDetails.account.filter(
      (accountItem) => accountItem.jointAccounts && accountItem.jointAccounts.length,
    );
    const cashAccountList = clientDetails.account.filter((accountItem) => accountItem.UTRACCOUNTTYPE === 'CS');
    return {
      isIndividualAccount: jointAccountList.length > 0 && cashAccountList.length === jointAccountList.length,
      jointAccountArray: jointAccountList,
    };
  }

  checkJointCashAccountExistence() {
    const jointAccountObject = this.getJointAccountObject();
    this.setState(
      {
        openCashJointAccountPopUp: jointAccountObject.isIndividualAccount,
        jointAccountList: jointAccountObject.jointAccountArray,
      },
      () => {
        if (!this.state.openCashJointAccountPopUp) {
          this.handleOpenPhotoContainerDialog(true, true);
        }
      },
    );
  }

  toggleJointAccountPopUp(toggle) {
    this.setState(
      {
        openCashJointAccountPopUp: !this.state.openCashJointAccountPopUp,
      },
      () => {
        if (toggle) {
          this.handleOpenPhotoContainerDialog(true, true);
        }
      },
    );
  }
  handleJointAccountHolderName(holderIndex, accountNumber) {
    let mainHolder = false,
      mainSecondaryHolder = false;
    let jointAccountHolderArray = [...this.state.jointAccountHolderArray];
    let jointAccountIndex;
    switch (holderIndex) {
      case 1: {
        mainHolder = true;
        mainSecondaryHolder = false;
        break;
      }
      case 2: {
        mainHolder = false;
        mainSecondaryHolder = true;
        break;
      }
      default: {
        mainHolder = false;
        mainSecondaryHolder = false;
        break;
      }
    }

    jointAccountIndex = _findIndex(jointAccountHolderArray, ['accountNumber', accountNumber]);
    if (jointAccountIndex === -1) {
      jointAccountHolderArray = [
        ...jointAccountHolderArray,
        {
          mainHolder: mainHolder,
          mainSecondaryHolder: mainSecondaryHolder,
          accountNumber: accountNumber,
        },
      ];
    } else {
      jointAccountHolderArray[jointAccountIndex] = {
        mainHolder: mainHolder,
        mainSecondaryHolder: mainSecondaryHolder,
        accountNumber: accountNumber,
      };
    }

    this.setState(
      {
        jointAccountHolderArray,
      },
      () => {
        this.props.change(`${accountNumber}_mainHolder`, mainHolder);
        this.props.change(`${accountNumber}_mainSecondaryHolder`, mainSecondaryHolder);
      },
    );
  }

  checkForAccNumValidation(value) {
    const { lov, formState } = this.props;
    const Banks = lov.Dictionary && lov.Dictionary[19].datadictionary;

    const selectedBank = Banks.find((b) => b.description === formState.values.bankName);
    let errorText = '';

    if (selectedBank) {
      const { HorizonValue, customValue1, customValue2 } = selectedBank;
      if (HorizonValue === 'AND') {
        if (customValue2) {
          if (!(value.trim().length >= Number(customValue1) && value.trim().length <= Number(customValue2))) {
            errorText = `Account number must be between ${Number(customValue1)} - ${Number(customValue2)} digits`;
          }
        } else {
          if (value.trim().length !== Number(customValue1)) {
            errorText = `Account number must be of ${Number(customValue1)} digits`;
          }
        }
      } else if (!(value.trim().length === Number(customValue1) || value.trim().length === Number(customValue2))) {
        errorText = `Account number must be either ${Number(customValue1)} or ${Number(customValue2)} digits`;
      }
    }

    this.setState({ accountNoErrMsg: errorText });
  }

  render() {
    let checkForAnyEmptyFields = true;
    let doShowEpfField = false;
    const { ageErrorMessage } = onBoardingConstants;
    if (this.props.formState && this.props.formState.values) {
      const {
        fullName,
        identificationType,
        identificationNumber,
        race,
        gender,
        dateOfBirth,
        AccMobileNo,
        nationality,
        purposeofinvestment,
        sourceoffunds,
        isTaxResidentOfMalaysia,
        isTaxResidentOfOtherCountry,
        doShowEpf,
      } = this.props.formState.values;
      doShowEpfField = doShowEpf;
      if (
        fullName &&
        identificationType &&
        identificationNumber &&
        race &&
        gender &&
        dateOfBirth &&
        AccMobileNo &&
        nationality &&
        purposeofinvestment &&
        sourceoffunds &&
        (isTaxResidentOfMalaysia || isTaxResidentOfOtherCountry)
      ) {
        checkForAnyEmptyFields = false;
      } else {
        checkForAnyEmptyFields = true;
      }
    }
    const {
      submitting,
      edit,
      formState,
      idObj,
      uploadType,
      lov: { Dictionary },
      bank,
      docs,
      initialValues,
      onChangeField,
      editEmail,
      originalEmail,
      cancelled,
    } = this.props;
    const className = edit ? 'edit' : '';
    const hasValues = formState && !_isEmpty(formState.values);
    const isML = hasValues && formState.values.permanentCountry === 'MY';
    const isCorrespondenceFromMlOrSg = hasValues && formState.values.correspondenceCountry === 'MY';
    const isCompanyFromMlOrSg = hasValues && formState.values.companyCountry === 'MY';
    const ageMaxDate = moment().subtract(18, 'years');
    const annualIncomeLOV = Dictionary[5].datadictionary;
    const IdTypes = Dictionary[9].datadictionary;
    const Occupation = Dictionary[1].datadictionary;
    const SourceOfFunds = Dictionary[8].datadictionary;
    const State = Dictionary[6].datadictionary;
    const Business = Dictionary[2].datadictionary;
    const Nationality = Dictionary[3].datadictionary;
    const Country = Dictionary[4].datadictionary;
    const CountryCor = Dictionary[28].datadictionary;
    const Purpose = Dictionary[15].datadictionary;
    const Interest = Dictionary[16].datadictionary;
    const Gender = Dictionary[11].datadictionary;
    const Title = Dictionary[12].datadictionary;
    const MaritalStatus = Dictionary[10].datadictionary;
    const Race = Dictionary[13].datadictionary;
    const TaxResidentNoIDReasons = Dictionary[29].datadictionary;
    const Banks = _orderBy(Dictionary[19].datadictionary, ['description'], ['asc']);
    const CountriesCwaCrs = Dictionary[30].datadictionary;
    const educationLevelLOV = Dictionary[34].datadictionary;
    const investmentExperienceLOV = Dictionary[35].datadictionary;
    const existingCommitmentsLOV = Dictionary[36].datadictionary;

    let showReasonExplanation1 = false;
    let showReasonExplanation2 = false;
    let showReasonExplanation3 = false;

    let taxResidentCountryList = [];
    let showTaxResidentInfo = false,
      showTaxResidentInfoSection2 = false,
      showTaxResidentInfoSection3 = false,
      showTaxResidentReasonSection1 = true,
      showTaxResidentReasonSection2 = true,
      showTaxResidentReasonSection3 = true,
      selectedReason1 = null,
      selectedReason2 = null,
      selectedReason3 = null,
      showTinInput1,
      showReasonInput1,
      showTinInput2,
      showReasonInput2,
      showTinInput3,
      showReasonInput3,
      showTaxResidentReasonRemarkSection1 = false,
      showTaxResidentReasonRemarkSection2 = false,
      showTaxResidentReasonRemarkSection3 = false,
      tooltipTaxResidentReasonSection1 = null,
      tooltipTaxResidentReasonSection2 = null,
      tooltipTaxResidentReasonSection3 = null;

    if (!_isEmpty(this.props.formState) && !_isEmpty(this.props.formState.values)) {
      const { values } = this.props.formState;

      if (values.taxResidentTaxIdentificationNumberUnAvailableReason1) {
        selectedReason1 = TaxResidentNoIDReasons.filter(
          (data) => data.codevalue === values.taxResidentTaxIdentificationNumberUnAvailableReason1,
        );
        selectedReason1 = selectedReason1[0] ? selectedReason1[0].description : null;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason2) {
        selectedReason2 = TaxResidentNoIDReasons.filter(
          (data) => data.codevalue === values.taxResidentTaxIdentificationNumberUnAvailableReason2,
        );
        selectedReason2 = selectedReason2[0] ? selectedReason2[0].description : null;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason3) {
        selectedReason3 = TaxResidentNoIDReasons.filter(
          (data) => data.codevalue === values.taxResidentTaxIdentificationNumberUnAvailableReason3,
        );
        selectedReason3 = selectedReason3[0] ? selectedReason3[0].description : null;
      }
      if (values.isTaxResidentTaxIdentificationNumberAvailable1 === true) {
        showTinInput1 = true;
      } else {
        showTinInput1 = false;
      }
      if (values.isTaxResidentTaxIdentificationNumberAvailable1 === false) {
        showReasonInput1 = true;
      } else {
        showReasonInput1 = false;
      }

      if (values.isTaxResidentTaxIdentificationNumberAvailable2 === true) {
        showTinInput2 = true;
      } else {
        showTinInput2 = false;
      }

      if (values.isTaxResidentTaxIdentificationNumberAvailable2 === false) {
        showReasonInput2 = true;
      } else {
        showReasonInput2 = false;
      }

      if (values.isTaxResidentTaxIdentificationNumberAvailable3 === true) {
        showTinInput3 = true;
      } else {
        showTinInput3 = false;
      }

      if (values.isTaxResidentTaxIdentificationNumberAvailable3 === false) {
        showReasonInput3 = true;
      } else {
        showReasonInput3 = false;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason1 === codeValueOfTaxResidentReasonToInputExplanation) {
        // showReasonExplanation1 = true;
      } else {
        showReasonExplanation1 = false;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason2 === codeValueOfTaxResidentReasonToInputExplanation) {
        // showReasonExplanation2 = true;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason3 === codeValueOfTaxResidentReasonToInputExplanation) {
        // showReasonExplanation3 = true;
      }

      if (values.nationality !== 'MY') {
        // (values.nationality === 'MY' && values.isTaxResidentOfMalaysia && values.isTaxResidentOfOtherCountry)) {
        taxResidentCountryList = CountriesCwaCrs;
      } else {
        taxResidentCountryList = CountriesCwaCrs.filter((country) => country.codevalue !== 'MY');
      }

      if (typeof values.isTaxResidentOfMalaysia !== 'string' && values.isTaxResidentOfMalaysia) {
        this.props.change('isTaxResidentOfMalaysia', true);
      } else if (values.isTaxResidentOfMalaysia) {
        this.props.change('isTaxResidentOfMalaysia', true);
      } else {
        this.props.change('isTaxResidentOfMalaysia', false);
      }
    }

    if (originalEmail) {
      this.props.change('email', originalEmail);
    }

    if (this.props.formState && this.props.formState.values) {
      if (
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason1 ===
        codeValueOfTaxResidentReasonToInputExplanation
      ) {
        showReasonExplanation1 = true;
      } else {
        showReasonExplanation1 = false;
      }
      if (
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason2 ===
        codeValueOfTaxResidentReasonToInputExplanation
      ) {
        showReasonExplanation2 = true;
      } else {
        showReasonExplanation2 = false;
      }
      if (
        this.props.formState.values.taxResidentTaxIdentificationNumberUnAvailableReason3 ===
        codeValueOfTaxResidentReasonToInputExplanation
      ) {
        showReasonExplanation3 = true;
      } else {
        showReasonExplanation3 = false;
      }
    }

    const { kwspFormFields } = this.props;
    let epfErrorMessage = false;

    if (kwspFormFields && kwspFormFields.values) {
      const { epfMembershipNumber } = kwspFormFields.values;
      if (epfMembershipNumber.length !== 8) {
        epfErrorMessage = true;
      } else {
        epfErrorMessage = false;
      }
    }

    // phase 1
    const disableEmailField = true;
    // for phase 2
    // const disableEmailField = typeof initialValues.email === 'string' && initialValues.email.length > 0;

    const hasSourceofFundValueExistInDictionary = SourceOfFunds.some(
      (item) => item.codevalue === String(initialValues.sourceoffunds),
    );

    const hasPurposeOfInvestValueExistInDictionary = Purpose.some(
      (item) => item.codevalue.toUpperCase() === initialValues.purposeofinvestment,
    );

    return (
      <React.Fragment>
        <LoadingOverlay show={this.props.processing} />

        {/*  TermAndCondition Modal */}
        <Modal
          open={this.state.isModalOpen}
          handleClose={this.handleCloseModal}
          title={titleForTermsAndConditionModal}
          editProfile>
          {(this.state.isCreatingCashAccount || this.state.isCreatingKwspAccount) && (
            <DoesHoldPoliticalParty
              handleDisclaimerRadio={(value) => this.handleDisclaimerRadio(value)}
              isCustomerPoliticallyRelated={this.state.isCustomerPoliticallyRelated}
            />
          )}
          <Grid container direction="column" justify="center" alignItems="center">
            <Disclaimer acknowledge={this.state.acknowledge} onChange={this.acknowledge} />
            <CWADisclaimer acknowledge={this.state.cwaAcknowledge} onChange={this.cwaAcknowledge} />
            <Grid item xs={12}>
              <StyleButtonForModal
                primary
                onClick={() =>
                  this.submit(this.state.docsUploading, this.state.isCreatingCashAccount, this.state.isCreatingKwspAccount)
                }
                disabled={
                  !(this.state.isCreatingCashAccount || this.state.isCreatingKwspAccount)
                    ? !this.state.acknowledge || !this.state.cwaAcknowledge
                    : !this.state.acknowledge || !this.state.cwaAcknowledge || this.state.isCustomerPoliticallyRelated === null
                }>
                Submit
              </StyleButtonForModal>
            </Grid>
          </Grid>
        </Modal>

        {/* Upload IC Photo */}
        <Dialog
          open={this.state.uploadingPhoto}
          title={''}
          // closeHandler={}
          noClose
          content={
            <PhotoContainer
              isExistingCustomer
              showGuideTakePhoto={this.showDialogGuideUploadPhoto}
              uploadType={
                this.props && this.props.formState && this.props.formState.values
                  ? this.convertToHumanReadable(this.props.formState.values.identificationType)
                  : null
              }
              identificationNumber={
                this.props && this.props.formState && this.props.formState.values
                  ? this.props.formState.values.identificationNumber
                  : null
              }
              uploadPhoto={this.props.uploadPhoto}
              handleOpenModal={(value) => this.handleOpenModal(value)}
              handleCloseDialog={this.handleCloseDialog}
              removePhoto={() => this.props.removePhoto(this.props && this.props.image ? this.props.image : null)}
              image={this.props ? this.props.image : null}
            />
          }
        />

        {/* Cash Account created successfully */}
        <Dialog
          open={this.props && (this.props.cashAccountCreatedSuccess || this.props.kwspAccountCreatedSuccess)}
          title={''}
          // closeHandler={}
          noClose
          content={
            <AccountCreationSuccessComponent
              viewClientProfile={this.viewClientProfile}
              accountTypeCreated={this.props.cashAccountCreatedSuccess ? 'CS' : 'KW'}
              continueAccountInvestment={(accountType) => this.continueAccountInvestment(accountType)}
              openDialogConfirmEmailResend={this.openDialogConfirmEmailResend}
            />
          }
        />
        <ErrorModal msg={ageErrorMessage} handleClose={this.showAgeEligibilityPopUp} open={this.state.isNotELigible} showClose />
        <Field
          component={KwspAccountTypeModal}
          processKwspDetails={this.processKwspDetails}
          isDisabled={this.isKwspDisabled}
          kwspAccountType={this.state.kwspAccountType}
          handleChange={this.kwspAccountTypeSelect}
          open={this.state.showKwspAccountTypeModal}
          handleClose={this.getKwspAccountDetails}
          width={700}
          height={600}
          showClose
          epfErrorMessage={epfErrorMessage}
        />

        <Form onSubmit={(e) => e.preventDefault()}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ marginBottom: '23px', marginTop: '-50px' }}>
            <Grid item>
              <Text size="16px" weight="bold" color="#000" align="left">
                <BolderText>View Profile Details</BolderText>
              </Text>
            </Grid>
            <Grid item>
              {edit ? (
                <Grid container direction="row" justify="space-between" alignItems="center">
                  {accountTypes.map(
                    (account) =>
                      this.getAccountType(account) && (
                        <NewAccountButton
                          isRiskExpired={this.props.isRiskExpired}
                          mandatoryFieldsMissing={checkIfMandatoryFieldsMissing(
                            this.props.formState,
                            this.state.checkCheckBoxIsTaxResidentOfOtherCountry,
                          )}
                          onCreateNonExistentAccount={(accountType) => this.selectAccountCreationFlow(accountType)}
                          accountStatus={this.props.initialValues.accountStatus}
                          accountType={account}
                        />
                      ),
                  )}
                  {/* {this.getAccountType() && (<NewCashAccountButton
                    isRiskExpired={this.props.isRiskExpired}
                    mandatoryFieldsMissing={checkIfMandatoryFieldsMissing(this.props.formState, this.state.checkCheckBoxIsTaxResidentOfOtherCountry)}
                    onCreateCashAccount={() => this.checkJointCashAccountExistence()}
                    accountStatus={this.props.initialValues.accountStatus}
                  />)} */}
                  <EditButton
                    onClick={this.handleEdit}
                    isEditable={Boolean(this.props.initialValues.isEditable)}
                    isRiskExpired={this.props.isRiskExpired}
                  />
                </Grid>
              ) : (
                <table border="0">
                  <tr>
                    <td>
                      <SaveButton
                        type="submit"
                        isEmpty={
                          this.checkIfTaxResidentSelected() || !_isEmpty(this.getFormErrors(this.props.formState.syncErrors))
                        }
                        getFormErrors={
                          this.getNonEditableFormFields(this.props.formState.values) ||
                          this.getFormErrors(this.props.formState.syncErrors) ||
                          this.state.accountNoErrMsg
                        }
                        accountStatus={this.props.initialValues.accountStatus}
                        isSaving={
                          this.state.isDocUpload
                            ? !this.state.isDocUpload ||
                              (!this.props.docs.length && !checkDocUploadCompletion(this.props.image, this.props.uploadType))
                            : this.shouldSaveButtonBeDisabled()
                          // _isEmpty(this.getUpdatedFields(this.props.formState.values)) ||
                          // !_isEmpty(this.getFormErrors(this.props.formState.syncErrors)) ||
                          // _isEmpty(this.props.formState.values.email) ||
                          // !this.checkIfMalaysianAndNonMalaysianUnSelected() ||
                          // this.state.checkCheckBoxIsTaxResidentOfOtherCountry && (this.checkTaxResidentNoAndReason(1) ||
                          //   (this.state.numTaxResidentInfo === 2 && this.checkTaxResidentNoAndReason(2)) ||
                          //   (this.state.numTaxResidentInfo === 3 && this.checkTaxResidentNoAndReason(3)))
                        }
                        onClick={() => this.handleOpenModal(false)}
                      />
                    </td>
                    <td style={{ width: 5 }}></td>
                    <td>
                      <CancelButton onClick={this.handleCancel} />
                    </td>
                  </tr>
                </table>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={24}>
            {/* ********
             * Document Preview Section
             ******** */}
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedDocumentSection}
                onChange={() => this.handleExpandCollapseSection('DOC_DETAIL')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text color="#1d1d26" weight="bold">
                    <BolderText>DOCUMENT PREVIEW</BolderText>
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  {docs.length > 0 ? (
                    <Grid container justify="flex-start" spacing={24} style={{ marginLeft: '1px' }}>
                      <DocumentSection
                        edit={edit}
                        accountStatus={this.props.initialValues.accountStatus}
                        docs={this.props.docs}
                        images={this.props.image}
                        uploadDocPhoto={this.uploadDocPhoto}
                        removePhoto={this.props.removePhoto}
                        handleDocUpload={this.handleDocUpload}
                        documentsUrl={this.props.documentsUrl}
                      />
                    </Grid>
                  ) : (
                    // <span>
                    //   <Text style={{ marginTop: '8px' }}>
                    //     <img src={NoDocs} />
                    //   </Text>
                    //   <Text color="#1d1d26" weight="bold" style={{ marginTop: '10px' }}>
                    //     No document preview available
                    // </Text>
                    // </span>
                    <Grid container justify="flex-start" spacing={24} style={{ marginLeft: '1px' }}>
                      <EmptyDocumentSection
                        edit={edit}
                        accountStatus={this.props.initialValues.accountStatus}
                        identificationType={this.props.clientDetails.account[0].identificationType}
                        images={this.props.image}
                        uploadDocPhoto={this.uploadDocPhoto}
                        removePhoto={this.props.removePhoto}
                        handleDocUpload={this.handleDocUpload}
                      />
                    </Grid>
                  )}
                </StyledDetails>
              </StyledPanel>
            </ContentItem>

            {/* ********
             * Personal Details Section
             ******** */}
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedPersonalDetailSection}
                onChange={() => this.handleExpandCollapseSection('PERSONAL_DETAIL')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text color="#1d1d26" weight="bold">
                    <BolderText>PERSONAL DETAILS</BolderText>
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="flex-start" spacing={24}>
                    <GridHere item xs={12} sm={6}>
                      <StyledField
                        name="fullName"
                        label="FULL NAME (AS PER ID TYPE)"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        parse={(value) => {
                          if ((value && /^[a-zA-Z\s]*$/.test(value)) || value === '') {
                            return value;
                          }
                        }}
                        className={'edit gray'}
                        disabled
                        component={InputField}
                        margin="normal"
                        placeholder="..."
                        width="100%"
                        checkIfEmptyLabel="Full Name"
                        shouldCheckIfEmpty
                        edit={!edit}
                      />
                    </GridHere>
                    <GridHere item xs={12} sm={6}>
                      <StyledField
                        name="title"
                        data={Title}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        className={className}
                        component={CustomReactSelectField}
                        label="TITLE"
                        margin="normal"
                        width="100%"
                        bgColor={!edit && 'white'}
                        validate={cancelled ? false : required}
                        edit={!edit}
                      />
                    </GridHere>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="identificationType"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        className={'edit gray'}
                        component={CustomReactSelectField}
                        label="ID TYPE"
                        margin="normal"
                        data={IdTypes}
                        width="100%"
                        placeholder="Select id type"
                        checkIfEmptyLabel="ID Type"
                        shouldCheckIfEmpty
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="identificationNumber"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        className={'edit gray'}
                        component={InputField}
                        label="ID NUMBER"
                        width="100%"
                        margin="normal"
                        placeholder="..."
                        checkIfEmptyLabel="ID Number"
                        shouldCheckIfEmpty
                        edit={!edit}
                      />
                    </Grid>
                    {initialValues.identificationType === 'PSPORT' ? (
                      <React.Fragment>
                        <Grid item xs={12} sm={6}>
                          <StyledField
                            disabled={edit}
                            bgColor={!edit && 'white'}
                            name="expiryDate"
                            label="PASSPORT EXPIRATION"
                            className={editEmail ? '' : 'edit'}
                            fullWidth="100%"
                            validate={cancelled ? false : [required, validatePassportDate, invalidDateFormatCheck]}
                            disablePast
                            shouldDisableDate={(date) => Date.parse(date) < Date.parse(new Date())}
                            component={DateField}
                            edit={!edit}
                            maxDateMessage="Must be later than today"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <StyledField
                            disabled={edit}
                            bgColor={!edit && 'white'}
                            name="expiryDateVisa"
                            label="VISA EXPIRATION"
                            className={editEmail ? '' : 'edit'}
                            fullWidth="100%"
                            validate={cancelled ? false : [required, validatePassportDate, invalidDateFormatCheck]}
                            component={DateField}
                            edit={!edit}
                            disablePast
                            shouldDisableDate={(date) => Date.parse(date) < Date.parse(new Date())}
                            maxDateMessage="Must be later than today"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </React.Fragment>
                    ) : null}
                    {initialValues.cashUTRNumber && (
                      <Grid item xs={12} sm={6}>
                        <StyledField
                          name="cashUTRNumber"
                          label="UTR Account Number (CASH)"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          parse={(value) => {
                            if ((value && /^[a-zA-Z\s]*$/.test(value)) || value === '') {
                              return value;
                            }
                          }}
                          className={'edit gray'}
                          disabled
                          component={InputField}
                          margin="normal"
                          placeholder="..."
                          width="100%"
                          checkIfEmptyLabel="UTR Account number"
                          shouldCheckIfEmpty
                          edit={!edit}
                        />
                      </Grid>
                    )}
                    {initialValues.kwspUTRNumber && (
                      <Grid item xs={12} sm={6}>
                        <StyledField
                          name="kwspUTRNumber"
                          label="UTR Account Number (KWSP)"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          parse={(value) => {
                            if ((value && /^[a-zA-Z\s]*$/.test(value)) || value === '') {
                              return value;
                            }
                          }}
                          className={'edit gray'}
                          component={InputField}
                          margin="normal"
                          placeholder="..."
                          width="100%"
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={Boolean(initialValues.race) || edit}
                        bgColor={!(Boolean(initialValues.race) || edit) && 'white'}
                        className={className}
                        name="race"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={CustomReactSelectField}
                        select
                        width="100%"
                        label="RACE"
                        margin="normal"
                        data={Race}
                        validate={cancelled ? false : required}
                        placeholder="..."
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="maritalStatus"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        select
                        component={CustomReactSelectField}
                        label="MARITAL STATUS"
                        data={MaritalStatus}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : required}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="gender"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={className}
                        select
                        disabled={['M', 'F'].includes(initialValues.gender) || edit}
                        bgColor={!(['M', 'F'].includes(initialValues.gender) || edit) && 'white'}
                        component={CustomReactSelectField}
                        label="GENDER"
                        width="100%"
                        margin="normal"
                        data={Gender}
                        validate={cancelled ? false : required}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        style={{ pointerEvents: initialValues.dateOfBirth ? 'none' : '' }}
                        bgColor={!(Boolean(initialValues.dateOfBirth) || edit) && 'white'}
                        name="dateOfBirth"
                        InputProps={{ disableUnderline: true }}
                        maxDate={ageMaxDate}
                        maxDateMessage="Must be 18 or older."
                        label="DATE OF BIRTH"
                        className={editEmail ? '' : 'edit'}
                        fullWidth="100%"
                        component={DateField}
                        checkIfEmptyLabel="DOB"
                        shouldCheckIfEmpty
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit || disableEmailField}
                        bgColor={!edit && !disableEmailField && 'white'}
                        className={editEmail && !disableEmailField ? '' : 'edit'}
                        name="email"
                        label="EMAIL ADDRESS"
                        type="email"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        width="100%"
                        // validate={isValidEmail}
                        component={InputField}
                        // bgColor="#ffffff"
                        onChange={onChangeField}
                        parse={(value) => {
                          if ((value && value.trim().length > 0 && value.length <= maxLengthEmail) || value === '') {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled
                        className={'edit gray'}
                        name="AccMobileNo"
                        placeholder="..."
                        label="MOBILE NUMBER"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= maxLengthMobile) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        width="100%"
                        component={InputField}
                        checkIfEmptyLabel="Mobile Number"
                        shouldCheckIfEmpty
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={Boolean(initialValues.motherMaidenName) || edit}
                        bgColor={!(Boolean(initialValues.motherMaidenName) || edit) && 'white'}
                        name="motherMaidenName"
                        label="MOTHER MAIDEN NAME"
                        type="text"
                        className={!initialValues.motherMaidenName && editEmail ? '' : 'edit gray'}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        width="100%"
                        component={InputField}
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && /^[a-zA-Z\/.,\"(\)\-'\s]*$/.test(value) && value.length <= 60) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        validate={cancelled ? false : [required, maxLength(100)]}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled
                        className={'edit gray'}
                        name="nationality"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        select
                        data={Nationality}
                        component={CustomReactSelectField}
                        label="NATIONALITY"
                        margin="normal"
                        width="100%"
                      />
                    </Grid>
                    {doShowEpfField && (
                      <Grid item xs={12} sm={6}>
                        <StyledField
                          disabled
                          className={'edit gray'}
                          name="epfNumber"
                          placeholder="..."
                          label="EPF Number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                          width="100%"
                          component={InputField}
                        />
                      </Grid>
                    )}
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            </ContentItem>

            {/* ********
             * Address Section
             ******** */}
            <ContentItem>
              <StyledPanel expanded={this.state.expandedAddressSection} onChange={() => this.handleExpandCollapseSection('ADDR')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text color="#1d1d26" weight="bold">
                    <BolderText>ADDRESSES</BolderText>
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="flex-start" spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <Text size="14px" weight="bold" color="#000" align="left">
                        Permanent Address
                      </Text>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Text size="14px" weight="bold" color="#000" align="left">
                        Correspondence Address
                      </Text>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="permanentAddressLine1"
                        label="PERMANENT ADDRESS LINE 1"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [required, maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="correspondenceAddressLine1"
                        label="CORRESPONDENCE ADDRESS LINE 1"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [required, maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="permanentAddressLine2"
                        label="PERMANENT ADDRESS LINE 2"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [required, maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="correspondenceAddressLine2"
                        label="CORRESPONDENCE ADDRESS LINE 2"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [required, maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="permanentAddressLine3"
                        label="PERMANENT ADDRESS LINE 3"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="correspondenceAddressLine3"
                        label="CORRESPONDENCE ADDRESS LINE 3"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="permanentCountry"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={CustomReactSelectField}
                        select
                        label="COUNTRY OF RESIDENCE"
                        margin="normal"
                        width="100%"
                        data={Country}
                        validate={cancelled ? false : required}
                        onChange={this.onChange}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="correspondenceCountry"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        data={Country}
                        component={CustomReactSelectField}
                        select
                        label="CORRESPONDENCE COUNTRY"
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : required}
                        onChange={this.onChange}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="permanentPostalCode"
                        label="POST CODE"
                        component={InputField}
                        type="number"
                        onBlur={(e) => this.validatePostalCode(e, 'permanent')}
                        placeholder="..."
                        validate={[required, maxLength(6)]}
                        width="100%"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        parse={(value) => {
                          if ((value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= 6) || value === '') {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="correspondencePostalCode"
                        label="POST CODE"
                        component={InputField}
                        type="number"
                        onBlur={(e) => this.validatePostalCode(e, 'correspondence')}
                        validate={[required, maxLength(6)]}
                        width="100%"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        parse={(value) => {
                          if ((value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= 6) || value === '') {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {isML && (
                        <StyledField
                          disabled={edit}
                          bgColor={!edit && 'white'}
                          className={className}
                          name="permanentState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={CustomReactSelectField}
                          data={State}
                          isState
                          label="STATE"
                          margin="normal"
                          width="100%"
                          validate={cancelled ? false : [required, maxLength(15)]}
                          edit={!edit}
                        />
                      )}
                      {!isML && (
                        <StyledField
                          disabled={edit}
                          bgColor={!edit && 'white'}
                          className={className}
                          name="permanentState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={InputField}
                          label="STATE"
                          width="100%"
                          margin="normal"
                          validate={cancelled ? false : [required, maxLength(20)]}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                                value.length <= 20) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                          edit={!edit}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {isCorrespondenceFromMlOrSg && (
                        <StyledField
                          disabled={edit}
                          bgColor={!edit && 'white'}
                          className={className}
                          name="correspondenceState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={CustomReactSelectField}
                          data={State}
                          isState
                          label="STATE"
                          margin="normal"
                          width="100%"
                          validate={cancelled ? false : [required, maxLength(15)]}
                          edit={!edit}
                        />
                      )}
                      {!isCorrespondenceFromMlOrSg && (
                        <StyledField
                          disabled={edit}
                          bgColor={!edit && 'white'}
                          className={className}
                          name="correspondenceState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={InputField}
                          label="STATE"
                          width="100%"
                          margin="normal"
                          validate={cancelled ? false : [required, maxLength(20)]}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                                value.length <= 20) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                          edit={!edit}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CheckboxField
                        onClick={this.toggleAddressCheckbox}
                        value={this.state.isPermanentCorrespondenceAddress}
                        disabled={edit}
                        className={className}
                        name="isPermanentCorrespondenceAddress"
                        label="Permanent Address is your Correspondence Address"
                      />
                    </Grid>
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            </ContentItem>

            {/* ********
             * Tax information Section
             ******** */}
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedTaxResidentInfoSection}
                onChange={() => this.handleExpandCollapseSection('TAX_RESIDENT_INFO')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text color="#1d1d26" weight="bold">
                    <BolderText>TAX RESIDENCE INFORMATION</BolderText>
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="flex-start" spacing={30} style={{ marginBottom: '-18px', marginTop: '21px' }}>
                    <Grid item xs={12} sm={6}>
                      {!edit && this.checkIfTaxResidentSelected() && (
                        <TextErrorBold align="left">Please check at least one below</TextErrorBold>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container justify="flex-start" spacing={24} style={{ marginTop: '21px' }}>
                    <Grid item xs={12} sm={6}>
                      <Text weight="bold" align="left" size="14px">
                        I hereby declare and represent that I am: (Check all that apply)
                      </Text>
                    </Grid>
                    <Grid item xs={12} sm={12} style={{ marginTop: '-18px' }}>
                      <CheckboxField
                        onClick={this.handleChangeIsTaxResidentOfMalaysia}
                        value={
                          this.props.formState
                            ? this.props.formState.values
                              ? this.props.formState.values.isTaxResidentOfMalaysia
                              : false
                            : false
                        }
                        disabled={edit}
                        className={className}
                        name="isTaxResidentOfMalaysia"
                        label="A Tax resident of Malaysia"
                        fontSize="14px"
                        validate={cancelled ? false : required}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} style={{ marginTop: '-17px' }}>
                      <CheckboxField
                        onClick={this.handleChangeIsTaxResidentOfOtherCountry}
                        value={this.state.checkCheckBoxIsTaxResidentOfOtherCountry}
                        disabled={edit}
                        className={className}
                        name="isTaxResidentOfOtherCountry"
                        label="A Tax resident or citizen of a country other than Malaysia"
                        fontSize="14px"
                        validate={cancelled ? false : required}
                      />
                    </Grid>
                    {this.state.checkCheckBoxIsTaxResidentOfOtherCountry && this.state.numTaxResidentInfo ? (
                      <React.Fragment>
                        <Grid container spacing={24} style={{ marginLeft: '23px' }}>
                          <GridHere item xs={3}>
                            <p style={{ height: 60 }}>
                              <StyledField
                                disabled={edit}
                                bgColor={!edit && 'white'}
                                className={className}
                                validate={cancelled ? false : required}
                                label="COUNTRY OF BIRTH"
                                name="PlaceandCountryBirth"
                                data={CountriesCwaCrs}
                                component={CustomReactSelectField}
                                placeholder="..."
                                onChange={this.onChange}
                                dropdownWidth="410px"
                                edit={!edit}
                              />
                            </p>
                          </GridHere>
                          <GridHere item>
                            <HiddenField component={InputField} />
                          </GridHere>
                        </Grid>
                        <Grid container spacing={24} style={{ marginLeft: '23px', marginBottom: '12px' }}>
                          <Grid item xs={3}>
                            <Text weight="bold" align="left" size="14px" style={{ paddingTop: 30 }}>
                              Tax Residence 1
                            </Text>
                            <p style={{ height: 60 }}>
                              <StyledField
                                disabled={edit}
                                bgColor={!edit && 'white'}
                                className={className}
                                validate={cancelled ? false : required}
                                label="COUNTRY / JURISDICATION OF TAX RESIDENT"
                                name="taxResidentCountry1"
                                data={taxResidentCountryList}
                                component={CustomReactSelectField}
                                placeholder="..."
                                onChange={this.onChange}
                                dropdownWidth="410px"
                                edit={!edit}
                              />
                            </p>
                            <Text
                              align="left"
                              size="10px"
                              color="#000000"
                              weight="bold"
                              opacity={0.4}
                              style={{ paddingTop: 25, width: '270px' }}>
                              TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                            </Text>
                            <RowGridLeft spacing={0} style={{ marginLeft: '5px' }}>
                              {!edit && this.checkTaxResidentNoAndReason(1) && (
                                <Text weight="bold" align="left" size="12px" color={Color.C_RED} style={{ paddingTop: 10 }}>
                                  Please select Yes or NO
                                </Text>
                              )}
                            </RowGridLeft>
                            <RowGridLeft spacing={0} style={{ marginLeft: '5px' }}>
                              <Grid item xs={3}>
                                <StyledRadioButton
                                  disabled={edit}
                                  checked={
                                    this.props.formState
                                      ? this.props.formState.values
                                        ? this.props.formState.values.isTaxResidentTaxIdentificationNumberAvailable1 === true
                                        : false
                                      : false
                                  }
                                  value="isTaxResidentTaxIdentificationNumberAvailable1"
                                  control={<Radio />}
                                  label="Yes"
                                  validate={[required]}
                                  onChange={() => this.handleChangeIsTaxResidentTaxIdentificationNumberAvailable(1, true)}
                                />
                              </Grid>
                              <Grid item xs={5}>
                                <StyledRadioButton
                                  disabled={edit}
                                  checked={
                                    this.props.formState
                                      ? this.props.formState.values
                                        ? this.props.formState.values.isTaxResidentTaxIdentificationNumberAvailable1 === false
                                        : false
                                      : false
                                  }
                                  value="isTaxResidentTaxIdentificationNumberAvailable1"
                                  control={<Radio />}
                                  label="No"
                                  validate={[required]}
                                  onChange={() => this.handleChangeIsTaxResidentTaxIdentificationNumberAvailable(1, false)}
                                />
                              </Grid>
                            </RowGridLeft>

                            {showTinInput1 ? (
                              <p style={{ paddingTop: 23 }}>
                                <StyledField
                                  disabled={edit}
                                  bgColor={!edit && 'white'}
                                  className={className}
                                  name="taxResidentTaxIdentificationNumber1"
                                  type="text"
                                  placeholder="..."
                                  label="Tax Identification Number"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  component={InputField}
                                  validate={
                                    cancelled ? false : [required, maxLength(maxLengthTaxResidentTaxIdentificationNumber)]
                                  }
                                  parse={(value) => {
                                    if (
                                      (value &&
                                        value.trim().length > 0 &&
                                        /^[0-9a-zA-Z\s]*$/.test(value) &&
                                        value.length <= maxLengthTaxResidentTaxIdentificationNumber) ||
                                      value === ''
                                    ) {
                                      return value;
                                    }
                                  }}
                                  edit={!edit}
                                />
                              </p>
                            ) : (
                              <DisplayNoneField
                                name="taxResidentTaxIdentificationNumber1"
                                component={EmptyField}
                                validate={false}
                              />
                            )}
                            {showReasonInput1 ? (
                              <React.Fragment>
                                <Text align="left" size="10px" color="#000000" style={{ paddingTop: 10, width: '270px' }}>
                                  IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                                </Text>
                                <StyledField
                                  disabled={edit}
                                  bgColor={!edit && 'white'}
                                  className={className}
                                  label=""
                                  name="taxResidentTaxIdentificationNumberUnAvailableReason1"
                                  data={TaxResidentNoIDReasons}
                                  component={ReactSelectFieldCustom}
                                  placeholder="..."
                                  validate={cancelled ? false : this.verifyReason}
                                  onChange={() => this.handleReasonChange(1)}
                                  edit={!edit}
                                />
                                {showReasonExplanation1 ? (
                                  <React.Fragment>
                                    <Text
                                      align="left"
                                      size="12px"
                                      color={Color.C_LIGHT_BLUE}
                                      style={{ paddingTop: 15, width: '270px' }}>
                                      FOR REASON B, PLEASE EXPLAIN REASON OF ACCOUNT HOLDER UNABLE TO OBTAIN TIN OR EQUIVALENT
                                      NUMBER
                                    </Text>
                                    <StyledField
                                      disabled={edit}
                                      bgColor={!edit && 'white'}
                                      className={className}
                                      name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1"
                                      type="text"
                                      placeholder="Explanation"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      component={InputField}
                                      validate={!cancelled ? [required, maxLength(maxLengthTaxResidentReasonExplanation)] : false}
                                      parse={(value) => {
                                        if (
                                          (value &&
                                            value.trim().length > 0 &&
                                            /^[0-9a-zA-Z\s]*$/.test(value) &&
                                            value.length <= maxLengthTaxResidentReasonExplanation) ||
                                          value === ''
                                        ) {
                                          return value;
                                        }
                                      }}
                                      edit={!edit}
                                    />
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment>
                                    <DisplayNoneField
                                      name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1"
                                      component={EmptyField}
                                      validate={false}
                                    />
                                  </React.Fragment>
                                )}
                              </React.Fragment>
                            ) : (
                              <DisplayNoneField
                                name="taxResidentTaxIdentificationNumberUnAvailableReason1"
                                component={EmptyField}
                                validate={false}
                              />
                            )}
                          </Grid>

                          <Grid item xs={3}>
                            {this.props.formState && this.props.formState.values && this.state.numTaxResidentInfo > 1 ? (
                              <React.Fragment>
                                <Text weight="bold" align="left" size="14px" style={{ paddingTop: 30 }}>
                                  Tax Residence 2
                                </Text>
                                <p style={{ height: 60 }}>
                                  <StyledField
                                    disabled={edit}
                                    bgColor={!edit && 'white'}
                                    className={className}
                                    validate={cancelled ? false : required}
                                    label="COUNTRY / JURISDICATION OF TAX RESIDENT"
                                    name="taxResidentCountry2"
                                    data={taxResidentCountryList}
                                    component={CustomReactSelectField}
                                    placeholder="..."
                                    onChange={this.onChange}
                                    dropdownWidth="410px"
                                    edit={!edit}
                                  />
                                </p>
                                <Text
                                  align="left"
                                  size="10px"
                                  color="#000000"
                                  weight="bold"
                                  opacity={0.4}
                                  style={{ paddingTop: 25 }}>
                                  TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                                </Text>
                                <RowGridLeft spacing={0} style={{ marginLeft: '5px' }}>
                                  {!edit && this.checkTaxResidentNoAndReason(2) && (
                                    <Text weight="bold" align="left" size="12px" color={Color.C_RED} style={{ paddingTop: 10 }}>
                                      Please select Yes or NO
                                    </Text>
                                  )}
                                </RowGridLeft>
                                <RowGridLeft spacing={0} style={{ marginLeft: '5px' }}>
                                  <Grid item xs={3}>
                                    <StyledRadioButton
                                      disabled={edit}
                                      checked={
                                        this.props.formState
                                          ? this.props.formState.values
                                            ? this.props.formState.values.isTaxResidentTaxIdentificationNumberAvailable2 === true
                                            : false
                                          : false
                                      }
                                      value="isTaxResidentTaxIdentificationNumberAvailable2"
                                      control={<Radio />}
                                      label="Yes"
                                      onChange={() => this.handleChangeIsTaxResidentTaxIdentificationNumberAvailable(2, true)}
                                    />
                                  </Grid>
                                  <Grid item xs={5}>
                                    <StyledRadioButton
                                      disabled={edit}
                                      checked={
                                        this.props.formState
                                          ? this.props.formState.values
                                            ? this.props.formState.values.isTaxResidentTaxIdentificationNumberAvailable2 === false
                                            : false
                                          : false
                                      }
                                      value="isTaxResidentTaxIdentificationNumberAvailable2"
                                      control={<Radio />}
                                      label="No"
                                      onChange={() => this.handleChangeIsTaxResidentTaxIdentificationNumberAvailable(2, false)}
                                    />
                                  </Grid>
                                </RowGridLeft>
                                {showTinInput2 === true ? (
                                  <p style={{ paddingTop: 23 }}>
                                    <StyledField
                                      disabled={edit}
                                      bgColor={!edit && 'white'}
                                      className={className}
                                      name="taxResidentTaxIdentificationNumber2"
                                      type="text"
                                      placeholder="..."
                                      label="Tax Identification Number"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      component={InputField}
                                      validate={
                                        cancelled ? false : [required, maxLength(maxLengthTaxResidentTaxIdentificationNumber)]
                                      }
                                      parse={(value) => {
                                        if (
                                          (value &&
                                            value.trim().length > 0 &&
                                            /^[0-9a-zA-Z\s]*$/.test(value) &&
                                            value.length <= maxLengthTaxResidentTaxIdentificationNumber) ||
                                          value === ''
                                        ) {
                                          return value;
                                        }
                                      }}
                                      edit={!edit}
                                    />
                                  </p>
                                ) : (
                                  <DisplayNoneField
                                    name="taxResidentTaxIdentificationNumber2"
                                    component={EmptyField}
                                    validate={false}
                                  />
                                )}
                                {showReasonInput2 === true ? (
                                  <React.Fragment>
                                    <Text align="left" size="10px" color="#000000" style={{ paddingTop: 10, width: '270px' }}>
                                      IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                                    </Text>
                                    <StyledField
                                      disabled={edit}
                                      bgColor={!edit && 'white'}
                                      className={className}
                                      label=""
                                      name="taxResidentTaxIdentificationNumberUnAvailableReason2"
                                      data={TaxResidentNoIDReasons}
                                      component={ReactSelectFieldCustom}
                                      placeholder="..."
                                      validate={cancelled ? false : this.verifyReason}
                                      onChange={() => this.handleReasonChange(2)}
                                      edit={!edit}
                                    />
                                    {showReasonExplanation2 ? (
                                      <React.Fragment>
                                        <Text
                                          align="left"
                                          size="12px"
                                          color={Color.C_LIGHT_BLUE}
                                          style={{ paddingTop: 15, width: '270px' }}>
                                          FOR REASON B, PLEASE EXPLAIN REASON OF ACCOUNT HOLDER UNABLE TO OBTAIN TIN OR EQUIVALENT
                                          NUMBER
                                        </Text>
                                        <StyledField
                                          disabled={edit}
                                          bgColor={!edit && 'white'}
                                          className={className}
                                          name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2"
                                          type="text"
                                          placeholder="Explanation"
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          component={InputField}
                                          validate={
                                            !cancelled ? [required, maxLength(maxLengthTaxResidentReasonExplanation)] : false
                                          }
                                          parse={(value) => {
                                            if (
                                              (value &&
                                                value.trim().length > 0 &&
                                                /^[0-9a-zA-Z\s]*$/.test(value) &&
                                                value.length <= maxLengthTaxResidentReasonExplanation) ||
                                              value === ''
                                            ) {
                                              return value;
                                            }
                                          }}
                                          edit={!edit}
                                        />
                                      </React.Fragment>
                                    ) : (
                                      <DisplayNoneField
                                        name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2"
                                        component={EmptyField}
                                        validate={false}
                                      />
                                    )}
                                  </React.Fragment>
                                ) : (
                                  <DisplayNoneField
                                    name="taxResidentTaxIdentificationNumberUnAvailableReason2"
                                    component={EmptyField}
                                    validate={false}
                                  />
                                )}
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <DisplayNoneField name="taxResidentCountry2" component={EmptyField} validate={false} />
                                <DisplayNoneField
                                  name="taxResidentTaxIdentificationNumberUnAvailableReason2"
                                  component={EmptyField}
                                  validate={false}
                                />
                                <DisplayNoneField
                                  name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2"
                                  component={EmptyField}
                                  validate={false}
                                />
                                <DisplayNoneField
                                  name="taxResidentTaxIdentificationNumber2"
                                  component={EmptyField}
                                  validate={false}
                                />
                              </React.Fragment>
                            )}
                          </Grid>
                          <Grid item xs={3}>
                            {this.props.formState && this.props.formState.values && this.state.numTaxResidentInfo > 2 ? (
                              <React.Fragment>
                                <Text weight="bold" align="left" size="14px" style={{ paddingTop: 30 }}>
                                  Tax Residence 3
                                </Text>
                                <p style={{ height: 60 }}>
                                  <StyledField
                                    disabled={edit}
                                    bgColor={!edit && 'white'}
                                    className={className}
                                    validate={cancelled ? false : required}
                                    label="COUNTRY / JURISDICATION OF TAX RESIDENT"
                                    name="taxResidentCountry3"
                                    data={taxResidentCountryList}
                                    component={CustomReactSelectField}
                                    placeholder="..."
                                    onChange={this.onChange}
                                    dropdownWidth="410px"
                                    edit={!edit}
                                  />
                                </p>
                                <Text
                                  align="left"
                                  size="10px"
                                  color="#000000"
                                  weight="bold"
                                  opacity={0.4}
                                  style={{ paddingTop: 25, width: '270px' }}>
                                  TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                                </Text>
                                <RowGridLeft spacing={0} style={{ marginLeft: '5px' }}>
                                  {!edit && this.checkTaxResidentNoAndReason(3) && (
                                    <Text weight="bold" align="left" size="12px" color={Color.C_RED} style={{ paddingTop: 10 }}>
                                      Please select Yes or NO
                                    </Text>
                                  )}
                                </RowGridLeft>
                                <RowGridLeft spacing={0} style={{ marginLeft: '5px' }}>
                                  <Grid item xs={3}>
                                    <StyledRadioButton
                                      disabled={edit}
                                      checked={
                                        this.props.formState
                                          ? this.props.formState.values
                                            ? this.props.formState.values.isTaxResidentTaxIdentificationNumberAvailable3 === true
                                            : false
                                          : false
                                      }
                                      value="isTaxResidentTaxIdentificationNumberAvailable3"
                                      control={<Radio />}
                                      label="Yes"
                                      onChange={() => this.handleChangeIsTaxResidentTaxIdentificationNumberAvailable(3, true)}
                                    />
                                  </Grid>
                                  <Grid item xs={5}>
                                    <StyledRadioButton
                                      disabled={edit}
                                      checked={
                                        this.props.formState
                                          ? this.props.formState.values
                                            ? this.props.formState.values.isTaxResidentTaxIdentificationNumberAvailable3 === false
                                            : false
                                          : false
                                      }
                                      value="isTaxResidentTaxIdentificationNumberAvailable3"
                                      control={<Radio />}
                                      label="No"
                                      onChange={() => this.handleChangeIsTaxResidentTaxIdentificationNumberAvailable(3, false)}
                                    />
                                  </Grid>
                                </RowGridLeft>
                                {showTinInput3 === true ? (
                                  <p style={{ paddingTop: 23 }}>
                                    <StyledField
                                      disabled={edit}
                                      bgColor={!edit && 'white'}
                                      className={className}
                                      name="taxResidentTaxIdentificationNumber3"
                                      type="text"
                                      placeholder="..."
                                      label="Tax Identification Number"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      component={InputField}
                                      validate={
                                        cancelled ? false : [required, maxLength(maxLengthTaxResidentTaxIdentificationNumber)]
                                      }
                                      parse={(value) => {
                                        if (
                                          (value &&
                                            value.trim().length > 0 &&
                                            /^[0-9a-zA-Z\s]*$/.test(value) &&
                                            value.length <= maxLengthTaxResidentTaxIdentificationNumber) ||
                                          value === ''
                                        ) {
                                          return value;
                                        }
                                      }}
                                      edit={!edit}
                                    />
                                  </p>
                                ) : (
                                  <DisplayNoneField
                                    name="taxResidentTaxIdentificationNumber3"
                                    component={EmptyField}
                                    validate={false}
                                  />
                                )}
                                {showReasonInput3 === true ? (
                                  <React.Fragment>
                                    <Text align="left" size="10px" color="#000000" style={{ paddingTop: 10, width: '270px' }}>
                                      IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                                    </Text>
                                    <StyledField
                                      disabled={edit}
                                      bgColor={!edit && 'white'}
                                      className={className}
                                      label=""
                                      name="taxResidentTaxIdentificationNumberUnAvailableReason3"
                                      data={TaxResidentNoIDReasons}
                                      component={ReactSelectFieldCustom}
                                      placeholder="..."
                                      validate={cancelled ? false : this.verifyReason}
                                      onChange={() => this.handleReasonChange(3)}
                                      edit={!edit}
                                    />
                                    {showReasonExplanation3 ? (
                                      <React.Fragment>
                                        <Text
                                          align="left"
                                          size="12px"
                                          color={Color.C_LIGHT_BLUE}
                                          style={{ paddingTop: 15, width: '270px' }}>
                                          FOR REASON B, PLEASE EXPLAIN REASON OF ACCOUNT HOLDER UNABLE TO OBTAIN TIN OR EQUIVALENT
                                          NUMBER
                                        </Text>
                                        <StyledField
                                          disabled={edit}
                                          bgColor={!edit && 'white'}
                                          className={className}
                                          name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3"
                                          type="text"
                                          placeholder="Explanation"
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          component={InputField}
                                          validate={
                                            !cancelled ? [required, maxLength(maxLengthTaxResidentReasonExplanation)] : false
                                          }
                                          parse={(value) => {
                                            if (
                                              (value &&
                                                value.trim().length > 0 &&
                                                /^[0-9a-zA-Z\s]*$/.test(value) &&
                                                value.length <= maxLengthTaxResidentReasonExplanation) ||
                                              value === ''
                                            ) {
                                              return value;
                                            }
                                          }}
                                          edit={!edit}
                                        />
                                      </React.Fragment>
                                    ) : (
                                      <DisplayNoneField
                                        name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3"
                                        component={EmptyField}
                                        validate={false}
                                      />
                                    )}
                                  </React.Fragment>
                                ) : (
                                  <DisplayNoneField
                                    name="taxResidentTaxIdentificationNumberUnAvailableReason3"
                                    component={EmptyField}
                                    validate={false}
                                  />
                                )}
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <DisplayNoneField name="taxResidentCountry3" component={EmptyField} validate={false} />
                                <DisplayNoneField
                                  name="taxResidentTaxIdentificationNumberUnAvailableReason3"
                                  component={EmptyField}
                                  validate={false}
                                />
                                <DisplayNoneField
                                  name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3"
                                  component={EmptyField}
                                  validate={false}
                                />
                                <DisplayNoneField
                                  name="taxResidentTaxIdentificationNumber3"
                                  component={EmptyField}
                                  validate={false}
                                />
                              </React.Fragment>
                            )}
                          </Grid>

                          <div style={{ width: '100%', marginTop: 15 }}>
                            <div style={{ display: 'table', margin: '0 auto' }}>
                              {((this.props.formState &&
                                this.props.formState.values &&
                                this.props.formState.values.numTaxResidentInfo == 2) ||
                                this.state.numTaxResidentInfo == 2) && (
                                <p>
                                  <Text
                                    align="left"
                                    size="14px"
                                    cursor={edit ? 'pointer' : 'not-allowed'}
                                    display="inline"
                                    color={Color.C_LIGHT_BLUE}
                                    style={{ width: '270px', textDecoration: 'underline', paddingRight: 20 }}
                                    onClick={!edit ? () => this.addTaxResidentInfo() : () => {}}>
                                    + Add Tax Residence
                                  </Text>
                                  <Text
                                    align="left"
                                    size="14px"
                                    cursor={!edit ? 'pointer' : 'not-allowed'}
                                    display="inline"
                                    color={Color.C_LIGHT_BLUE}
                                    style={{ width: '270px', textDecoration: 'underline' }}
                                    onClick={!edit ? () => this.removeTaxResidentInfo() : () => {}}>
                                    - Remove Tax Residence
                                  </Text>
                                </p>
                              )}
                              {((this.props.formState &&
                                this.props.formState.values &&
                                this.props.formState.values.numTaxResidentInfo == 1) ||
                                this.state.numTaxResidentInfo == 1) && (
                                <Text
                                  align="left"
                                  size="14px"
                                  cursor={edit ? 'pointer' : 'not-allowed'}
                                  display="inline"
                                  color={Color.C_LIGHT_BLUE}
                                  style={{ paddingTop: 20, width: '270px', textDecoration: 'underline' }}
                                  onClick={!edit ? () => this.addTaxResidentInfo() : () => {}}>
                                  + Add Tax Residence
                                </Text>
                              )}
                              {(this.state.numTaxResidentInfo == 3 ||
                                (this.props.formState &&
                                  this.props.formState.values &&
                                  this.props.formState.values.numTaxResidentInfo == 3)) && (
                                <Text
                                  align="left"
                                  size="14px"
                                  cursor={!edit ? 'pointer' : 'not-allowed'}
                                  display="inline"
                                  color={Color.C_LIGHT_BLUE}
                                  style={{ paddingTop: 20, width: '270px', textDecoration: 'underline' }}
                                  onClick={!edit ? () => this.removeTaxResidentInfo() : () => {}}>
                                  - Remove Tax Residence
                                </Text>
                                // </p>
                              )}
                            </div>
                          </div>
                        </Grid>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <DisplayNoneField name="PlaceandCountryBirth" component={EmptyField} validate={false} />
                        <DisplayNoneField name="taxResidentCountry1" component={EmptyField} validate={false} />
                        <DisplayNoneField
                          name="taxResidentTaxIdentificationNumberUnAvailableReason1"
                          component={EmptyField}
                          validate={false}
                        />
                        <DisplayNoneField
                          name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1"
                          component={EmptyField}
                          validate={false}
                        />
                        <DisplayNoneField name="taxResidentTaxIdentificationNumber1" component={EmptyField} validate={false} />
                      </React.Fragment>
                    )}
                    <Grid item xs={12} sm={12} style={{ marginTop: '-16px' }}>
                      <Text weight="bold" align="left" size="14px">
                        And I hereby declare and represent that I have checked all designations that may apply to me.
                      </Text>
                    </Grid>
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            </ContentItem>

            {/* ********
             * Employee Section
             ******** */}
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedEmploymentDetailSection}
                onChange={() => this.handleExpandCollapseSection('EMPLOYMENT_DETAIL')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text color="#1d1d26" weight="bold">
                    <BolderText>EMPLOYMENT DETAILS</BolderText>
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="flex-start" spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="companyName"
                        label="EMPLOYER NAME"
                        type="text"
                        width="100%"
                        component={InputField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        validate={cancelled ? false : [required, maxLength(maxLengthEmployeeName)]}
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && parseInt(value.length, 10) <= maxLengthEmployeeName) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="yearlyIncome"
                        select
                        width="100%"
                        component={CustomReactSelectField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        data={annualIncomeLOV}
                        label="ANNUAL INCOME"
                        margin="normal"
                        validate={cancelled ? false : required}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="occupationType"
                        select
                        width="100%"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={CustomReactSelectField}
                        label="OCCUPATION TYPE"
                        margin="normal"
                        data={Occupation}
                        validate={cancelled ? false : this.checkOccupationType}
                        onChange={this.onChangeOccupation}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit || this.state.isNatureOfBusinessDisable}
                        bgColor={edit ? '' : !this.state.isNatureOfBusinessDisable && 'white'}
                        className={className}
                        // showUnderline={!edit}
                        name="natureofbusiness"
                        select
                        InputLabelProps={{
                          shrink: true,
                        }}
                        width="100%"
                        component={CustomReactSelectField}
                        label="NATURE OF BUSINESS"
                        margin="normal"
                        data={Business}
                        validate={this.state.isNatureOfBusinessDisable ? false : this.checkNatureOfBusiness}
                        edit={this.state.isNatureOfBusinessDisable ? '' : !edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={
                          (Boolean(initialValues.purposeofinvestment) &&
                            initialValues.purposeofinvestment !== 'NULL' &&
                            hasPurposeOfInvestValueExistInDictionary) ||
                          edit
                        }
                        bgColor={
                          !(
                            (Boolean(initialValues.purposeofinvestment) &&
                              initialValues.purposeofinvestment !== 'NULL' &&
                              hasPurposeOfInvestValueExistInDictionary) ||
                            edit
                          ) && 'white'
                        }
                        className={className}
                        name="purposeofinvestment"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={CustomReactSelectField}
                        select
                        width="100%"
                        label="PURPOSE OF INVESTMENT"
                        margin="normal"
                        data={Purpose}
                        validate={cancelled ? false : this.checkPuposeOfInvestment}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={
                          (Boolean(initialValues.sourceoffunds) &&
                            initialValues.sourceoffunds !== 'NULL' &&
                            hasSourceofFundValueExistInDictionary) ||
                          edit
                        }
                        bgColor={
                          !(
                            (Boolean(initialValues.sourceoffunds) &&
                              initialValues.sourceoffunds !== 'NULL' &&
                              hasSourceofFundValueExistInDictionary) ||
                            edit
                          ) && 'white'
                        }
                        name="sourceoffunds"
                        select
                        width="100%"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={CustomReactSelectField}
                        data={SourceOfFunds}
                        label="SOURCE OF FUNDS"
                        margin="normal"
                        validate={cancelled ? false : this.checkSourceOfFunds}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="companyAddressLine1"
                        label="COMPANY ADDRESS 1"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [required, maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="companyAddressLine2"
                        label="COMPANY ADDRESS 2"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [required, maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="companyAddressLine3"
                        label="COMPANY ADDRESS 3"
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        margin="normal"
                        width="100%"
                        validate={cancelled ? false : [maxLength(maxLengthAddressLine)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="companyCountry"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={CustomReactSelectField}
                        select
                        label="COUNTRY OF COMPANY"
                        margin="normal"
                        width="100%"
                        data={CountryCor}
                        validate={cancelled ? false : required}
                        onChange={this.onChange}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="companyPostalCode"
                        label="COMPANY POST CODE"
                        component={InputField}
                        validate={this.state.isNatureOfBusinessDisable ? false : [required, maxLength(6)]}
                        parse={(value) => {
                          if ((value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= 6) || value === '') {
                            return value;
                          }
                        }}
                        onBlur={(e) => this.validatePostalCode(e, 'company')}
                        type="number"
                        width="100%"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {isCompanyFromMlOrSg && (
                        <StyledField
                          disabled={edit}
                          bgColor={!edit && 'white'}
                          className={className}
                          name="companyState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={CustomReactSelectField}
                          data={State}
                          isState
                          label="COMPANY STATE"
                          margin="normal"
                          width="100%"
                          validate={this.state.isNatureOfBusinessDisable ? false : [required, maxLength(15)]}
                          edit={!edit}
                        />
                      )}
                      {!isCompanyFromMlOrSg && (
                        <StyledField
                          disabled={edit}
                          bgColor={!edit && 'white'}
                          className={className}
                          name="companyState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={InputField}
                          label="COMPANY STATE"
                          width="100%"
                          margin="normal"
                          validate={this.state.isNatureOfBusinessDisable ? false : [required, maxLength(20)]}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                                value.length <= 20) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                          edit={!edit}
                        />
                      )}
                    </Grid>
                  </Grid>
                  {this.state.doShowPermanentCompanyAddCheckbox && (
                    <Grid container justify="flex-start" style={{ marginTop: 17 }}>
                      <Grid item xs={12} sm={6}>
                        <CheckboxField
                          onClick={this.toggleCompanyAddress}
                          value={this.state.isPermmanentAndCompanyAddSame}
                          disabled={edit}
                          className={className}
                          name="isPermmanentAndCompanyAddSame"
                          label="Update Company Address same as Permanent Address"
                        />
                      </Grid>
                    </Grid>
                  )}
                </StyledDetails>
              </StyledPanel>
            </ContentItem>

            {/* ********
             * Account details Section
             ******** */}
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedBankSection}
                onChange={() => this.handleExpandCollapseSection('BANK_DETAIL')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text color="#1d1d26" weight="bold">
                    <BolderText>ACCOUNT DETAILS</BolderText>
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="flex-start" spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="bankAcctName"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        className={'edit gray'}
                        component={InputField}
                        label="BANK ACCOUNT NAME (AS PER ID TYPE)"
                        width="100%"
                        margin="normal"
                        placeholder="..."
                        validate={cancelled ? false : [maxLength(maxLengthBankAccountName), zeroOnly]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[a-zA-Z@&\/.,\"(\)\-'\s]*$/.test(value) &&
                              parseInt(value.length, 10) <= maxLengthBankAccountName) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="bankName"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        component={CustomReactSelectField}
                        data={Banks}
                        isBank
                        label="BANK NAME"
                        width="100%"
                        margin="normal"
                        placeholder="..."
                        edit={!edit}
                        onChange={() => {
                          this.props.change('bankAcctNumber', '');
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="bankAcctNumber"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit || !this.props.formState.values.bankName}
                        bgColor={!edit && 'white'}
                        className={className}
                        component={InputField}
                        label="BANK ACCOUNT NUMBER"
                        width="100%"
                        margin="normal"
                        placeholder="..."
                        validate={cancelled ? false : [maxLength(maxLengthBankAccNumber), zeroOnly]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z\s]*$/.test(value) &&
                              value.length <= maxLengthBankAccNumber) ||
                            value === ''
                          ) {
                            this.checkForAccNumValidation(value);
                            return value;
                          }
                        }}
                        edit={!edit}
                      />
                      {this.state.accountNoErrMsg && <TextErrorBold>{this.state.accountNoErrMsg}</TextErrorBold>}
                    </Grid>
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            </ContentItem>
            {/*
            Section for Joint Account
             */}
            {this.checkIfJointHolderExists() && (
              <Field
                name={getJointAccountFieldName(getAccountNumbers(this.props.clientDetails.account))}
                component={JointAccountContainer}
                accountNumberList={getAccountNumbers(this.props.clientDetails.account)}
                edit={edit}
                handleJointAccountHolderName={this.handleJointAccountHolderName}
                jointAccountHolderArray={this.state.jointAccountHolderArray}
              />
            )}

            {/* ********
             * Additional details Section
             ******** */}
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedAdditionalDetailsSection}
                onChange={() => this.handleExpandCollapseSection('ADDITIONAL_DETAILS')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text color="#1d1d26" weight="bold">
                    <BolderText>ADDITIONAL DETAILS</BolderText>
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="flex-start" spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="monthlySavings"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        component={InputField}
                        label="MONTHLY SAVINGS"
                        width="100%"
                        margin="normal"
                        placeholder="..."
                        validate={cancelled ? false : [required, maxLength(maxLengthBankAccountName), zeroOnly]}
                        parse={(value) => {
                          let saving = value.trim();
                          if (saving.length > 1) {
                            saving = saving.substr(2, saving.length - 1);
                            saving = saving.replace(/,/g, '');
                          }
                          if (saving && saving.length > 0 && /^[0-9]*$/.test(saving)) {
                            const num = Number(saving);
                            if (num > maxMonthlySavingAmount) {
                              return 'RM' + numberWithCommas(maxMonthlySavingAmount);
                            }
                            return 'RM' + numberWithCommas(num);
                          }
                          if (saving.length > 0 && !isNaN(saving)) {
                            return 'RM' + numberWithCommas(saving.substr(0, saving.length - 1));
                          }
                          return null;
                        }}
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="noOfDependants"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        component={CustomReactSelectField}
                        label="NO. OF DEPENDANTS"
                        width="100%"
                        data={['0', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '> 10'].map((ele) => ({
                          description: String(ele),
                          codevalue: String(ele),
                        }))}
                        margin="normal"
                        placeholder="..."
                        edit={!edit}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        name="interests"
                        label="INTERESTS"
                        type="text"
                        width="100%"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        data={Interest}
                        component={CustomReactSelectField}
                        margin="normal"
                        validate={cancelled ? false : required}
                        edit={!edit}>
                        {Interest.map((option) => (
                          <MenuItem key={option.id} value={option.codevalue ? option.codevalue.toUpperCase() : null}>
                            {option.description ? option.description.toUpperCase() : ''}
                          </MenuItem>
                        ))}
                      </StyledField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="educationLevel"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        component={CustomReactSelectField}
                        label="EDUCATION LEVEL"
                        width="100%"
                        data={educationLevelLOV}
                        margin="normal"
                        placeholder="..."
                        edit={!edit}
                        validate={cancelled ? false : required}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="investmentExperience"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        component={CustomReactSelectField}
                        label="INVESTMENT EXPERIENCE"
                        width="100%"
                        data={investmentExperienceLOV}
                        margin="normal"
                        placeholder="..."
                        edit={!edit}
                        isMulti
                        validate={cancelled ? false : required}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledField
                        name="existingCommitments"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        bgColor={!edit && 'white'}
                        className={className}
                        component={CustomReactSelectField}
                        label="EXISTING COMMITMENTS"
                        width="100%"
                        data={existingCommitmentsLOV}
                        margin="normal"
                        placeholder="..."
                        edit={!edit}
                        isMulti
                        validate={cancelled ? false : required}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                      />
                    </Grid>
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            </ContentItem>
          </Grid>
        </Form>
        <PhotoGuideDialog
          isOpenDialogGuideUploadPhoto={this.state.isOpenDialogGuideUploadPhoto}
          showDialogGuideUploadPhoto={this.showDialogGuideUploadPhoto}
        />
        {this.state.amlaWarningModal && (
          <HighCategoryMessageModal
            isOpen={this.state.amlaWarningModal}
            data={null}
            navigateTo={this.navigateTo}
            fromPage={'Client Profile'}
            backButtonClick={(pathName) => this.backToCurrentPageClick(pathName)}
            isFromTransaction={false}
          />
        )}

        <EmailVerification
          isOpenDialogConfirmEmailResend={this.state.isOpenDialogConfirmEmailResend}
          openDialogConfirmEmailResend={this.openDialogConfirmEmailResend}
          account={this.props.clientDetails.account[0].AccEmail}
          newEmail={this.props.clientDetails.account[0].AccEmail}
          submitResendConfirmationEmail={this.submitResendConfirmationEmail}
        />
      </React.Fragment>
    );
  }
}

EditProfileFields.propTypes = {
  formState: PropTypes.object,
  change: PropTypes.func,
  initialValues: PropTypes.object,
  stateFromPostalCode: PropTypes.object,
  validatePostalCode: PropTypes.func,
  image: PropTypes.object,
  clientDetails: PropTypes.object,
  isRiskExpired: PropTypes.bool,
  idObj: PropTypes.object,
  checkPermanentCorrespondenceAddr: PropTypes.func,
  lov: PropTypes.object,
  clearUploadedUnsavedImages: PropTypes.func,
  blur: PropTypes.func,
  setProcessing: PropTypes.func,
  clearStateFromPostalCode: PropTypes.func,
  uploadPhoto: PropTypes.func,
  removePhoto: PropTypes.func,
  entireClientInfo: PropTypes.func,
  onSubmit: PropTypes.func,
  saveKWSPandCashDetails: PropTypes.func,
  handleEdit: PropTypes.func,
  reset: PropTypes.func,
  cancelled: PropTypes.bool,
  docs: PropTypes.array,
  uploadType: PropTypes.string,
  cashAccountCreatedSuccess: PropTypes.bool,
  kwspAccountCreatedSuccess: PropTypes.bool,
  processing: PropTypes.bool,
  kwspFormFields: PropTypes.object,
  uploadDocPhoto: PropTypes.func,
  onChangeField: PropTypes.func,
  handleCancel: PropTypes.func,
  history: PropTypes.object,
  editEmail: PropTypes.string,
  originalEmail: PropTypes.string,
  isBankAcctName: PropTypes.bool,
  clearCashKwspAccountCreatedStateValue: PropTypes.func,
  customerAddFunds: PropTypes.func,
  documentsUrl: PropTypes.object,
};

const mapStateToProps = (state) => ({
  formState: state.form.EditProfile, // <== Inject the form store itself
  stateFromPostalCode: state.onBoarding.stateFromPostalCode,
  processing: state.onBoarding.processing,
  image: state.onBoarding.image,
  kwspFormFields: state.form.KwspAccountTypeSelector,
});

function mapDispatchToProps(dispatch) {
  return {
    change: (name, value) => dispatch(change('EditProfile', name, value)),
    clearStateFromPostalCode: () => dispatch(clearStateFromPostalCode()),
    validatePostalCode: (payload) => dispatch(validatePostalCode(payload)),
    setProcessing: (payload) => dispatch(processing(payload)),
    removePhoto: (payload) => dispatch(removePhoto(payload)),
    uploadPhoto: (payload) => dispatch(uploadPhoto(payload)),
    uploadDocPhoto: (payload) => dispatch(uploadDocPhoto(payload)),
    clearCashKwspAccountCreatedStateValue: () => dispatch(clearCashKwspAccountCreatedStateValue()),
    clearUploadedUnsavedImages: () => dispatch(clearUploadedUnsavedImages()),
    saveKWSPandCashDetails: (payload) => dispatch(saveKWSPandCashDetails(payload)),
    saveDocumentsUrl: (payload) => dispatch(saveDocumentsUrl(payload)),
  };
}

const ReduxEditProfileForm = reduxForm({
  form: 'EditProfile', // a unique identifier for this form
  destroyOnUnmount: false,
  enableReinitialize: true,
  // asyncValidate,
})(EditProfileFields);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxEditProfileForm);
