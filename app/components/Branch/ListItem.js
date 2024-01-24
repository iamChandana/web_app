import React from 'react';
import styled from 'styled-components';
import Text from 'components/Text';
import Parser from 'html-react-parser';

const InlineInfo = styled.div`
  display: block;
`;
const InfoDetail = styled(Text)`
  display: inline-block;
`;

const InfoLabel = styled(Text)`
  display: inline-block;
  margin-right: 5px;
`;
const Wrapper = styled.div`
  margin: 5px 0;
`;

function ListItem({ item }) {
  const { category, name, address, tel, fax } = item;
  return (
    <Wrapper>
      {category && (
        <Text size="12px" weight="bold" color="#fff" align="left">
          {category}
        </Text>
      )}
      <Text size="12px" weight="bold" color="#fff" align="left">
        {name}
      </Text>
      <Text size="12px" color="#fff" align="left">
        {Parser(address)}
      </Text>
      <InlineInfo>
        <InfoLabel size="12px" color="#fff" align="left" weight="bold">
          Tel:
        </InfoLabel>
        <InfoDetail size="12px" color="#fff" align="left">
          {tel}
        </InfoDetail>
      </InlineInfo>
      <InlineInfo>
        <InfoLabel size="12px" color="#fff" align="left" weight="bold">
          Fax:
        </InfoLabel>
        <InfoDetail size="12px" color="#fff" align="left">
          {fax}
        </InfoDetail>
      </InlineInfo>
    </Wrapper>
  );
}

export default ListItem;
