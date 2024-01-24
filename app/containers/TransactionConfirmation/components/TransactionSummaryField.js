import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import Text from 'components/Text';

export const TransactionSummaryField = ({ label, value }) => (
  <Grid alignItems="center" spacing={8} container>
    <Grid item xs={8}>
      <Text align="left" weight="bold">
        {label}
      </Text>
    </Grid>
    <Grid item xs={4}>
      <Text align="left">{`: ${value}`}</Text>
    </Grid>
  </Grid>
);

TransactionSummaryField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};
