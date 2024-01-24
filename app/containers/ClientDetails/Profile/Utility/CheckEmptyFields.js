import _isEmpty from 'lodash/isEmpty';
import _isDate from 'lodash/isDate';

export default function checkIfMandatoryFieldsMissing(formFields, checkCheckBoxIsTaxResidentOfOtherCountry) {
  if (formFields) {
    return (
      checkPersonalDetailsSection(formFields.values) ||
      checkAddressDetailsSection(formFields.values) ||
      (checkCheckBoxIsTaxResidentOfOtherCountry && checkTaxResidenceDetailsSection(formFields.values)) ||
      checkEmploymentDetailsSection(formFields.values) ||
      checkAccountDetailsSection(formFields.values)
    );
  }
}

// CHECKS IF PERESONAL DETAILS ARE PRESENT
function checkPersonalDetailsSection(formFieldsPersonal) {
  let isEmpty = false;

  if (
    formFieldsPersonal &&
    (_isEmpty(formFieldsPersonal.fullName) ||
      _isEmpty(formFieldsPersonal.title) ||
      _isEmpty(formFieldsPersonal.identificationType) ||
      _isEmpty(formFieldsPersonal.identificationNumber) ||
      _isEmpty(formFieldsPersonal.UTRNumber) ||
      _isEmpty(formFieldsPersonal.race) ||
      _isEmpty(formFieldsPersonal.maritalStatus) ||
      _isEmpty(formFieldsPersonal.gender) ||
      formFieldsPersonal.dateOfBirth === 'Invalid date' ||
      _isEmpty(formFieldsPersonal.email) ||
      _isEmpty(formFieldsPersonal.AccMobileNo) ||
      _isEmpty(formFieldsPersonal.motherMaidenName) ||
      _isEmpty(formFieldsPersonal.interests) ||
      _isEmpty(formFieldsPersonal.nationality))
  ) {
    isEmpty = true;
  }
  return isEmpty;
}

// CHECKS IF THE ADDRESS DETAILS ARE PRESENT
function checkAddressDetailsSection(formFieldsAddress) {
  let isEmpty = false;

  if (
    formFieldsAddress &&
    (_isEmpty(formFieldsAddress.permanentAddressLine1) ||
      _isEmpty(formFieldsAddress.permanentAddressLine2) ||
      _isEmpty(formFieldsAddress.permanentCountry) ||
      _isEmpty(formFieldsAddress.permanentPostalCode) ||
      _isEmpty(formFieldsAddress.permanentState) ||
      _isEmpty(formFieldsAddress.correspondenceAddressLine1) ||
      _isEmpty(formFieldsAddress.correspondenceAddressLine2) ||
      _isEmpty(formFieldsAddress.correspondenceCountry) ||
      _isEmpty(formFieldsAddress.correspondencePostalCode) ||
      _isEmpty(formFieldsAddress.correspondenceState))
  ) {
    isEmpty = true;
  }
  return isEmpty;
}

// CHECKS IF TAX RESIDENCE INFORMATIONS ARE FULFILLED
function checkTaxResidenceDetailsSection(formFieldsTaxResidence) {
  let isEmpty = false;

  if (formFieldsTaxResidence) {
    if (_isEmpty(formFieldsTaxResidence.PlaceandCountryBirth)) {
      isEmpty = true;
      return isEmpty;
    }

    for (let index = 1; index <= formFieldsTaxResidence.numTaxResidentInfo; index++) {
      if (
        _isEmpty(formFieldsTaxResidence[`taxResidentCountry${index}`]) ||
        checkIfIncomeTaxAvailable(
          formFieldsTaxResidence,
          formFieldsTaxResidence[`isTaxResidentTaxIdentificationNumberAvailable${index}`],
          index,
        )
      ) {
        isEmpty = true;
        break;
      }
    }
  }
  return isEmpty;
}

// CHECKS IF ALL THE EMPLLYEE DETAILS ARE PRESENT
function checkEmploymentDetailsSection(formFieldsEmployeeDetails) {
  let isEmpty = false;

  if (
    formFieldsEmployeeDetails &&
    (_isEmpty(formFieldsEmployeeDetails.companyName) ||
      _isEmpty(formFieldsEmployeeDetails.occupationType) ||
      _isEmpty(formFieldsEmployeeDetails.yearlyIncome) ||
      _isEmpty(formFieldsEmployeeDetails.purposeofinvestment) ||
      _isEmpty(formFieldsEmployeeDetails.sourceoffunds) ||
      _isEmpty(formFieldsEmployeeDetails.permanentState) ||
      _isEmpty(formFieldsEmployeeDetails.companyAddressLine1) ||
      _isEmpty(formFieldsEmployeeDetails.companyAddressLine2) ||
      _isEmpty(formFieldsEmployeeDetails.companyCountry) ||
      _isEmpty(formFieldsEmployeeDetails.companyPostalCode) ||
      _isEmpty(formFieldsEmployeeDetails.companyState))
  ) {
    isEmpty = true;
  }
  return isEmpty;
}

// CHECKS IF ALL THE ACCOUNT DETAILS ARE PRESENT
function checkAccountDetailsSection(formFieldsAccountDetails) {
  let isEmpty = false;

  if (formFieldsAccountDetails && _isEmpty(formFieldsAccountDetails.bankAcctName)) {
    isEmpty = true;
  }
  return isEmpty;
}

// CHECKS IF INCOME TAX IS AVAILABLE
function checkIfIncomeTaxAvailable(formFieldsTaxResident, isIncomeTaxAvailable, index) {
  if (isIncomeTaxAvailable) {
    return _isEmpty(formFieldsTaxResident[`taxResidentTaxIdentificationNumber${index}`]);
  } else if (isIncomeTaxAvailable === false) {
    return checkReasonAndExplanation(formFieldsTaxResident, index);
  }
  return true;
}

// CHECKS IF REASON AND EXPLANATION (if required) IS AVAILABLE
function checkReasonAndExplanation(formFieldsTaxResident, index) {
  if (_isEmpty(formFieldsTaxResident[`taxResidentTaxIdentificationNumberUnAvailableReason${index}`])) {
    return true;
  }
  switch (formFieldsTaxResident[`taxResidentTaxIdentificationNumberUnAvailableReason${index}`]) {
    case 'Reason B': {
      return _isEmpty(formFieldsTaxResident[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${index}`]);
    }
    default: {
      return false;
    }
  }
}
