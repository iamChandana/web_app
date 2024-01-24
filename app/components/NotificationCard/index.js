/**
 *
 * NotificationCard
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui';

function NotificationCard() {
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={4}>
        icon
      </Grid>
      <Grid item xs={8}>
        Name
      </Grid>
    </Grid>
  );
}

NotificationCard.propTypes = {};

export default NotificationCard;
