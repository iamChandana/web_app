import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import Text from 'components/Text';

export const SwitchField = ({ label, value }) => (
  <Grid container>
    <Grid item xs={12}>
      <Text weight="bold" align="left">
        {label}
      </Text>
    </Grid>
    <Grid item xs={12}>
      <Text align="left">{value}</Text>
    </Grid>
  </Grid>
);

SwitchField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
};
