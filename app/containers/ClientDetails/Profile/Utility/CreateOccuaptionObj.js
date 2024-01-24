export default function createOccupationObj(formValues) {
    let Occupation = {};
    Occupation = {
        companyName: formValues.companyName,
        natureofbusiness: formValues.natureofbusiness,
        occupationType: formValues.occupationType,
        yearlyIncome: formValues.yearlyIncome,
    };

    if (Object.prototype.hasOwnProperty.call(formValues, 'companyName')) {
        delete formValues.companyName;
    }
    if (Object.prototype.hasOwnProperty.call(formValues, 'natureofbusiness')) {
        delete formValues.natureofbusiness;
    }
    if (Object.prototype.hasOwnProperty.call(formValues, 'occupationType')) {
        delete formValues.occupationType;
    }
    if (Object.prototype.hasOwnProperty.call(formValues, 'yearlyIncome')) {
        delete formValues.yearlyIncome;
    }

    formValues = {
        ...formValues,
        Occupation,
    };

    return formValues;
}
