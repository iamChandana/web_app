/**
 *
 * RiskButtonInfo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import styled from 'styled-components';
import BaseUrl from 'utils/getDomainUrl';
import _find from 'lodash/find';
import Button from 'components/Button';
import Tooltip from 'material-ui/Tooltip';
import Parser from 'html-react-parser';
import InfoIcon from './info.svg';
const RiskButton = styled(Button)`
  @media (max-width: 720px) {
    display: none;
  }
  min-width: 154px;
  height: 40px;
  margin: 0 24px;
  border: none;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-evenly;
  img {
    width: 20px;
    height: 15px;
    margin-right: ${(props) => (props.isEdgeBrowser ? '20px' : '3px')};
    margin-left: ${(props) => (props.isEdgeBrowser ? '20px' : '3px')};
  }
  .info {
    margin-left: ${(props) => (props.isEdgeBrowser ? '15px' : '5px')};
  }
`;

const InfoWrapper = styled.div`
  min-width: 32px;
`;

function RiskButtonInfo(props) {
  const { data, riskProfiles } = props;

  let riskDetails = {};
  riskProfiles.map((obj) => {
    if (obj && obj.riskProfileType && data && data.account && data.account[0].riskAppetite) {
      if (obj.riskProfileType.toUpperCase() === data.account[0].riskAppetite.toUpperCase()) {
        riskDetails = obj;
      }
    }
  });
  // console.log(riskDetails, riskProfiles, data.account[0]);
  const Title = (
    <InfoWrapper>
      <Text color="#fff" size="12px" weight="bold" align="left">
        {riskDetails ? (riskDetails.riskProfileType ? riskDetails.riskProfileType.toUpperCase() : '') : ''}
      </Text>
      <Text color="#fff" size="12px" align="left">
        {riskDetails && Parser(riskDetails.description || '')}
      </Text>
    </InfoWrapper>
  );

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  return (
    <RiskButton isEdgeBrowser={isEdge}>
      {riskDetails && riskDetails.iconURL ? <img src={`${BaseUrl}${riskDetails.iconURL}`} alt="Risk Profile" /> : null}
      <Text size="12px" color="#1d1d26" lineHeight="1.33" weight="bold">
        {data ? (data.info ? (data.info.riskAppetite ? data.info.riskAppetite.toUpperCase() : null) : null) : null}
      </Text>
      <Tooltip id="tooltip-fab" title={Title}>
        <img src={InfoIcon} className="info" alt="Info" />
      </Tooltip>
    </RiskButton>
  );
}

RiskButtonInfo.propTypes = {};

export default RiskButtonInfo;
