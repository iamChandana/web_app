import React from 'react';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
import _isEmpty from 'lodash/isEmpty';
import Checkbox from 'components/Checkbox';
import CashSchemeIcon from 'containers/ClientDetails/Funds/assets/cash_scheme_blue.svg';
import KWSPSchemeIcon from 'containers/ClientDetails/Funds/assets/KWSP_scheme_blue.svg';
import NumberFormat from 'react-number-format';
import Color from 'utils/StylesHelper/color';
import Tooltip from 'material-ui/Tooltip';
import styled from 'styled-components';
import InfoIcon from '../../images/info-grey.svg';
import { FundToRedeemContainer, FundToRedeemInnerContainer, FundToRedeemInnerItem, StyledNumberFormat } from './Atoms';
import rspStatuses from '../rspStatuses';

const EstimatedRedemptionWrapper = styled(Grid)`
  display: flex;
  justify-content: left;
  align-items: left;
  img {
    height: 10px;
    width: 10px;
    margin-left: 5px;
    cursor: pointer;
  }
`;

function renderErrorMessage(error) {
  if (_isEmpty(error)) return null;

  if (typeof error === 'string') {
    return (
      <Text color={Color.C_RED} size="10px" lineHeight="1.35" align="left">
        {error}
      </Text>
    );
  }
  return error.map((message) => (
    <Text color={Color.C_RED} size="10px" lineHeight="1.35" align="left">
      {message}
    </Text>
  ));
}

function FundToRedeem(props) {
  const { handleChange, toggleFullRedemption, index, data, error, clientDetails } = props;
  const order = index % 2 === 0 ? 'even' : 'odd';
  const availableRedeemSwitchUnits = data.availableRedeemSwitchUnits ? data.availableRedeemSwitchUnits : 0;
  const totalValue = availableRedeemSwitchUnits
    ? availableRedeemSwitchUnits * (data.fund ? (data.fund.price ? data.fund.price : 0) : 0)
    : 0;

  // dynamically change the grid size based on availableRedeemSwitchUnits value
  let xs = 6;
  if (
    (availableRedeemSwitchUnits > 999999 && totalValue > 999999) ||
    (availableRedeemSwitchUnits > 999999 && totalValue < 1000000) ||
    (availableRedeemSwitchUnits < 1000000 && totalValue > 999999)
  ) {
    xs = 12;
  } else if (window.innerWidth <= 1024) {
    xs = 12;
  }

  let isDisabled = false;
  const disabledStyle = {
    opacity: '0.7',
    cursor: 'not-allowed',
  };
  if (
    data.rspStatus === rspStatuses.pending ||
    data.rspStatus === rspStatuses.inProgress ||
    data.rspStatus === rspStatuses.editPending ||
    data.rspStatus === rspStatuses.editInProgress
  ) {
    isDisabled = true;
  }

  // if no data, return null
  if (_isEmpty(data)) return null;

  console.log('redeem error: ', error);

  return (
    <FundToRedeemContainer order={order} container>
      <Grid item xs={12}>
        <Text size="14px" color={Color.C_GRAY} weight="bold" align="left">
          {data.fund.fundcode} &nbsp; {data.fund.name}
          <div style={{ display: 'inline', marginLeft: 10 }}>
            <span style={{ fontWeight: 'bolder', fontSize: '14px', verticalAlign: 'unset' }}>
              <img src={data.accountType === 'CS' ? CashSchemeIcon : KWSPSchemeIcon} alt="Account type" width="17px" />{' '}
              {`${data.partnerAccountNo}`}
            </span>
          </div>
        </Text>
      </Grid>
      <Grid item xs={12}>
        {/* this is the main section of the component */}
        <FundToRedeemInnerContainer container>
          <Grid item xs={3}>
            <Grid container>
              <Grid item xs={12}>
                <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                  AVAIL. UNITS
                </Text>
                <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
                  <NumberFormat
                    thousandSeparator
                    value={availableRedeemSwitchUnits || 0}
                    displayType={'text'}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Text>
              </Grid>
              <Grid item xs={12}>
                <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                  TOTAL VALUE
                </Text>
                <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
                  <NumberFormat
                    value={totalValue}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Text>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <FundToRedeemInnerItem>
              <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                I WANT TO REDEEM
              </Text>
              <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left" width="100%">
                <StyledNumberFormat
                  allowNegative={false}
                  value={data.newAmount}
                  thousandSeparator
                  suffix={'  units'}
                  onValueChange={(values) => {
                    const { value } = values;
                    handleChange(data, value);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  disabled={data.FullIndicator}
                  autoComplete="off"
                />
              </Text>
              {renderErrorMessage(error)}
              <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
                {data.errorMessage}
              </Text>
            </FundToRedeemInnerItem>
            <Text size="10px" weight="bold" lineHeight="1.25" align="left">
              <Checkbox
                checked={data.FullIndicator}
                value
                onChange={() => toggleFullRedemption(data)}
                disabled={isDisabled}
                style={isDisabled ? disabledStyle : {}}
              />{' '}
              Full Redemption
            </Text>
            {data.FullIndicator && (
              <Text style={{ paddingLeft: '14px' }} color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
                Disclaimer: Total units redeem may differ with estimated value subject to change in daily market price
              </Text>
            )}
          </Grid>
          <Grid item xs={4}>
            <EstimatedRedemptionWrapper item>
              <Text align="left" size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4">
                ESTIMATED REDEMPTION VALUE
              </Text>
              <Tooltip id="tooltip-fab" title={'Estimated Redemption Value = Latest Available NAV * Units'} placement="top">
                <img src={InfoIcon} className="info" alt="Info" />
              </Tooltip>
            </EstimatedRedemptionWrapper>
            <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
              <NumberFormat
                value={data.newAmount ? data.newAmount * data.fund.price : 0}
                displayType={'text'}
                thousandSeparator
                prefix={'RM '}
                decimalScale={2}
                fixedDecimalScale
              />
            </Text>
          </Grid>
        </FundToRedeemInnerContainer>
      </Grid>
    </FundToRedeemContainer>
  );
}

export default FundToRedeem;
