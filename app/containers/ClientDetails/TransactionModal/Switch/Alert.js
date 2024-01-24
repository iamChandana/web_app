import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'components/Button';
import Text from 'components/Text';
import Icon from 'components/ConfirmRiskModal/moderate-error.svg';
import DisclaimerModal from 'components/Disclaimer/DisclaimerModal';

import { Img, AlertContent, AlertActionContainer, AlertDisclaimerButton } from './Atoms';

function Alert(props) {
  const { riskAppetite, riskProfileType, back, submit, disclaimerOpen, disclaimerHandler } = props;

  return (
    <Grid container alignItems="center" justify="center">
      <DisclaimerModal open={disclaimerOpen} handleClose={disclaimerHandler} />
      <Grid item xs={12}>
        <Img src={Icon} alt="risk" />
      </Grid>
      <AlertContent item xs={12}>
        <Text weight="bold">
          Your risk profile is {riskAppetite} but you have selected {riskProfileType} fund.
        </Text>
        <Text>
          You may proceed if you acknowledge the{' '}
          <AlertDisclaimerButton onClick={disclaimerHandler}>Disclaimer</AlertDisclaimerButton> and accept the risk.
        </Text>
      </AlertContent>
      <AlertActionContainer item xs={12}>
        <Button display="inline-block" onClick={back}>
          Cancel
        </Button>
        <Button display="inline-block" primary onClick={submit}>
          Accept & Continue
        </Button>
      </AlertActionContainer>
    </Grid>
  );
}

Alert.propTypes = {
  riskAppetite: PropTypes.string,
  riskProfileType: PropTypes.string,
  back: PropTypes.func,
  submit: PropTypes.func,
  disclaimerOpen: PropTypes.bool,
  disclaimerHandler: PropTypes.func,
};

Alert.defaultProps = {
  riskAppetite: '',
  riskProfileType: PropTypes.string,
};

export default Alert;
