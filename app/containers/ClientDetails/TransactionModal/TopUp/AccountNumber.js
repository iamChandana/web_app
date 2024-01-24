import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Text from 'components/Text';
import CashSchemeIcon from 'containers/ClientDetails/Funds/assets/cash_scheme_blue.svg';
import KWSPSchemeIcon from 'containers/ClientDetails/Funds/assets/KWSP_scheme_blue.svg';

const AccountNumberWrapper = styled.div`
  display: inline-flex;
  align-items: center;

  & > img {
    margin-right: 2px;
  }
`;

export const AccountNumber = ({ accountType, accountNo }) => (
  <AccountNumberWrapper>
    <img src={accountType === 'CS' ? CashSchemeIcon : KWSPSchemeIcon} alt="Account type" width={17} height={17} />
    <Text align="left" weight="bold">
      {accountNo}
    </Text>
  </AccountNumberWrapper>
);

AccountNumber.propTypes = {
  accountType: PropTypes.string.isRequired,
  accountNo: PropTypes.string.isRequired,
};
