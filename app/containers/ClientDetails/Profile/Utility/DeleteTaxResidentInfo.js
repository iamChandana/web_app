export default function deleteTaxResidentInfo(formValues) {
  const maxTaxResidents = 3;

  for (let index = 0; index < maxTaxResidents; index++) {
      if (Object.prototype.hasOwnProperty.call(formValues, `isTaxResidentTaxIdentificationNumberAvailable${index + 1}`)) {
          delete formValues[`isTaxResidentTaxIdentificationNumberAvailable${index + 1}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `taxResidentCountry${index + 1}`)) {
          delete formValues[`taxResidentCountry${index + 1}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `taxResidentTaxIdentificationNumber${index + 1}`)) {
          delete formValues[`taxResidentTaxIdentificationNumber${index + 1}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `taxResidentTaxIdentificationNumberUnAvailableReason${index + 1}`)) {
          delete formValues[`taxResidentTaxIdentificationNumberUnAvailableReason${index + 1}`];
        }
      if (Object.prototype.hasOwnProperty.call(formValues, `taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${index + 1}`)) {
          delete formValues[`taxResidentTaxIdentificationNumberUnAvailableReasonExplanation${index + 1}`];
        }
    }
  formValues = {
      ...formValues,
      isTaxResidentOfOtherCountryInfo: formValues.taxResidents ? formValues.taxResidents : [],
    };
  delete formValues.taxResidents;

  return formValues;
}
