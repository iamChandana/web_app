import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from 'components/Text';

const StyledText = styled(Text)`
  font-size: 18px;
  color: #1a1a1a;
  line-height: 2.55;
  @media screen and (max-width: 1200px) {
    font-size: 14px;
  }
`;

function FormText(props) {
  return <StyledText>{props.children}</StyledText>;
}

FormText.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormText;
