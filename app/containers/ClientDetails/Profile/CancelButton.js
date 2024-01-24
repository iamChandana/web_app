import React from 'react';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import defaultFont from 'utils/StylesHelper/font';
// import SaveIcon from '../images/edit-ic.svg';
import Text from 'components/Text';

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.7px;
  background-color: ${Color.C_LIGHT_BLUE};
  // margin-top: 32px;
  color: #ffffff;
  font-family: ${defaultFont.primary.name};
  outline: none;
  cursor: pointer;
`;
const Img = styled.img`
  margin-left: 8px;
`;
function CancelButton(props) {
  const { onClick } = props;
  return (
    <StyledBtn onClick={onClick}>
      <Text color="#ffffff">Cancel</Text>
    </StyledBtn>
  );
}

export default CancelButton;
