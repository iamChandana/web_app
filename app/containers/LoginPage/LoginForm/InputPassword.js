/* eslint react/jsx-closing-bracket-location: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import BaseUrl from 'utils/getDomainUrl';

import Color from 'utils/StylesHelper/color';
import Text from 'components/Text';

import NextButton from './NextButton';
import AuthLink from './AuthLink';
import TextInput from './TextInput';
import TextPassword from './TextPassword';
import BackIcon from './images/back.png';

const StyledText = styled(Text)`
  padding-bottom: 23px;
`;

const FlexGridItem = styled(Grid)`
  display: flex;
`;

const StyledImageForBackIcon = styled.img`
  width: 17px;
  margin-right: 8px;
  cursor: pointer;
`;

const StyledImage = styled.img`
  width: 56px;
  height: 56px;
  border: solid 1px #979797;
  margin-right: 16px;
`;

const InputWrapper = styled.div`
  margin-bottom: 24px;
  width: 100%;
`;
const BackLink = styled(Text)`
  margin-top: 90px;
  text-align: center;
  cursor: pointer;
  line-height: 0;
  color: ${Color.C_LIGHT_BLUE};
`;

const tempImageBaseUrl = `${BaseUrl}/api/gateway/_internal/Agents/getSimg/`;

class InputPassword extends React.PureComponent {
  static propTypes = {
    proceed: PropTypes.func,
    processing: PropTypes.bool,
    setMode: PropTypes.func,
    handleInputChange: PropTypes.func,
    userInfo: PropTypes.object,
    prevMode: PropTypes.string,
    password: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    message: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.createInputRef = this.createInputRef.bind(this);
  }

  componentDidMount() {
    this.input.focus();
  }

  createInputRef(ref) {
    this.input = ref;
  }

  render() {
    const { proceed, processing, setMode, handleInputChange, userInfo, prevMode, password, error, message } = this.props;
    const sw = userInfo.agent && userInfo.agent.sw;
    const isFromLogin = prevMode === 'login';
    const HeaderText = prevMode === 'login' ? 'Principal Consultant Log In' : 'Enter Your Account Password';
    return (
      <Grid container direction="column">
        <form onSubmit={proceed}>
          <Grid item xs={12}>
            <StyledText weight="600" size="18px" align="left">
              {HeaderText}
            </StyledText>
          </Grid>
          <FlexGridItem item xs={12}>
            <StyledText weight="bold" size="14px" color="#1d1d26">
              {isFromLogin && <StyledImageForBackIcon src={BackIcon} onClick={() => setMode('login')} />}
              User ID: &nbsp;
            </StyledText>
            <StyledText size="14px" color="#1d1d26">
              {userInfo.agent ? userInfo.agent.username : ''}
            </StyledText>
          </FlexGridItem>
          <Grid item xs={12}>
            <Grid container direction="row">
              <Grid item>
                {userInfo.agent ? <StyledImage src={`${tempImageBaseUrl}simg${userInfo.agent.simgid}.png`} alt="Secret" /> : ''}
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
            <InputWrapper>
              <TextPassword
                label="PASSWORD"
                handleInputChange={handleInputChange}
                name="password"
                autoComplete="off"
                innerRef={this.createInputRef}
              />
              {error && (
                <StyledText color={Color.C_RED} align="left">
                  {message}
                </StyledText>
              )}
            </InputWrapper>

            {!isFromLogin && (
              <React.Fragment>
                <NextButton label="Proceed" processing={processing || password} />
                <BackLink
                  size="12px"
                  weight="600"
                  onClick={() => setMode('secrets')}
                  decoration="underline"
                  role="button"
                  align="left">
                  Back
                </BackLink>
              </React.Fragment>
            )}
            {isFromLogin && (
              <React.Fragment>
                <NextButton withIcon label="Log In to Dashboard" processing={processing || password} />
                <AuthLink setMode={setMode} />
              </React.Fragment>
            )}
          </Grid>
        </form>
      </Grid>
    );
  }
}

export default InputPassword;
