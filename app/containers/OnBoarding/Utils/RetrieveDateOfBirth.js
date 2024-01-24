import moment from 'moment';
import _floor from 'lodash/floor';

export default function retrieveDateOfBirth(dobValue) {
  let dob = dobValue;
  const yearOfBirth = parseInt(dob.slice(0, 2));
  dob = dobValue;
  const monthOfBirth = parseInt(dob.slice(2, 4));
  dob = dobValue;
  const dayOfBirth = parseInt(dob.slice(4, 6));
  const currentCentury = _floor((moment().year() / 100)) * 100;
  const previousCentury = currentCentury - 100;
  let dateOfBirth;

  const minYearDifference = moment().year() - (yearOfBirth + currentCentury);
  // minYearDifference = minYearDifference > 0 ? minYearDifference : minYearDifference * (-1);

  if (moment().year() - (yearOfBirth + currentCentury) < 0) {
    dateOfBirth = `${dayOfBirth}/${monthOfBirth}/${yearOfBirth + previousCentury}`;
  } else {
    dateOfBirth = `${dayOfBirth}/${monthOfBirth}/${yearOfBirth + currentCentury}`;
  }
  return new Date(moment(dateOfBirth, 'DD/MM/YYYY'));
}
