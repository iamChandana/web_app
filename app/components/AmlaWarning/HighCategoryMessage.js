import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from 'components/Text';
import CustomerCare from 'components/CustomerCare';
import Tooltip from 'material-ui/Tooltip';
import Branch from 'components/Branch';

const StyledText = styled(Text)`
  display: flex;
  justify-content: center;
  line-height: 1.67;
`;
const TextLink = styled(Text)`
  margin: 0 3px;
  line-height: 1.67;
`;

function HighCategoryMesage({ open, toggleInfo, openBranch, toggleBranch, message }) {
  return (
    <React.Fragment>
      <Text lineHeight="1.67">{message}</Text>
      <StyledText>
        Please visit the nearest
        <Tooltip title={<Branch onClose={toggleBranch} />} open={openBranch}>
          <TextLink role="button" onClick={toggleBranch} decoration="underline" cursor="pointer">
            branch
          </TextLink>
        </Tooltip>
        for further assistance.
      </StyledText>
      <StyledText>
        Please contact our
        <Tooltip title={<CustomerCare onClose={toggleInfo} />} open={open}>
          <TextLink role="button" onClick={toggleInfo} decoration="underline" cursor="pointer">
            Customer Care
          </TextLink>
        </Tooltip>
        if you have further questions.
      </StyledText>
    </React.Fragment>
  );
}

HighCategoryMesage.propTypes = {
  toggleInfo: PropTypes.func,
  open: PropTypes.bool,
  openBranch: PropTypes.bool,
  toggleBranch: PropTypes.func,
  message: PropTypes.string,
};

export default HighCategoryMesage;
