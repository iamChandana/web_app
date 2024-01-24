/* eslint react/jsx-closing-bracket-location: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';

import NextButton from './NextButton';
import TextPassword from './TextPassword';

const StyledText = styled(Text)`
  margin-bottom: 16px;
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
  margin-bottom: 48px;
  width: 100%;
`;

const NRICMask = styled(TextPassword)`
  margin-bottom: 8px;
`;
const StyledErrorText = styled(Text)`
  margin-bottom: 16px;
  width: 100%;
`;
function PasswordRecovery(props) {
  const { handleInputChange, proceed, nric, processing, setMode, error } = props;
  return (
    <Grid container direction="column">
      <form onSubmit={proceed} autoComplete="off">
        <Grid container justify="flex-start" alignItems="flex-start">
          <StyledText weight="600" size="18px" align="left">
            Recover My User ID
          </StyledText>
          <StyleLastText size="14px" align="left" color="#1d1d26">
            Please key in your NRIC number. Your User ID will be sent to your registered email address.
          </StyleLastText>
          <InputWrapper>
            <NRICMask label="NRIC NUMBER" handleInputChange={handleInputChange} name="nric" />
            {/* <TextInput label="NRIC NUMBER" value={nric} handleInputChange={handleInputChange} name="nric" type="text" /> */}
            {error && (
              <StyledErrorText color={Color.C_RED} align="left">
                {error}
              </StyledErrorText>
            )}
          </InputWrapper>
          <NextButton label="Continue" processing={processing || nric} />
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}

PasswordRecovery.propTypes = {
  handleInputChange: PropTypes.func,
  proceed: PropTypes.func,
  processing: PropTypes.bool,
  setMode: PropTypes.func,
  error: PropTypes.string,
  nric: PropTypes.string,
};

export default PasswordRecovery;
