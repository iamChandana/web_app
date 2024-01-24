/* eslint react/jsx-closing-bracket-location: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';

const GridLink = styled(Grid)`
  margin-top: 8px;
  cursor: pointer;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14px;
`;
const GridItem = styled(Grid)`
  width: 100%;
`;
function AuthLink(props) {
  const { setMode } = props;
  return (
    <GridLink container justify="center" alignItems="center" gutter={24}>
      <GridItem item lg={6} xs={6}>
        <Text
          color={Color.C_LIGHT_BLUE}
          size="12px"
          weight="600"
          onClick={() => setMode('reset')}
          decoration="underline"
          role="button"
          align="center"
          lineHeight="2">
          Reset My Password
        </Text>
      </GridItem>
      <GridItem item lg={6} xs={6}>
        <Text
          color={Color.C_LIGHT_BLUE}
          size="12px"
          weight="600"
          onClick={() => setMode('recovery')}
          decoration="underline"
          role="button"
          align="center"
          lineHeight="2">
          Recover My User ID
        </Text>
      </GridItem>
    </GridLink>
  );
}

AuthLink.propTypes = {
  setMode: PropTypes.func,
};
export default AuthLink;
