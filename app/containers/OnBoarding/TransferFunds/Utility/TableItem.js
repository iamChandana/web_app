import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from 'components/Text';

function TableItem(props) {
  return (
    <Text color="#1a1a1a" lineHeight="1.43" align="left">
      {props.children}
    </Text>
  );
}

TableItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TableItem;
