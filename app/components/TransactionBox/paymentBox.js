import React from 'react';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import { kwspPaymentBoxString } from '../../utils/kwspTextConstants';

export default function PaymentDisclaimerContent(props) {
  const { done, value } = props;
  const nonKWSPTypes = ['CQ', 'BD', 'VA'];
  return (
    !done &&
    value &&
    value !== 'Select' &&
    (value === 'CQ' || value === 'BD' || value === '9N' || value === 'VA') && (
      <Grid container style={{ marginTop: '25px' }}>
        <Grid item xs={12}>
          {value === '9N' && (
            <Text lineHeight="1.57" align="left" style={{ textAlign: 'center' }}>
              {kwspPaymentBoxString}
            </Text>
          )}

          {nonKWSPTypes.includes(value) &&
            (value === 'VA' ? (
              <Text align="left" lineHeight="1.57">
                Please upload clear copy of transfer/bank in slip.
                <br />
                Submission cutoff time is 2:00 PM. Any successful transaction and bank in slip submission after 2:00 PM or on a
                non-business day, orders will be processed on the next business day NAV.
                <br />
                Reminder : 3rd Party payments are not accepted by Principal. Principal shall have the right to reject and/or
                cancel any transaction, in respect of which payment is made using 3rd Party accounts, without further notice. Any
                transfer via cash deposit machine will also be rejected.
              </Text>
            ) : (
              <Text align="left" lineHeight="1.57" style={{ width: '650px' }}>
                Please present Cheque payments at Principal branch counters within 1 working day as no cash transaction is
                allowed.
              </Text>
            ))}

          {value === '9N' && (
            <Text align="left" lineHeight="1.57" style={{ textAlign: 'center' }}>
              The KWSP transactions will be processed based on the NAV at the next valuation point after the payment
              settlement/confirmation. If the transactions' payment settlement/confirmation notices are received on/by 4:00 PM on
              a Business Day, it will be processed using the NAV per unit for the said Business Day. But if the payment
              settlement/confirmation notices are received after 4:00 PM on a Business Day, then it will be processed using the
              NAV per unit for the next Business Day.
            </Text>
          )}
          {value !== '9N' && value !== 'VA' && (
            <Text align="left" lineHeight="1.57" style={{ width: '650px' }}>
              Submission cutoff time is 4:00 PM. Any successful transaction and Cheque submission after 4:00 PM or on a
              non-business day, orders will be processed on the next business day NAV.
            </Text>
          )}
        </Grid>
      </Grid>
    )
  );
}
