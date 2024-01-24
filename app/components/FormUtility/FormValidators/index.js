import moment from 'moment';

export const required = (value) => (value && value !== 'none' ? undefined : 'Required');
export const maxLength = (max) => (value) => (value && value.length > max ? `Must be ${max} characters or less` : undefined);
export const minLength = (min) => (value) => (value && value.length < min ? `Must be ${min} characters or more` : undefined);
export const length = (length) => (value) => (value && value.length === length ? undefined : `Must be ${length} characters`);
export const number = (value) => (value && isNaN(Number(value)) ? 'Must be a number' : undefined);
export const minValue = (min) => (value) => (value && value < min ? `Must be at least ${min}` : undefined);
export const email = (value) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email address' : undefined;
export const alphaNumeric = (value) => (value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only alphanumeric characters' : undefined);
export const alpha = (value) => (value && /^[a-zA-Z]+$/.test(value) ? 'Only letters' : undefined);
export const phoneNumber = (value) =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? 'Invalid phone number, must be 10 digits' : undefined;
export const validPassword = (value) =>
  value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i ? 'Invalid password.' : undefined;
export const zeroOnly = (value) => (value && /^0*$/.test(value) ? 'Value cannot be 0s' : undefined);
export const minLength8 = minLength(8);
export const length8 = length(8);
export const length12 = length(12);
export const minValue1 = minValue(1);
export const maxValueMonthlySaving = (max) => (value) => (value && value > max ? `Must be not more than ${max}` : undefined);
export const maxValueMonthlySaving1Billion = maxValueMonthlySaving(1000000000);

export const validatePasswordSchema = (pass) => {
  let characterRule = false;
  let uppercaseRule = false;
  let numberRule = false;

  if (pass) {
    characterRule = pass.length >= 8;
    try {
      for (let i = 0; i < pass.length; i++) {
        const c = pass.charAt(i);
        if (!isNaN(parseInt(c, 10))) {
          numberRule = true;
        } else if (c && /^[A-Z]*$/.test(c)) {
          uppercaseRule = true;
        }
      }
    } catch (err) {}
  }

  return {
    characterRule,
    uppercaseRule,
    numberRule,
  };
};

export const validatePassportDate = (value) => {
  const today = moment().startOf('day');
  if (value <= today) {
    // mean error
    return true;
  }
  return false;
  /*
  const dayAfterSixMonth = moment().startOf('day').add(6, 'months');
  const isBtw = value.isBetween(today, dayAfterSixMonth);
  if (isBtw) {
    return true;
  } else {
    return false;
  }
  */
};

export const invalidDateFormatCheck = (value) => {
  const invalidFormats = ['Invalid date', 'DD/MM/YYYY'];
  if (invalidFormats.includes(value)) return true;
  return false;
};

export default {
  minLength8,
  required,
  alphaNumeric,
  validPassword,
  email,
  minValue,
  number,
  maxLength,
  phoneNumber,
  alpha,
  minValue1,
  validatePasswordSchema,
  validatePassportDate,
  maxValueMonthlySaving1Billion,
  length8,
};
