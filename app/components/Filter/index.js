import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import styled, { ThemeProvider } from 'styled-components';
import Text from 'components/Text';

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.flexDirection ? props.flexDirection : 'row')};
  align-items: center;
  .label {
    font-size: 12px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: right;
    opacity: 0.9;
    color: #979797;
  }
`;

export const StyledSelect = styled(Select)`
  width: 150px;
  height: 40px;
  opacity: 0.9;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #979797;
  margin-left: 16px;
  margin-right: ${(props) => (props.theme.lastItem ? '0' : '25px')};
  text-align: center;
  > div > div {
    margin-top: 5px;
  }
  &::before,
  &::after {
    display: none;
  }
  svg {
    color: Color.C_LIGHT_BLUE;
  }
`;

function Filter(props) {
  const { data, name, onChange, value, label, lastItem, onClick, flexDirection, page } = props;
  const theme = {
    lastItem,
  };

  const getValue = (item) => {
    if (name === 'modelPortfolioFilter') {
      return page === 'addFunds' ? item.value : item.codevalue;
    }
    return item.value;
  };
  return (
    <ThemeProvider theme={theme}>
      <FilterContainer flexDirection={flexDirection}>
        {label && <Text className="label">{label}</Text>}
        <StyledSelect value={value} onChange={(e) => onChange(e, name)} onClick={onClick}>
          {data.map((item, i) => (
            <MenuItem key={i} value={getValue(item)}>
              {item.name || item.description}
            </MenuItem>
          ))}
        </StyledSelect>
      </FilterContainer>
    </ThemeProvider>
  );
}

Filter.propTypes = {
  name: PropTypes.string,
  data: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.any,
  label: PropTypes.string,
  lastItem: PropTypes.bool,
};

export default Filter;
