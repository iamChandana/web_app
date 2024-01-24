function getAddressLine(addressItem, index, formValues) {
  switch (addressItem) {
      case 'PERMANENT': {
          return formValues[`permanentAddressLine${index}`];
        }
      case 'CORRESPONDENCE': {
          return formValues[`correspondenceAddressLine${index}`];
        }
      case 'COMPANY': {
          return formValues[`companyAddressLine${index}`];
        }
    }
}

function getPostalCode(addressItem, index, formValues) {
  switch (addressItem) {
      case 'PERMANENT': {
          return formValues.permanentPostalCode;
        }
      case 'CORRESPONDENCE': {
          return formValues.correspondencePostalCode;
        }
      case 'COMPANY': {
          return formValues.companyPostalCode;
        }
    }
}

function getState(addressItem, index, formValues) {
  switch (addressItem) {
      case 'PERMANENT': {
          return formValues.permanentState;
        }
      case 'CORRESPONDENCE': {
          return formValues.correspondenceState;
        }
      case 'COMPANY': {
          return formValues.companyState;
        }
    }
}

function getCountry(addressItem, index, formValues) {
  switch (addressItem) {
      case 'PERMANENT': {
          return formValues.permanentCountry;
        }
      case 'CORRESPONDENCE': {
          return formValues.correspondenceCountry;
        }
      case 'COMPANY': {
          return formValues.companyCountry;
        }
    }
}

function clearAddressFields(formValues) {
  const maxTaxResidents = 3;

  for (let index = 0; index < maxTaxResidents; index++) {
      if (Object.prototype.hasOwnProperty.call(formValues, `permanentAddressLine${index + 1}`)) {
          delete formValues[`permanentAddressLine${index + 1}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `permanentAddressLine${index + 2}`)) {
          delete formValues[`permanentAddressLine${index + 2}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `permanentAddressLine${index + 3}`)) {
        delete formValues[`permanentAddressLine${index + 3}`];
      }
      if (Object.prototype.hasOwnProperty.call(formValues, 'permanentCountry')) {
          delete formValues['permanentCountry'];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, 'permanentPostalCode')) {
          delete formValues['permanentPostalCode'];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, 'permanentState')) {
          delete formValues['permanentState'];
        }
    }
  for (let index = 0; index < maxTaxResidents; index++) {
      if (Object.prototype.hasOwnProperty.call(formValues, `correspondenceAddressLine${index + 1}`)) {
          delete formValues[`correspondenceAddressLine${index + 1}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `correspondenceAddressLine${index + 2}`)) {
          delete formValues[`correspondenceAddressLine${index + 2}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `correspondenceAddressLine${index + 3}`)) {
        delete formValues[`correspondenceAddressLine${index + 3}`];
      }
      if (Object.prototype.hasOwnProperty.call(formValues, 'correspondenceCountry')) {
          delete formValues['correspondenceCountry'];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, 'correspondencePostalCode')) {
          delete formValues['correspondencePostalCode'];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, 'correspondenceState')) {
          delete formValues['correspondenceState'];
        }
    }

  for (let index = 0; index < maxTaxResidents; index++) {
      if (Object.prototype.hasOwnProperty.call(formValues, `companyAddressLine${index + 1}`)) {
          delete formValues[`companyAddressLine${index + 1}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `companyAddressLine${index + 2}`)) {
          delete formValues[`companyAddressLine${index + 2}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `companyAddressLine${index + 3}`)) {
        delete formValues[`companyAddressLine${index + 3}`];
      }
      if (Object.prototype.hasOwnProperty.call(formValues, 'companyCountry')) {
          delete formValues['companyCountry'];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, 'companyPostalCode')) {
          delete formValues['companyPostalCode'];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, 'companyState')) {
          delete formValues['companyState'];
        }
    }
  return formValues;
}

export default function createAddressArray(formValues) {
  const maxNumberOfAddressTypes = ['PERMANENT', 'CORRESPONDENCE', 'COMPANY'];
  let formattedAddressArray = [];

  formattedAddressArray = maxNumberOfAddressTypes.map((addressItem) => ({
            addressline1: getAddressLine(addressItem, 1, formValues),
            addressline2: getAddressLine(addressItem, 2, formValues),
            addressline3: getAddressLine(addressItem, 3, formValues),
            postalCode: getPostalCode(addressItem, 0, formValues),
            state: getState(addressItem, 0, formValues),
            country: getCountry(addressItem, 0, formValues),
            addresstype: addressItem,
        }));
  formValues = {
      ...formValues,
      address: formattedAddressArray,
    };

  formValues = clearAddressFields(formValues);

  return formValues;
}
