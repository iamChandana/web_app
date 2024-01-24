import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Text from 'components/Text';
import NextButton from './NextButton';
import StyledText from './StyledText';

const LastText = styled(Text)`
  margin-bottom: 48px;
`;

function Confirmation(props) {
  const { proceed, userInfo } = props;
  return (
    <Grid container direction="column" justify="flex-start">
      <Grid item xs={12}>
        <StyledText weight="600" size="18px" align="left">
          Please Activate Your Account
        </StyledText>
      </Grid>
      <Grid item xs={12}>
        <Text size="14px" color="#1d1d26" align="left">
          We have sent a confirmation link to your registered email address:
        </Text>
      </Grid>
      <Grid item xs={12}>
        <StyledText size="14px" weight="bold" color="#1d1d26" align="left">
          {userInfo.email}
        </StyledText>
      </Grid>
      <Grid>
        <LastText size="14px" color="#1d1d26" align="left">
          Please follow the instructions in the email to activate your account. If you did not receive the email within 24 hours,
          please contact our Customer Care Hotline.
        </LastText>
      </Grid>
      <NextButton label="Back to Log In" processing={false} proceed={() => proceed('login')} />
    </Grid>
  );
}
Confirmation.propTypes = {
  proceed: PropTypes.func,
  userInfo: PropTypes.object,
};

export default Confirmation;
