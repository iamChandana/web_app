import React from 'react';
import styled from 'styled-components';
import Text from 'components/Text';
import Button from 'components/Button';
import Color from 'utils/StylesHelper/color';

export const BolderText = styled(Text)`
  font-weight: bolder;
`;

export const StyledButton = styled(Button)`
  background: ${(props) => (props.primary ? Color.C_LIGHT_BLUE : Color.C_WHITE)};
  margin: 0 10px;
`;
