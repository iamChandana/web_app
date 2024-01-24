import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

const StyledDivider = styled.div`
  height: ${(props) => (props.height ? props.height : '48px')};
  width: ${(props) => (props.width ? props.width : '2px')};
  background: #cacaca;
`;

function VerticalDivider(props) {
  const { height, width } = props;
  return <StyledDivider height={height} width={width} />;
}

VerticalDivider.propTypes = {
  height: PropTypes.number,
  width: PropTypes.width,
};

export default VerticalDivider;
