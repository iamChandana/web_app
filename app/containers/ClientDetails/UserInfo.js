import React from 'react';
import styled from 'styled-components';
import Text from 'components/Text';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const Icon = styled.img`
  margin-right: 8px;
  width: 16px;
  height: 12px;
`;

function UserInfo(props) {
  const { icon, name } = props;
  return (
    <Container>
      <Icon src={icon} />
      <Text color="#ffffff" size="14px" lineHeight="1.43">
        {name}
      </Text>
    </Container>
  );
}

export default UserInfo;
