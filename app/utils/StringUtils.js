export const toMoneyFormat = (number) => number.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,');
export const suppressMobileNo = (mobile) => {
  if (mobile !== undefined && mobile !== null) {
    const len = mobile.length;
    const mobilepart = mobile.slice(3, len - 4);
    return mobile.replace(mobilepart, 'xxxxx');
  }
  return '';
};

export const numberWithCommas = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const toUpperCase = (string) => (string ? string.toUpperCase() : string);
