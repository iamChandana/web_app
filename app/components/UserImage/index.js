/**
 *
 * UserImage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
import Color from 'utils/StylesHelper/color';

const StyledAvatar = styled(Avatar)`
  width: 80px !important;
  height: 80px !important;
  margin-right: 10px;
`;

const StyledBadge = styled(Badge)`
  span {
    top: 1px;
    right: 21px;
    width: 16px;
    height: 16px;
    background-color: ${Color.C_LIGHT_BLUE};
    box-shadow: 0 2px 8px 0 rgba(216, 35, 42, 0.2);
  }
`;

function UserImage(props) {
  if (!props.withNotifications) {
    return (
      // <StyledBadge badgeContent="">
      <StyledAvatar src="http://via.placeholder.com/350x150" />
      // </StyledBadge>
    );
  }

  return StyledAvatar;
}

UserImage.propTypes = {
  withNotifications: PropTypes.bool,
};

export default UserImage;
