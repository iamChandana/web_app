import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from 'components/Text';
import CustomerCare from 'components/CustomerCare';
import Tooltip from 'material-ui/Tooltip';

const StyledText = styled(Text)`
  display: flex;
  justify-content: center;
  line-height: 1.67;
`;
const TextLink = styled(Text)`
  margin: 0 5px;
  line-height: 1.67;
`;

function BlockedCategoryMesage({ open, toggleInfo, message }) {
  return (
    <React.Fragment>
      <Text lineHeight="1.67">{message}</Text>
      <StyledText>
        Please contact our
        <Tooltip title={<CustomerCare onClose={toggleInfo} />} open={open}>
          <TextLink role="button" onClick={toggleInfo} decoration="underline" cursor="pointer">
            Customer Care
          </TextLink>
        </Tooltip>
        if you have further question.
      </StyledText>
    </React.Fragment>
  );
}

BlockedCategoryMesage.propTypes = {
  toggleInfo: PropTypes.func,
  open: PropTypes.bool,
};

export default BlockedCategoryMesage;
