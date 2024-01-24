import React from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Checkbox from 'material-ui/Checkbox';
import Color from 'utils/StylesHelper/color';
import SophisticatedDisclaimer from 'components/SophisticatedUsersDeclartion';

const StyledCheckbox = styled(Checkbox)`
  width: 20px;
  height: 20px;
  margin-right: 16px;
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const Container = styled.div`
  width: 100%;
  background-color: rgba(0, 145, 218, 0.05);
  padding: 20px;
`;

const DisclaimerWrapper = styled.div`
padding: ${(props) => props.padding};
`;

export default function WholeSaleDisclaimer(props) {
  const { acknowledge, onChange, secondaryHolderNameIfAvailable } = props;
  return (
    <Container>
      <Grid justify="center" container>
        <Grid item>
          <StyledCheckbox checked={acknowledge} onChange={onChange} value="true" />
        </Grid>
        <Grid>
          <DisclaimerWrapper padding="12px 0 0 0">
            <SophisticatedDisclaimer clientName={props.fullName} secondaryHolderNameIfAvailable={secondaryHolderNameIfAvailable} />
          </DisclaimerWrapper>
        </Grid>
      </Grid>
    </Container>
  )
}