import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from 'components/Text';
import CheckICon from '../../images/check-icon.svg';

const StyledImage = styled.img`
  width: 16px;
  height: 16px;
`;

const Container = styled.div`
  display: flex;
  img {
    margin-right: 5px;
  }
`;

function DocStatus(props) {
  const { data } = props;
  if (data) {
    return (
      <Container>
        <StyledImage src={CheckICon} alt="Verified" />
        <Text color="#000" size="14px" align="left">
          Verified
        </Text>
      </Container>
    );
  }
  return (
    <Text color="#000" size="14px" align="left">
      Unverified
    </Text>
  );
}

DocStatus.propTypes = {
  data: PropTypes.object,
};

export default DocStatus;
