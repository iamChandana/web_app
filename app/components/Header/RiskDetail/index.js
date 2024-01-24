import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import BaseUrl from 'utils/getDomainUrl';
import Tooltip from 'material-ui/Tooltip';
import InfoIcon from '../images/info.svg';
import { RiskButton } from '../Atoms';
import RiskDetailToolTip from './RiskDetailToolTip';

function RiskDetail(props) {
  const { riskDetails } = props;
  return (
    <RiskButton>
      <img src={`${BaseUrl}${riskDetails.iconURL}`} alt="Risk Profile" />
      <Text size="12px" color="#1d1d26" lineHeight="1.33" weight="bold">
        {riskDetails.riskProfileType}
      </Text>
      <Tooltip id="tooltip-fab" title={<RiskDetailToolTip riskDetails={riskDetails} />}>
        <img src={InfoIcon} className="info" alt="Info" />
      </Tooltip>
    </RiskButton>
  );
}

RiskDetail.propTypes = {
  riskDetails: PropTypes.object,
};
export default RiskDetail;
