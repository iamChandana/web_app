import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Badge from 'material-ui/Badge';
import Color from 'utils/StylesHelper/color';

import Bell from './images/bell.svg';

const Container = styled.div`
  height: 100%;
  width: 72px;
  background-color: #1d1d26;
  box-shadow: -2px 0 8px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  img {
    margin-top: 22px;
    cursor: pointer;
  }
`;

const StyledBadge = styled(Badge)`
  span {
    top: 15px;
    width: 15px;
    right: -5px;
    height: 15px;
    background-color: ${Color.C_LIGHT_BLUE};
    box-shadow: 0 2px 8px 0 rgba(216, 35, 42, 0.2);
  }
`;

function Notifications(props) {
  const { showFull } = props;
  return (
    <Container>
      <StyledBadge>
        <img src={Bell} alt="Notifications" onClick={showFull} />
      </StyledBadge>
    </Container>
  );
}

Notifications.propTypes = {
  showFull: PropTypes.func,
};
export default Notifications;
