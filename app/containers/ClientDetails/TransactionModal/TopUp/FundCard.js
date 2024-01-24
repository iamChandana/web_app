import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';
import NumberFormat from 'react-number-format';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import getSalesCharge from 'utils/getSalesCharge';
import Text from 'components/Text';
import InfoIcon from 'containers/ClientDetails/images/info-grey.svg';
import Color from 'utils/StylesHelper/color';
import { AccountNumber } from './AccountNumber';
import CampaignCode from './CampaignCode';
import { makeSelectSalesCharges } from '../../selectors';

const styles = {
  typeContainer: {
    '& > div': {
      borderLeft: '1px solid #ddd',
    },
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    '& > span': {
      marginRight: 5,
    },
  },
  input: {
    borderBottom: 'solid 1px #cacaca',
    outline: 'none',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 1.43,
    textAlign: 'left',
    color: '#000',
    width: '100%',
  },
  inputError: {
    borderBottom: '1px solid red',
    color: 'red',
    outline: 'none',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 1.43,
    textAlign: 'left',
    width: '100%',
  },
};

function renderErrorMessage(error) {
  if (typeof error === 'string') {
    return (
      <Text color={Color.C_RED} size="10px" lineHeight="1" align="left">
        {error}
      </Text>
    );
  }

  if (Array.isArray(error[0].ErrorMessage)) {
    return error[0].ErrorMessage.map((message) => (
      <Text color={Color.C_RED} size="10px" lineHeight="1" align="left">
        {message.ErrorDesc ? message.ErrorDesc : message.FrontEndErrorMessage}
      </Text>
    ));
  }

  return (
    <Text color={Color.C_RED} size="10px" lineHeight="1" align="left">
      {error[0].message}
    </Text>
  );
}

const FundCardField = ({ title, children }) => (
  <Grid container>
    <Grid item xs={12}>
      <Text align="left" weight="bold" opacity={0.4} textTransform="uppercase" size="10px">
        {title}
      </Text>
    </Grid>
    <Grid item xs={12}>
      {children}
    </Grid>
  </Grid>
);

FundCardField.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  children: PropTypes.any.isRequired,
};

const getFundSalesCharge = (fundCode, salesCharges) => {
  const DEFAULT_VALUE = 0;

  if (salesCharges.length === 0) {
    return DEFAULT_VALUE;
  }
  const fund = salesCharges.find((item) => item.NEWFUNDCODE.trim() === fundCode.toString());
  return fund !== undefined ? getSalesCharge(fund.campaignCodeSalesCharge, fund.RATE || 0) : 0;
};

const getCampaign = (fundCode, salesCharges) => {
  const DEFAULT_VALUE = {
    campaignCode: null,
    campaignErrorMessage: null,
  };

  if (salesCharges.length === 0) {
    return DEFAULT_VALUE;
  }

  const campaign = salesCharges.find((item) => item.NEWFUNDCODE.trim() === fundCode.toString());

  return campaign !== undefined
    ? { campaignCode: campaign.campaignCode, campaignErrorMessage: campaign.campaignErrorMessage }
    : DEFAULT_VALUE;
};

export function FundCard({ data, classes, handleChange, error, salesCharges }) {
  const salesCharge = getFundSalesCharge(data.fund.fundcode, salesCharges);
  const campaign = getCampaign(data.fund.fundcode, salesCharges);

  return (
    <Grid spacing={8} container>
      <Grid item xs={12}>
        <div className={classes.flex}>
          <Text weight="bold" align="left">
            {`${data.fund.fundcode} ${data.fund.name}`}
          </Text>
          <AccountNumber accountType={data.accountType} accountNo={data.partnerAccountNo} />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Grid spacing={8} container>
          <Grid item xs={12} sm={5}>
            <Grid spacing={8} container>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <FundCardField title="Total Value">
                      <Text size="16px" align="left" weight="bold">
                        {data.totalNetAssetValue ? (
                          <NumberFormat
                            displayType="text"
                            value={data.totalNetAssetValue}
                            decimalScale={2}
                            fixedDecimalScale
                            prefix="RM "
                          />
                        ) : (
                          '-'
                        )}
                      </Text>
                    </FundCardField>
                  </Grid>
                  {error && error.length > 0 ? (
                    <Grid item xs={12}>
                      {renderErrorMessage(error)}
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <FundCardField
                  title={
                    <React.Fragment>
                      Latest NAV*{' '}
                      <Tooltip
                        id="tooltip-fab"
                        title={'Prices subject to daily cut off 8PM MYT(locals funds) and T+1 by 2pm(Foreign Funds)'}
                        placement="right">
                        <img src={InfoIcon} className="info" alt="Info" width={10} height={10} />
                      </Tooltip>
                    </React.Fragment>
                  }>
                  <Text size="16px" align="left" weight="bold">
                    {data.fund && data.fund.netAssetValue ? (
                      <NumberFormat
                        displayType="text"
                        value={data.fund.netAssetValue}
                        decimalScale={4}
                        fixedDecimalScale
                        prefix="RM "
                      />
                    ) : (
                      '-'
                    )}
                  </Text>
                </FundCardField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Grid spacing={16} classes={{ typeContainer: classes.typeContainer }} container>
              <Grid item xs={12} sm={4}>
                <Grid container>
                  <Grid item xs={12}>
                    <FundCardField title="I want to top up">
                      <NumberFormat
                        className={
                          (campaign.campaignErrorMessage && campaign.campaignErrorMessage.includes('less than')) ||
                          data.errorMessage
                            ? classes.inputError
                            : classes.input
                        }
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
                    </FundCardField>
                  </Grid>
                  {data.errorMessage ? (
                    <Grid item xs={12}>
                      <Text color={Color.C_RED} size="10px" align="left">
                        {data.errorMessage}
                      </Text>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FundCardField title="Sales Charge">
                  <NumberFormat displayType="text" value={salesCharge} suffix="%" />
                </FundCardField>
              </Grid>
              <Grid item xs={12} sm={5}>
                <FundCardField title="Campaign Code">
                  <CampaignCode
                    campaignErrorMessage={campaign.campaignErrorMessage}
                    isCampaignCodeApplied={campaign.campaignCode !== null}
                    appliedCampaignCode={campaign.campaignCode}
                    minimumInvestment={data.newAmount}
                    accountType={data.accountType}
                    fundCode={data.fund.fundcode}
                    fundName={data.fund.name}
                  />
                </FundCardField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

FundCard.propTypes = {
  data: PropTypes.object.isRequired,
  error: PropTypes.array,
  handleChange: PropTypes.func.isRequired,
  salesCharges: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  salesCharges: makeSelectSalesCharges(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  withStyles(styles),
  withConnect,
)(FundCard);
