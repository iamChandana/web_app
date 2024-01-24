import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';

import getSalesCharge from 'utils/getSalesCharge';
import Text from 'components/Text';

export const NoData = ({ showText }) => (
  <React.Fragment>
    {showText ? (
      <Text color="#1d1d26" align="center" size="12px" weight="bold">
        No data found!
      </Text>
    ) : null}
  </React.Fragment>
);

NoData.propTypes = {
  showText: PropTypes.any,
};

export const Headers = ({ showSales, withPadding, hideFinalCol }) => (
  <Grid spacing={8} container>
    <Grid item xs={12} sm={8} style={{ paddingLeft: withPadding ? '18px' : '4px' }}>
      <Text color="#1d1d26" align="left" opacity={0.4} size="10px" weight="bold">
        FUND
      </Text>
    </Grid>
    <Grid item xs={12} sm={2}>
      <Text color="#1d1d26" align="left" opacity={0.4} size="10px" weight="bold">
        AMOUNT
      </Text>
    </Grid>
    {hideFinalCol && (
      <Grid item xs={12} sm={2}>
        <Text color="#1d1d26" align="left" opacity={0.4} size="10px" weight="bold">
          {showSales ? 'SALES CHARGE' : 'REF ID'}
        </Text>
      </Grid>
    )}
  </Grid>
);

Headers.propTypes = {
  showSales: PropTypes.bool,
  withPadding: PropTypes.bool,
  hideFinalCol: PropTypes.bool,
};

export const ListOfFunds = ({ funds, showSales, hideFinalCol }) => {
  if (!funds || (funds && funds.length === 0)) {
    return <NoData />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Headers showSales={showSales} hideFinalCol={hideFinalCol} />
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          {funds.map((fund) => (
            <Grid key={fund.id} item xs={12}>
              <Grid spacing={8} container>
                <Grid item xs={12} sm={8}>
                  <Text weight="bold" align="left">
                    {`${fund.fundcode} ${fund.name}`}
                  </Text>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Text weight="bold" align="left">
                    <NumberFormat displayType="text" value={fund.initialInvestment} prefix="RM " />
                  </Text>
                </Grid>
                {showSales && (
                  <Grid item xs={12} sm={2}>
                    <Text weight="bold" align="left">
                      <NumberFormat
                        displayType="text"
                        value={getSalesCharge(fund.campaignCodeSalesCharge, fund.defaultSalesCharge) || 0}
                        suffix="%"
                      />
                    </Text>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

ListOfFunds.defaultProps = {
  showSales: true,
  hideFinalCol: true,
};

ListOfFunds.propTypes = {
  funds: PropTypes.array,
  showSales: PropTypes.bool,
  hideFinalCol: PropTypes.bool,
};
