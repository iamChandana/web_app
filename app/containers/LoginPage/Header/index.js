import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import { Logo } from './Atoms';
import CpamLogo from '../images/logo.png';

function Header(props) {
  const { onClickHandler } = props;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Logo onClick={onClickHandler} src={CpamLogo} alt="logo" />
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  onClickHandler: PropTypes.func,
};

export default Header;
