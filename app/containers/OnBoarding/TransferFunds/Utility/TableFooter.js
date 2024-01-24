import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from 'components/Text';

function TableFooter(props) {
  return (
    <Text color="#1d1d26" size="10px" opacity="0.4" lineHeight="1.6" align="right">
      {props.children}
    </Text>
  );
}

TableFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TableFooter;
