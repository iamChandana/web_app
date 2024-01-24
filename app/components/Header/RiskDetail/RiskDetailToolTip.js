import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import Parser from 'html-react-parser';
import { InfoWrapper } from '../Atoms';

function RiskDetailTooltip(props) {
  const { riskDetails } = props;
  return (
    <InfoWrapper>
      <Text color="#fff" size="12px" weight="bold" align="left">
        {riskDetails.riskProfileType}
      </Text>
      <Text color="#fff" size="12px" align="left">
        {Parser(riskDetails.description)}
      </Text>
    </InfoWrapper>
  );
}

RiskDetailTooltip.propTypes = {
  riskDetails: PropTypes.object,
};

export default RiskDetailTooltip;
