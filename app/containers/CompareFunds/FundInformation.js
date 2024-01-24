/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import InputValue from 'components/InputValue';
import Parser from 'html-react-parser';

function FundInformation(props) {
  const fundDetails = props.data;
  const na = 'NA';

  return (
    <Grid item>
      <InputValue 
        label="Strategy" 
        value={fundDetails ? (fundDetails.strategy ? Parser(fundDetails.strategy) : na) : na} 
        odd
        align="justify"
      />
      <InputValue 
        label="Manager" 
        value={fundDetails ? (fundDetails.manager ? Parser(fundDetails.manager) : na) : na} 
        odd 
        align="justify"
      />
      <InputValue
        label="Application Fee"
        value={fundDetails ? (fundDetails.applicationfee ? Parser(fundDetails.applicationfee) : na) : na}
        odd
        align="justify"
      />
      <InputValue
        label="Management Fee"
        value={fundDetails ? (fundDetails.managementfee ? Parser(fundDetails.managementfee) : na) : na}
        odd
        align="justify"
      />
      <InputValue
        label="Trustee Fee"
        value={fundDetails ? (fundDetails.trusteefee ? Parser(fundDetails.trusteefee) : na) : na}
        odd
        align="justify"
      />
      <InputValue
        label="Distribution Policy"
        value={fundDetails ? (fundDetails.distributionpolicy ? Parser(fundDetails.distributionpolicy) : na) : na}
        odd
        align="justify"
      />
      <InputValue
        label="Cooling-off Period"
        value={fundDetails ? (fundDetails.coolingoffperiod ? Parser(fundDetails.coolingoffperiod) : na) : na}
        odd
        align="justify"
      />
      <InputValue
        label="Switching Policy"
        value={fundDetails ? (fundDetails.switchingpolicy ? Parser(fundDetails.switchingpolicy) : na) : na}
        odd
        align="justify"
      />
    </Grid>
  );
}

FundInformation.propTypes = {
  data: PropTypes.any,
};

export default FundInformation;
