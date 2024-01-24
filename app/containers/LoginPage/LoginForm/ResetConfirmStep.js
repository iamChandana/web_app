import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import BaseUrl from 'utils/getDomainUrl';

import Text from 'components/Text';

import NextButton from './NextButton';
import TextInput from './TextInput';

const StyledText = styled(Text)`
  margin-bottom: 15px;
`;

const FlexGridItem = styled(Grid)`
  display: flex;
`;

const StyledNextButton = styled.div`
  margin-top: 85px;
`;
const StyledImage = styled.img`
  width: 56px;
  height: 56px;
  border: solid 1px #979797;
  margin-right: 16px;
`;

const InputWrapper = styled.div`
  width: 100%;
`;

const tempImageBaseUrl = `${BaseUrl}/api/gateway/_internal/Agents/getSimg/`;
function ResetConfirmStep(props) {
  const { proceed, processing, handleInputChange, userInfo, prevMode } = props;
  const sw = userInfo.agent && userInfo.agent.sw;
  const HeaderText = prevMode === 'resetConfirm' ? 'Confirm your Secure Image and Secure Word' : 'Enter Your Account Password';
  // const Footer  = fromLogin ? ''()
  return (
    <Grid container direction="column">
      <form onSubmit={proceed} autoComplete="off">
        <Grid item xs={12}>
          <StyledText weight="600" size="18px" align="left">
            {HeaderText}
          </StyledText>
        </Grid>
        <FlexGridItem item xs={12}>
          <StyledText weight="bold" size="14px" color="#1d1d26">
            User ID: &nbsp;
          </StyledText>
          <StyledText size="14px" color="#1d1d26">
            {userInfo.agent ? userInfo.agent.username : ''}
          </StyledText>
        </FlexGridItem>
        <Grid item xs={12}>
          {userInfo.agent && userInfo.agent.simgid && sw && (
            <Grid container direction="row">
              <Grid item>
                <StyledImage src={`${tempImageBaseUrl}simg${userInfo.agent.simgid}.png`} alt="Secret" />
              </Grid>
              <Grid item xs>
                <Grid container direction="row">
                  <InputWrapper>
                    <TextInput
                      label="SECURE WORD"
                      disabled
                      value={sw}
                      handleInputChange={handleInputChange}
                      name="sw"
                      type="text"
                      autoComplete="off"
                    />
                  </InputWrapper>
                </Grid>
              </Grid>
            </Grid>
          )}
          <StyledNextButton>
            <NextButton label="Confirm" processing={processing} />
          </StyledNextButton>
        </Grid>
      </form>
    </Grid>
  );
}

ResetConfirmStep.propTypes = {
  proceed: PropTypes.func,
  processing: PropTypes.bool,
  handleInputChange: PropTypes.func,
  userInfo: PropTypes.object,
  prevMode: PropTypes.string,
};
export default ResetConfirmStep;
