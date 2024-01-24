import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';

import { RowGridSpaceBetween, RowGridLeft, ColumnGridLeft } from 'components/GridContainer';
import Text from 'components/Text';

import { FullWidthGrid } from './styles';

import Bell from './images/bell.svg';
import Close from './images/white_close.svg';
import NotificationCard from './NotificationCard';

const Container = styled.div`
  height: calc(100vh - 104px);
  position: absolute;
  right: 0;
  top: 104px;
  padding: 30px 24px;
  width: 328px;
  background-color: #1d1d26;
  box-shadow: -2px 0 8px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  .bell {
    margin-left: 8px;
    margin-top: -10px;
  }
  .close {
    cursor: pointer;
  }
  .header {
    margin-bottom: 16px;
  }
`;

function FullNotifications(props) {
  const { closeFull } = props;
  return (
    <Container>
      <ColumnGridLeft>
        <FullWidthGrid item className="header">
          <RowGridSpaceBetween>
            <Grid item>
              <RowGridLeft>
                <Grid item>
                  <Text color="#fff" size="14px" weight="bold">
                    Notifications
                  </Text>
                </Grid>
                <Grid item>
                  <img src={Bell} alt="FullNotifications" className="bell" />
                </Grid>
              </RowGridLeft>
            </Grid>
            <Grid item>
              <img src={Close} alt="Close" onClick={closeFull} className="close" />
            </Grid>
          </RowGridSpaceBetween>
        </FullWidthGrid>
        <FullWidthGrid item>
          <ColumnGridLeft>
            <Grid item>
              <NotificationCard />
            </Grid>
          </ColumnGridLeft>
        </FullWidthGrid>
      </ColumnGridLeft>
    </Container>
  );
}

FullNotifications.propTypes = {
  closeFull: PropTypes.func,
};
export default FullNotifications;
