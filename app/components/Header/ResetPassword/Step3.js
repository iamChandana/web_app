import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'components/Button';
import Text from 'components/Text';
import TextPassword from 'containers/LoginPage/LoginForm/TextPassword';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import Parser from 'html-react-parser';

import { GridContentItem, GridMainContainer } from './Atoms';

const StyledErrorText = styled(Text)`
  margin-top: 5px;
  width: 100%;
`;

function Step3(props) {
  const { values, handleInputChange, onClick, isButtonDisabled, error } = props;

  const newPasswordFieldSettings = {
    //label: 'NEW PASSWORD',
    name: 'newPass',
    value: values[0],
    handleInputChange,
    placeholder: 'New Password'
  };
  const confirmNewPasswordFieldSettings = {
    //label: 'CONFIRM NEW PASSWORD',
    name: 'confirmPassword',
    value: values[1],
    handleInputChange,
    placeholder: 'Re-type New Password'
  };

  return (
    <GridMainContainer container>
      <Grid item xs={12}>
        <Text align="left" size="18px" weight="bold">
          Change My Password
        </Text>
        <Text align="left">Now enter your new password.</Text>       
      </Grid>
      <GridContentItem item xs={12}>
        {error && (
          <StyledErrorText color={Color.C_RED} align="left">
            {Parser(error)}
          </StyledErrorText>
        )}      
        <TextPassword {...newPasswordFieldSettings} />
        <div style={{padding:5}}></div>
        <TextPassword {...confirmNewPasswordFieldSettings} />     
      </GridContentItem>
      <Grid item xs={12}>
        <Button disabled={isButtonDisabled} onClick={onClick} width="100%" primary>
          Confirm
        </Button>
      </Grid>
    </GridMainContainer>
  );
}

Step3.propTypes = {
  values: PropTypes.array,
  handleInputChange: PropTypes.func,
  onClick: PropTypes.func,
  isButtonDisabled: PropTypes.bool,
};
export default Step3;
