import moment from 'moment';

export default function (birthday) {
  const age = moment().diff(birthday, 'years');
  return age;
}
