import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import { toast } from 'react-toastify';
import { reset as ResetForm } from 'redux-form';
import LoadingOverlay from 'components/LoadingOverlay';
import PersonalDetailsFields from 'components/FormUtility/PersonalDetailsFields';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import { rejectBackButton } from 'utils/helpers';
import {
  setTitle,
  setStep,
  savePersonalDetails,
  uploadPhoto,
  checkAmla,
  resetError,
  validatePersonalDetails,
  resetAmla,
  processing,
  saveDraft,
  getDraft,
  resetIntroductionPageDetails,
  saveKWSPandCashDetails,
  saveCifDetails,
} from 'containers/OnBoarding/actions';
import {
  makeSelectPersonalDetails,
  makeSelectIntroduction,
  makeSelectImage,
  makeSelectAnnualIncomeLOV,
  makeSelectProcessing,
  makeSelectAmlaPass,
  makeSelectError,
  makeSelectValidatedDetails,
  makeSelectValidateErrorDetails,
  makeSelectCifDetails,
  makeSelectDraftDetails,
  makekwspCashIntroDetails,
  makeSelectIsQueryISAFAmlaError,
} from 'containers/OnBoarding/selectors';
// import AmlaWarningModal from 'components/AmlaWarning';
import PhotoGuideDialog from 'components/PhotoBox/PhotoGuideDialog';
import PhotoContainer from './PhotoContainer';
import retrieveDateOfBirth from '../Utils/RetrieveDateOfBirth';
import checkCustomerAge from '../Utils/CheckCustomerAge';
import CheckAgeEligibility from '../../../containers/ClientDetails/Profile/Utility/CheckAgeEligibility';
import QueryISAFAmlaErrorModal from '../../../containers/ClientDetails/Funds/QueryISAFAmlaErrorModal';

class PersonalDetails extends React.Component {
  constructor(props) {
    super(props);

    this.isTINAvaliable1 =
      props.personalDetails && props.personalDetails.isTaxResidentTaxIdentificationNumberAvailable1
        ? props.personalDetails.isTaxResidentTaxIdentificationNumberAvailable1
        : props.draftDetails && props.draftDetails.data && props.draftDetails.data.isTaxResidentTaxIdentificationNumberAvailable1;
    this.isTINAvaliable2 =
      props.personalDetails && props.personalDetails.isTaxResidentTaxIdentificationNumberAvailable2
        ? props.personalDetails.isTaxResidentTaxIdentificationNumberAvailable2
        : props.draftDetails && props.draftDetails.data && props.draftDetails.data.isTaxResidentTaxIdentificationNumberAvailable2;
    this.isTINAvaliable3 =
      props.personalDetails && props.personalDetails.isTaxResidentTaxIdentificationNumberAvailable3
        ? props.personalDetails.isTaxResidentTaxIdentificationNumberAvailabl3
        : props.draftDetails && props.draftDetails.data && props.draftDetails.data.isTaxResidentTaxIdentificationNumberAvailable3;

    this.taxObj = {};

    const { dateOfBirth, fullName, interests, annualIncome, gender } = props.personalDetails || {};

    this.state = {
      // uploadType: props.cifDetails.uploadType || 'IC',
      uploadType: props.cifDetails.uploadType,
      personalDetails: {
        ...props.personalDetails,
        dateOfBirth:
          dateOfBirth || (!_isEmpty(props.introduction) ? props.introduction.dateOfBirth : props.draftDetails.data.dateOfBirth),
        fullName: fullName || (!_isEmpty(props.introduction) ? props.introduction.fullName : props.draftDetails.data.fullName),
        gender: gender || (!_isEmpty(props.introduction) ? props.introduction.gender : props.draftDetails.data.gender),
        interests: interests || (!_isEmpty(props.introduction) ? props.introduction.hobby : props.draftDetails.data.interests),
        annualIncome:
          annualIncome ||
          (!_isEmpty(props.introduction) ? props.introduction.annualIncome : props.draftDetails.data.annualIncome),
        region: 'MY',
      },
      showAmlaError: false,
      isOpenDialogGuideUploadPhoto: false,
      openDialogConfirmEmail: false,
      introductionDetails: props.introduction,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
    this.backToCurrentPageClick = this.backToCurrentPageClick.bind(this);
    this.showDialogGuideUploadPhoto = this.showDialogGuideUploadPhoto.bind(this);
    this.handleSaveDraft = this.handleSaveDraft.bind(this);
    this.formatFinalValues = this.formatFinalValues.bind(this);
    this.setTINAvailability = this.setTINAvailability.bind(this);
    this.clearOuterTaxInformation = this.clearOuterTaxInformation.bind(this);
    this.setIncomeTaxValue = this.setIncomeTaxValue.bind(this);
    this.structureTaxResdents = this.structureTaxResdents.bind(this);
    this.setDateOfBirth = this.setDateOfBirth.bind(this);
    this.handleAgeEligibilityPopUp = this.handleAgeEligibilityPopUp.bind(this);
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

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  componentWillMount() {
    const {
      cifDetails,
      getDraft,
      personalDetails,
      draftDetails: { data },
      introduction,
    } = this.props;
    const introductionDetailsObj = { ...data, ...introduction };
    rejectBackButton();
    this.props.setStep(5);
    this.props.setTitle('Next, please provide us with your personal details.');
    // if (_isEqual(introductionDetailsObj, data)) {
    //   getDraft(cifDetails);
    // }
  }

  componentDidMount() {
    if (this.props.processing) {
      setTimeout(() => {
        this.props.setProcessing(false);
      }, 5000);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.validatedDetails !== nextProps.validatedDetails && !_isEmpty(nextProps.validatedDetails)) {
    //   this.props.history.push('/onboarding/confirmation');
    //   this.props.checkAmla(nextProps.validatedDetails);
    // }

    if (this.props.introduction !== nextProps.introduction && _isEmpty(nextProps.introduction)) {
      this.setState(
        {
          introductionDetails: nextProps.introduction,
        },
        () => {
          console.log('is empty', nextProps.introduction);
        },
      );
    }

    if (this.props.amlaPass !== nextProps.amlaPass && nextProps.amlaPass) {
      this.props.resetAmla();
      this.props.setStep(6);
      this.props.history.push('/onboarding/confirmation');
    }

    if (
      (this.props.validateErrorDetails !== nextProps.validateErrorDetails && nextProps.validateErrorDetails) ||
      this.props.amlaPass === false
    ) {
      this.setState({
        showAmlaError: true,
      });
    }
  }

  checkIfImageComplete() {
    const images = this.props.image;
    const imageKeys =
      this.state.uploadType === 'IC' ? ['IC_Front', 'IC_Back'] : ['Passport_Front', 'Passport_Back', 'Passport_Visa'];
    let counter = 0;
    if (!_isEmpty(images)) {
      Object.keys(images).map((image) => {
        if (imageKeys.indexOf(image) > -1 && !_isEmpty(images[image])) {
          counter += 1;
        }
      });
    }

    if (this.state.uploadType === 'IC') {
      return counter >= 2;
    }
    return counter > 2;
  }

  handleSaveDraft(values) {
    const clone = { ...values };
    this.setState(
      {
        introductionDetails: null,
      },
      () => {
        if (values.isTaxResidentOfOtherCountry) {
          values.isTaxResidentOfOtherCountryInfo = [
            {
              no: 1,
              CountryJurisdiction: values.taxResidentCountry1 ? values.taxResidentCountry1 : '',
              IncomeTax: values.taxResidentTaxIdentificationNumber1 ? values.taxResidentTaxIdentificationNumber1 : '',
              ReasonTINNotAvailable: values.taxResidentTaxIdentificationNumberUnAvailableReason1
                ? values.taxResidentTaxIdentificationNumberUnAvailableReason1
                : '',
              RemarksReason: values.taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1
                ? values.taxResidentTaxIdentificationNumberUnAvailableReasonExplanation1
                : '',
            },
            {
              no: 2,
              CountryJurisdiction: values.taxResidentCountry2 ? values.taxResidentCountry2 : '',
              IncomeTax: values.taxResidentTaxIdentificationNumber2 ? values.taxResidentTaxIdentificationNumber2 : '',
              ReasonTINNotAvailable: values.taxResidentTaxIdentificationNumberUnAvailableReason2
                ? values.taxResidentTaxIdentificationNumberUnAvailableReason2
                : '',
              RemarksReason: values.taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2
                ? values.taxResidentTaxIdentificationNumberUnAvailableReasonExplanation2
                : '',
            },
            {
              no: 3,
              CountryJurisdiction: values.taxResidentCountry3 ? values.taxResidentCountry3 : '',
              IncomeTax: values.taxResidentTaxIdentificationNumber3 ? values.taxResidentTaxIdentificationNumber3 : '',
              ReasonTINNotAvailable: values.taxResidentTaxIdentificationNumberUnAvailableReason3
                ? values.taxResidentTaxIdentificationNumberUnAvailableReason3
                : '',
              RemarksReason: values.taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3
                ? values.taxResidentTaxIdentificationNumberUnAvailableReasonExplanation3
                : '',
            },
          ];
        } else {
          values.isTaxResidentOfOtherCountryInfo = [];
        }
        console.log('Values for Save Draft', values);
        this.props.saveDraft(values);
        // this.props.clearIntroductionPageDetails();
      },
    );
  }

  handleAgeEligibilityPopUp() {
    this.setState({
      showAgeEligibilityPopUp: !this.state.showAgeEligibilityPopUp,
    });
  }

  validateKwspAge(values) {
    const {
      kwspCashIntroDetails: { createKwspAccountParams },
    } = this.props;

    if (CheckAgeEligibility(values.dateOfBirth) >= 55) {
      this.handleAgeEligibilityPopUp();
    } else if (CheckAgeEligibility(values.dateOfBirth) < 18) {
      this.notify('You must be 18 years or older to open a KWSP account.');
    }
  }

  handleSubmit(values) {
    if (!this.checkIfImageComplete()) {
      if (this.state.uploadType === 'IC') {
        this.notify('Please upload IC front and back document images.');
      } else {
        this.notify('Please upload passport front and back document images and also Visa image.');
      }
      return;
    }

    // check age eligibility iff idType === NRIC
    if (values.identificationType === 'NRIC' && this.props.kwspCashIntroDetails.createKwspAccountParams.AccountType === 'KW') {
      this.validateKwspAge(values);
    }
    // check if passport is expired in 6 months time
    if (this.state.uploadType && this.state.uploadType.toLowerCase() === 'passport') {
      const today = moment().startOf('day');
      const dayAfterSixMonth = moment()
        .startOf('day')
        .add(6, 'months');
      const expiryDate = moment(values.expiryDate, 'DD/MM/YYYY');
      const expiryDateVisa = moment(values.expiryDateVisa, 'DD/MM/YYYY');
      let isBtw = expiryDate.isBetween(today, dayAfterSixMonth);

      if (isBtw) {
        this.notify('Passport should have minimum 6 months validity.');
        return;
      }

      isBtw = expiryDateVisa.isBetween(today, dayAfterSixMonth);

      if (isBtw) {
        this.notify('Visa should have minimum 6 months validity');
        return;
      }

      values.identificationNumber = null;
      values.identificationType = null;
      // values.expiryDate = moment(expiryDate).format('YYYY-MM-DD');
      // values.expiryDateVisa = moment(expiryDateVisa).format('YYYY-MM-DD');
    } else {
      values.passportNumber = null;
      values.passportIdentificationType = null;
    }

    // check if tax resident chheckboxes has been checked at least one of them
    if (!values.isTaxResidentOfMalaysia && !values.isTaxResidentOfOtherCountry) {
      console.log('00');
      return;
    }

    if (values.isTaxResidentOfOtherCountry) {
      if (values.isTaxResidentTaxIdentificationNumberAvailable1 === null) {
        return;
      }
      if (values.taxResidentCountry2 && values.isTaxResidentTaxIdentificationNumberAvailable2 === null) {
        return;
      }
      if (values.taxResidentCountry3 && values.isTaxResidentTaxIdentificationNumberAvailable3 === null) {
        return;
      }
    }

    // check if permanent State is entered
    if (!values.permanentState || !values.permanentState.trim()) {
      this.notify('Please enter a valid permanent State.');
      return;
    }

    // check if correspondence State is entered
    if (!values.correspondenceState || !values.correspondenceState.trim()) {
      this.notify('Please enter a valid correspondence State.');
      return;
    }

    /*
    values.correspondenceState = values.correspondenceState.trim();

    // check if it is valid correspondence State by comparing State map
    if (values.correspondenceCountry === 'MY') {
      const { State } = DictionaryMapper(this.props.lov.Dictionary);
      const result = State.filter((state) => state.description.toLowerCase() === values.correspondenceState.trim().toLowerCase());
      if (!result || result.length < 1) {
        this.notify(`Please enter a valid correspondence State.`);
        return;
      }

      // need to set correspondenceState to correspondenceStateInCodeValue because correspondenceState will display codeValue of the State
      values.correspondenceStateInCodeValue = result[0].codevalue;
    } else {
      // non-Malaysia country
      values.correspondenceStateInCodeValue = values.correspondenceState;
    }
    */

    values.uploadType = this.state.uploadType;

    this.setState(
      (prevState) => ({
        clientInputFinalValues: { ...this.props.kwspCashIntroDetails.createKwspAccountParams, ...this.formatFinalValues(values) },
      }),
      () => {
        // finally submit
        const { epfMembershipNumber } = this.state.clientInputFinalValues;
        const { createKwspAccountParams } = this.props.kwspCashIntroDetails;
        this.props.saveKWSPandCashDetails({
          ...this.props.kwspCashIntroDetails,
          createKwspAccountParams: {
            ...createKwspAccountParams,
            epfMembershipNumber,
          },
        });
        this.props.savePersonalDetails(this.state.clientInputFinalValues);
        this.props.validatePersonalDetails(this.state.clientInputFinalValues);
      },
    );
  }

  handleChange(event) {
    this.setState({
      uploadType: event.target.value,
    });
  }

  navigateTo(url) {
    if (url === 'home') {
      this.setState({
        showAmlaError: false,
      });
    } else {
      // reset form data
      this.props.formReset();
      this.props.history.push(url);
    }
    // remove validation error object from store
    this.props.resetError();
  }

  backToCurrentPageClick() {
    this.setState({
      showAmlaError: false,
    });
  }

  showDialogGuideUploadPhoto() {
    this.setState((prevState) => ({
      isOpenDialogGuideUploadPhoto: !prevState.isOpenDialogGuideUploadPhoto,
    }));
  }

  clearOuterTaxInformation(isTinAvailable, formattedTaxResidentArray, taxResidentIndex) {
    const taxResidentObj = {};

    if (formattedTaxResidentArray.length) {
      if (isTinAvailable) {
        taxResidentObj[`taxResidentTaxIdentificationNumber${taxResidentIndex}`] = formattedTaxResidentArray.filter(
          (taxItem) => taxItem.no === taxResidentIndex,
        )[0].IncomeTax;
        taxResidentObj[`taxResidentTaxIdentificationNumberUnAvailableReason${taxResidentIndex}`] = '';
        taxResidentObj[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${taxResidentIndex}`] = '';
      } else {
        taxResidentObj[`taxResidentTaxIdentificationNumber${taxResidentIndex}`] = '';
        taxResidentObj[
          `taxResidentTaxIdentificationNumberUnAvailableReason${taxResidentIndex}`
        ] = formattedTaxResidentArray.filter((taxItem) => taxItem.no === taxResidentIndex)[0].ReasonTINNotAvailable;
        taxResidentObj[
          `taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${taxResidentIndex}`
        ] = formattedTaxResidentArray.filter((taxItem) => taxItem.no === taxResidentIndex)[0].RemarksReason;
      }
    }

    return taxResidentObj;
  }

  setIncomeTaxValue(index, taxResidentItem, isTINAvailable) {
    let taxObj = {};

    if (isTINAvailable) {
      taxObj = {
        no: index,
        IncomeTax: taxResidentItem.IncomeTax,
        ReasonTINNotAvailable: '',
        RemarksReason: '',
        CountryJurisdiction: taxResidentItem.CountryJurisdiction,
      };
    } else {
      taxObj = {
        no: index,
        IncomeTax: '',
        ReasonTINNotAvailable: taxResidentItem.ReasonTINNotAvailable,
        RemarksReason: taxResidentItem.RemarksReason,
        CountryJurisdiction: taxResidentItem.CountryJurisdiction,
      };
    }

    console.log('TX', taxObj);
    return taxObj;
  }

  formFormattedArray(editedFields, {}) {
    const formattedTaxResidents = [];
    const maxTaxResidentLength = 3;

    for (let i = 0; i < maxTaxResidentLength; i++) {
      formattedTaxResidents.push({
        no: i + 1,
        CountryJurisdiction: editedFields[`taxResidentCountry${i + 1}`] || '',
        IncomeTax: editedFields[`taxResidentTaxIdentificationNumber${i + 1}`] || '',
        ReasonTINNotAvailable: editedFields[`taxResidentTaxIdentificationNumberUnAvailableReason${i + 1}`] || '',
        RemarksReason: editedFields[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${i + 1}`] || '',
      });
    }

    // delete editedFields[`taxResidentCountry${i + 1}`];
    // delete editedFields[`isTaxResidentTaxIdentificationNumberAvailable${i + 1}`];
    // delete editedFields[`taxResidentTaxIdentificationNumber${i + 1}`];
    // delete editedFields[`taxResidentTaxIdentificationNumberUnAvailableReason${i + 1}`];
    // delete editedFields[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${i + 1}`];

    return formattedTaxResidents;
  }

  structureTaxResdents(taxResidents) {
    const taxResidentFormattedValue = [];
    let taxResidentItem;
    let taxResidentObj = {};

    if (!taxResidents.isTaxResidentOfOtherCountry) {
      return {
        ...taxResidents,
        isTaxResidentOfOtherCountryInfo: [],
      };
    }

    taxResidents = {
      isTaxResidentOfOtherCountryInfo: [...this.formFormattedArray(taxResidents, {})],
    };

    taxResidentItem = taxResidents.isTaxResidentOfOtherCountryInfo.filter((taxResident) => taxResident.no === 1)[0];
    taxResidentFormattedValue.push(this.setIncomeTaxValue(1, taxResidentItem, this.isTINAvaliable1));

    taxResidentItem = taxResidents.isTaxResidentOfOtherCountryInfo.filter((taxResident) => taxResident.no === 2)[0];
    taxResidentFormattedValue.push(this.setIncomeTaxValue(2, taxResidentItem, this.isTINAvaliable2));

    taxResidentItem = taxResidents.isTaxResidentOfOtherCountryInfo.filter((taxResident) => taxResident.no === 3)[0];
    taxResidentFormattedValue.push(this.setIncomeTaxValue(3, taxResidentItem, this.isTINAvaliable3));

    taxResidentObj = { ...taxResidentObj, ...this.clearOuterTaxInformation(this.isTINAvaliable1, taxResidentFormattedValue, 1) };
    taxResidentObj = { ...taxResidentObj, ...this.clearOuterTaxInformation(this.isTINAvaliable2, taxResidentFormattedValue, 2) };
    taxResidentObj = { ...taxResidentObj, ...this.clearOuterTaxInformation(this.isTINAvaliable3, taxResidentFormattedValue, 3) };

    console.log('TAX OBJ', taxResidentObj, taxResidentFormattedValue);

    return {
      ...taxResidents,
      ...taxResidentObj,
      isTaxResidentOfOtherCountryInfo: [...taxResidentFormattedValue],
    };
  }

  formatFinalValues(formValues) {
    let finalFormattedValue = {};

    // STRUCTURE TAX RESIDENTS
    finalFormattedValue = { ...formValues, ...this.structureTaxResdents(formValues) };

    return finalFormattedValue;
  }

  setTINAvailability(taxResidentIndex, isTINAvailable) {
    switch (taxResidentIndex) {
      case 1: {
        this.isTINAvaliable1 = isTINAvailable;
        console.log('TIN1', this.isTINAvaliable1);
        break;
      }
      case 2: {
        this.isTINAvaliable2 = isTINAvailable;
        console.log('TIN2', this.isTINAvaliable2);
        break;
      }
      case 3: {
        this.isTINAvaliable3 = isTINAvailable;
        console.log('TIN3', this.isTINAvaliable3);
        break;
      }

      default: {
        this.isTINAvaliable1 = false;
        this.isTINAvaliable2 = false;
        this.isTINAvaliable3 = false;
      }
    }
  }

  setDateOfBirth(idNumber, formState) {
    const updatedDOB = retrieveDateOfBirth(idNumber);
    const finalUpdatedDOB = checkCustomerAge(updatedDOB);
    const cifObj = {
      ...this.props.cifDetails,
      ...formState.values,
      identificationNumber: idNumber,
    };
    const {
      values: { epfMembershipNumber },
    } = formState;
    const { createKwspAccountParams } = this.props.kwspCashIntroDetails;
    this.props.saveKWSPandCashDetails({
      ...this.props.kwspCashIntroDetails,
      createKwspAccountParams: {
        ...createKwspAccountParams,
        epfMembershipNumber,
      },
      dateOfBirth: finalUpdatedDOB.dateOfBirth,
      identificationNumber: idNumber,
    });
    this.props.saveCifDetails(cifObj);
    this.setState({
      introductionDetails: this.props.introduction,
    });
  }

  render() {
    const introduction = this.state.introductionDetails;

    if (_isEmpty(this.props.lov)) {
      return <LoadingOverlay show />;
    }

    const { draftDetails, personalDetails, kwspCashIntroDetails } = this.props;
    const {
      fullName,
      interests,
      hobby,
      annualIncome,
      gender,
      identificationNumber,
      identificationType,
      dateOfBirth: introDateOfBirth,
    } = personalDetails || {};
    if (_isEmpty(draftDetails) || _isEmpty(draftDetails.data)) return <LoadingOverlay show />;

    let formValues = {};
    // if (!_isEmpty(draftDetails)) {
    const { data } = draftDetails;
    let savedDateOfBirth = data.dateOfBirth;

    formValues = {
      ...draftDetails.data,
      ...personalDetails,
      fullName: fullName || data.fullName,
      gender: gender || data.gender,
      interests: hobby || interests || data.interests,
      annualIncome: annualIncome || data.annualIncome,
      region: 'MY',
      bankAcctName: fullName || data.fullName,
      identificationNumber,
      identificationType,
    };
    if (kwspCashIntroDetails && kwspCashIntroDetails.createKwspAccountParams) {
      const {
        createKwspAccountParams: { AccountType, epfMembershipNumber, islamicORConventionalFlag, effectiveDate },
        dateOfBirth,
        identificationNumber,
        idType,
      } = kwspCashIntroDetails;
      formValues = {
        permanentCountry: 'MY',
        correspondenceCountry: 'MY',
        ...formValues,
        ...introduction,
        identificationNumber,
        interests: interests || hobby,
        isKwsp: AccountType === 'KW',
        identificationType: idType,
        dateOfBirth: dateOfBirth || savedDateOfBirth || introDateOfBirth,
        epfMembershipNumber,
        bankAcctName: fullName,
        isIslamic: islamicORConventionalFlag === 'I',
        effectiveDate,
      };
    }

    const { uploadType } = this.state;
    const { image, processing, lov, validateErrorDetails, isQueryISAFAmlaError } = this.props;
    // console.log('PROPS', this.props);
    return (
      <React.Fragment>
        <LoadingOverlay show={processing} />
        {/* {!_isEmpty(validateErrorDetails) && (
          <AmlaWarningModal
            isOpen={this.state.showAmlaError}
            data={this.props.validateErrorDetails}
            navigateTo={this.navigateTo}
            fromPage={'Personal Details'}
            backButtonClick={() => this.backToCurrentPageClick()}
          />
        )} */}
        {isQueryISAFAmlaError ? (
          <QueryISAFAmlaErrorModal
            open={isQueryISAFAmlaError}
            isFromClientsFundPage={false}
            isFromOnboardingPage
            navigateToClientFundPage={() => this.props.history.push('/onboarding/personal-details')}
          />
        ) : null}
        <PhotoContainer
          image={image}
          uploadPhoto={this.props.uploadPhoto}
          uploadType={uploadType}
          handleChange={this.handleChange}
          showGuideTakePhoto={this.showDialogGuideUploadPhoto}
        />
        <PersonalDetailsFields
          onSubmit={this.handleSubmit}
          initialValues={formValues}
          uploadType={this.state.uploadType}
          lov={lov}
          handleSaveDraft={this.handleSaveDraft}
          draftDetails={draftDetails.data}
          setTINAvailability={(taxResidentIndex, isTINAvailable) => this.setTINAvailability(taxResidentIndex, isTINAvailable)}
          insidePersonalDetails
          setDateOfBirth={this.setDateOfBirth}
        />
        <PhotoGuideDialog
          isOpenDialogGuideUploadPhoto={this.state.isOpenDialogGuideUploadPhoto}
          showDialogGuideUploadPhoto={this.showDialogGuideUploadPhoto}
        />
        {/* <Dialog
          open={this.state.isOpenDialogGuideUploadPhoto}
          title={''}
          closeHandler={this.showDialogGuideUploadPhoto}
          content={
            <React.Fragment>
              <Grid container direction="column" justify="center" alignItems="center" style={{ marginBottom: '25px' }}>
                <Grid item xs={12} style={{ paddingBottom: '15px' }}>
                  <img src={ImgTakePhotoGuideHeader} />
                </Grid>
                <Grid item xs={12} style={{ paddingBottom: '25px' }}>
                  <Text weight="bold">
                    <Text color={Color.C_RED} display="inline" weight="bold">
                      NOTE:
                    </Text>
                    : Please clear your browser's cache to make sure we have the updated caching in your browser.
                  </Text>
                  <Text>
                    How-to Guide (Clear Cache):{' '}
                    <a href="https://kb.iu.edu/d/ahic" target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                      https://kb.iu.edu/d/ahi
                    </a>
                  </Text>
                </Grid>
                <Grid item xs={12} size="10px">
                  <Text>Take Photo for IC or Passport</Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginTop: '25px' }}>
                  <Text align="left">
                    <b>Step 1:</b> Click on the "Take Photo" button.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                  <img src={ImgTakePhotoGuidePic1} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <Text align="left">
                    <b>Step 2:</b> Take the photo and click on the "Circle" button as shown below.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                  <img src={ImgTakePhotoGuidePic2} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <Text align="left">
                    <b>Step 3:</b> After taking the photo, a pop-up will show to verify if the image is blurred or not. If blurred
                    or not clear click on the "Retake" button otherwise click on the "Ok" button to proceed.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                  <img src={ImgTakePhotoGuidePic3} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <Text align="left">
                    <b>Step 4:</b> Do Step 3 for the rest of the images.
                  </Text>
                  <Text color={Color.C_RED} display="inline" weight="bold">
                    NOTE:
                  </Text>{' '}
                  If you notice the image is still blurred, unclear or low quality you can click on the "Remove" hyperlink to
                  retake photo.
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <img src={ImgTakePhotoGuidePic4} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px', paddingTop: '40px', paddingBottom: '40px' }}>
                  <hr style={{ border: '1px solid #EDEEEE' }} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <Text align="left">
                    <b>Step 1:</b> Let's start funding, click on the "Upload Document" button to select either Bank Draft/Cheque.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                  <img src={ImgTakePhotoGuidePic5} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <Text align="left">
                    <b>Step 2:</b> In this guide, we selected Cheque, click on the "Upload" button.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                  <img src={ImgTakePhotoGuidePic6} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <Text align="left">
                    <b>Step 3:</b> In this guide, we are using iPad(iOS) you will have a option to click on "Take Photo" button as
                    default for iOS.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                  <img src={ImgTakePhotoGuidePic7} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <Text align="left">
                    <b>Step 4:</b> Take the photo and confirm if it's clear, if yes, click on the "Use Photo" button otherwise
                    click on the "Retake" button
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                  <img src={ImgTakePhotoGuidePic8} />
                </Grid>
                <Grid item xs={12} style={{ width: '900px' }}>
                  <Text align="left">
                    <b>Step 5:</b> Once done uploading the Cheque/Bank Draft, fill up the details needed then click on the
                    "Submit" button.
                  </Text>
                </Grid>
                <Grid item xs={12} style={{ width: '900px', marginBottom: '25px' }}>
                  <img src={ImgTakePhotoGuidePic9} />
                </Grid>
              </Grid>
            </React.Fragment>
          }
        /> */}
      </React.Fragment>
    );
  }
}

PersonalDetails.propTypes = {
  setTitle: PropTypes.func,
  history: PropTypes.object,
  setStep: PropTypes.func,
  introduction: PropTypes.object,
  personalDetails: PropTypes.object,
  lov: PropTypes.any,
  uploadPhoto: PropTypes.func,
  validatedDetails: PropTypes.object,
  savePersonalDetails: PropTypes.func,
  validatePersonalDetails: PropTypes.func,
  resetAmla: PropTypes.func,
  image: PropTypes.object,
  amlaPass: PropTypes.bool,
  checkAmla: PropTypes.func,
  processing: PropTypes.bool,
  validateErrorDetails: PropTypes.object,
  formReset: PropTypes.func,
  resetError: PropTypes.func,
  saveDraft: PropTypes.func,
  isQueryISAFAmlaError: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  personalDetails: makeSelectPersonalDetails(),
  introduction: makeSelectIntroduction(),
  image: makeSelectImage(),
  annualIncomeLOV: makeSelectAnnualIncomeLOV(),
  amlaPass: makeSelectAmlaPass(),
  error: makeSelectError(),
  processing: makeSelectProcessing(),
  lov: makeSelectLOV(),
  validatedDetails: makeSelectValidatedDetails(),
  validateErrorDetails: makeSelectValidateErrorDetails(),
  cifDetails: makeSelectCifDetails(),
  draftDetails: makeSelectDraftDetails(),
  kwspCashIntroDetails: makekwspCashIntroDetails(),
  isQueryISAFAmlaError: makeSelectIsQueryISAFAmlaError(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTitle: (payload) => dispatch(setTitle(payload)),
    setStep: (payload) => dispatch(setStep(payload)),
    savePersonalDetails: (payload) => dispatch(savePersonalDetails(payload)),
    uploadPhoto: (payload) => dispatch(uploadPhoto(payload)),
    checkAmla: (payload) => dispatch(checkAmla(payload)),
    resetError: () => dispatch(resetError()),
    resetAmla: () => dispatch(resetAmla()),
    validatePersonalDetails: (payload) => dispatch(validatePersonalDetails(payload)),
    formReset: () => dispatch(ResetForm()),
    setProcessing: (payload) => dispatch(processing(payload)),
    saveDraft: (payload) => dispatch(saveDraft(payload)),
    getDraft: (payload) => dispatch(getDraft(payload)),
    resetIntroductionPageDetails: (payload) => dispatch(resetIntroductionPageDetails(payload)),
    saveKWSPandCashDetails: (payload) => dispatch(saveKWSPandCashDetails(payload)),
    saveCifDetails: (payload) => dispatch(saveCifDetails(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonalDetails);
