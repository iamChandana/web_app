function addRemainingFields(formValues, clientInfo) {
  if (clientInfo) {
    formValues = {
      ...formValues,
      riskAppetite: clientInfo.info.riskAppetite,
      cpamRiskScore: clientInfo.info.ISAF_SCORE,
      profield: '',
      holdPositionFlag: clientInfo.info.holdPositionFlag,
    };
  }
  return formValues;
}

function clearRedundantFields(formFields) {
  if (formFields) {
    if (Object.prototype.hasOwnProperty.call(formFields, 'identificationNumber')) {
      delete formFields.identificationNumber;
    }
    if (Object.prototype.hasOwnProperty.call(formFields, 'identificationType')) {
      delete formFields.identificationType;
    }
  }
  return formFields;
}

function getIdDescription(idType) {
  switch (idType) {
    case 'ARID': {
      return 'ARMY ID';
    }
    case 'NRIC': {
      return 'MALAYSIA ID';
    }
    case 'POID': {
      return 'POLICE ID';
    }
    case 'PSPORT': {
      return 'PASSPORT';
    }
  }
}

export default function createIdObj(formValues, initialValues, clientInfo) {
  let ID = {};
  ID = {
    identificationType: formValues.identificationType,
    identificationNumber: formValues.identificationNumber,
    identificationTypeDescription: getIdDescription(formValues.identificationType),
  };

  formValues = clearRedundantFields(formValues);

  formValues = {
    ...formValues,
    ID,
    usTaxResident: clientInfo.info.usTaxResident,
    foreignTaxNo: clientInfo.info.foreignTaxNo,
    agentId: clientInfo.info.agentId,
  };

  delete formValues.userNumber;
  delete formValues.kwspUTRNumber;
  delete formValues.numTaxResidentInfo;
  delete formValues.isTaxResidentOfMalaysia;
  delete formValues.isTaxResidentOfOtherCountry;
  delete formValues.isEditable;
  delete formValues.interests;
  delete formValues.incomeTaxNo;
  delete formValues.id;
  delete formValues.UTRNumber;
  delete formValues.accountId;
  delete formValues.accountStatus;
  delete formValues.bankAcctName;
  delete formValues.bankAcctNumber;
  delete formValues.cashUTRNumber;
  delete formValues.customerId;
  delete formValues.doesTaxResidentsAvailable;
  delete formValues.expiryDate;
  delete formValues.expiryDateVisa;
  delete formValues.bankAcctName;

  formValues = addRemainingFields(formValues, clientInfo);
  return formValues;
}
