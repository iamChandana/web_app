import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

// custom
import Text from 'components/Text';

import NextButton from './NextButton';

const StyledText = styled(Text)`
  margin-bottom: 20px;
`;

const LastText = styled(Text)`
  margin-bottom: 32px;
`;
function UserVerify(props) {
  const { userInfo, proceed, processing } = props;
  return (
    <React.Fragment>
      <Grid container justify="flex-start" alignItems="flex-start">
        <StyledText weight="600" size="18px" align="left">
          Welcome to Our New Principal Direct Access!
        </StyledText>
        <StyledText size="14px" color="#1d1d26" align="left">
          Before you login in to our portal for the first time, there are some security details we will need you to set up for your account.
        </StyledText>
        <Text size="14px" color="#1d1d26" align="left">
          First, please verify your registered mobile number:
        </Text>
        <LastText weight="600" size="14px" color="#1d1d26" align="left">
          {userInfo.agent.MobileNo}
        </LastText>
        <NextButton proceed={proceed} label="Verify" processing={processing} />
      </Grid>
    </React.Fragment>
  );
}

UserVerify.propTypes = {
  userInfo: PropTypes.object,
  proceed: PropTypes.func,
  processing: PropTypes.bool,
};

export default UserVerify;
