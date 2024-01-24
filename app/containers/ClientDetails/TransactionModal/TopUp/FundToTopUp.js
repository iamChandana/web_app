import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
import CashSchemeIcon from 'containers/ClientDetails/Funds/assets/cash_scheme_blue.svg';
import KWSPSchemeIcon from 'containers/ClientDetails/Funds/assets/KWSP_scheme_blue.svg';
import Color from 'utils/StylesHelper/color';
import NumberFormat from 'react-number-format';

import { FundToTopUpContainer, FundToTopUpInnerContainer } from './Atoms';
import Tooltip from 'material-ui/Tooltip';
import InfoIcon from 'containers/ClientDetails/images/info-grey.svg';

const LatestNAVWrapper = styled(Grid)`
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

const StyledNumberFormat = styled(NumberFormat)`
  border-bottom: solid 1px #cacaca;
  outline: none;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.43;
  text-align: left;
  color: ${Color.C_GRAY};
`;

function renderErrorMessage(error) {
  if (typeof error === 'string') {
    return (
      <Text color={Color.C_RED} size="10px" lineHeight="1" align="left">
        {error}
      </Text>
    );
  }
  return error[0].ErrorMessage.map((message) => (
    <Text color={Color.C_RED} size="10px" lineHeight="1" align="left">
      {message.ErrorDesc ? message.ErrorDesc : message.FrontEndErrorMessage}
    </Text>
  ));
}

function FundToTopUp(props) {
  const { handleChange, index, data, error } = props;
  const value = index % 2 === 20 ? 'even' : 'odd';
  return (
    <FundToTopUpContainer container order={value}>
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
        <FundToTopUpInnerContainer container>
          <Grid item xs={6} md={6}>
            <Grid container>
              <Grid item xs={8} md={6}>
                <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                  TOTAL VALUE
                </Text>
                <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
                  <NumberFormat
                    value={data.totalNetAssetValue || '-'}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Text>
              </Grid>
              <Grid item xs={12} md={6}>
                <LatestNAVWrapper item>
                  <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
                    LATEST NAV*
                  </Text>
                  <Tooltip
                    id="tooltip-fab"
                    title={'Prices subject to daily cut off 8PM MYT(locals funds) and T+1 by 2pm(Foreign Funds)'}
                    placement="right">
                    <img src={InfoIcon} className="info" alt="Info" />
                  </Tooltip>
                </LatestNAVWrapper>
                <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
                  <NumberFormat
                    value={data.fund ? data.fund.netAssetValue : '-'}
                    displayType={'text'}
                    thousandSeparator
                    prefix={'RM '}
                    decimalScale={4}
                    fixedDecimalScale
                  />
                </Text>
              </Grid>
              <Grid item xs={12}>
                {error.length > 0 && renderErrorMessage(error)}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} md={6}>
            <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4" align="left">
              I WANT TO TOP UP
            </Text>
            <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
              <StyledNumberFormat
                allowNegative={false}
                value={data.newAmount}
                thousandSeparator
                prefix={'RM '}
                isAllowed={(values) => {
                  const { value } = values;
                  if (value > data.fund.maxAdditionalInvestmentAmt) {
                    handleChange(data, data.fund.maxAdditionalInvestmentAmt);
                    return false;
                  }
                  handleChange(data, value);
                  return true;
                }}
                decimalScale={2}
                autoComplete="off"
              />
            </Text>
            {data.errorMessage && (
              <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
                {data.errorMessage}
              </Text>
            )}
          </Grid>
        </FundToTopUpInnerContainer>
      </Grid>
    </FundToTopUpContainer>
  );
}

FundToTopUp.propTypes = {
  error: PropTypes.object,
  data: PropTypes.object,
  handleChange: PropTypes.func,
  index: PropTypes.number,
};

export default FundToTopUp;
