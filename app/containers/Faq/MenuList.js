import React from 'react';
import PropTypes from 'prop-types';
import { ListItemText } from 'material-ui/List';
import { MenuList, MenuItem } from 'material-ui/Menu';
import styled from 'styled-components';
import { withStyles } from 'material-ui/styles';
import Color from 'utils/StylesHelper/color';
import { primaryFont } from 'utils/StylesHelper/font';

const StyleListItemText = styled(ListItemText)`
  h3 {
    color: white !important;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    margin: 10px 16px !important;
    font-family: ${primaryFont};
  }
`;

const styles = {
  selected: {
    backgroundColor: `${Color.C_LIGHT_BLUE} !important`,
  },
};

const StyledMenuItem = styled(MenuItem)`
  height: 40px;
  background-color: ${Color.C_LIGHT_BLUE};
  &:focus,
  &:hover {
    background-color: ${`${Color.C_LIGHT_BLUE} !important`};
  }
`;

const data = [
  'Getting Started',
  'Client’s Account',
  'Investments',
  'Transactions',
  'Regular Savings Plan (RSP)',
  'Existing Client’s Profile (Principal Direct Access Release 4.0)',
  'General Questions',
];

function Menu(props) {
  const { selected, onClick } = props;
  return (
    <MenuList>
      {data.map((item, index) => (
        <StyledMenuItem
          button
          key={item}
          selected={selected === index}
          classes={{
            selected: props.classes.selected,
          }}
          onClick={() => onClick(index)}>
          <StyleListItemText primary={item} />
        </StyledMenuItem>
      ))}
    </MenuList>
  );
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.number,
  onClick: PropTypes.func,
};

export default withStyles(styles)(Menu);
