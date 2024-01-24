/* eslint react/jsx-closing-bracket-location: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';

import Color from 'utils/StylesHelper/color';
import Text from 'components/Text';

import NextButton from './NextButton';
import TextInput from './TextInput';

const StyledText = styled(Text)`
  margin-bottom: 15px;
`;

const BackLink = styled(Text)`
  display: flex;
  margin-top: 8px;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
`;

const StyleLastText = styled(Text)`
  margin-bottom: 34px;
`;

const InputWrapper = styled.div`
  margin-bottom: 24px;
  width: 100%;
`;

const StyledErrorText = styled(Text)`
  margin-bottom: 16px;
  width: 100%;
`;

function ResetPassword(props) {
  const { proceed, processing, setMode, handleInputChange, userId, error } = props;
  return (
    <Grid container direction="column">
      <form onSubmit={proceed} autoComplete="off">
        <Grid item xs={12}>
          <StyledText weight="600" size="18px" align="left">
            Reset My Password
          </StyledText>
        </Grid>
        <StyleLastText size="14px" align="left" color="#1d1d26">
          Key in your User ID and we will send you a One-Time Password (OTP) to your registered mobile number.
        </StyleLastText>
        <InputWrapper>
          <TextInput label="USER ID" value={userId} handleInputChange={handleInputChange} name="userId" type="text" autoComplete="off"/>
          {error && (
            <StyledErrorText color={Color.C_RED} align="left">
              {error}
            </StyledErrorText>
          )}
        </InputWrapper>
        <NextButton label="Continue" processing={processing || userId} />
        <BackLink
          color={Color.C_LIGHT_BLUE}
          size="12px"
          weight="600"
          onClick={() => setMode('login')}
          decoration="underline"
          role="button"
          align="left">
          Back to Log In
        </BackLink>
      </form>
    </Grid>
  );
}

ResetPassword.propTypes = {
  proceed: PropTypes.func,
  processing: PropTypes.bool,
  setMode: PropTypes.func,
  handleInputChange: PropTypes.func,
  userId: PropTypes.string,
  error: PropTypes.string,
};
export default ResetPassword;
