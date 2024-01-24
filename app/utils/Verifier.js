export const isValidEmail = (email) => {
  if (email) {
    // General Email Regex (RFC 5322 Official Standard)
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
    let result = re.test(String(email).toLowerCase());
    return !result ? 'Invalid Email Address' : false;
  } else {
    return 'Required';
  }
};