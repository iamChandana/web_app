import React from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import { confirmAlert } from 'react-confirm-alert';
import 'containers/App/style/react-confirm-alert.css';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Text from 'components/Text';
import { RowGridCenter } from 'components/GridContainer';
import { FormControlLabel } from 'material-ui/Form';
import Color from 'utils/StylesHelper/color';
import Radio from 'material-ui/Radio';
import Button from 'components/Button';
import ErrorModal from 'components/Kwsp/Modal/ErrorModal';
import { DictionaryMapper } from 'components/FormUtility/PersonalDetailsFields/DictionaryMapper';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { Field, reduxForm } from 'redux-form';
import ReactSelectField from 'components/FormUtility/FormFields/ReactSelectField';
import InputField from 'components/FormUtility/FormFields/InputField';
import { required, maxLength, zeroOnly, length12 } from 'components/FormUtility/FormValidators';
import _isEmpty from 'lodash/isEmpty';
import _isFinite from 'lodash/isFinite';
import _isNumber from 'lodash/isNumber';
import LoadingOverlay from 'components/LoadingOverlay';
import { saveCifDetails, checkCif, resetCifAlreadyExist, setTitle, setStep, saveKWSPandCashDetails } from 'containers/OnBoarding/actions';
import { makeSelectCifDetails, makeSelectProcessing, makeSelectIsExistingClient, makeSelectPersonalDetails, makekwspCashIntroDetails } from 'containers/OnBoarding/selectors';
import { rejectBackButton } from 'utils/helpers';
import AccountType from './AccountTypeComponent';
import EffectiveDate from './EffectiveDate';
import retrieveDateOfBirth from '../Utils/RetrieveDateOfBirth';
import checkCustomerAge from '../Utils/CheckCustomerAge';
import onBoardingConstants from '../Utils/constants';
import { accountTypes } from './AccountLists';

const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const StyledButton = styled(Button)`
  margin: 40px 0;
`;

export const StyledField = styled(Field)` 
  opacity: ${(props) => props ? props.opacity : 1};
  label {
    opacity: 0.4;
    font-size: 10px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: ${(props) => props.lineHeightLabel || 1.0};
    letter-spacing: normal;
    text-align: left;
    color: #000;
  }
  input,
  div {
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #1d1d26;
    > {
      &::before{
        display: block !important;
    }
  }
  }
  .css-d8oujb {
    display: none;
  }
  .css-1rtrksz {
    padding-left: 0 !important;
    flex-wrap: nowrap !important;
  }
  .css-ln5n5c {
    display: none;
  }

  p {
    position: relative;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg {
    color: ${Color.C_LIGHT_BLUE};
  }  
`;

const maxLengthIdNo = 12;
const maxAgeForKWSP = 55;
const minAgeForAccountCreation = 18;

export const Form = styled.form`
  margin-top: 32px;
`;

export const MirrorGridItem = styled(Grid)`
  display: flex;

  &:nth-child(2n) {
    justify-content: flex-start;
  }
  
  &:nth-child(2n+1) {
    justify-content: flex-end;
  }
`;

class CifVerification extends React.PureComponent {
  constructor(props) {
    super(props);

    this.accountTypeAlteredNum = 0;
    this.state = {
      uploadType: props.cifDetails ? props.cifDetails.uploadType : 'IC',
      accountType: null,
      idType: null,
      isEpfVisible: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.setAccountType = this.setAccountType.bind(this);
    this.clearRemainingFields = this.clearRemainingFields.bind(this);
    this.setIdentificationType = this.setIdentificationType.bind(this);
    this.getDateOfBirth = this.getDateOfBirth.bind(this);
    this.processCIFDetails = this.processCIFDetails.bind(this);
    this.notify = this.notify.bind(this);
    this.clearKwspFields = this.clearKwspFields.bind(this);
    this.getFormValidation = this.getFormValidation.bind(this);
    this.getAccountTypes = this.getAccountTypes.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.processing === false &&
      nextProps.isExistingClient !== this.props.isExistingClient &&
      nextProps.isExistingClient === false
    ) {
      const { finalAge } = checkCustomerAge(this.getDateOfBirth());
      const { ageErrorMessage } = onBoardingConstants;
      if (finalAge < minAgeForAccountCreation && this.state.accountType !== 'CS') {
        this.handleAccountErrorMessage('KWSP');
      } else if (finalAge > maxAgeForKWSP && this.state.accountType !== 'CS') {
        this.showAlert(ageErrorMessage);
      } else {
        this.props.history.push('/onboarding/introduction/introDetailInput');
      }
    }
    
    if (nextProps.isExistingClient) {
      this.props.history.push('/onboarding/introduction/customerExist');
    } 
  }

  componentDidMount() {
    this.props.resetCifAlreadyExist();
    if (this.props.personalDetails) {
      if (this.props.personalDetails.passportIdentificationType) {
        this.props.change('identificationType', this.props.personalDetails.passportIdentificationType);
      }
      if (this.props.personalDetails.identificationType) {
        this.props.change('identificationType', this.props.personalDetails.identificationType);
      }
      if (this.props.personalDetails.passportNumber) {
        this.props.change('identificationNumber', this.props.personalDetails.passportNumber);
      }
      if (this.props.personalDetails.identificationNumber) {
        this.props.change('identificationNumber', this.props.personalDetails.identificationNumber);
      }
    }
  }

  componentWillMount() {
    rejectBackButton();
    this.props.setStep(2);
    this.props.setTitle('Hello! Please tell us about yourself.');
  }

  notify = (msg) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
        className: {},
      });
    }
  };

  handleChange = (event) => {
    if (event.target.value === 'IC') {
      this.setState({
        uploadType: 'IC',
      }, () => {
        this.clearRemainingFields();
        this.setIdentificationType(null);
      });
    } else if (event.target.value === 'Passport') {
      this.setState({
        uploadType: 'Passport',
      }, () => {
        this.clearRemainingFields();
        this.setIdentificationType('PSPORT');
      });
    } else if (event.target.value === 'NRIC') {
      this.setState({
        idType: event.target.value,
      });
    }
  };

  handleChangeIdType = (idType) => {
    this.setState({
      idType,
    }, () => {
      if (this.accountTypeAlteredNum > 1) {
        this.props.change('epfMembershipNumber', null);
      }
      if (idType === 'PSPORT') {
        this.props.change('identificationType', idType);
      }
    });
  }

  getDateOfBirth() {
    if (this.props && this.props.formState && this.props.formState.values) {
      const dob = this.props.formState.values.identificationNumber;
      if (this.state.idType === 'NRIC' && dob.slice(0, 6).length >= 6 && _isNumber(parseInt(dob.slice(0, 6)))) {
        return retrieveDateOfBirth(dob);
      }
    } return null;
  }

  showAlert(msg) {
    confirmAlert({
      customUI: ({ onClose }) => <ErrorModal msg={msg} handleClose={() => {
        this.props.resetCifAlreadyExist();
        onClose();
      }} open showClose />,
      // message: msg,
      // buttons: [
      //   {
      //     label: 'Ok',
      //     onClick: () => {
      //       this.clearRemainingFields();
      //     },
      //   },
      // ],
      // willUnmount: () => {
      //   // console.log('willUnmount');
      // },
      // childrenElement: () => <p></p>,
    });
  }

  processCIFDetails(dateOfBirth) {
    this.props.saveKWSPandCashDetails({
      createKwspAccountParams: {
        AccountType: this.state.accountCategory,
        epfMembershipNumber: this.props.formState.values.epfMembershipNumber || null,
        islamicORConventionalFlag: this.state.islamicORConventionalFlag || null,
      },
      dateOfBirth,
      identificationNumber: this.props.formState.values.identificationNumber,
      idType: this.state.idType,
    });

    this.props.checkCif({
      uploadType: this.state.uploadType,
      identificationType: this.state.uploadType === 'Passport' ? 'PSPORT' : this.props.formState.values.identificationType,
      identificationNumber: this.props.formState.values.identificationNumber ? this.props.formState.values.identificationNumber.toUpperCase() : null,
    });
  }

  handleAccountErrorMessage(accountType) {
    this.notify(`You must be ${minAgeForAccountCreation} years or older to open a ${accountType} account.`);
  }

  handleInvalidIdNumberMessage() {
    this.notify('Invalid IC number');
  }

  validateAgeCS(finalAge) {
    if (_isFinite(finalAge)) {
      this.handleAccountErrorMessage('cash');
    } else {
      this.handleInvalidIdNumberMessage();
    }
  }

  next(event) {
    event.preventDefault();
    const { finalAge, dateOfBirth } = checkCustomerAge(this.getDateOfBirth());

    if (this.props && this.props.formState) {
      if (this.state.idType === 'NRIC') {
        if (_isFinite(finalAge)) {
          if (this.state.accountType !== 'CS') {
            this.processCIFDetails(dateOfBirth);
          } else if (finalAge < minAgeForAccountCreation) {
            this.validateAgeCS(finalAge);
          } else {
            this.processCIFDetails(dateOfBirth);
          }
        } else {
          this.handleInvalidIdNumberMessage();
        }
      } else {
        this.processCIFDetails(dateOfBirth);
      }
    }
  }

  back() {
    this.props.history.push('/dashboard');
  }

  clearRemainingFields() {
    this.setState({
      accountType: null,
      idType: null,
      accountTypeAlteredNum: 0,
      isEpfVisible: false,
    }, () => {
      this.props.change('identificationType', null);
      this.props.change('identificationNumber', null);
      this.props.change('epfMembershipNumber', null);
      this.props.change('accountType', null);
    });
  }

  setIdentificationType(identificationType) {
    this.props.change('identificationType', identificationType);
    this.handleChangeIdType(identificationType);
  }

  clearKwspFields() {
    this.props.change('epfMembershipNumber', null);
  }

  setAccountType(accountType, isEpfVisible, islamicORConventionalFlag, accountCategory) {
    this.setState({
      accountType,
      isEpfVisible,
      islamicORConventionalFlag,
      accountCategory,
    }, () => {
      this.accountTypeAlteredNum = this.accountTypeAlteredNum + 1;
      this.props.change('accountType', accountType);
      if ((accountType === 'C' || accountType === 'I')) {
        if (!(this.state.uploadType === 'Passport')) {
          this.setIdentificationType('NRIC');
        } else {
          this.setIdentificationType('PSPORT');
        }
      } else {
        this.clearKwspFields();
        this.setIdentificationType(this.props.formState.values.identificationType);
      }
    });
  }

  checkAccountType() {
    const { accountType } = this.state;
    return (accountType === 'I' || accountType === 'C');
  }

  getFormValidation() {
    if (this.state.idType === 'NRIC') {
      return (required(this.props.formState.values.identificationNumber)
        || length12(this.props.formState.values.identificationNumber)
        || zeroOnly(this.props.formState.values.identificationNumber)
      );
    } return false;
  }

  getAccountTypes(accountTypes) {
    const { uploadType, idType } = this.state;
    if (uploadType === 'Passport' || idType === 'ARID' || idType === 'POID') {
      return accountTypes.filter((account) => account.codevalue === 'CS');
    }
    return accountTypes;
  }

  render() {
    const { accountType } = this.state;
    const { formState } = this.props;
    let epfErrorMessage = false;

    if (formState && formState.values) {
      const { epfMembershipNumber } = formState.values;
      if (epfMembershipNumber && epfMembershipNumber.length !== 8) {
        epfErrorMessage = true;
      } else {
        epfErrorMessage = false;
      }
    }

    if (_isEmpty(this.props.lov)) {
      return <LoadingOverlay show />;
    }
    const { IdTypes } = DictionaryMapper(this.props.lov.Dictionary);
    let IDTypesWithoutPassword = IdTypes.slice(0);
    IDTypesWithoutPassword = IDTypesWithoutPassword.filter((obj) => obj.codevalue !== 'PSPORT');

    return (
      <Form onSubmit={this.next} autoComplete="off" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <LoadingOverlay show={this.props.processing} />
        {/* <CifDialog redirect={this.back} /> */}
        <Text size="18px" color="#1d1d26" lineHeight="1.43" weight="bold">
          Let’s start with your identification
        </Text>
        <RowGridCenter spacing={24}>
          <MirrorGridItem item xs={6}>
            <StyledRadioButton
              checked={this.state.uploadType === 'IC'}
              value="IC"
              control={<Radio />}
              label="IC"
              onChange={this.handleChange}
            />
          </MirrorGridItem>
          <MirrorGridItem item xs={6}>
            <StyledRadioButton
              checked={this.state.uploadType === 'Passport'}
              value="Passport"
              control={<Radio />}
              label="Passport"
              onChange={this.handleChange}
            />
          </MirrorGridItem>
        </RowGridCenter>
        <RowGridCenter spacing={24}>
          <MirrorGridItem item xs={6}>
            <StyledField
              disabled={this.state.uploadType === 'Passport' || this.checkAccountType()}
              validate={required}
              label="ID TYPE"
              name="identificationType"
              data={this.state.uploadType !== 'Passport' ? IDTypesWithoutPassword : IdTypes}
              component={ReactSelectField}
              placeholder="Select id type"
              uploadType={this.state.uploadType}
              handleChangeIdType={(idType) => this.handleChangeIdType(idType)}
            />
          </MirrorGridItem>
          <MirrorGridItem item xs={6}>
            <StyledField
              name="identificationNumber"
              InputLabelProps={{
                shrink: true,
              }}
              component={InputField}
              label="ID NUMBER"
              type="text"
              placeholder="..."
              validate={this.state.idType === 'NRIC' ?
                [length12, zeroOnly]
                : [maxLength(maxLengthIdNo), zeroOnly]
              }
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.next(e);
                }
              }}
            />
          </MirrorGridItem>
        </RowGridCenter>
        <AccountType epfErrorMessage={epfErrorMessage} accountTypes={this.getAccountTypes(accountTypes)} setAccountType={(accountType, isEpfVisible, islamicORConventionalFlag, accountCategory) => this.setAccountType(accountType, isEpfVisible, islamicORConventionalFlag, accountCategory)} isEpfVisible={this.state.isEpfVisible} />
        <RowGridCenter spacing={24}>
          <MirrorGridItem item xs={6}>
            <StyledButton onClick={this.back} primary>
              Back
            </StyledButton>
          </MirrorGridItem>
          <MirrorGridItem item xs={6}>
            <StyledButton
              type="submit"
              disabled={
                this.getFormValidation() ||
                this.state.uploadType === '' ||
                !this.props.formState ||
                !this.props.formState.values ||
                !this.props.formState.values.identificationType ||
                !this.props.formState.values.identificationNumber ||
                !this.props.formState.values.accountType ||
                (
                  ((accountType === 'C' || accountType === 'I') && (
                    !this.props.formState.values.epfMembershipNumber))
                ) || this.props.formState.syncErrors
              }
              primary
            >
              Continue
            </StyledButton>
          </MirrorGridItem>
        </RowGridCenter>
      </Form >
    );
  }
}

const mapStateToProps = createStructuredSelector({
  lov: makeSelectLOV(),
  formState: (state, ownProps) => state.form.CifDetails, // <== Inject the form store itself
  cifDetails: makeSelectCifDetails(),
  processing: makeSelectProcessing(),
  isExistingClient: makeSelectIsExistingClient(),
  personalDetails: makeSelectPersonalDetails(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    change: (name, value) => dispatch(change('CifDetails', name, value)),
    saveCifDetails: (payload) => dispatch(saveCifDetails(payload)),
    checkCif: (payload) => dispatch(checkCif(payload)),
    resetCifAlreadyExist: () => dispatch(resetCifAlreadyExist()),
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    saveKWSPandCashDetails: (payload) => dispatch(saveKWSPandCashDetails(payload)),
  };
}

const ReduxCifDetailsForm = reduxForm({
  form: 'CifDetails', // a unique identifier for this form
  destroyOnUnmount: true,
})(CifVerification);

// export default connect(mapStateToProps, mapDispatchToProps)(CifVerification);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxCifDetailsForm);
