/**
 *
 * InputValue
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from 'components/Text';

const Container = styled.div`
  background-color: ${(props) => (props.odd ? '#ffffff' : '#f5f5f5')};
  padding: 7px 16px;
`;
function InputValue(props) {
  const { value, label, odd } = props;
  return (
    <Container odd={odd}>
      <Text size="10px" color="#1d1d26" weight="bold" opacity="0.4" lineHeight="1.6" align="left">
        {label}
      </Text>
      <Text size="14px" color="#1d1d26" lineHeight="1.43" align={props.align ? props.align : 'left'}>
        {value}
      </Text>
    </Container>
  );
}

InputValue.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string,
  odd: PropTypes.any,
};

export default InputValue;
