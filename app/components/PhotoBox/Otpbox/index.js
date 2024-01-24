/**
 *
 * Otpbox
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Inputs = styled.input``;

class Otpbox extends React.Component {
  constructor() {
    super();

    this.state = {
      otp1: null,
      otp2: null,
      otp3: null,
      otp4: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }
  render() {
    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item xs={12}>
          We have sent a OTP to your registered mobile number <br />
          Please enter the OTP below to verify. If you did not recieve the OTP via SMS within the next few minutes, please click "Resend".
        </Grid>
        <Grid item xs={12}>
          <InputsWrapper>
            <Inputs type="number" name="otp1" />
            <hr />
            <Inputs type="number" name="otp2" />
            <hr />
            <Inputs type="number" name="otp3" />
            <hr />
            <Inputs type="number" name="otp4" />
          </InputsWrapper>
        </Grid>
        <Grid item xs={12}>
          <Button variant="raised" color="primary" onClick={this.proceed}>
            Proceed
          </Button>
        </Grid>
        <Grid item xs={12}>
          Resend
        </Grid>
      </Grid>
    );
  }
}
Otpbox.propTypes = {};

export default Otpbox;
