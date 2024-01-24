import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Parser from 'html-react-parser';

const Card = styled.div`
  width: 230px;
  height: 120px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  text-align: center;
  margin: 32px 8px 0;
  cursor: pointer;
  &:hover,
  &.selected {
    background-color: #90909a;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.2);
    color: #fff;
  }
`;

function CardOption(props) {
  const { data, onClick, selected } = props;
  const selectedClass = selected && selected.id === data.id ? 'selected' : '';
  return (
    <Card role="button" onClick={() => onClick(data)} className={selectedClass}>
      {Parser(data.answer)}
    </Card>
  );
}

CardOption.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
  selected: PropTypes.any,
};

export default CardOption;
