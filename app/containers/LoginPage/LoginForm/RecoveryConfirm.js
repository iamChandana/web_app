import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import Text from 'components/Text';

import NextButton from './NextButton';

const StyledText = styled(Text)`
  margin-bottom: 16px;
`;
const LastText = styled(Text)`
  margin-bottom: 80px;
`;

function RecoveryConfirm(props) {
  const { proceed, userInfo } = props;
  return (
    <Grid container direction="row" justify="flex-start">
      <Grid item xs={12}>
        <StyledText weight="600" size="18px" align="left">
          Recover My User ID
        </StyledText>
      </Grid>
      <Grid item xs={12}>
        <Text size="14px" color="#1d1d26" align="left">
          We have sent your User ID to your registered email address:
        </Text>
        <StyledText size="14px" weight="600" color="#1d1d26" align="left">
          {userInfo.agent.email}
        </StyledText>
      </Grid>
      <Grid>
        <LastText size="14px" color="#1d1d26" align="left">
          If you did not receive the email within 24 hours, please contact our support hotline.
        </LastText>
      </Grid>
      <NextButton label="Back to Log In" processing={false} proceed={() => proceed('login')} />
    </Grid>
  );
}

RecoveryConfirm.propTypes = {
  proceed: PropTypes.func,
  userInfo: PropTypes.object,
};

export default RecoveryConfirm;
