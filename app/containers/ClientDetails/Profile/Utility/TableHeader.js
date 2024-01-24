import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from 'components/Text';

function TableHeader(props) {
  return (
    <Text color="#1d1d26" weight="bold" size="10px" align="left">
      {props.children}
    </Text>
  );
}

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TableHeader;
