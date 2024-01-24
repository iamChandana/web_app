import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import BackArrow from './images/left-arrow.svg';

const Wrapper = styled.div`
  margin-top: 23px;
`;

const StyledBackArrow = styled.img`
  width: 20px;
  height: 13px;
`;
const StyledLink = styled(Link)`
  margin-left: 40px;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`;

function BackToClient() {
  return (
    <Wrapper>
      <StyledLink to="/clients">
        <StyledBackArrow src={BackArrow} alt="Back To Clients" />Back to Client List
      </StyledLink>
    </Wrapper>
  );
}

export default BackToClient;
