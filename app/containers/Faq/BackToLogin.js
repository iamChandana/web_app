import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
  position: absolute;
  top: 32px;
  right: 40px;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`;

function BackToLogin() {
  return <StyledLink to="/login">Back to Log In</StyledLink>;
}

export default BackToLogin;
