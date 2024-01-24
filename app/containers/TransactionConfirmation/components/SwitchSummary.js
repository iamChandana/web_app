import React from 'react';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Proptypes from 'prop-types';
import moment from 'moment';

import { TransactionSummaryField } from './TransactionSummaryField';
import { SwitchField } from './SwitchField';

export class SwitchSummary extends React.PureComponent {
  render() {
    const {
      data: { transactionType, date, refNo, funds },
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
              <Divider />
            </Grid>
            <Grid item xs={12}>
              {parsedFunds.map((fund) => (
                <Grid spacing={8} key={fund.fundNameOut} container>
                  <Grid item xs={8}>
                    <SwitchField label="Fund Switch Out" value={fund.fundNameOut} />
                  </Grid>
                  <Grid item xs={4}>
                    <SwitchField label="Units to Switch Out" value={fund.units} />
                  </Grid>
                  <Grid item xs={12}>
                    <SwitchField label="Funds Switch In" value={fund.fundNameIn} />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

SwitchSummary.propTypes = {
  data: Proptypes.object,
};

export default SwitchSummary;
