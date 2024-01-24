import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import { reduxForm, change, reset } from 'redux-form';
import _isEmpty from 'lodash/isEmpty';
import _has from 'lodash/has';
import moment from 'moment';
import InputField from 'components/FormUtility/FormFields/InputField';
import DateField from 'components/FormUtility/FormFields/DateField';
// import DateField from '../../../containers/OnBoarding/Introduction/DateField';
import CheckboxField from 'components/FormUtility/FormFields/Checkbox';
import ReactSelectField from 'components/FormUtility/FormFields/ReactSelectField';
import ReactSelectLongField from 'components/FormUtility/FormFields/ReactSelectLongField';
import ReactSelectFieldCustom from 'components/FormUtility/FormFields/ReactSelectFieldCustom';
import EpfMembershipNumber from 'components/Kwsp/CustomComponents/EpfMembershipField';
import EffectiveDatePicker from 'components/Kwsp/CustomComponents/EffectiveDateField';
import ErrorModal from 'components/Kwsp/Modal/ErrorModal';
import { required, email, maxLength, validatePassportDate, zeroOnly } from 'components/FormUtility/FormValidators';
import {
  validatePostalCode,
  setCorrespondencePermanentEquality,
  clearStateFromPostalCode,
  disableNOB,
} from 'containers/OnBoarding/actions';
import { toast } from 'react-toastify';
import {
  GridHere,
  StyledField,
  HiddenField,
  ButtonContainer,
  StyledButton,
  StyledButton2,
  Form,
  GrayContainer,
  DisabledStyledField,
} from './styles';
import { DictionaryMapper } from './DictionaryMapper';
import Text from 'components/Text';
import downIcon from 'containers/Faq/images/down.svg';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import styled from 'styled-components';
import { primaryFont } from 'utils/StylesHelper/font';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';
import Color from 'utils/StylesHelper/color';
import { RowGridLeft } from 'components/GridContainer';
import ReactTooltip from 'react-tooltip';
import 'containers/App/style/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import onBoardingConstants from '../../../containers/OnBoarding/Utils/constants';

const maxLengthPostCode = 6;
const maxLengthCustomerName = 100;
const maxLengthIdNo = 12;
const maxLengthEmail = 60;
const maxLengthMobile = 20;
const maxLengthMotherMaidenName = 60;
const maxLengthIncomeTaxNumber = 20;
const defaultMaxLengthAddressLine = 40;
let maxLengthAddressLine1PermanentCountry = 40;
let maxLengthAddressLine1CorrespondenceAddress = 40;
let maxLengthAddressLine1CompanyAddress = 40;
let maxLengthAddressLine2PermanentCountry = 66;
let maxLengthAddressLine2CorrespondenceAddress = 40;
let maxLengthAddressLine2CompanyAddress = 66;
const maxLengthAddressCountryisMalaysia = 66; // when selected country is malaysia
const maxLengthAddressCountryisNotMalaysia = 66; // when selected country is malaysia
const maxLengthCompanyName = 40;
const maxLengthBankAccountName = 100;
const maxLengthState = 20;
const maxLengthBankAccNumber = 18;
const maxLengthTaxResidentReasonExplanation = 250;
const maxLengthTaxResidentTaxIdentificationNumber = 20;
const widthOfInputFieldContainer = '640px';
const codeValueOfTaxResidentReasonToInputExplanation = 'Reason B';

const ContentItem = styled.div`
  padding: 10px 0 10px 0;
  width: ${widthOfInputFieldContainer};
  margin-bottom: 10px;
`;

const CustomIcon = () => <img src={downIcon} alt="test" />;

const StyledPanel = styled(ExpansionPanel)`
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`;

const StyledDetails = styled(ExpansionPanelDetails)`
  flex-direction: column;
  font-family: ${primaryFont};
  border-top: 1px solid #ccc;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`;

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #000 !important;
  padding: 10px !important;
  opacity: 0.75 !important;
`;

const TextErrorBold = styled.p`
  font-size: 13px;
  color: ${Color.C_RED};
  text-align: left;
  font-weight: 900;
  margin-top: 4px;
`;

class PersonalDetailsFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPermanentCorrespondenceAddress: props.initialValues && props.initialValues.isPermanentCorrespondenceAddress,
      heightPermanentStateField: '135px',
      expandedPersonalDetailSection: null,
      expandedPermanentAddressSection: null,
      expandedCorrespondenceAddressSection: null,
      expandedEmploymentDetailSection: null,
      expandedCompanyAddressSection: null,
      expandedBankSection: null,
      expandedTaxResidentInfoSection: null,
      numTaxResidentInfo: props.initialValues.numTaxResidentInfo ? props.initialValues.numTaxResidentInfo : null,
      isAddOrRemoveTaxResidentInfoSectionAction: false,
      hideRemoveTaxResidentInfoSecrtion: null,
      isStudentSelected: false,
      isPermmanentAndCompanyAddSame: (props.initialValues && props.initialValues.isPermmanentAndCompanyAddSame) || false,
      doShowPermanentCompanyAddCheckbox: (props.initialValues && props.initialValues.doShowPermanentCompanyAddCheckbox) || false,
      checkCheckBoxIsTaxResidentOfOtherCountry:
        props && props.initialValues
          ? props.initialValues.isTaxResidentOfOtherCountry
          : props.draftDetails && props.draftDetails.isTaxResidentOfOtherCountry,
      isTaxResidentOfMalaysia: props.initialValues.isTaxResidentOfMalaysia,
      isDisabled:
        (props.initialValues && props.initialValues.nationality !== 'MY') ||
        (props.draftDetails && props.draftDetails.nationality !== 'MY'),
      NOBisDisable: props.NOBisDisable,
      accountNoErrMsg: '',
    };
    this.validatePostalCode = this.validatePostalCode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeOccupation = this.onChangeOccupation.bind(this);
    this.handleExpandCollapseSection = this.handleExpandCollapseSection.bind(this);
    this.handleChangeIsTaxResidentOfMalaysia = this.handleChangeIsTaxResidentOfMalaysia.bind(this);
    this.handleChangeIsTaxResidentTaxIdentificationNumberAvailable = this.handleChangeIsTaxResidentTaxIdentificationNumberAvailable.bind(
      this,
    );
    this.addTaxResidentInfo = this.addTaxResidentInfo.bind(this);
    this.removeTaxResidentInfo = this.removeTaxResidentInfo.bind(this);
    this.handleChangeIsTaxResidentOfOtherCountry = this.handleChangeIsTaxResidentOfOtherCountry.bind(this);
    this.toggleAddressCheckbox = this.toggleAddressCheckbox.bind(this);
    this.checkOccupationType = this.checkOccupationType.bind(this);
    this.checkNationality = this.checkNationality.bind(this);
    this.toggleCompanyAddress = this.toggleCompanyAddress.bind(this);
    this.handleIdNumberChange = this.handleIdNumberChange.bind(this);
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

  handleChangeIsTaxResidentTaxIdentificationNumberAvailable(
    taxResidentTaxIdentificationNumber,
    isTaxResidentTaxIdentificationNumberAvailable,
  ) {
    switch (taxResidentTaxIdentificationNumber) {
      case 1:
        this.props.change('isTaxResidentTaxIdentificationNumberAvailable1', isTaxResidentTaxIdentificationNumberAvailable);
        this.props.setTINAvailability(1, isTaxResidentTaxIdentificationNumberAvailable);
        break;
      case 2:
        this.props.change('isTaxResidentTaxIdentificationNumberAvailable2', isTaxResidentTaxIdentificationNumberAvailable);
        this.props.setTINAvailability(2, isTaxResidentTaxIdentificationNumberAvailable);
        break;
      case 3:
        this.props.change('isTaxResidentTaxIdentificationNumberAvailable3', isTaxResidentTaxIdentificationNumberAvailable);
        this.props.setTINAvailability(3, isTaxResidentTaxIdentificationNumberAvailable);
        break;
    }
  }

  handleExpandCollapseSection(section) {
    switch (section) {
      case 'PERSONAL_DETAIL':
        this.setState({
          expandedPersonalDetailSection: !this.state.expandedPersonalDetailSection,
        });
        break;
      case 'PERM_ADDR':
        this.setState({
          expandedPermanentAddressSection: !this.state.expandedPermanentAddressSection,
        });
        break;
      case 'CORR_ADDR':
        this.setState({
          expandedCorrespondenceAddressSection: !this.state.expandedCorrespondenceAddressSection,
        });
        break;
      case 'COMPANY_ADDR':
        this.setState({
          expandedCompanyAddressSection: !this.state.expandedCompanyAddressSection,
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
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stateFromPostalCode !== nextProps.stateFromPostalCode && nextProps.stateFromPostalCode) {
      if (_has(nextProps.stateFromPostalCode, 'permanent')) {
        if (_has(nextProps.stateFromPostalCode.permanent, 'error')) {
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
        // if (nextProps.stateFromPostalCode.permanent.state !== 'SGP') {

        // this.props.formState.values.permanentState =
        //   _has(nextProps.stateFromPostalCode, 'permanent') && nextProps.stateFromPostalCode.permanent.state;
        // } else {
        //   this.props.formState.values.permanentState = null;
        //   this.showToast('No available state on specific postal code!');
        // }
      }
      if (_has(nextProps.stateFromPostalCode, 'company')) {
        if (_has(nextProps.stateFromPostalCode.company, 'error')) {
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
        // this.props.formState.values.correspondenceState = nextProps.stateFromPostalCode.correspondence.state;
        if (_has(nextProps.stateFromPostalCode.correspondence, 'error')) {
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
      if (nextProps.formState.values.nationality && nextProps.formState.values.nationality !== 'MY') {
        // this.props.change('isTaxResidentOfOtherCountry', true);
        if (!this.props.formState.values.numTaxResidentInfo) {
          this.props.change('numTaxResidentInfo', 1);
          this.setState({
            numTaxResidentInfo: 1,
            checkCheckBoxIsTaxResidentOfOtherCountry: true,
          });
        }
      } else if (nextProps.isTaxResidentOfOtherCountry) {
        this.setState({
          numTaxResidentInfo: 1,
          checkCheckBoxIsTaxResidentOfOtherCountry: true,
        });
      }

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

      // for dynamiaclly changing the Bank Account Name
      if (this.props.formState.values.fullName !== nextProps.formState.values.fullName) {
        this.props.change('bankAcctName', nextProps.formState.values.fullName);
      }

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

  componentDidMount() {
    const { initialValues, draftDetails, formState } = this.props;
    if (initialValues && !_isEmpty(initialValues)) {
      // if (
      //   initialValues.permanentAddressLine1 &&
      //   initialValues.permanentAddressLine2 &&
      //   initialValues.permanentAddressLine1 === initialValues.permanentAddressLine2
      // ) {
      //   this.setState({
      //     isPermanentCorrespondenceAddress: true,
      //   });
      // }
      if (initialValues && initialValues.passportNumber) {
        this.props.change('passportNumber', initialValues.passportNumber);
      }
      if (initialValues && initialValues.identificationNumber) {
        this.props.change('identificationNumber', initialValues.identificationNumber);
      } else if (draftDetails && draftDetails.identificationNumber) {
        this.props.change('identificationNumber', draftDetails.identificationNumber);
      }

      if (initialValues && initialValues.passportIdentificationType) {
        this.props.change('passportIdentificationType', initialValues.passportIdentificationType);
      } else if (draftDetails && draftDetails.passportIdentificationType) {
        this.props.change('passportIdentificationType', draftDetails.passportIdentificationType);
      }

      if (initialValues && initialValues.identificationType) {
        this.props.change('identificationType', initialValues.identificationType);
      } else if (draftDetails && draftDetails.identificationType) {
        this.props.change('identificationType', draftDetails.identificationType);
      }
    }
    // this.props.change('numTaxResidentInfo', this.state.numTaxResidentInfo);
    if (this.props.formState && this.props.formState.values && this.props.formState.values.numTaxResidentInfo) {
      this.setState(
        {
          numTaxResidentInfo: this.props.formState.values.numTaxResidentInfo,
        },
        () => {},
      );
    }

    this.checkNationality();
  }

  onChange(e, value, prevValue, name) {
    const { values } = this.props.formState;

    if (name === 'permanentCountry') {
      // the StateFromPostalCode redux store need to be cleared. if not, when change postal code in permanent or company will affect each other.
      console.log('Correspon country', this.props.formState.values.correspondenceState);
      this.props.clearStateFromPostalCode();
      if (value !== 'MY') {
        maxLengthAddressLine1PermanentCountry = maxLengthAddressCountryisNotMalaysia;
        maxLengthAddressLine2PermanentCountry = maxLengthAddressCountryisNotMalaysia;

        if (this.props.formState && this.props.formState.values && this.props.formState.values.permanentAddressLine1) {
          if (this.props.formState.values.permanentAddressLine1.length > maxLengthAddressCountryisNotMalaysia) {
            this.props.change(
              'permanentAddressLine1',
              this.props.formState.values.permanentAddressLine1.substring(0, maxLengthAddressCountryisNotMalaysia),
            );
          }
        }

        if (this.props.formState && this.props.formState.values && this.props.formState.values.permanentAddressLine2) {
          if (this.props.formState.values.permanentAddressLine2.length > maxLengthAddressCountryisNotMalaysia) {
            this.props.change(
              'permanentAddressLine2',
              this.props.formState.values.permanentAddressLine2.substring(0, maxLengthAddressCountryisNotMalaysia),
            );
          }
        }
      } else {
        maxLengthAddressLine1PermanentCountry = defaultMaxLengthAddressLine;
        maxLengthAddressLine2PermanentCountry = defaultMaxLengthAddressLine;
      }

      if (value !== prevValue) {
        this.props.change('permanentPostalCode', null);
        this.props.change('permanentState', null);
        // this.props.change('permanentAddressLine1', null);
        // this.props.change('permanentAddressLine2', null);
        this.props.setCorrespondencePermanentEquality(false);
        this.setState({
          // isPermanentCorrespondenceAddress: false,
          heightPermanentStateField: '135px',
        });
      }
    }

    if (name === 'correspondenceCountry') {
      if (value !== 'MY') {
        maxLengthAddressLine1CorrespondenceAddress = maxLengthAddressCountryisNotMalaysia;
        maxLengthAddressLine2CorrespondenceAddress = maxLengthAddressCountryisNotMalaysia;
        if (this.props.formState && this.props.formState.values && this.props.formState.values.correspondenceAddressLine1) {
          if (this.props.formState.values.correspondenceAddressLine1.length > maxLengthAddressCountryisNotMalaysia) {
            this.props.change(
              'correspondenceAddressLine1',
              this.props.formState.values.correspondenceAddressLine1.substring(0, maxLengthAddressCountryisNotMalaysia),
            );
          }
        }
        if (this.props.formState && this.props.formState.values && this.props.formState.values.correspondenceAddressLine2) {
          if (this.props.formState.values.correspondenceAddressLine2.length > maxLengthAddressCountryisNotMalaysia) {
            this.props.change(
              'correspondenceAddressLine2',
              this.props.formState.values.correspondenceAddressLine2.substring(0, maxLengthAddressCountryisNotMalaysia),
            );
          }
        }
      } else {
        maxLengthAddressLine1CorrespondenceAddress = maxLengthAddressCountryisMalaysia;
        maxLengthAddressLine2CorrespondenceAddress = maxLengthAddressCountryisMalaysia;
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
        maxLengthAddressLine1CompanyAddress = maxLengthAddressCountryisNotMalaysia;
        maxLengthAddressLine2CompanyAddress = maxLengthAddressCountryisNotMalaysia;
        if (this.props.formState && this.props.formState.values && this.props.formState.values.companyAddressLine1) {
          if (this.props.formState.values.companyAddressLine1.length > maxLengthAddressCountryisNotMalaysia) {
            this.props.change(
              'companyAddressLine1',
              this.props.formState.values.companyAddressLine1.substring(0, maxLengthAddressCountryisNotMalaysia),
            );
          }
        }
        if (this.props.formState && this.props.formState.values && this.props.formState.values.companyAddressLine2) {
          if (this.props.formState.values.companyAddressLine2.length > maxLengthAddressCountryisNotMalaysia) {
            this.props.change(
              'companyAddressLine2',
              this.props.formState.values.companyAddressLine2.substring(0, maxLengthAddressCountryisNotMalaysia),
            );
          }
        }
      } else {
        maxLengthAddressLine1CompanyAddress = defaultMaxLengthAddressLine;
        maxLengthAddressLine2CompanyAddress = defaultMaxLengthAddressLine;
      }
      if (value !== prevValue) {
        this.props.change('companyPostalCode', null);
        this.props.change('companyState', null);
      }
    }

    if (name === 'taxResidentCountry1') {
      if (value === values.taxResidentCountry2 || value === values.taxResidentCountry3) {
        this.notify('Please do not select the same country of jurisdiction.');
        e.preventDefault();
        return false;
      }

      /* if (value === 'MY' && values.nationality !== 'MY') {
        this.showAlert ('Malaysian nationality only need to declare tax details for countries other than Malaysia.');
      } */
    }

    if (name === 'taxResidentCountry2') {
      if (value === values.taxResidentCountry1 || value === values.taxResidentCountry3) {
        this.notify('Please do not select the same country of jurisdiction.');
        e.preventDefault();
        return false;
      }
    }

    if (name === 'taxResidentCountry3') {
      if (value === values.taxResidentCountry1 || value === values.taxResidentCountry2) {
        this.notify('Please do not select the same country of jurisdiction.');
        e.preventDefault();
        return false;
      }
    }

    if (name === 'nationality') {
      this.setState(
        {
          isTaxResidentOfMalaysia: false,
          // checkCheckBoxIsTaxResidentOfOtherCountry: this.checkNationality(true),
        },
        () => {
          this.props.change('isTaxResidentOfMalaysia', this.state.isTaxResidentOfMalaysia);
          this.props.change('isTaxResidentOfOtherCountry', this.state.checkCheckBoxIsTaxResidentOfOtherCountry);
          this.checkNationality();
          this.clearTaxResidentInfo();
        },
      );
    }
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
      willUnmount: () => {
        // console.log('willUnmount');
      },
      childrenElement: () => <p></p>,
    });
  }

  checkOccupationType(value) {
    // 91 is housewife
    // 90 is retiree
    // -33 is unemployed. changed to 62 on 20191101 because CPAM was requesting changes on LOV
    let NOBisDisable;
    const occupationCodeChanged = true;
    let doShowPermanentCompanyAddCheckbox;
    const isPrevNOBDisabled = this.state.NOBisDisable;

    const { formState } = this.props;

    if (parseInt(value) === 23 || parseInt(value) === 91 || parseInt(value) === 90 || parseInt(value) === 62) {
      NOBisDisable = true;
      doShowPermanentCompanyAddCheckbox = true;
    } else {
      NOBisDisable = false;
      doShowPermanentCompanyAddCheckbox = false;
    }

    this.setState(
      {
        NOBisDisable,
        occupationCodeChanged,
        doShowPermanentCompanyAddCheckbox,
      },
      () => {
        if (NOBisDisable) {
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
  onChangeOccupation(e, value, prevValue, name) {
    this.checkOccupationType(value);
  }

  toggleCompanyAddress() {
    const { formState } = this.props;
    this.setState({ isPermmanentAndCompanyAddSame: !this.state.isPermmanentAndCompanyAddSame }, () => {
      this.props.change('isPermmanentAndCompanyAddSame', this.state.isPermmanentAndCompanyAddSame);
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

  showToast(message) {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  disableToday() {
    return (date) => Date.parse(date) < Date.parse(new Date());
  }

  handleChangeIsTaxResidentOfMalaysia() {
    this.setState(
      {
        isTaxResidentOfMalaysia: !this.props.formState.values.isTaxResidentOfMalaysia,
      },
      () => {
        this.props.change('isTaxResidentOfMalaysia', this.state.isTaxResidentOfMalaysia);
      },
    );
  }

  // handleChangeIsTaxResidentOfOtherCountry(event) {
  //   const { checkCheckBoxIsTaxResidentOfOtherCountry } = this.state;
  //   if (this.props.formState.values.nationality && this.props.formState.values.nationality !== 'MY') {
  //     this.props.change('isTaxResidentOfOtherCountry', true);
  //     if (!this.props.formState.values.numTaxResidentInfo) {
  //       this.props.change('numTaxResidentInfo', 1);
  //       this.setState({
  //         numTaxResidentInfo: 1,
  //         checkCheckBoxIsTaxResidentOfOtherCountry: !checkCheckBoxIsTaxResidentOfOtherCountry,
  //       });
  //     }
  //   } else {
  //     this.clearTaxResidentInfo();
  //     this.setState({
  //       numTaxResidentInfo: this.props.formState.values.isTaxResidentOfOtherCountry ? 0 : 1,
  //       checkCheckBoxIsTaxResidentOfOtherCountry: !checkCheckBoxIsTaxResidentOfOtherCountry,
  //     });
  //     this.props.change('numTaxResidentInfo', this.props.formState.values.isTaxResidentOfOtherCountry ? 0 : 1);
  //     this.props.change('isTaxResidentOfOtherCountry', !this.props.formState.values.isTaxResidentOfOtherCountry);

  //     if (this.props.formState.values.nationality === 'MY' && event.target.checked === true) {
  //       this.showAlert('Malaysian nationality only need to declare tax details for countries other than Malaysia.');
  //     }
  //   }
  // }

  handleOtherCountryCheckboxToggle() {
    const checkCheckBoxIsTaxResidentOfOtherCountry = this.checkNationality()
      ? true
      : !this.state.checkCheckBoxIsTaxResidentOfOtherCountry;
    const numTaxResidentInfo = checkCheckBoxIsTaxResidentOfOtherCountry ? 1 : 0;
    this.setState(
      {
        checkCheckBoxIsTaxResidentOfOtherCountry,
        numTaxResidentInfo,
      },
      () => {
        this.props.change('isTaxResidentOfOtherCountry', this.state.checkCheckBoxIsTaxResidentOfOtherCountry);
        this.props.change('numTaxResidentInfo', this.state.numTaxResidentInfo);
      },
    );
  }

  handleChangeIsTaxResidentOfOtherCountry(event) {
    if (!this.props.formState.values.numTaxResidentInfo) {
      this.props.change('numTaxResidentInfo', 1);
      this.setState({
        numTaxResidentInfo: 1,
      });
    }

    this.handleOtherCountryCheckboxToggle();

    if (this.props.formState.values.nationality && this.props.formState.values.nationality !== 'MY') {
      if (this.state.checkCheckBoxIsTaxResidentOfOtherCountry) {
        if (!this.state.numTaxResidentInfo) {
          this.props.change('numTaxResidentInfo', this.state.numTaxResidentInfo + 1);
          this.setState({
            numTaxResidentInfo: this.state.numTaxResidentInfo + 1,
          });
        }
      }
    } else {
      this.props.change('numTaxResidentInfo', this.props.formState.values.isTaxResidentOfOtherCountry ? 0 : 1);
      this.setState({ checkCheckBoxIsTaxResidentOfOtherCountry: !this.state.checkCheckBoxIsTaxResidentOfOtherCountry });

      if (this.props.formState.values.nationality === 'MY' && event.target.checked === true) {
        this.showAlert('Malaysian nationality only need to declare tax details for countries other than Malaysia.');
      }
    }

    this.state.isTaxResidentOfOtherCountry ? null : this.clearTaxResidentInfo();
  }

  addTaxResidentInfo() {
    this.setState({
      isAddOrRemoveTaxResidentInfoSectionAction: true,
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
          this.props.change('taxResidentCountry3', null);
          this.props.change('isTaxResidentTaxIdentificationNumberAvailable3', null);
          this.props.change('taxResidentTaxIdentificationNumber3', null);
          this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason3', null);
          this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3', null);

          if (this.state.numTaxResidentInfo < 2) {
            this.props.change('taxResidentCountry2', null);
            this.props.change('isTaxResidentTaxIdentificationNumberAvailable2', null);
            this.props.change('taxResidentTaxIdentificationNumber2', null);
            this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason2', null);
            this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2', null);
          }
        },
      );
    }
  }

  clearTaxResidentInfo() {
    this.props.change('taxResidentCountryOfBirth', null);
    this.props.change('taxResidentCountry1', null);
    this.props.change('taxResidentCountry2', null);
    this.props.change('taxResidentCountry3', null);
    this.props.change('isTaxResidentTaxIdentificationNumberAvailable1', null);
    this.props.change('isTaxResidentTaxIdentificationNumberAvailable2', null);
    this.props.change('isTaxResidentTaxIdentificationNumberAvailable3', null);
    this.props.change('taxResidentTaxIdentificationNumber1', null);
    this.props.change('taxResidentTaxIdentificationNumber2', null);
    this.props.change('taxResidentTaxIdentificationNumber3', null);
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason1', null);
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason2', null);
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReason3', null);
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1', null);
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2', null);
    this.props.change('taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3', null);
    // this.props.change('numTaxResidentInfo', 0);
    // this.setState({
    //   checkCheckBoxIsTaxResidentOfOtherCountry: false,
    // })
  }
  toggleAddressCheckbox() {
    const { formState } = this.props;
    this.props.change('isPermanentCorrespondenceAddress', !this.state.isPermanentCorrespondenceAddress);
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

  checkNationality() {
    const { formState, insidePersonalDetails } = this.props;
    let declarationB;

    if (insidePersonalDetails) {
      if (formState && formState.values) {
        // if (!this.state.checkCheckBoxIsTaxResidentOfOtherCountry) {
        const isChecked = formState.values.nationality !== 'MY';
        this.setState(
          {
            // checkCheckBoxIsTaxResidentOfOtherCountry: isChecked,
            isDisabled: isChecked,
          },
          () => {
            declarationB = isChecked;
          },
        );
        return declarationB;
      }
    }
  }

  checkIfIdTypeNRIC() {
    return this.props.initialValues.identificationType === 'NRIC';
  }

  handleIdNumberChange(element) {
    const idNumber = element.target.value;
    if (idNumber && idNumber.length === 12) {
      this.props.setDateOfBirth(idNumber, this.props.formState);
    }
  }

  checkForAccNumValidation(value) {
    const { lov, formState } = this.props;

    const Banks = lov.Dictionary && lov.Dictionary[19].datadictionary;

    const selectedBank = Banks.find((b) => b.codevalue === formState.values.bankName);

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
    const {
      handleSubmit,
      invalid,
      edit,
      formState,
      uploadType,
      lov: { Dictionary },
      handleSaveDraft,
      draftDetails,
      setTINAvailability,
      initialValues,
    } = this.props;
    const { isStudentSelected, checkCheckBoxIsTaxResidentOfOtherCountry, isDisabled } = this.state;
    const className = edit ? 'edit' : '';
    const { ageErrorMessage } = onBoardingConstants;

    const hasValues = formState && !_isEmpty(formState.values);
    const isUserFromMlOrSg = hasValues && formState.values.permanentCountry === 'MY';
    const isCorrespondenceFromMlOrSg = hasValues && formState.values.correspondenceCountry === 'MY';
    const isCompanyFromMlOrSg = hasValues && formState.values.companyCountry === 'MY';
    const ageMaxDate = moment().subtract(18, 'years');

    if (hasValues && uploadType === 'Passport') {
      // uncomment if you want to highlight error message immediately
      // this.props.blur('passportNumber');
      // this.props.blur('expiryDate');
      formState.values.passportIdentificationType = 'PSPORT';
    }
    // clear state field always
    if (hasValues && !isUserFromMlOrSg) {
      formState.values.state = null;
    }

    const {
      AnnualIncomeLOV,
      IdTypes,
      Occupation,
      SourceOfFunds,
      State,
      Business,
      Nationality,
      Country,
      Purpose,
      Interest,
      Gender,
      Title,
      MaritalStatus,
      Race,
      Banks,
      CountryCor,
      TaxResidentNoIDReasons,
      CountriesWithNoMY,
      CountriesCwaCrs,
    } = DictionaryMapper(Dictionary);

    let selectedReason1 = null,
      selectedReason2 = null,
      selectedReason3 = null,
      // checkCheckBoxIsTaxResidentOfOtherCountry = false,
      showTinInput1 = false,
      showReasonInput1 = false,
      showTinInput2 = false,
      showReasonInput2 = false,
      showTinInput3 = false,
      showReasonInput3 = false,
      showReasonExplanation1 = false,
      showReasonExplanation2 = false,
      showReasonExplanation3 = false,
      isTaxResidentOfMalaysia = null,
      isTaxResidentOfOtherCountry = null,
      isTaxResidentTaxIdentificationNumberAvailable1 = null,
      isTaxResidentTaxIdentificationNumberAvailable2 = null,
      isTaxResidentTaxIdentificationNumberAvailable3 = null,
      enabledNextButton = true,
      taxResidentCountryList = [],
      formattedTaxResidents = [];

    if (this.props.formState && this.props.formState.values) {
      const { values } = this.props.formState;

      // console.log('PROPS FORM', this.props.formState.values.permanentCountry)

      if (values.taxResidentTaxIdentificationNumberUnAvailableReason1) {
        selectedReason1 = TaxResidentNoIDReasons.filter(
          (data) => data.codevalue === values.taxResidentTaxIdentificationNumberUnAvailableReason1,
        );
        selectedReason1 = selectedReason1[0].description;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason2) {
        selectedReason2 = TaxResidentNoIDReasons.filter(
          (data) => data.codevalue === values.taxResidentTaxIdentificationNumberUnAvailableReason2,
        );
        selectedReason2 = selectedReason2[0].description;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason3) {
        selectedReason3 = TaxResidentNoIDReasons.filter(
          (data) => data.codevalue === values.taxResidentTaxIdentificationNumberUnAvailableReason3,
        );
        selectedReason3 = selectedReason3[0].description;
      }
      if (values.isTaxResidentTaxIdentificationNumberAvailable1 === true) {
        showTinInput1 = true;
      }
      if (values.isTaxResidentTaxIdentificationNumberAvailable1 === false) {
        showReasonInput1 = true;
      }
      if (values.isTaxResidentTaxIdentificationNumberAvailable2 === true) {
        showTinInput2 = true;
      }
      if (values.isTaxResidentTaxIdentificationNumberAvailable2 === false) {
        showReasonInput2 = true;
      }
      if (values.isTaxResidentTaxIdentificationNumberAvailable3 === true) {
        showTinInput3 = true;
      }
      if (values.isTaxResidentTaxIdentificationNumberAvailable3 === false) {
        showReasonInput3 = true;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason1 === codeValueOfTaxResidentReasonToInputExplanation) {
        showReasonExplanation1 = true;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason2 === codeValueOfTaxResidentReasonToInputExplanation) {
        showReasonExplanation2 = true;
      }
      if (values.taxResidentTaxIdentificationNumberUnAvailableReason3 === codeValueOfTaxResidentReasonToInputExplanation) {
        showReasonExplanation3 = true;
      }
      // if (values.isTaxResidentOfOtherCountry) {
      //   checkCheckBoxIsTaxResidentOfOtherCountry = true;
      // } else {
      //   checkCheckBoxIsTaxResidentOfOtherCountry = false;
      // }
      if (values.isTaxResidentOfMalaysia) {
        isTaxResidentOfMalaysia = true;
      }
      if (values.isTaxResidentOfOtherCountry) {
        isTaxResidentOfOtherCountry = true;
        if (values.isTaxResidentTaxIdentificationNumberAvailable1) {
          isTaxResidentTaxIdentificationNumberAvailable1 = true;
        }
        if (values.isTaxResidentTaxIdentificationNumberAvailable2) {
          isTaxResidentTaxIdentificationNumberAvailable2 = true;
        }
        if (values.isTaxResidentTaxIdentificationNumberAvailable3) {
          isTaxResidentTaxIdentificationNumberAvailable3 = true;
        }
        if (values.isTaxResidentTaxIdentificationNumberAvailable1 === null) {
          enabledNextButton = false;
        }
        if (values.numTaxResidentInfo == 1 && values.isTaxResidentOfOtherCountry && values.taxResidentCountry1 === 'MY') {
          enabledNextButton = false;
        }
        if (values.numTaxResidentInfo == 2 && values.isTaxResidentTaxIdentificationNumberAvailable2 === null) {
          enabledNextButton = false;
        }
        if (values.numTaxResidentInfo == 3 && values.isTaxResidentTaxIdentificationNumberAvailable3 === null) {
          enabledNextButton = false;
        }
        if (
          values.numTaxResidentInfo == 1 &&
          values.isTaxResidentOfOtherCountry &&
          values.nationality !== 'MY' &&
          values.taxResidentCountry1 === 'MY'
        ) {
          enabledNextButton = true;
        }

        if (values.isTaxResidentTaxIdentificationNumberAvailable1 !== null) {
          isTaxResidentTaxIdentificationNumberAvailable1 = values.isTaxResidentTaxIdentificationNumberAvailable1;
        }
        if (values.isTaxResidentTaxIdentificationNumberAvailable2 !== null) {
          isTaxResidentTaxIdentificationNumberAvailable2 = values.isTaxResidentTaxIdentificationNumberAvailable2;
        }
        if (values.isTaxResidentTaxIdentificationNumberAvailable3 !== null) {
          isTaxResidentTaxIdentificationNumberAvailable3 = values.isTaxResidentTaxIdentificationNumberAvailable3;
        }
      }

      if (values.nationality !== 'MY') {
        // (values.nationality === 'MY' && values.isTaxResidentOfMalaysia && values.isTaxResidentOfOtherCountry)) {
        taxResidentCountryList = CountriesCwaCrs;
      } else {
        taxResidentCountryList = CountriesWithNoMY;
      }

      const occupationTypeValue = values.occupationType;

      if (occupationTypeValue == 91 || occupationTypeValue == 90 || occupationTypeValue == 62 || occupationTypeValue == 23) {
        this.props.disableNOB(true);
      } else {
        this.props.disableNOB(false);
      }

      if (
        (values && values.isTaxResidentOfOtherCountryInfo) ||
        (draftDetails || {}).isTaxResidentOfOtherCountryInfo ||
        this.state.checkCheckBoxIsTaxResidentOfOtherCountry
      ) {
        for (let index = 0; index < this.state.numTaxResidentInfo; index += 1) {
          if (draftDetails) {
            formattedTaxResidents.push({
              no: index + 1,
              CountryJurisdiction:
                values[`taxResidentCountry${index + 1}`] ||
                draftDetails[`taxResidentCountry${index + 1}`] ||
                initialValues[`taxResidentCountry${index + 1}`],
              IncomeTax:
                values[`taxResidentTaxIdentificationNumber${index + 1}`] ||
                draftDetails[`taxResidentTaxIdentificationNumber${index + 1}`] ||
                initialValues[`taxResidentTaxIdentificationNumber${index + 1}`],
              ReasonTINNotAvailable:
                values[`taxResidentTaxIdentificationNumberUnAvailableReason${index + 1}`] ||
                draftDetails[`taxResidentTaxIdentificationNumberUnAvailableReason${index + 1}`] ||
                initialValues[`taxResidentTaxIdentificationNumberUnAvailableReason${index + 1}`],
              RemarksReason:
                values[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${index + 1}`] ||
                draftDetails[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${index + 1}`] ||
                initialValues[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${index + 1}`],
            });
          }
        }
      }

      // console.log('TAX RESIDENT', formattedTaxResidents, values);

      formattedTaxResidents.map((item, index) => {
        () => {
          setTINAvailability(index + 1, values[`isTaxResidentTaxIdentificationNumberAvailable${index + 1}`]);
        };
      });
    }
    return (
      <Form onSubmit={handleSubmit} autoComplete="off">
        <HiddenField component={InputField} name="numTaxResidentInfo" />
        <ErrorModal
          msg={ageErrorMessage}
          handleClose={this.props.handleAgeEligibilityPopUp}
          open={this.props.showAgeEligibilityPopUp}
          showClose
        />
        {/** **********************
         *
         * Personal Details Section
         *
         *********************** */}
        <Grid container justify="center" spacing={24} style={{ marginTop: -50 }}>
          <ContentItem>
            {!edit ? (
              <StyledPanel
                expanded={this.state.expandedPersonalDetailSection}
                onChange={() => this.handleExpandCollapseSection('PERSONAL_DETAIL')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text color="#1d1d26" weight="bold">
                    Personal Details
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  {uploadType === 'Passport' && (
                    <Grid container justify="center" spacing={24} style={{ marginTop: 10 }}>
                      <GridHere item>
                        <StyledField
                          name="fullName"
                          label="FULL NAME (as per ID Type)"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[a-zA-Z@&\/.,\"(\)\-'`\s]*$/.test(value) &&
                                parseInt(value.length, 10) <= maxLengthCustomerName) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                          className={className}
                          disabled={edit}
                          component={InputField}
                          placeholder="..."
                          validate={[required, maxLength(100)]}
                        />
                      </GridHere>
                      <GridHere item>
                        <StyledField
                          disabled={edit}
                          className={className}
                          validate={required}
                          label="TITLE"
                          name="title"
                          data={Title}
                          component={ReactSelectField}
                          placeholder="..."
                        />
                      </GridHere>
                    </Grid>
                  )}
                  {uploadType === 'IC' && (
                    <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                      <GridHere item>
                        <StyledField
                          name="fullName"
                          label="FULL NAME (as per ID Type)"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[a-zA-Z@&\/.,\"(\)\-'`\s]*$/.test(value) &&
                                parseInt(value.length, 10) <= maxLengthCustomerName) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                          className={className}
                          disabled={edit}
                          component={InputField}
                          placeholder="..."
                          validate={[required, maxLength(100)]}
                          // edit
                        />
                      </GridHere>
                      <GridHere item>
                        <StyledField
                          disabled={edit}
                          className={className}
                          validate={required}
                          label="TITLE"
                          name="title"
                          data={Title}
                          component={ReactSelectField}
                          placeholder="..."
                        />
                      </GridHere>
                    </Grid>
                  )}
                  {uploadType === 'Passport' && (
                    <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                      <GridHere item>
                        <StyledField
                          disabled
                          showUnderline={!edit}
                          className={className}
                          validate={required}
                          label="ID TYPE"
                          name="passportIdentificationType"
                          data={IdTypes}
                          component={ReactSelectField}
                          placeholder="Select id type"
                          borderBottomField={!edit ? '1px solid rgba(29, 29, 38, .5)' : '0px'}
                          lineHeightLabel={0.2}
                        />
                      </GridHere>
                      <GridHere item>
                        <StyledField
                          name="passportNumber"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[a-zA-Z0-9\s]*$/.test(value) &&
                                value.length <= maxLengthIdNo) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                          disabled={edit}
                          className={className}
                          component={InputField}
                          label="PASSPORT NUMBER"
                          type="text"
                          placeholder="..."
                          validate={[required, maxLength(maxLengthIdNo), zeroOnly]}
                        />
                      </GridHere>
                    </Grid>
                  )}
                  {uploadType === 'IC' && (
                    <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                      <GridHere item>
                        <StyledField
                          showUnderline={!edit}
                          disabled
                          className={className}
                          validate={required}
                          label="ID TYPE"
                          name="identificationType"
                          data={IdTypes}
                          uploadType="IC"
                          component={ReactSelectField}
                          placeholder="Select id type"
                          borderBottomField={!edit ? '1px solid rgba(29, 29, 38, .5)' : '0px'}
                          lineHeightLabel={0.2}
                        />
                      </GridHere>
                      <GridHere item>
                        <StyledField
                          name="identificationNumber"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled={edit}
                          className={className}
                          component={InputField}
                          label="ID NUMBER"
                          type="text"
                          placeholder="..."
                          onChange={this.handleIdNumberChange}
                          validate={[required, maxLength(maxLengthIdNo), zeroOnly]}
                          edit
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[a-zA-Z0-9]*$/.test(value) &&
                                value.length <= maxLengthIdNo) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                        />
                      </GridHere>
                    </Grid>
                  )}
                  {uploadType === 'Passport' && (
                    <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                      <GridHere item>
                        <StyledField
                          showUnderline={!edit}
                          disabled={edit}
                          className={className}
                          name="expiryDate"
                          maxDateMessage="Must be later than today"
                          label="PASSPORT EXPIRATION"
                          width="137.8px"
                          validate={[required, validatePassportDate]}
                          component={DateField}
                          disablePast
                          shouldDisableDate={(date) => Date.parse(date) < Date.parse(new Date())}
                          placeholder="DD/MM/YYYY"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </GridHere>
                      <GridHere item>
                        <StyledField
                          disabled={edit}
                          className={className}
                          name="expiryDateVisa"
                          maxDateMessage="Must be later than today"
                          label="VISA EXPIRATION"
                          width="137.8px"
                          validate={[required, validatePassportDate]}
                          component={DateField}
                          disablePast
                          shouldDisableDate={this.disableToday()}
                          placeholder="DD/MM/YYYY"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </GridHere>
                    </Grid>
                  )}
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="RACE"
                        name="race"
                        data={Race}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="MARITAL STATUS"
                        name="maritalStatus"
                        data={MaritalStatus}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="GENDER"
                        name="gender"
                        data={Gender}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                    <GridHere item>
                      <DisabledStyledField
                        disabled={edit || this.checkIfIdTypeNRIC()}
                        className={className}
                        name="dateOfBirth"
                        // maxDate={ageMaxDate}
                        // maxDateMessage="Must be 18 or older."
                        label="DATE OF BIRTH"
                        width="137.8px"
                        validate={required}
                        component={DateField}
                        placeholder="DD/MM/YYYY"
                        borderBottomField={!edit ? '1px solid rgba(29, 29, 38, .5)' : '0px'}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="email"
                        label="EMAIL ADDRESS"
                        type="email"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        validate={[required, email, maxLength(maxLengthEmail)]}
                        component={InputField}
                        parse={(value) => {
                          if ((value && value.trim().length > 0 && value.length <= maxLengthEmail) || value === '') {
                            return value;
                          }
                        }}
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="mobileNo"
                        placeholder="..."
                        label="MOBILE NUMBER"
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= maxLengthMobile) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[required, maxLength(20), zeroOnly]}
                      />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="motherMaidenName"
                        label="MOTHER MAIDEN NAME"
                        placeholder="..."
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[a-zA-Z@&\/.,\"(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthMotherMaidenName) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[required, maxLength(100)]}
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="incomeTaxNumber"
                        label="INCOME TAX NUMBER"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(50)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z\s]*$/.test(value) &&
                              value.length <= maxLengthIncomeTaxNumber) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="INTERESTS"
                        name="interests"
                        data={Interest}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="NATIONALITY"
                        name="nationality"
                        data={Nationality}
                        component={ReactSelectField}
                        placeholder="..."
                        onChange={this.onChange}
                      />
                    </GridHere>
                    <GridHere item>
                      {this.props.initialValues.isKwsp ? (
                        <EpfMembershipNumber isEpfVisible />
                      ) : (
                        <HiddenField component={InputField} />
                      )}
                    </GridHere>
                  </Grid>
                  {this.props.initialValues.isIslamic ? (
                    <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                      <GridHere item>
                        <HiddenField component={InputField} />
                      </GridHere>
                      <GridHere item></GridHere>
                    </Grid>
                  ) : null}
                </StyledDetails>
              </StyledPanel>
            ) : (
              <React.Fragment>
                <Grid container justify="center" spacing={24}>
                  <Grid item xs={12}>
                    <Text color="#000000" weight="bold" align="left" size="14px" weight="bold" style={{ marginLeft: 28 }}>
                      Personal Details
                    </Text>
                  </Grid>
                </Grid>
                {uploadType === 'Passport' && (
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        name="fullName"
                        label="FULL NAME (as per ID Type)"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={className}
                        disabled={edit}
                        component={InputField}
                        placeholder="..."
                        // edit
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="TITLE"
                        name="title"
                        data={Title}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                  </Grid>
                )}
                {uploadType === 'IC' && (
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        name="fullName"
                        label="FULL NAME (as per ID Type)"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={className}
                        disabled={edit}
                        component={InputField}
                        placeholder="..."
                        // edit
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        label="TITLE"
                        name="title"
                        data={Title}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                  </Grid>
                )}
                {uploadType === 'Passport' && (
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        disabled
                        showUnderline={!edit}
                        className={className}
                        label="ID TYPE"
                        name="passportIdentificationType"
                        data={IdTypes}
                        component={ReactSelectField}
                        placeholder="Select id type"
                        borderBottomField={!edit ? '1px solid rgba(29, 29, 38, .5)' : '0px'}
                        lineHeightLabel={0.2}
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        name="passportNumber"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        className={className}
                        component={InputField}
                        label="PASSPORT NUMBER"
                        type="text"
                        placeholder="..."
                      />
                    </GridHere>
                  </Grid>
                )}
                {uploadType === 'IC' && (
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        showUnderline={!edit}
                        disabled
                        className={className}
                        label="ID TYPE"
                        name="identificationType"
                        data={IdTypes}
                        uploadType="IC"
                        component={ReactSelectField}
                        placeholder="Select id type"
                        borderBottomField={!edit ? '1px solid rgba(29, 29, 38, .5)' : '0px'}
                        lineHeightLabel={0.2}
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        name="identificationNumber"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={edit}
                        className={className}
                        component={InputField}
                        label="ID NUMBER"
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && /^[a-zA-Z0-9]*$/.test(value) && value.length <= maxLengthIdNo) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        type="text"
                        edit
                        placeholder="..."
                      />
                    </GridHere>
                  </Grid>
                )}
                {uploadType === 'Passport' && (
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        showUnderline={!edit}
                        disabled={edit}
                        className={className}
                        name="expiryDate"
                        label="PASSPORT EXPIRATION"
                        width="137.8px"
                        component={DateField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="expiryDateVisa"
                        label="VISA EXPIRATION"
                        width="137.8px"
                        component={DateField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </GridHere>
                  </Grid>
                )}
                <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="RACE"
                      name="race"
                      data={Race}
                      component={ReactSelectField}
                      placeholder="..."
                    />
                  </GridHere>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="MARITAL STATUS"
                      name="maritalStatus"
                      data={MaritalStatus}
                      component={ReactSelectField}
                      placeholder="..."
                    />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="GENDER"
                      name="gender"
                      data={Gender}
                      component={ReactSelectField}
                      placeholder="..."
                    />
                  </GridHere>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="dateOfBirth"
                      label="DATE OF BIRTH"
                      width="137.8px"
                      component={DateField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="email"
                      label="EMAIL ADDRESS"
                      type="email"
                      placeholder="..."
                      edit
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                    />
                  </GridHere>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="mobileNo"
                      placeholder="..."
                      label="MOBILE NUMBER"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                    />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="motherMaidenName"
                      label="MOTHER MAIDEN NAME"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                    />
                  </GridHere>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="INTERESTS"
                      name="interests"
                      data={Interest}
                      component={ReactSelectField}
                    />
                  </GridHere>
                  {/*
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="incomeTaxNumber"
                      label="INCOME TAX NUMBER"
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                      style={{ display: 'none'}}
                    />
                  </GridHere>
                  */}
                </Grid>
                <Grid container justify="center" spacing={24} style={{ marginTop: 15, marginBottom: 15 }}>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="NATIONALITY"
                      name="nationality"
                      data={Nationality}
                      component={ReactSelectField}
                    />
                  </GridHere>
                  <GridHere item>
                    {this.props.initialValues.isKwsp ? (
                      <EpfMembershipNumber isEpfVisible edit={edit} disabled={edit} />
                    ) : (
                      <HiddenField component={InputField} />
                    )}
                  </GridHere>
                </Grid>
                {this.props.initialValues.isIslamic ? (
                  <Grid container justify="center" spacing={24}>
                    <GridHere item>
                      <HiddenField component={InputField} />
                    </GridHere>
                    <GridHere item></GridHere>
                  </Grid>
                ) : null}
              </React.Fragment>
            )}
          </ContentItem>
        </Grid>
        {/** **********************
         *
         * Permanent Address Section
         *
         *********************** */}
        {!edit ? (
          <Grid container justify="center" spacing={24}>
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedPermanentAddressSection}
                onChange={() => this.handleExpandCollapseSection('PERM_ADDR')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text weight="bold" align="left">
                    Permanent Address
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="permanentAddressLine1"
                        label="ADDRESS"
                        type="text"
                        placeholder=""
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[required, maxLength(maxLengthAddressLine1PermanentCountry)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1PermanentCountry) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                      />
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="permanentAddressLine2"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[required, maxLength(maxLengthAddressLine1PermanentCountry)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1PermanentCountry) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20 }}
                      />
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="permanentAddressLine3"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1PermanentCountry)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1PermanentCountry) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20 }}
                      />
                      <StyledField
                        disabled
                        className={className}
                        name="permanentAddressLine4"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1PermanentCountry)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1PermanentCountry) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20, display: 'none' }}
                      />
                      <StyledField
                        disabled
                        className={className}
                        name="permanentAddressLine5"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1PermanentCountry)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1PermanentCountry) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20, paddingBottom: 30, display: 'none' }}
                      />
                    </GridHere>
                    <GridHere item style={{ height: 90 }}>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="COUNTRY OF RESIDENCE"
                        name="permanentCountry"
                        data={Country}
                        component={ReactSelectField}
                        placeholder="..."
                        onChange={this.onChange}
                      />
                      <p style={{ paddingBottom: 30 }}></p>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="permanentPostalCode"
                        label="POST CODE"
                        component={InputField}
                        onBlur={(e) => this.validatePostalCode(e, 'permanent')}
                        placeholder="..."
                        validate={[required, maxLength(maxLengthPostCode)]}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= maxLengthPostCode) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                      />
                      <p style={{ paddingBottom: 30 }}></p>
                      {isUserFromMlOrSg && (
                        <StyledField
                          disabled={edit}
                          className={className}
                          validate={[required, maxLength(15)]}
                          label="STATE"
                          isState
                          name="permanentState"
                          data={State}
                          component={ReactSelectField}
                          placeholder="..."
                        />
                      )}
                      {!isUserFromMlOrSg && (
                        <StyledField
                          disabled={edit}
                          className={className}
                          name="permanentState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={InputField}
                          label="STATE"
                          validate={[required, maxLength(maxLengthState)]}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                                value.length <= maxLengthState) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                        />
                      )}
                      <p style={{ paddingBottom: 30 }}></p>
                      <StyledField
                        disabled
                        className={className}
                        name="permanentAddressTownOrCity"
                        type="text"
                        label="TOWN/CITY"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1PermanentCountry)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1PermanentCountry) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24} style={{ marginLeft: -22, paddingTop: 125 }}>
                    <GridHere item>
                      <CheckboxField
                        onClick={this.toggleAddressCheckbox}
                        value={this.state.isPermanentCorrespondenceAddress}
                        disabled={edit}
                        className={className}
                        name="isPermanentCorrespondenceAddress"
                        label="Permanent Address is your Correspondence Address"
                      />
                    </GridHere>
                    <GridHere item>
                      <HiddenField component={InputField} />
                    </GridHere>
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            </ContentItem>
          </Grid>
        ) : (
          <GrayContainer>
            <Grid container justify="center" spacing={24} style={{ paddingTop: 20 }}>
              <GridHere item style={{ width: '305px' }}>
                <Text color="#000000" weight="bold" align="left" size="14px" weight="bold">
                  Permanent Address
                </Text>
              </GridHere>
              <GridHere item>
                <HiddenField component={InputField} />
              </GridHere>
            </Grid>
            <Grid container justify="center" spacing={24}>
              <GridHere item>
                <StyledField
                  disabled={edit}
                  className={className}
                  name="permanentAddressLine1"
                  label="ADDRESS"
                  type="text"
                  placeholder=""
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                />
                <StyledField
                  disabled={edit}
                  className={className}
                  name="permanentAddressLine2"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingTop: 15 }}
                />
                <StyledField
                  disabled
                  className={className}
                  name="permanentAddressLine3"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingTop: 20 }}
                />
                <StyledField
                  disabled
                  className={className}
                  name="permanentAddressLine4"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingTop: 20, display: 'none' }}
                />
                <StyledField
                  disabled
                  className={className}
                  name="permanentAddressLine5"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingTop: 20, paddingBottom: 0, display: 'none' }}
                />
              </GridHere>
              <GridHere item style={{ height: 90 }}>
                <StyledField
                  disabled={edit}
                  className={className}
                  label="COUNTRY OF RESIDENCE"
                  name="permanentCountry"
                  data={Country}
                  component={ReactSelectField}
                  placeholder="..."
                />
                <p style={{ paddingBottom: 20 }}></p>
                <StyledField
                  disabled={edit}
                  className={className}
                  name="permanentPostalCode"
                  label="POST CODE"
                  component={InputField}
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ paddingBottom: 20 }}
                />
                {isUserFromMlOrSg && (
                  <StyledField
                    disabled={edit}
                    className={className}
                    label="STATE"
                    isState
                    name="permanentState"
                    data={State}
                    component={ReactSelectField}
                    placeholder="..."
                  />
                )}
                {!isUserFromMlOrSg && (
                  <StyledField
                    disabled={edit}
                    className={className}
                    name="permanentState"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    component={InputField}
                    label="STATE"
                  />
                )}
                <p style={{ paddingBottom: 20 }}></p>
                <StyledField
                  disabled
                  className={className}
                  name="permanentAddressTownOrCity"
                  type="text"
                  label="TOWN/CITY"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ display: 'none' }}
                />
              </GridHere>
            </Grid>
            <Grid container justify="center" spacing={24} style={{ marginTop: 70 }}>
              <GridHere item>
                <CheckboxField
                  value={
                    (this.props.formState &&
                      this.props.formState.values &&
                      this.props.formState.values.isPermanentCorrespondenceAddress) ||
                    (this.props.initialValues && this.props.initialValues.isPermanentCorrespondenceAddress)
                  }
                  disabled={edit}
                  className={className}
                  name="isPermanentCorrespondenceAddress"
                  label="Permanent Address is your Correspondence Address"
                  // style={{ marginLeft: -25 }}
                />
              </GridHere>
              <GridHere item>
                <HiddenField component={InputField} />
              </GridHere>
            </Grid>
          </GrayContainer>
        )}
        {/** **********************
         *
         * Correspondence Address Section
         *
         *********************** */}
        <Grid container justify="center" spacing={24}>
          <ContentItem>
            {!edit ? (
              <StyledPanel
                expanded={this.state.expandedPermanentAddressSection}
                onChange={() => this.handleExpandCollapseSection('PERM_ADDR')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text weight="bold" align="left">
                    Correspondence Address
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="correspondenceAddressLine1"
                        label="Address"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[required]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1CorrespondenceAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                      />
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="correspondenceAddressLine2"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[required]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine2CorrespondenceAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20 }}
                      />
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="correspondenceAddressLine3"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine2CorrespondenceAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20 }}
                      />
                      <StyledField
                        disabled
                        className={className}
                        name="correspondenceAddressLine4"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine2CorrespondenceAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20, display: 'none' }}
                      />
                      <StyledField
                        disabled
                        className={className}
                        name="correspondenceAddressLine5"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine2CorrespondenceAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20, display: 'none' }}
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="CORRESPONDENCE COUNTRY"
                        name="correspondenceCountry"
                        data={Country}
                        component={ReactSelectField}
                        placeholder="..."
                        onChange={this.onChange}
                      />
                      <p style={{ paddingBottom: 30 }}></p>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="correspondencePostalCode"
                        label="POST CODE"
                        component={InputField}
                        onBlur={(e) => this.validatePostalCode(e, 'correspondence')}
                        placeholder="..."
                        validate={[required, maxLength(6)]}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= maxLengthPostCode) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                      />
                      <p style={{ paddingBottom: 30 }}></p>
                      {isCorrespondenceFromMlOrSg && (
                        /* <StyledField
                        disabled={edit}
                        className={className}
                        name="correspondenceState"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        label="STATE"
                        validate={[required, maxLength(maxLengthState)]}
                        parse={(value) => {
                          if ((value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthState) || value === '') {
                            return value;
                          }
                        }}
                      /> */
                        <StyledField
                          disabled={edit}
                          className={className}
                          label="STATE"
                          isState
                          name="correspondenceState"
                          data={State}
                          component={ReactSelectField}
                          placeholder="..."
                        />
                      )}
                      {!isCorrespondenceFromMlOrSg && (
                        <StyledField
                          disabled={edit}
                          className={className}
                          name="correspondenceState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={InputField}
                          label="STATE"
                          validate={[required, maxLength(maxLengthState)]}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                                value.length <= maxLengthState) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                        />
                      )}
                      <p style={{ paddingBottom: 15 }}></p>
                      <StyledField
                        disabled
                        className={className}
                        name="correspondenceAddressTownOrCity"
                        type="text"
                        label="TOWN/CITY"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1PermanentCountry)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1PermanentCountry) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingBottom: 10, display: 'none' }}
                      />
                    </GridHere>
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            ) : (
              <React.Fragment>
                <Grid container justify="center" spacing={24} style={{ marginTop: 10 }}>
                  <GridHere item style={{ width: '305px' }}>
                    <Text color="#000000" weight="bold" align="left" size="14px" weight="bold">
                      Correspondence Address
                    </Text>
                  </GridHere>
                  <GridHere item>
                    <HiddenField component={InputField} />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24}>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="correspondenceAddressLine1"
                      label="Address"
                      type="text"
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                    />
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="correspondenceAddressLine2"
                      type="text"
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                      style={{ paddingTop: 15 }}
                    />
                    <StyledField
                      disabled
                      className={className}
                      name="correspondenceAddressLine3"
                      type="text"
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                      style={{ paddingTop: 20 }}
                    />
                    <StyledField
                      disabled
                      className={className}
                      name="correspondenceAddressLine4"
                      type="text"
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                      style={{ paddingTop: 20, display: 'none' }}
                    />
                    <StyledField
                      disabled
                      className={className}
                      name="correspondenceAddressLine5"
                      type="text"
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                      style={{ paddingTop: 20, paddingBottom: 10, display: 'none' }}
                    />
                  </GridHere>
                  <GridHere item>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="CORRESPONDENCE COUNTRY"
                      name="correspondenceCountry"
                      data={Country}
                      component={ReactSelectField}
                      placeholder="..."
                    />
                    <p style={{ paddingBottom: 20 }}></p>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="correspondencePostalCode"
                      label="POST CODE"
                      component={InputField}
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ paddingBottom: 20 }}
                    />
                    {isCorrespondenceFromMlOrSg && (
                      <StyledField
                        disabled={edit}
                        className={className}
                        label="STATE"
                        isState
                        name="correspondenceState"
                        data={State}
                        component={ReactSelectField}
                      />
                    )}
                    {!isCorrespondenceFromMlOrSg && (
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="correspondenceState"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        label="STATE"
                      />
                    )}
                    <p style={{ paddingBottom: 15 }}></p>
                    <StyledField
                      disabled
                      className={className}
                      name="correspondenceAddressTownOrCity"
                      type="text"
                      label="TOWN/CITY"
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                      style={{ display: 'none' }}
                    />
                  </GridHere>
                </Grid>
              </React.Fragment>
            )}
          </ContentItem>
        </Grid>
        {/** **********************
         *
         * Tax Residence Information Section
         *
         *********************** */}
        {!edit ? (
          <Grid container justify="center" spacing={24}>
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedTaxResidentInfoSection}
                onChange={() => this.handleExpandCollapseSection('TAX_RESIDENT_INFO')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text weight="bold" align="left">
                    Tax Residence Information
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <RowGridLeft spacing={4} style={{ marginTop: 15 }}>
                    <Grid item xs={12}>
                      {(this.props.submitFailed || this.props.submitSucceeded) &&
                        !checkCheckBoxIsTaxResidentOfOtherCountry &&
                        !isTaxResidentOfMalaysia && (
                          <Text weight="bold" align="left" size="12px" color={Color.C_RED} style={{ paddingBottom: 15 }}>
                            Please check at least one below
                          </Text>
                        )}
                      <Text weight="bold" align="left" size="12px">
                        I hereby declare and represent that I am: (Check all that apply)
                      </Text>
                    </Grid>
                    <Grid item xs={12}>
                      <CheckboxField
                        onClick={this.handleChangeIsTaxResidentOfMalaysia}
                        value={this.state.isTaxResidentOfMalaysia}
                        disabled={edit}
                        className={className}
                        name="isTaxResidentOfMalaysia"
                        label="A Tax resident of Malaysia"
                        fontSize="14px"
                        validate={required}
                      />
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: -15 }}>
                      <CheckboxField
                        value={checkCheckBoxIsTaxResidentOfOtherCountry}
                        disabled={
                          edit ||
                          (this.props.formState &&
                            this.props.formState.values &&
                            _isEmpty(this.props.formState.values.nationality))
                            ? false
                            : isDisabled
                        }
                        className={className}
                        name="isTaxResidentOfOtherCountry"
                        label="A Tax resident or citizen of a country other than Malaysian"
                        fontSize="14px"
                        validate={required}
                        onChange={this.handleChangeIsTaxResidentOfOtherCountry}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Text weight="bold" align="left" size="12px">
                        And I hereby declare and represent that I have checked all designations that may apply to me.
                      </Text>
                    </Grid>
                  </RowGridLeft>
                  {checkCheckBoxIsTaxResidentOfOtherCountry === true ? (
                    <React.Fragment>
                      <Grid container justify="center" spacing={24} style={{ marginTop: 10 }}>
                        <GridHere item>
                          <StyledField
                            disabled={edit}
                            className={className}
                            validate={required}
                            label="COUNTRY OF BIRTH"
                            name="taxResidentCountryOfBirth"
                            data={CountriesCwaCrs}
                            component={ReactSelectField}
                            placeholder="..."
                            onChange={this.onChange}
                            dropdownWidth="410px"
                          />
                        </GridHere>
                        <GridHere item>
                          <HiddenField component={InputField} />
                        </GridHere>
                      </Grid>
                      <Grid container justify="center" spacing={24} style={{ marginTop: 10 }}>
                        <GridHere item>
                          <Text weight="bold" align="left" size="14px" style={{ paddingTop: 20, paddingBottom: 15 }}>
                            Tax Residence 1
                          </Text>
                          <p style={{ height: 60 }}>
                            <StyledField
                              disabled={edit}
                              className={className}
                              validate={required}
                              label="COUNTRY / JURISDICTION OF TAX RESIDENT"
                              name="taxResidentCountry1"
                              data={taxResidentCountryList}
                              component={ReactSelectField}
                              placeholder="..."
                              onChange={this.onChange}
                              dropdownWidth="410px"
                            />
                          </p>
                          <Text
                            align="left"
                            size="8px"
                            color="#000000"
                            weight="bold"
                            opacity={0.4}
                            style={{ paddingTop: 25, width: '270px' }}>
                            TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                          </Text>
                          {(this.props.submitFailed || this.props.submitSucceeded) &&
                            isTaxResidentTaxIdentificationNumberAvailable1 === null && (
                              <Text weight="bold" align="left" size="12px" color={Color.C_RED} style={{ paddingTop: 10 }}>
                                Please select Yes or NO
                              </Text>
                            )}
                          <RowGridLeft spacing={0}>
                            <Grid item xs={3}>
                              <StyledRadioButton
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
                            <Grid item xs={6}>
                              <StyledRadioButton
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
                          {showTinInput1 === true ? (
                            <p style={{ paddingTop: 10 }}>
                              <StyledField
                                disabled={edit}
                                className={className}
                                name="taxResidentTaxIdentificationNumber1"
                                type="text"
                                placeholder="..."
                                label="Tax Identification Number"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                component={InputField}
                                validate={[required, maxLength(maxLengthTaxResidentTaxIdentificationNumber)]}
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
                              />
                            </p>
                          ) : null}
                          {showReasonInput1 === true ? (
                            <React.Fragment>
                              <Text align="left" size="10px" color="#000000" style={{ paddingTop: 10, width: '270px' }}>
                                IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                              </Text>
                              <StyledField
                                disabled={edit}
                                className={className}
                                label=""
                                name="taxResidentTaxIdentificationNumberUnAvailableReason1"
                                data={TaxResidentNoIDReasons}
                                component={ReactSelectFieldCustom}
                                placeholder="..."
                                validate={required}
                              />
                              {selectedReason1 && showReasonExplanation1 ? (
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
                                    className={className}
                                    name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1"
                                    type="text"
                                    placeholder="Explanation"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    component={InputField}
                                    validate={[required, maxLength(maxLengthTaxResidentReasonExplanation)]}
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
                                  />
                                </React.Fragment>
                              ) : null}
                            </React.Fragment>
                          ) : null}
                        </GridHere>
                        <GridHere item>
                          {(this.props.formState &&
                            this.props.formState.values &&
                            this.props.formState.values.numTaxResidentInfo > 1) ||
                          this.state.numTaxResidentInfo > 1 ? (
                            <React.Fragment>
                              <Text weight="bold" align="left" size="14px" style={{ paddingTop: 20, paddingBottom: 15 }}>
                                Tax Residence 2
                              </Text>
                              <p style={{ height: 60 }}>
                                <StyledField
                                  disabled={edit}
                                  className={className}
                                  validate={required}
                                  label="COUNTRY / JURISDICTION OF TAX RESIDENT"
                                  name="taxResidentCountry2"
                                  data={taxResidentCountryList}
                                  component={ReactSelectField}
                                  placeholder="..."
                                  onChange={this.onChange}
                                  dropdownWidth="410px"
                                />
                              </p>
                              <Text
                                align="left"
                                size="8px"
                                color="#000000"
                                weight="bold"
                                opacity={0.4}
                                style={{ paddingTop: 25 }}>
                                TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                              </Text>
                              {(this.props.submitFailed || this.props.submitSucceeded) &&
                                isTaxResidentTaxIdentificationNumberAvailable2 === null && (
                                  <Text weight="bold" align="left" size="12px" color={Color.C_RED} style={{ paddingTop: 10 }}>
                                    Please select Yes or NO
                                  </Text>
                                )}
                              <RowGridLeft spacing={0}>
                                <Grid item xs={3}>
                                  <StyledRadioButton
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
                                <Grid item xs={6}>
                                  <StyledRadioButton
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
                                <p style={{ paddingTop: 10 }}>
                                  <StyledField
                                    disabled={edit}
                                    className={className}
                                    name="taxResidentTaxIdentificationNumber2"
                                    type="text"
                                    placeholder="..."
                                    label="Tax Identification Number"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    component={InputField}
                                    validate={[required, maxLength(maxLengthTaxResidentTaxIdentificationNumber)]}
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
                                  />
                                </p>
                              ) : null}
                              {showReasonInput2 === true ? (
                                <React.Fragment>
                                  <Text align="left" size="10px" color="#000000" style={{ paddingTop: 10, width: '270px' }}>
                                    IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                                  </Text>
                                  <StyledField
                                    disabled={edit}
                                    className={className}
                                    label=""
                                    name="taxResidentTaxIdentificationNumberUnAvailableReason2"
                                    data={TaxResidentNoIDReasons}
                                    component={ReactSelectFieldCustom}
                                    placeholder="..."
                                    validate={required}
                                  />
                                  {selectedReason2 && showReasonExplanation2 ? (
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
                                        className={className}
                                        name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2"
                                        type="text"
                                        placeholder="Explanation"
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        component={InputField}
                                        validate={[required, maxLength(maxLengthTaxResidentReasonExplanation)]}
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
                                      />
                                    </React.Fragment>
                                  ) : null}
                                </React.Fragment>
                              ) : null}
                            </React.Fragment>
                          ) : (
                            <HiddenField component={InputField} />
                          )}
                        </GridHere>
                      </Grid>
                      {(this.props.formState &&
                        this.props.formState.values &&
                        this.props.formState.values.numTaxResidentInfo > 2) ||
                      this.state.numTaxResidentInfo > 2 ? (
                        <Grid container justify="center" spacing={24} style={{ marginTop: 10 }}>
                          <GridHere item>
                            <Text weight="bold" align="left" size="14px" style={{ paddingTop: 20, paddingBottom: 15 }}>
                              Tax Residence 3
                            </Text>
                            <p style={{ height: 60 }}>
                              <StyledField
                                disabled={edit}
                                className={className}
                                validate={required}
                                label="COUNTRY / JURISDICTION OF TAX RESIDENT"
                                name="taxResidentCountry3"
                                data={taxResidentCountryList}
                                component={ReactSelectField}
                                placeholder="..."
                                onChange={this.onChange}
                                dropdownWidth="410px"
                              />
                            </p>
                            <Text
                              align="left"
                              size="8px"
                              color="#000000"
                              weight="bold"
                              opacity={0.4}
                              style={{ paddingTop: 25, width: '270px' }}>
                              TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                            </Text>
                            {(this.props.submitFailed || this.props.submitSucceeded) &&
                              isTaxResidentTaxIdentificationNumberAvailable3 === null && (
                                <Text weight="bold" align="left" size="12px" color={Color.C_RED} style={{ paddingTop: 10 }}>
                                  Please select Yes or NO
                                </Text>
                              )}
                            <RowGridLeft spacing={0}>
                              <Grid item xs={3}>
                                <StyledRadioButton
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
                              <Grid item xs={6}>
                                <StyledRadioButton
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
                              <p style={{ paddingTop: 10 }}>
                                <StyledField
                                  disabled={edit}
                                  className={className}
                                  name="taxResidentTaxIdentificationNumber3"
                                  type="text"
                                  placeholder="..."
                                  label="Tax Identification Number"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  component={InputField}
                                  validate={[required, maxLength(maxLengthTaxResidentTaxIdentificationNumber)]}
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
                                />
                              </p>
                            ) : null}
                            {showReasonInput3 === true ? (
                              <React.Fragment>
                                <Text align="left" size="10px" color="#000000" style={{ paddingTop: 20, width: '270px' }}>
                                  IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                                </Text>
                                <StyledField
                                  disabled={edit}
                                  className={className}
                                  label=""
                                  name="taxResidentTaxIdentificationNumberUnAvailableReason3"
                                  data={TaxResidentNoIDReasons}
                                  component={ReactSelectFieldCustom}
                                  placeholder="..."
                                  validate={required}
                                />
                                {selectedReason3 && showReasonExplanation3 ? (
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
                                      className={className}
                                      name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3"
                                      type="text"
                                      placeholder="Explanation"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      component={InputField}
                                      validate={[required, maxLength(maxLengthTaxResidentReasonExplanation)]}
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
                                    />
                                  </React.Fragment>
                                ) : null}
                              </React.Fragment>
                            ) : null}
                          </GridHere>
                          <GridHere item>
                            <HiddenField component={InputField} />
                          </GridHere>
                        </Grid>
                      ) : null}
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
                                cursor="pointer"
                                display="inline"
                                color={Color.C_LIGHT_BLUE}
                                style={{ width: '270px', textDecoration: 'underline', paddingRight: 20 }}
                                onClick={this.addTaxResidentInfo}>
                                + Add Tax Residence
                              </Text>
                              <Text
                                align="left"
                                size="14px"
                                cursor="pointer"
                                display="inline"
                                color={Color.C_LIGHT_BLUE}
                                style={{ width: '270px', textDecoration: 'underline' }}
                                onClick={this.removeTaxResidentInfo}>
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
                              cursor="pointer"
                              display="inline"
                              color={Color.C_LIGHT_BLUE}
                              style={{ paddingTop: 20, width: '270px', textDecoration: 'underline' }}
                              onClick={this.addTaxResidentInfo}>
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
                              cursor="pointer"
                              display="inline"
                              color={Color.C_LIGHT_BLUE}
                              style={{ paddingTop: 20, width: '270px', textDecoration: 'underline' }}
                              onClick={this.removeTaxResidentInfo}>
                              - Remove Tax Residence
                            </Text>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null}
                </StyledDetails>
              </StyledPanel>
            </ContentItem>
          </Grid>
        ) : (
          <GrayContainer>
            <div style={{ width: widthOfInputFieldContainer, margin: '0 auto' }}>
              <Grid container justify="center" spacing={24} style={{ paddingTop: 20 }}>
                <GridHere item style={{ width: '305px' }}>
                  <Text color="#000000" weight="bold" align="left" size="14px" weight="bold">
                    Tax Residence Information
                  </Text>
                </GridHere>
                <GridHere item>
                  <HiddenField component={InputField} />
                </GridHere>
              </Grid>
              <div style={{ paddingLeft: 30 }}>
                <Text weight="bold" align="left" size="12px">
                  I hereby declare and represent that I am: (Check all that apply)
                </Text>
              </div>
              <div style={{ paddingLeft: 30, textAlign: 'left' }}>
                <CheckboxField
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
                />
              </div>
              <div style={{ paddingLeft: 30, textAlign: 'left', marginTop: -15 }}>
                <CheckboxField
                  value={checkCheckBoxIsTaxResidentOfOtherCountry}
                  disabled={edit}
                  className={className}
                  name="isTaxResidentOfOtherCountry"
                  label="A Tax resident or citizen of a country other than Malaysia"
                  fontSize="14px"
                />
              </div>
              <div style={{ paddingLeft: 30 }}>
                <Text weight="bold" align="left" size="12px">
                  And I hereby declare and represent that I have checked all designations that may apply to me.
                </Text>
              </div>
              {!checkCheckBoxIsTaxResidentOfOtherCountry && <p style={{ paddingBottom: 20 }}></p>}
              {checkCheckBoxIsTaxResidentOfOtherCountry === true ? (
                <React.Fragment>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 10 }}>
                    <GridHere item>
                      <StyledField
                        disabled={edit}
                        className={className}
                        label="COUNTRY OF BIRTH"
                        name="taxResidentCountryOfBirth"
                        data={CountriesCwaCrs}
                        component={ReactSelectLongField}
                      />
                    </GridHere>
                    <GridHere item>
                      <HiddenField component={InputField} />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 5 }}>
                    <GridHere item>
                      <Text weight="bold" align="left" size="14px" style={{ paddingBottom: 15 }}>
                        Tax Residence 1
                      </Text>
                      <StyledField
                        disabled={edit}
                        className={className}
                        label="COUNTRY / JURISDICTION OF TAX RESIDENT"
                        name="taxResidentCountry1"
                        data={taxResidentCountryList}
                        component={ReactSelectLongField}
                        placeholder="..."
                      />
                      <Text
                        align="left"
                        size="8px"
                        color="#000000"
                        weight="bold"
                        opacity={0.4}
                        style={{ paddingTop: 5, width: '270px' }}>
                        TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                      </Text>
                      <RowGridLeft spacing={0}>
                        <Grid item xs={3}>
                          <StyledRadioButton
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
                            disabled={edit}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <StyledRadioButton
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
                            disabled={edit}
                          />
                        </Grid>
                      </RowGridLeft>
                      {showTinInput1 === true ? (
                        <p style={{ paddingTop: 10 }}>
                          <StyledField
                            disabled={edit}
                            className={className}
                            name="taxResidentTaxIdentificationNumber1"
                            type="text"
                            label="Tax Identification Number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            component={InputField}
                          />
                        </p>
                      ) : null}
                      {showReasonInput1 === true ? (
                        <React.Fragment>
                          <Text align="left" size="10px" color="#000000" style={{ paddingTop: 10, width: '270px' }}>
                            IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                          </Text>
                          <StyledField
                            disabled={edit}
                            className={className}
                            label=""
                            name="taxResidentTaxIdentificationNumberUnAvailableReason1"
                            data={TaxResidentNoIDReasons}
                            component={ReactSelectFieldCustom}
                            placeholder="..."
                          />
                          {selectedReason1 && showReasonExplanation1 ? (
                            <StyledField
                              disabled={edit}
                              className={className}
                              name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1"
                              type="text"
                              placeholder="Explanation"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              component={InputField}
                            />
                          ) : null}
                        </React.Fragment>
                      ) : null}
                    </GridHere>
                    <GridHere item>
                      {this.props.formState &&
                      this.props.formState.values &&
                      this.props.formState.values.numTaxResidentInfo > 1 ? (
                        <React.Fragment>
                          <Text weight="bold" align="left" size="14px" style={{ paddingBottom: 15 }}>
                            Tax Residence 2
                          </Text>
                          <StyledField
                            disabled={edit}
                            className={className}
                            label="COUNTRY / JURISDICTION OF TAX RESIDENT"
                            name="taxResidentCountry2"
                            data={taxResidentCountryList}
                            component={ReactSelectLongField}
                          />
                          <Text align="left" size="8px" color="#000000" weight="bold" opacity={0.4} style={{ paddingTop: 5 }}>
                            TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                          </Text>
                          <RowGridLeft spacing={0}>
                            <Grid item xs={3}>
                              <StyledRadioButton
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
                                disabled={edit}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <StyledRadioButton
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
                                disabled={edit}
                              />
                            </Grid>
                          </RowGridLeft>
                          {showTinInput2 === true ? (
                            <p style={{ paddingTop: 10 }}>
                              <StyledField
                                disabled={edit}
                                className={className}
                                name="taxResidentTaxIdentificationNumber2"
                                type="text"
                                label="Tax Identification Number"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                component={InputField}
                              />
                            </p>
                          ) : null}
                          {showReasonInput2 === true ? (
                            <React.Fragment>
                              <Text align="left" size="10px" color="#000000" style={{ paddingTop: 20, width: '270px' }}>
                                IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                              </Text>
                              <StyledField
                                disabled={edit}
                                className={className}
                                label=""
                                name="taxResidentTaxIdentificationNumberUnAvailableReason2"
                                data={TaxResidentNoIDReasons}
                                component={ReactSelectFieldCustom}
                                placeholder="..."
                              />
                              {selectedReason2 && showReasonExplanation2 ? (
                                <StyledField
                                  disabled={edit}
                                  className={className}
                                  name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2"
                                  type="text"
                                  placeholder="Explanation"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  component={InputField}
                                />
                              ) : null}
                            </React.Fragment>
                          ) : null}
                        </React.Fragment>
                      ) : (
                        <HiddenField component={InputField} />
                      )}
                    </GridHere>
                  </Grid>
                  {this.props.formState && this.props.formState.values && this.props.formState.values.numTaxResidentInfo > 2 ? (
                    <Grid container justify="center" spacing={24} style={{ marginTop: 10 }}>
                      <GridHere item>
                        <Text weight="bold" align="left" size="14px" style={{ paddingBottom: 15 }}>
                          Tax Residence 3
                        </Text>
                        <StyledField
                          disabled={edit}
                          className={className}
                          label="COUNTRY/JURISDICTION OF TAX RESIDENT"
                          name="taxResidentCountry3"
                          data={taxResidentCountryList}
                          component={ReactSelectLongField}
                        />
                        <Text
                          align="left"
                          size="8px"
                          color="#000000"
                          weight="bold"
                          opacity={0.4}
                          style={{ paddingTop: 5, width: '270px' }}>
                          TAX IDENTIFICATION NUMBER (TIN) OR EQUIVALENT
                        </Text>
                        <RowGridLeft spacing={0}>
                          <Grid item xs={3}>
                            <StyledRadioButton
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
                              disabled={edit}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <StyledRadioButton
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
                              disabled={edit}
                            />
                          </Grid>
                        </RowGridLeft>
                        {showTinInput3 === true ? (
                          <p style={{ paddingTop: 10 }}>
                            <StyledField
                              disabled={edit}
                              className={className}
                              name="taxResidentTaxIdentificationNumber3"
                              type="text"
                              placeholder="..."
                              label="Tax Identification Number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              component={InputField}
                            />
                          </p>
                        ) : null}
                        {showReasonInput3 === true ? (
                          <React.Fragment>
                            <Text align="left" size="10px" color="#000000" style={{ paddingTop: 20, width: '270px' }}>
                              IF TIN OR EQUIVALENT IS UNAVAILABLE, PLEASE CHOOSE THE REASON BELOW
                            </Text>
                            <StyledField
                              disabled={edit}
                              className={className}
                              label=""
                              name="taxResidentTaxIdentificationNumberUnAvailableReason3"
                              data={TaxResidentNoIDReasons}
                              component={ReactSelectFieldCustom}
                              placeholder="..."
                            />
                            {selectedReason3 && showReasonExplanation3 ? (
                              <StyledField
                                disabled={edit}
                                className={className}
                                name="taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3"
                                type="text"
                                placeholder="Explanation"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                component={InputField}
                              />
                            ) : null}
                          </React.Fragment>
                        ) : null}
                      </GridHere>
                      <GridHere item>
                        <HiddenField component={InputField} />
                      </GridHere>
                    </Grid>
                  ) : null}
                </React.Fragment>
              ) : null}
            </div>
          </GrayContainer>
        )}
        {/** **********************
         *
         * Employment Details Section
         *
         *********************** */}
        <Grid container justify="center" spacing={24}>
          <ContentItem>
            {!edit ? (
              <StyledPanel
                expanded={this.state.expandedPermanentAddressSection}
                onChange={() => this.handleExpandCollapseSection('EMPLOYMENT_DETAIL')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text weight="bold" align="left">
                    Employment Details
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item style={{ height: 100 }}>
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="companyName"
                        label="EMPLOYER NAME"
                        type="text"
                        placeholder="..."
                        component={InputField}
                        // showUnderline={!edit}
                        // borderBottomField={edit ? 'none' : '1px solid rgba(0,0,0,0.4)'}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        validate={this.props.NOBisDisable ? false : [required, maxLength(maxLengthCompanyName)]}
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && parseInt(value.length, 10) <= maxLengthCompanyName) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                      />
                    </GridHere>
                    <GridHere item style={{ height: 100 }}>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="ANNUAL INCOME"
                        name="annualIncome"
                        data={AnnualIncomeLOV}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24}>
                    <GridHere item style={{ height: 100 }}>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="OCCUPATION TYPE"
                        name="occupationType"
                        data={Occupation}
                        component={ReactSelectField}
                        placeholder="..."
                        dropdownWidth="310px"
                        onChange={this.onChangeOccupation}
                      />
                    </GridHere>
                    <GridHere item style={{ height: 100 }}>
                      <StyledField
                        disabled={this.props.NOBisDisable ? true : edit}
                        className={className}
                        validate={this.props.NOBisDisable ? false : required}
                        label="NATURE OF BUSINESS"
                        name="natureofbusiness"
                        data={Business}
                        component={ReactSelectField}
                        placeholder="..."
                        dropdownWidth="350px"
                        showUnderline={!edit}
                      />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24}>
                    <GridHere item style={{ height: 90 }}>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="PURPOSE OF INVESTMENT"
                        name="purposeofinvestment"
                        data={Purpose}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                    <GridHere item style={{ height: 90 }}>
                      <StyledField
                        disabled={edit}
                        className={className}
                        validate={required}
                        label="SOURCE OF FUNDS"
                        name="sourceoffunds"
                        data={SourceOfFunds}
                        component={ReactSelectField}
                        placeholder="..."
                      />
                    </GridHere>
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            ) : (
              <React.Fragment>
                <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                  <GridHere item style={{ width: '305px' }}>
                    <Text color="#000000" weight="bold" align="left" size="14px" weight="bold">
                      Employment Details
                    </Text>
                  </GridHere>
                  <GridHere item>
                    <HiddenField component={InputField} />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24}>
                  <GridHere item style={{ height: 90 }}>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="companyName"
                      label="EMPLOYER NAME"
                      type="text"
                      placeholder="..."
                      component={InputField}
                      showUnderline={!edit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </GridHere>
                  <GridHere item style={{ height: 90 }}>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="ANNUAL INCOME"
                      name="annualIncome"
                      data={AnnualIncomeLOV}
                      component={ReactSelectField}
                      placeholder="..."
                    />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24}>
                  <GridHere item style={{ height: 90 }}>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="OCCUPATION TYPE"
                      name="occupationType"
                      data={Occupation}
                      component={ReactSelectField}
                      placeholder="..."
                      dropdownWidth="310px"
                    />
                  </GridHere>
                  <GridHere item style={{ height: 90 }}>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="NATURE OF BUSINESS"
                      name="natureofbusiness"
                      data={Business}
                      component={ReactSelectField}
                      placeholder="..."
                      dropdownWidth="350px"
                      showUnderline={!edit}
                    />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24}>
                  <GridHere item style={{ height: 90 }}>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="PURPOSE OF INVESTMENT"
                      name="purposeofinvestment"
                      data={Purpose}
                      component={ReactSelectField}
                      placeholder="..."
                    />
                  </GridHere>
                  <GridHere item style={{ height: 90 }}>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="SOURCE OF FUNDS"
                      name="sourceoffunds"
                      data={SourceOfFunds}
                      component={ReactSelectField}
                      placeholder="..."
                    />
                  </GridHere>
                </Grid>
              </React.Fragment>
            )}
          </ContentItem>
        </Grid>

        {/** **********************
         *
         * Company Address Section
         *
         *********************** */}
        {!edit ? (
          <Grid container justify="center" spacing={24}>
            <ContentItem>
              <StyledPanel
                expanded={this.state.expandedPermanentAddressSection}
                onChange={() => this.handleExpandCollapseSection('EMPLOYMENT_DETAIL')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text weight="bold" align="left">
                    Company Address
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item>
                      <StyledField
                        // disabled={this.props.NOBisDisable && !isStudentSelected ? true : edit}
                        disabled={edit}
                        className={className}
                        name="companyAddressLine1"
                        label="Address"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[required, maxLength(maxLengthAddressLine1CompanyAddress)]}
                        // validate={
                        //   this.props.NOBisDisable && !isStudentSelected
                        //     ? false
                        //     : [required, maxLength(maxLengthAddressLine1CompanyAddress)]
                        // }
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1CompanyAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                      />
                      <StyledField
                        // disabled={this.props.NOBisDisable && !isStudentSelected ? true : edit}
                        className={className}
                        disabled={edit}
                        name="companyAddressLine2"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[required, maxLength(maxLengthAddressLine1CompanyAddress)]}
                        // validate={
                        //   this.props.NOBisDisable && !isStudentSelected
                        //     ? false
                        //     : [required, maxLength(maxLengthAddressLine1CompanyAddress)]
                        // }
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1CompanyAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20 }}
                      />
                      <StyledField
                        disabled={edit}
                        className={className}
                        name="companyAddressLine3"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1CompanyAddress)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1CompanyAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20 }}
                      />
                      <StyledField
                        disabled
                        className={className}
                        name="companyAddressLine4"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1CompanyAddress)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1CompanyAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20, display: 'none' }}
                      />
                      <StyledField
                        disabled
                        className={className}
                        name="companyAddressLine5"
                        type="text"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1CompanyAddress)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1CompanyAddress) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingTop: 20, display: 'none' }}
                      />
                    </GridHere>
                    <GridHere item>
                      <StyledField
                        // disabled={this.props.NOBisDisable && !isStudentSelected ? true : edit}
                        disabled={edit}
                        className={className}
                        // validate={this.props.NOBisDisable && !isStudentSelected ? false : required}
                        validate={required}
                        label="COUNTRY OF COMPANY"
                        name="companyCountry"
                        data={CountryCor}
                        component={ReactSelectField}
                        placeholder="..."
                        onChange={this.onChange}
                        showUnderline={!edit}
                      />
                      <p style={{ paddingBottom: 30 }}></p>
                      <StyledField
                        // disabled={this.props.NOBisDisable && !isStudentSelected ? true : edit}
                        disabled={edit}
                        className={className}
                        name="companyPostalCode"
                        label="COMPANY POST CODE"
                        placeholder="..."
                        onBlur={(e) => this.validatePostalCode(e, 'company')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        // validate={this.props.NOBisDisable && !isStudentSelected ? false : [required, maxLength(6)]}
                        validate={[required, maxLength(6)]}
                        parse={(value) => {
                          if (
                            (value && value.trim().length > 0 && /^[0-9]*$/.test(value) && value.length <= maxLengthPostCode) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                      />
                      <p style={{ paddingBottom: 30 }}></p>
                      {isCompanyFromMlOrSg && (
                        <StyledField
                          // disabled={this.props.NOBisDisable && !isStudentSelected ? true : edit}
                          disabled={edit}
                          className={className}
                          // validate={this.props.NOBisDisable && !isStudentSelected ? false : required}
                          validate={required}
                          label="COMPANY STATE"
                          name="companyState"
                          data={State}
                          isState
                          component={ReactSelectField}
                          placeholder="..."
                        />
                      )}
                      {!isCompanyFromMlOrSg && (
                        <StyledField
                          // disabled={this.props.NOBisDisable && !isStudentSelected ? true : edit}
                          disabled={edit}
                          className={className}
                          name="companyState"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          component={InputField}
                          label="COMPANY STATE"
                          // validate={this.props.NOBisDisable && !isStudentSelected ? false : [required, maxLength(maxLengthState)]}
                          validate={[required, maxLength(maxLengthState)]}
                          parse={(value) => {
                            if (
                              (value &&
                                value.trim().length > 0 &&
                                /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                                value.length <= maxLengthState) ||
                              value === ''
                            ) {
                              return value;
                            }
                          }}
                        />
                      )}
                      <p style={{ paddingBottom: 15 }}></p>
                      <StyledField
                        disabled
                        className={className}
                        name="companyAddressTownOrCity"
                        type="text"
                        label="TOWN/CITY"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthAddressLine1PermanentCountry)]}
                        parse={(value) => {
                          if (
                            (value &&
                              value.trim().length > 0 &&
                              /^[0-9a-zA-Z@&#:\/.,(\)\-'\s]*$/.test(value) &&
                              value.length <= maxLengthAddressLine1PermanentCountry) ||
                            value === ''
                          ) {
                            return value;
                          }
                        }}
                        style={{ paddingBottom: 10, display: 'none' }}
                      />
                    </GridHere>
                    {this.state.doShowPermanentCompanyAddCheckbox && (
                      <Grid container justify="center" spacing={24} style={{ marginLeft: -22 }}>
                        <GridHere item>
                          <CheckboxField
                            onClick={this.toggleCompanyAddress}
                            value={this.state.isPermmanentAndCompanyAddSame}
                            disabled={edit}
                            className={className}
                            name="isPermmanentAndCompanyAddSame"
                            label="Update Company Address same as Permanent Address"
                          />
                        </GridHere>
                        <GridHere item>
                          <HiddenField component={InputField} />
                        </GridHere>
                      </Grid>
                    )}
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            </ContentItem>
          </Grid>
        ) : (
          <GrayContainer>
            <Grid container justify="center" spacing={24} style={{ paddingTop: 20 }}>
              <GridHere item style={{ width: '305px' }}>
                <Text color="#000000" weight="bold" align="left" size="14px" weight="bold">
                  Company Address
                </Text>
              </GridHere>
              <GridHere item>
                <HiddenField component={InputField} />
              </GridHere>
            </Grid>
            <Grid container justify="center" spacing={24}>
              <GridHere item>
                <StyledField
                  disabled={edit}
                  className={className}
                  name="companyAddressLine1"
                  label="Address"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                />
                <StyledField
                  disabled={edit}
                  className={className}
                  name="companyAddressLine2"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingTop: 15 }}
                />
                <StyledField
                  disabled={edit}
                  className={className}
                  name="companyAddressLine3"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingTop: 20 }}
                />
                <StyledField
                  disabled={edit}
                  className={className}
                  name="companyAddressLine4"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingTop: 20, display: 'none' }}
                />
                <StyledField
                  disabled={edit}
                  className={className}
                  name="companyAddressLine5"
                  type="text"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingTop: 20, display: 'none' }}
                />
              </GridHere>
              <GridHere item>
                <StyledField
                  disabled={edit}
                  className={className}
                  label="COUNTRY OF COMPANY"
                  name="companyCountry"
                  data={CountryCor}
                  component={ReactSelectField}
                  placeholder="..."
                />
                <p style={{ paddingBottom: 20 }}></p>
                <StyledField
                  disabled={edit}
                  className={className}
                  name="companyPostalCode"
                  label="COMPANY POST CODE"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ paddingBottom: 20 }}
                />
                {isCompanyFromMlOrSg && (
                  <StyledField
                    disabled={edit}
                    className={className}
                    label="COMPANY STATE"
                    name="companyState"
                    data={State}
                    isState
                    component={ReactSelectLongField}
                  />
                )}
                {!isCompanyFromMlOrSg && (
                  <StyledField
                    disabled={edit}
                    className={className}
                    name="companyState"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    component={InputField}
                    label="COMPANY STATE"
                  />
                )}
                <p style={{ paddingBottom: 20 }}></p>
                <StyledField
                  disabled={edit}
                  className={className}
                  name="companyAddressTownOrCity"
                  type="text"
                  label="TOWN/CITY"
                  placeholder="..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  component={InputField}
                  style={{ display: 'none' }}
                />
              </GridHere>
            </Grid>
          </GrayContainer>
        )}
        {/** **********************
         *
         * Bank Account Detail Section
         *
         *********************** */}
        <Grid container justify="center" spacing={24}>
          <ContentItem>
            {!edit ? (
              <StyledPanel
                expanded={this.state.expandedPermanentAddressSection}
                onChange={() => this.handleExpandCollapseSection('EMPLOYMENT_DETAIL')}>
                <ExpansionPanelSummary expandIcon={<CustomIcon />}>
                  <Text weight="bold" align="left">
                    Bank Account Details
                  </Text>
                </ExpansionPanelSummary>
                <StyledDetails>
                  <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                    <GridHere item style={{ height: 100 }}>
                      <DisabledStyledField
                        disabled
                        name="bankAcctName"
                        label="BANK ACCOUNT NAME (as per ID Type)"
                        component={InputField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={className}
                        type="text"
                        placeholder="..."
                        validate={[maxLength(maxLengthBankAccountName), zeroOnly]}
                        borderBottomField={edit ? 'none' : '1px solid rgba(0,0,0,0.4)'}
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
                      />
                    </GridHere>
                    <GridHere item style={{ height: 100 }}>
                      <StyledField
                        disabled={edit}
                        className={className}
                        label="BANK NAME"
                        name="bankName"
                        data={Banks}
                        component={ReactSelectField}
                        placeholder="..."
                        dropdownWidth="370px"
                        onChange={() => {
                          this.props.change('bankAcctNumber', '');
                        }}
                      />
                    </GridHere>
                  </Grid>
                  <Grid container justify="center" spacing={24}>
                    <GridHere item style={{ height: 90 }}>
                      <StyledField
                        disabled={
                          edit || !(this.props.formState && this.props.formState.values && this.props.formState.values.bankName)
                        }
                        className={className}
                        name="bankAcctNumber"
                        label="BANK ACCOUNT NUMBER"
                        placeholder="..."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        component={InputField}
                        validate={[maxLength(maxLengthBankAccNumber), zeroOnly]}
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
                      />
                      {this.state.accountNoErrMsg && <TextErrorBold>{this.state.accountNoErrMsg}</TextErrorBold>}
                    </GridHere>
                    <GridHere item>
                      <HiddenField component={InputField} />
                    </GridHere>
                  </Grid>
                </StyledDetails>
              </StyledPanel>
            ) : (
              <React.Fragment>
                <Grid container justify="center" spacing={24} style={{ marginTop: 15 }}>
                  <GridHere item style={{ width: '305px' }}>
                    <Text color="#000000" weight="bold" align="left" size="14px" weight="bold">
                      Bank Account Details
                    </Text>
                  </GridHere>
                  <GridHere item>
                    <HiddenField component={InputField} />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24}>
                  <GridHere item style={{ height: 85 }}>
                    <DisabledStyledField
                      disabled
                      name="bankAcctName"
                      label="BANK ACCOUNT NAME (as per ID Type)"
                      component={InputField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      className={className}
                      type="text"
                      placeholder="..."
                      borderBottomField={edit ? 'none' : '1px solid rgba(0,0,0,0.4)'}
                    />
                  </GridHere>
                  <GridHere item style={{ height: 90 }}>
                    <StyledField
                      disabled={edit}
                      className={className}
                      label="BANK NAME"
                      name="bankName"
                      data={Banks}
                      component={ReactSelectLongField}
                    />
                  </GridHere>
                </Grid>
                <Grid container justify="center" spacing={24}>
                  <GridHere item style={{ height: 90 }}>
                    <StyledField
                      disabled={edit}
                      className={className}
                      name="bankAcctNumber"
                      label="BANK ACCOUNT NUMBER"
                      placeholder="..."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      component={InputField}
                    />
                  </GridHere>
                  <GridHere item>
                    <HiddenField component={InputField} />
                  </GridHere>
                </Grid>
              </React.Fragment>
            )}
          </ContentItem>
        </Grid>

        {/*! edit &&
          <ButtonContainer item xs={12}>
            <StyledButton type="submit" disabled={false} primary>
              Next
            </StyledButton>
          </ButtonContainer>
        */}
        {!edit && (
          <ButtonContainer item xs={12}>
            <StyledButton2
              type="button"
              disabled={this.state.accountNoErrMsg}
              primary
              onClick={() =>
                handleSaveDraft({
                  ...draftDetails.data,
                  ...this.props.formState.values,
                  hobby: this.props.formState.values.interests,
                  isPermanentCorrespondenceAddress: this.state.isPermanentCorrespondenceAddress,
                  doShowPermanentCompanyAddCheckbox: this.state.doShowPermanentCompanyAddCheckbox,
                })
              }>
              Save
            </StyledButton2>

            {invalid ||
            !enabledNextButton ||
            (!this.state.checkCheckBoxIsTaxResidentOfOtherCountry && !this.state.isTaxResidentOfMalaysia) ? (
              <a data-tip data-for="tootltipPersonalDetailInputPageNextButton">
                <StyledButton type="submit" disabled={this.state.accountNoErrMsg} primary>
                  Next
                </StyledButton>
              </a>
            ) : (
              <StyledButton type="submit" disabled={this.state.accountNoErrMsg} primary>
                Next
              </StyledButton>
            )}
            {invalid ||
            !enabledNextButton ||
            (!this.state.checkCheckBoxIsTaxResidentOfOtherCountry && !this.state.isTaxResidentOfMalaysia) ? (
              <ReactTooltip1
                id="tootltipPersonalDetailInputPageNextButton"
                effect="solid"
                place="right"
                event="click"
                eventOff="mouseout">
                <Text size="12px" color="#fff" align="left">
                  Please input all the mandatory fields
                </Text>
              </ReactTooltip1>
            ) : null}
          </ButtonContainer>
        )}
      </Form>
    );
  }
}

PersonalDetailsFields.propTypes = {
  stateFromPostalCode: PropTypes.object,
  formState: PropTypes.object,
  validatePostalCode: PropTypes.func,
  change: PropTypes.func,
  initialValues: PropTypes.object,
  setCorrespondencePermanentEquality: PropTypes.func,
  correpondenceIsPermanent: PropTypes.bool,
  setTINAvailability: PropTypes.func,
};

const mapStateToProps = (state) => ({
  formState: state.form.PersonalDetails, // <== Inject the form store itself
  stateFromPostalCode: state.onBoarding.stateFromPostalCode,
  correpondenceIsPermanent: state.onBoarding.correpondenceIsPermanent,
  NOBisDisable: state.onBoarding.NOBisDisable,
});

function mapDispatchToProps(dispatch) {
  return {
    validatePostalCode: (payload) => dispatch(validatePostalCode(payload)),
    change: (name, value) => dispatch(change('PersonalDetails', name, value)),
    setCorrespondencePermanentEquality: (payload) => dispatch(setCorrespondencePermanentEquality(payload)),
    clearStateFromPostalCode: () => dispatch(clearStateFromPostalCode()),
    disableNOB: (payload) => dispatch(disableNOB(payload)),
  };
}

const ReduxPersonalDetailsForm = reduxForm({
  form: 'PersonalDetails', // a unique identifier for this form
  destroyOnUnmount: false,
  enableReinitialize: true,
})(PersonalDetailsFields);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxPersonalDetailsForm);
