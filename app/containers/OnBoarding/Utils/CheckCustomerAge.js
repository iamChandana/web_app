import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';

function checkFutureDOB() {
  let numberOfDaysIntoFuture = 9; // It should have been 10 but the moment takes one extra day as the invalid day, so had to reduce the number of future days by 1
  for (let day = 1; day <= numberOfDaysIntoFuture; day += 1) {
    const nextTenDays = moment().add(day, 'days');
    if (nextTenDays.day() === 6 || nextTenDays.day() === 0) {
      numberOfDaysIntoFuture += 1;
    }
  }
  return moment().add(numberOfDaysIntoFuture, 'days');
}

export default function checkCustomerAge(customerDOB) {
  if (_isEmpty({ customerDOB })) {
    return { finalAge: null, dateOfBirth: null };
  }
  const maxAgeForKwsp = 55;
  const previousYear = moment().year() - 1;
  const birthYearDOB = moment(customerDOB).get('year');
  const presentYearDOB = moment(customerDOB).set('year', moment().year());
  const previousYearDOB = moment(customerDOB).set('year', previousYear);
  const previousMonth = moment(presentYearDOB).set('month', moment().month() - 1);
  let calculatedAge;
  // const currentYearDOB = moment().year();

  const ageYear = previousYear - birthYearDOB;
  const ageMonth = presentYearDOB.diff(previousYearDOB, 'months', true);
  const monthPendingOrExceeded = moment().diff(presentYearDOB, 'months', true);

  if (ageYear >= maxAgeForKwsp) {
    calculatedAge = ageYear;
    console.log('FA1', calculatedAge, ageYear, ageMonth)
    return { finalAge: calculatedAge, dateOfBirth: customerDOB };
  } else if ((ageYear + (ageMonth + monthPendingOrExceeded) / 12) >= maxAgeForKwsp) {
    calculatedAge = ageYear + ((ageMonth + monthPendingOrExceeded) / 12);
    console.log('FA2', calculatedAge, ageYear, ageMonth, monthPendingOrExceeded)
    return { finalAge: calculatedAge, dateOfBirth: customerDOB };
  } else if (checkFutureDOB().diff(presentYearDOB, 'day') >= 0 && (moment(presentYearDOB).get('year') - birthYearDOB === maxAgeForKwsp)) {
    calculatedAge = maxAgeForKwsp;
    console.log('FA3', calculatedAge, ageYear, ageMonth)
    return { finalAge: calculatedAge, dateOfBirth: customerDOB };
  }
  calculatedAge = ageYear + ((ageMonth + monthPendingOrExceeded) / 12);
  console.log('FA4', calculatedAge, ageMonth, monthPendingOrExceeded)
  return { finalAge: calculatedAge, dateOfBirth: customerDOB };
}
