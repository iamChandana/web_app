import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Parser from 'html-react-parser';

// own components
import Color from 'utils/StylesHelper/color';
import Text from 'components/Text';
import NextButton from './NextButton';
import TextPassword from './TextPassword';

const StyledText = styled(Text)`
  margin-bottom: 16px;
  width: 100%;
  .fail {
    margin-left: 22px;
  }
  .success {
    color: black;
    img {
      margin-right: 5px;
    }
  }
`;

const StyledLastText = styled(StyledText)`
  margin-bottom: 28px;
`;
const NewPassword = styled(TextPassword)`
  margin-bottom: 8px;
`;
const ConfirmPassword = styled(TextPassword)`
  margin-bottom: 24px;
`;

function ChangePassword(props) {
  const { userId, handleInputChange, proceed, processing, error, newPassword, confirmPassword } = props;
  return (
    <React.Fragment>
      <form onSubmit={proceed} autoComplete="off">
        <Grid container justify="flex-start" alignItems="flex-start">
          <StyledText weight="600" size="18px" align="left">
            Reset My Password
          </StyledText>
          <Text color="#1d1d26" align="left">
            You have requested to reset your password for:
          </Text>
          <StyledLastText weight="600" color="#1d1d26" align="left">
            {userId}
          </StyledLastText>
        </Grid>
        <Grid container justify="flex-start" alignItems="flex-start">
          {error && !processing && (
            <StyledText color={Color.C_RED} align="left">
              {Parser(error)}
            </StyledText>
          )}
          <NewPassword handleInputChange={handleInputChange} name="newPassword" placeholder="New Password" autoComplete="off"/>
          <ConfirmPassword handleInputChange={handleInputChange} name="confirmPassword" placeholder="Re-type New Password" autoComplete="off"/>
          <NextButton label="Reset Password" processing={processing || (newPassword && confirmPassword)} />
        </Grid>
      </form>
    </React.Fragment>
  );
}

ChangePassword.propTypes = {
  userId: PropTypes.string,
  handleInputChange: PropTypes.func,
  proceed: PropTypes.func,
  processing: PropTypes.bool,
  error: PropTypes.string,
  newPassword: PropTypes.string,
  confirmPassword: PropTypes.string,
};

// const createReduxForm = reduxForm({ form: 'ChangePassword' });

export default ChangePassword;
