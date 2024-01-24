import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';

function InfoText(props) {
  const { title, value } = props;

  return (
    <div>
      <Text color="#90909a" size="10px" align="left" weight="bold">
        {title}
      </Text>
      <Text align="left" color="#000" size="14px" weight="bold">
        {value}
      </Text>
    </div>
  );
}

InfoText.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default InfoText;
