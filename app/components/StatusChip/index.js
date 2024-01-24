import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Chip from 'material-ui/Chip';
import Color from 'utils/StylesHelper/color';

const StyledChip = styled(Chip)`
  min-width: 59px !important;
  height: 24px !important;
  border-radius: 12px !important;
  background-color: ${(props) => (props.label === 'Active' ? `${Color.C_GREEN} !important` : '#f5a623 !important')};
  color: #fff !important;
`;

function StatusChip(props) {
  const { label } = props;
  return <StyledChip label={label} />;
}

StatusChip.propTypes = {
  label: PropTypes.string,
};
export default StatusChip;
