import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Text from 'components/Text';
import moment from 'moment';

import { ColumnGridLeft } from 'components/GridContainer';

import NextButton from './NextButton';
import StyledText from './StyledText';

const TextWrapper = styled(Text)`
  margin-bottom: 148px;
  width: 300px;
`;

function PasswordResetted(props) {
  const { proceed } = props;
  const time = moment().format(' h:mm A, D MMMM YYYY');
  // const
  return (
    <Grid container direction="column" justify="space-between">
      <Grid item xs={12}>
        <ColumnGridLeft>
          <Grid item>
            <StyledText weight="600" size="18px" align="left">
              Reset My Password
            </StyledText>
          </Grid>
          <Grid item>
            <TextWrapper size="14px" color="#1d1d26" align="left">
              Your password has been successfully changed at {time}.
            </TextWrapper>
          </Grid>
        </ColumnGridLeft>
      </Grid>

      <NextButton label="Proceed to Log In" processing={false} proceed={() => proceed('login')} />
    </Grid>
  );
}
PasswordResetted.propTypes = {
  proceed: PropTypes.func,
};

export default PasswordResetted;
