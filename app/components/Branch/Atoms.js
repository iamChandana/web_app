import styled from 'styled-components';
import { primaryFont } from 'utils/StylesHelper/font';
import Text from 'components/Text';

export const Container = styled.div`
  background-color: #676775;
  border-radius: 5px;
  height: 300px;
  overflow-y: auto;
  opacity: 1;
  padding: 10px;
  position: absolute;
  bottom: -15px;
  right: 0;
  width: 269px;
`;

export const Item = styled.div`
  &:not(:first-of-type) {
    padding-top: 5px;
  }

  &:not(:last-of-type) {
    padding-bottom: 5px;
  }

  & > img {
    margin-right: 8px;
  }
`;

export const Button = styled.button`
  cursor: pointer;
  display: inline-block;
  float: right;
`;

export const Link = styled.a`
  color: #fff;
  cursor: pointer;
  font-family: ${primaryFont};
  font-size: 12px;
  text-decoration: underline;
`;

export const InlineTextWrapper = styled.div`
  display: block;
`;

export const InlineText = styled(Text)`
  display: inline-block;
`;
