import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from 'components/Text';

const StyledChip = styled.button`
  min-width: 72px;
  height: 24px;
  opacity: ${(props) => (props.opacity ? props.opacity : 0.6)};
  border-radius: 12px;
  background-color: ${(props) => (props.color ? props.color : '#1d1d26')};
  margin-bottom: ${(props) => (props.bottom ? props.bottom : '8px')};
  margin-right: ${(props) => (props.right ? props.right : '8px')};
  color: #fff;
  span {
    padding: 0 10px;
  }
`;
function Chip(props) {
  const { name, bottom, color, opacity, textColor = '#fff' } = props;
  return (
    <StyledChip bottom={bottom} color={color} opacity={opacity}>
      <Text color={textColor} size="10px" weight="bold">
        {name}
      </Text>
    </StyledChip>
  );
}

Chip.propTypes = {
  name: PropTypes.string,
  bottom: PropTypes.any,
  color: PropTypes.string,
  opacity: PropTypes.number,
  textColor: PropTypes.string,
};

export default Chip;
