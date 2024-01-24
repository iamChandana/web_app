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
    default:
      text = startCase(transactionType);
  }

  return text;
};

export class RspSummary extends React.PureComponent {
  render() {
    const transactionSummaryData = this.props.data ? this.props.data : placeHolderData;
    const { transactionType, date, rspRefNo, refNo, fund, prodamountList, totalAmount, total } = transactionSummaryData;
    const rspType = new URLSearchParams(window.location.search).get('rt');

    return (
      <Grid spacing={16} container>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TransactionSummaryField label="Transaction" value={getTrxType(transactionType || rspType)} />
            </Grid>
            {date ? (
              <Grid item xs={12}>
                <TransactionSummaryField label="Date" value={moment(date).format('DD-MMM-YYYY')} />
              </Grid>
            ) : null}
            {rspRefNo || refNo ? (
              <Grid item xs={12}>
                <TransactionSummaryField label="Reference No." value={rspRefNo || refNo} />
              </Grid>
            ) : null}
            {/* only for reject lol */}
            {total ? (
              <Grid item xs={12}>
                <TransactionSummaryField label="Total Amount" value={`RM ${total}`} />
              </Grid>
            ) : null}
            {/* eslint-disable-next-line no-nested-ternary */}
            {prodamountList && prodamountList.length > 0 ? (
              <Grid item xs={12}>
                <Grid spacing={8} container>
                  <Grid item xs={12}>
                    <Grid container spacing={8}>
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
                      {prodamountList.map((product) => (
                        <Grid item xs={12} key={product.fundcode}>
                          <Grid container spacing={8}>
                            <Grid item xs={8}>
                              <Text align="left">{product.name}</Text>
                            </Grid>
                            <Grid item xs={4}>
                              <Text align="left" weight="bold">
                                {product.transactionAmount}
                              </Text>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={8}>
                      <Grid item xs={8}>
                        <Text align="right" weight="bold">
                          Total Amount
                        </Text>
                      </Grid>
                      <Grid item xs={4}>
                        <Text align="left" weight="bold">{`RM ${totalAmount}`}</Text>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : fund ? (
              <Grid item xs={12}>
                <TransactionSummaryField label="Fund Name" value={fund} />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

RspSummary.propTypes = {
  data: Proptypes.object,
};

export default RspSummary;
