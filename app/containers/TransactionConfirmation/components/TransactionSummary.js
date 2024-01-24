import React from 'react';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Proptypes from 'prop-types';
import { startCase } from 'lodash';
import moment from 'moment';

import Text from 'components/Text';
import { TransactionSummaryField } from './TransactionSummaryField';

const placeHolderData = {
  transactionType: '-',
  date: '01-Jan-2001',
  refNo: '00000000',
  funds: [{ fundName: '-', amount: '0.00' }],
  total: '0.00',
};

const getTrxType = (transactionType) => {
  let text = '-';

  switch (transactionType) {
    case 'SA':
      text = 'Initial Subscription';
      break;
    case 'T':
      text = 'Top Up';
      break;
    case 'SW':
      text = 'Switch';
      break;
    case 'R':
      text = 'Redeem';
      break;
    case 'RD':
      text = 'Redeem';
      break;
    default:
      text = startCase(transactionType);
  }

  return text;
};

export class TransactionSummary extends React.PureComponent {
  render() {
    const transactionSummaryData = this.props.data ? this.props.data : placeHolderData;
    const { transactionType, date, refNo, funds, total } = transactionSummaryData;
    const { hideFundsDetails = false } = this.props;
    const parsedFunds = !hideFundsDetails ? JSON.parse(funds) : funds;
    const hideTotalAmount =
      transactionType === 'R' ||
      transactionType === 'RD' ||
      transactionType === 'Redemption' ||
      transactionType === 'Switching' ||
      transactionType === 'SW';

    return (
      <Grid spacing={16} container>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TransactionSummaryField label="Transaction" value={getTrxType(transactionType)} />
            </Grid>
            <Grid item xs={12}>
              <TransactionSummaryField label="Date" value={moment(date).format('DD-MMM-YYYY')} />
            </Grid>
            <Grid item xs={12}>
              <TransactionSummaryField label="Reference No." value={refNo} />
            </Grid>
          </Grid>
        </Grid>
        {!hideFundsDetails || (typeof parsedFunds !== 'string' && parsedFunds.length > 0) ? (
          <Grid item xs={12}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Grid alignItems="center" spacing={8} container>
                  <Grid item xs={8}>
                    <Text align="left" weight="bold">
                      Fund Name
                    </Text>
                  </Grid>
                  <Grid item xs={4}>
                    <Text align="left" weight="bold">
                      Amount
                    </Text>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={8}>
                  {parsedFunds.map((fund) => (
                    <Grid item xs={12} key={fund.fundName}>
                      <Grid alignItems="center" spacing={8} container>
                        <Grid item xs={8}>
                          <Text align="left">{fund.fundName}</Text>
                        </Grid>
                        <Grid item xs={4}>
                          <Text align="left" weight="bold">
                            RM {fund.amount}
                          </Text>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                  {!hideTotalAmount ? (
                    <Grid item xs={12}>
                      <Grid alignItems="center" spacing={8} container>
                        <Grid item xs={8}>
                          <Text weight="bold">Total Amount</Text>
                        </Grid>
                        <Grid item xs={4}>
                          <Text align="left" weight="bold">
                            RM {total}
                          </Text>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : !hideTotalAmount ? (
          <Grid item xs={12}>
            <TransactionSummaryField label="Total Amount" value={`RM ${total}`} />
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

TransactionSummary.propTypes = {
  data: Proptypes.object,
  hideFundsDetails: Proptypes.bool,
};

export default TransactionSummary;
