import styled from 'styled-components';
import { primaryFont } from 'utils/StylesHelper/font';

export const Container = styled.div`
  background-color: #676775;
  border-radius: 5px;
  height: 350px;
  opacity: 0.85;
  padding: 10px;
  position: absolute;
  bottom: -15px;
  right: 0;
  width: 269px;
`;

export const Item = styled.div`
  &:not(:first-of-type) {
    padding-top: 10px;
  }

  &:not(:last-of-type) {
    padding-bottom: 10px;
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

export const LinkTextGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > :not(:last-child) {
    margin-right: 5px;
  }
`;
