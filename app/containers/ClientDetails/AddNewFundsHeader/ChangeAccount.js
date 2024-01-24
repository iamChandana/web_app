/**
 *
 * ChangeAccount
 *
 */

import React from 'react';
import Text from 'components/Text';
import styled from 'styled-components';
import _find from 'lodash/find';
import Button from 'components/Button';
// import AccountIcon from './account.svg';
import CashSchemeIcon from '../Funds/assets/cash_scheme_blue.svg';
import KWSPSchemeIcon from '../Funds/assets/KWSP_scheme_blue.svg';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import LoadingOverlay from 'components/LoadingOverlay';
import { makeSelectClientDetails, makeSelectGetSelectionAccount } from 'containers/ClientDetails/selectors';
const RiskButton = styled(Button)`
  @media (max-width: 720px) {
    display: none;
  }
  width: 140px;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  cursor: default;
  justify-content: space-evenly;
  img {
    width: 20px;
    margin-right: ${(props) => (props.isEdgeBrowser ? '20px' : '3px')};
    margin-left: ${(props) => (props.isEdgeBrowser ? '20px' : '3px')};
  }
  .info {
    margin-left: ${(props) => (props.isEdgeBrowser ? '15px' : '5px')};
  }
`;

function ChangeAccount(props) {
  const {
    handleToggleAccountSelectionModal,
    clientDetails,
    match: { params },
    selectedAccountDetails,
  } = props;
  const { portfolio } = clientDetails || {};
  // Internet Explorer 6-11
  const isIE = /* @cc_on!@ */ false || !!document.documentMode;
  // Edge 20+
  const isEdge = !isIE && !!window.StyleMedia;

  if (_isEmpty(portfolio) || _isEmpty(params.portfolioId)) return <LoadingOverlay show />;
  let currentFund = clientDetails.info.account[0].partnerAccountMappingId; // This need not be initialized. Will have to remove after KWSP APIs are integrated
  let AccountIcon = KWSPSchemeIcon; // This need not be initialized. Will have to remove after KWSP APIs are integrated;
  if (selectedAccountDetails) {
    currentFund = selectedAccountDetails.partnerAccountMappingId;
    AccountIcon = selectedAccountDetails.UTRACCOUNTTYPE === 'KW' ? KWSPSchemeIcon : CashSchemeIcon;
  }
  return (
    <RiskButton isEdgeBrowser={isEdge}>
      <img src={AccountIcon} alt="Account icon" />
      <Text size="12px" color="#1d1d26" lineHeight="1.33" weight="bold">
        {currentFund}
      </Text>
      <Text size="12px" color="blue" decoration="underline" cursor="pointer" onClick={handleToggleAccountSelectionModal}>
        Change
      </Text>
    </RiskButton>
  );
}

const mapStateToProps = createStructuredSelector({
  clientDetails: makeSelectClientDetails(),
  selectedAccountDetails: makeSelectGetSelectionAccount(),
});

const withConnect = connect(mapStateToProps, null);

export default compose(withRouter, withConnect)(ChangeAccount);
