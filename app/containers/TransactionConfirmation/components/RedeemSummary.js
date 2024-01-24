import React from 'react';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Proptypes from 'prop-types';
import moment from 'moment';

import Text from 'components/Text';
import { TransactionSummaryField } from './TransactionSummaryField';

export class RedeemSummary extends React.PureComponent {
  render() {
    const {
      data: { transactionType, date, refNo, funds, total },
    } = this.props;
    const parsedFunds = JSON.parse(funds);

    return (
      <Grid spacing={16} container>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TransactionSummaryField label="Transaction" value={transactionType} />
            </Grid>
            <Grid item xs={12}>
              <TransactionSummaryField label="Date" value={moment(date).format('DD-MMM-YYYY')} />
            </Grid>
            <Grid item xs={12}>
              <TransactionSummaryField label="Reference No." value={refNo} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={8}>
                <Grid item xs={8}>
                  <Text align="left" weight="bold">
                    Fund Name
                  </Text>
                </Grid>
                <Grid item xs={4}>
                  <Text align="left" weight="bold">
                    Units to Redeem
                  </Text>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  {typeof parsedFunds === 'object' && parsedFunds.length > 0 ? (
                    <Grid container spacing={8}>
                      {parsedFunds.map((fund) => (
                        <React.Fragment key={fund.fundName}>
                          <Grid item xs={8}>
                            <Text align="left">{fund.fundName}</Text>
                          </Grid>
                          <Grid item xs={4}>
                            <Text align="left" weight="bold">
                              {fund.units}
                            </Text>
                          </Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  ) : (
                    <Text align="center">Funds data not found</Text>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={8}>
                <Grid item xs={8}>
                  <Text align="right" weight="bold">
                    Estimated Redemption Value
                  </Text>
                </Grid>
                <Grid item xs={4}>
                  <Text align="left" weight="bold">
                    RM {total}
                  </Text>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

RedeemSummary.propTypes = {
  data: Proptypes.object,
};

export default RedeemSummary;
