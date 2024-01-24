import React from 'react';
import styled from 'styled-components';

const StyledImage = styled.img`
  width: 120px;
  height: 120px;
  background-color: #d8d8d8;
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  margin-right: 48px;
  @media (max-width: 922px) {
    margin-right: 0px;
  }
`;

function Avatar() {
  return (
    <div>
      <StyledImage />
    </div>
  );
}

export default Avatar;
