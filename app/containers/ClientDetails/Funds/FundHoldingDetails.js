import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import Tooltip from 'material-ui/Tooltip';
import Color from 'utils/StylesHelper/color';
import Text from 'components/Text';
import _find from 'lodash/find';
import InfoFillIcon from '../images/info-fill.svg';
import { isIOS } from 'react-device-detect';
import ReactTooltip from 'react-tooltip';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #000000 !important;
  padding: 10px !important;
  -webkit-opacity: 1;
`;

const PaddedGrid = styled(Grid)`
  padding: ${(props) => (props.padding ? `${props.padding} !important` : '12px !important')};
`;

const TooltipImg = styled.img`
  margin-bottom: 3px;
`;

function FundHoldingDetails({ data, clientDetails }) {
  const getAccountType = () => {
    let accountType;
    clientDetails.portfolio.forEach((portfolio) => {
      const selectedAccountType = _find(portfolio.productbreakdown, {
        partnerProductId: data.partnerProductId,
        partnerAccountNo: data.partnerAccountNo,
      });
      if (selectedAccountType) {
        accountType = portfolio.partnerAccountType;
      }
    });
    // console.log(accountType);
    switch (accountType) {
      case 'CS':
        return 'CASH';
      case 'KW':
        return 'KWSP';
      default:
        return '-';
    }
  };
  return (
    <Grid container direction="row" spacing={24}>
      <Grid item xs={6}>
        <Grid container direction="row" spacing={24} justify="flex-start">
          <PaddedGrid padding="5px" item xs={6}>
            <Text color={Color.C_GRAY} size="12px" opacity="0.4" weight="bold" align="left">
              TOTAL NAV
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color="#10151a" size="12px" weight="bold" align="left">
              <NumberFormat
                value={data.totalNetAssetValue || 0}
                displayType={'text'}
                thousandSeparator=","
                allowNegative={false}
                prefix={'RM '}
                decimalScale={2}
                fixedDecimalScale
              />
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color={Color.C_GRAY} size="12px" opacity="0.4" weight="bold" align="left">
              TOTAL SALES{' '}
              {isIOS ? (
                <ReactTooltip1
                  id="tooltipTotalSale"
                  effect="float"
                  place="right"
                  style={{ cursor: 'pointer' }}
                  globalEventOff={'click'}>
                  <Text size="14px" color="#fff" align="left">
                    Includes Total invested & Total Switch in
                  </Text>
                </ReactTooltip1>
              ) : null}
              {isIOS ? (
                <a data-tip data-for="tooltipTotalSale">
                  <TooltipImg src={InfoFillIcon} className="info" alt="Info" width="12" height="12" />
                </a>
              ) : null}
              {!isIOS ? (
                <Tooltip id="tooltip-fab" title="Includes Total invested & Total Switch in" placement="right">
                  <TooltipImg src={InfoFillIcon} className="info" alt="Info" width="12" height="12" />
                </Tooltip>
              ) : null}
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color="#10151a" size="12px" weight="bold" align="left">
              <NumberFormat
                value={data.totalPurchase || 0}
                displayType={'text'}
                thousandSeparator=","
                allowNegative={false}
                prefix={'RM '}
                decimalScale={2}
                fixedDecimalScale
              />
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="4px" item xs={6}>
            <Text color={Color.C_GRAY} size="12px" opacity="0.4" weight="bold" align="left">
              TOTAL REDEMPTION{' '}
              {isIOS ? (
                <ReactTooltip1
                  id="tooltipTotalRedemption"
                  effect="float"
                  place="right"
                  style={{ cursor: 'pointer' }}
                  globalEventOff={'click'}>
                  <Text size="14px" color="#fff" align="left">
                    Includes Total redemption & Total Switch out
                  </Text>
                </ReactTooltip1>
              ) : null}
              {isIOS ? (
                <a data-tip data-for="tooltipTotalRedemption">
                  <TooltipImg src={InfoFillIcon} className="info" alt="Info" width="12" height="12" />
                </a>
              ) : null}
              {!isIOS ? (
                <Tooltip id="tooltip-fab" title="Includes Total redemption & Total Switch out" placement="right">
                  <TooltipImg src={InfoFillIcon} className="info" alt="Info" width="12" height="12" />
                </Tooltip>
              ) : null}
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color="#10151a" size="12px" weight="bold" align="left">
              <NumberFormat
                value={data.totalRedemption || 0}
                displayType={'text'}
                thousandSeparator=","
                allowNegative={false}
                prefix={'RM '}
                decimalScale={2}
                fixedDecimalScale
              />
            </Text>
          </PaddedGrid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container direction="row" spacing={24} justify="flex-start">
          <PaddedGrid padding="5px" item xs={6}>
            <Text color={Color.C_GRAY} size="12px" opacity="0.4" weight="bold" align="left">
              ACCOUNT TYPE
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color="#10151a" size="12px" weight="bold" align="left">
              {getAccountType()}
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color={Color.C_GRAY} size="12px" opacity="0.4" weight="bold" align="left">
              DISTRIBUTION INSTRUCTION
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color="#10151a" size="12px" weight="bold" align="left">
              {data.distributionInstruction || 'Re-investment'}
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color={Color.C_GRAY} size="12px" opacity="0.4" weight="bold" align="left">
              TOTAL INCOME DISTRIBUTION REINVESTED
            </Text>
          </PaddedGrid>
          <PaddedGrid padding="5px" item xs={6}>
            <Text color="#10151a" size="12px" weight="bold" align="left">
              {data.totalDDAmount ? (
                <NumberFormat
                  value={data.totalDDAmount}
                  displayType={'text'}
                  thousandSeparator=","
                  allowNegative={false}
                  prefix={'RM '}
                  decimalScale={2}
                  fixedDecimalScale
                />
              ) : (
                '-'
              )}
            </Text>
          </PaddedGrid>
        </Grid>
      </Grid>
    </Grid>
  );
}

FundHoldingDetails.propTypes = {
  data: PropTypes.object,
  clientDetails: PropTypes.object,
};

export default FundHoldingDetails;
