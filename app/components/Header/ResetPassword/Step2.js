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

function Step2(props) {
  const { onClick, value, handleInputChange, isButtonDisabled, error } = props;

  const passwordFieldSettings = {
    label: 'CURRENT PASSWORD',
    name: 'existingPass',
    value,
    handleInputChange,
  }; 
  return (
    <GridMainContainer container>
      <Grid item xs={12}>
        <Text align="left" size="18px" weight="bold">
          Change My Password
        </Text>
        <Text align="left">Key in your current password to continue.</Text>        
      </Grid>
      <GridContentItem item xs={12}>
        {error && (
          <StyledErrorText color={Color.C_RED} align="left">
            {Parser(error)}
          </StyledErrorText>
        )}        
        <TextPassword {...passwordFieldSettings} />      
      </GridContentItem>
      <Grid item xs={12}>
        <Button disabled={isButtonDisabled} onClick={onClick} width="100%" primary>
          Continue
        </Button>
      </Grid>
    </GridMainContainer>
  );
}

Step2.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.string,
  handleInputChange: PropTypes.func,
  isButtonDisabled: PropTypes.bool,
};

export default Step2;
