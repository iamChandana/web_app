import React from 'react';
import PropTypes from 'prop-types';

import Text from 'components/Text';

function TableHeader(props) {
  return (
    <Text color="#1d1d26" weight="bold" size="10px" opacity="0.4" lineHeight="1.6" align="left">
      {props.children}
    </Text>
  );
}

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TableHeader;
