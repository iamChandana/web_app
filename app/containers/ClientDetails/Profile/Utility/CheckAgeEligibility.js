import moment from 'moment';

export default function CheckAgeEligibility(dateOfBirth) {
  const currentDob = moment(dateOfBirth);
  let numberOfDaysIntoFuture = 10;
  for (let day = 1; day <= numberOfDaysIntoFuture; day += 1) {
    const nextTenDays = moment().add(day, 'days');
    if (nextTenDays.day() === 6 || nextTenDays.day() === 0) {
      numberOfDaysIntoFuture += 1;
    }
  }

  const futureDob = moment().add(numberOfDaysIntoFuture, 'days');
  const age = futureDob.diff(currentDob, 'years');
  return age;
}
