import React from 'react';
import PropTypes from 'prop-types';

import CashSchemeIcon from './assets/cash_scheme_blue.svg';
import KWSPSchemeIcon from './assets/KWSP_scheme_blue.svg';

export const AccountNumber = ({ accountType, partnerAccountNo }) => (
  <div style={{ display: 'inline' }}>
    <span style={{ fontWeight: 'bolder', fontSize: '14px', verticalAlign: 'unset' }}>
      <img src={accountType === 'CS' ? CashSchemeIcon : KWSPSchemeIcon} alt="Account type" width="17px" /> {partnerAccountNo}
    </span>
  </div>
);

AccountNumber.propTypes = {
  accountType: PropTypes.string.isRequired,
  partnerAccountNo: PropTypes.string,
};
