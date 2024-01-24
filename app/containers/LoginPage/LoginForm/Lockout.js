/* eslint react/no-unescaped-entities: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Text from 'components/Text';
import ReactTooltip from 'react-tooltip';

import { ColumnGridLeft } from 'components/GridContainer';

import NextButton from './NextButton';
import StyledText from './StyledText';

const TextWrapper = styled(Text)`
  margin-bottom: 148px;
  max-width: 282px;
`;

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #676775 !important;
  padding: 15px !important;
  opacity: 0.85 !important;
  margin-right: 50px !important;
`;

function Lockout(props) {
  const { proceed } = props;
  // const time = moment().format(' h:mm A, D MMMM YYYY');
  // const
  return (
    <Grid container direction="column" justify="space-between">
      <Grid item xs={12}>
        <ColumnGridLeft>
          <Grid item>
            <StyledText weight="600" size="18px" align="left">
              Username/password incorrect!!
            </StyledText>
          </Grid>
          <Grid item>
            <TextWrapper size="14px" color="#1d1d26" align="left">
              Your account has been locked since you have reached maximum number of invalid logon attempts. Please click on
              "Proceed to Login" button below to reset your password.
            </TextWrapper>
          </Grid>
        </ColumnGridLeft>
      </Grid>
      <NextButton label="Proceed to Log In" processing={false} proceed={() => proceed('login')} />
      <ReactTooltip1 id="customerCare" effect="solid" place="bottom">
        <Text size="14px" weight="bold" color="#fff" align="left">
          Agency Hotline
        </Text>
        <Text size="12px" color="#fff" align="left">
          03-77237261
        </Text>
        <Text size="12px" color="#fff" align="left">
          Monday to Friday: 8:45 am to 5:45 pm
        </Text>
        <Text size="12px" weight="bold" color="#fff" align="left">
          (except on Kuala Lumpur and national public holidays)
        </Text>
      </ReactTooltip1>
    </Grid>
  );
}
Lockout.propTypes = {
  proceed: PropTypes.func,
};

export default Lockout;
