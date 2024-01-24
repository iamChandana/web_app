import React from 'react';
import styled from 'styled-components';

import LogoImage from './images/logo.png';

const StyledImage = styled.img`
  position: absolute;
  top: 28px;
  left: 41px;
`;

function Logo() {
  return <StyledImage src={LogoImage} alt="CIMB" />;
}

export default Logo;
