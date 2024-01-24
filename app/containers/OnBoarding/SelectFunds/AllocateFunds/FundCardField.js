import React from 'react';
import Grid from 'material-ui/Grid';

import Text from 'components/Text';

export const FundCardField = ({ label, children }) => (
  <Grid spacing={8} container>
    <Grid item xs={12}>
      <Text color="#1d1d26" size="12px" weight="bold" opacity="0.4" textTransform="uppercase" align="left">
        {label}
      </Text>
    </Grid>
    <Grid item xs={12}>
      {children}
    </Grid>
  </Grid>
);
