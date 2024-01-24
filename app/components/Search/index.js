import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { primaryFont } from 'utils/StylesHelper/font';
import SearchIcon from './search.svg';

const Input = styled.input`
  height: 40px;
  border-radius: 5px;
  border: solid 1px #cacaca;
  width: 100%;
  padding: 10px 12px;
  padding-left: 30px;
  font-family: ${primaryFont};
  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #f5f5f5;
    border: none;
  }
  input {
    &::placeholder {
      line-height: 1.8;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  padding: 0;
  margin-right: ${(props) => (props.right ? props.right : '20px')};
  width: ${(props) => (props.width ? props.width : '456px')};
  img {
    width: 15.7px;
    height: 16px;
    position: absolute;
    top: 10px;
    cursor: pointer;
    opacity: 0.8;
    left: 10px;
  }
`;

function Search(props) {
  const {
    placeholder = 'Search Existing Client Mobile No. / ID No. / Email Address / UTR Account no.',
    width,
    right,
    value,
    onChange,
  } = props;

  return (
    <InputWrapper width={width} right={right}>
      <Input
        value={value}
        name="search"
        type="text"
        placeholder={placeholder}
        className="change-placeholder"
        onChange={onChange}
      />
      <img role="button" src={SearchIcon} alt="Search" />
    </InputWrapper>
  );
}

Search.propTypes = {
  placeholder: PropTypes.string,
  width: PropTypes.string,
};

export default Search;
