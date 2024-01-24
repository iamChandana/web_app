import _isEmpty from 'lodash/isEmpty';
import _isDate from 'lodash/isDate';

export default function checkNonEditableFieldsValues(formFields) {
  return (_isEmpty(formFields.AccMobileNo) ||
    _isEmpty(formFields.identificationNumber) ||
    _isEmpty(formFields.identificationType) ||
    (formFields.dateOfBirth === 'Invalid date')
  );
}
