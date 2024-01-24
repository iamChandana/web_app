import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';

// own components
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';
import NextButton from './NextButton';
import AuthLink from './AuthLink';
import TextInput from './TextInput';

const StyledText = styled(Text)`
  margin-bottom: 16px;
  width: 100%;
`;

const InputWrapper = styled.div`
  margin-bottom: 94px;
  width: 100%;
`;

class InputUserId extends React.Component {
  static propTypes = {
    userId: PropTypes.string,
    handleInputChange: PropTypes.func,
    proceed: PropTypes.func,
    processing: PropTypes.bool,
    setMode: PropTypes.func,
    error: PropTypes.string,
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
    const { userId, handleInputChange, proceed, processing, setMode, error } = this.props;
    return (
      <React.Fragment>
        <form onSubmit={proceed} autoComplete="off">
          <Grid container justify="flex-start" alignItems="flex-start">
            <StyledText weight="600" size="18px" align="left">
              Principal Consultant Log In
            </StyledText>
            <StyledText color="#1d1d26" align="left">
              Enter your User ID to begin.
            </StyledText>
          </Grid>
          <Grid container justify="flex-start" alignItems="flex-start">
            <InputWrapper>
              <TextInput
                autoComplete="off"
                label="USER ID"
                value={userId}
                handleInputChange={handleInputChange}
                name="userId"
                type="text"
                innerRef={this.createInputRef}
              />
              {error && (
                <StyledText color={Color.C_RED} align="left">
                  {error}
                </StyledText>
              )}
            </InputWrapper>
            <NextButton label="Proceed" processing={processing || userId} />
          </Grid>
        </form>
        <AuthLink setMode={setMode} />
      </React.Fragment>
    );
  }
}

// const createReduxForm = reduxForm({ form: 'inputUserId' });

export default InputUserId;
