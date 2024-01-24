import React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import { RowGridLeft, ColumnGridCenter, ColumnGridLeft } from 'components/GridContainer';

const Container = styled.div`
  width: 272px;
  height: 128px;
  border-radius: 5px;
  background-color: rgba(103, 103, 117, 0.5);
  margin-bottom: 4px;
  padding: 20px 16px;
  .message {
    max-width: 184px;
  }
`;

const DateHolder = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 16px;
  border-radius: 3.6px;
  border: solid 0.7px #ffffff;
  .content {
    height: 100%;
  }
`;
function NotificationCard(props) {
  return (
    <Container>
      <RowGridLeft>
        <Grid item>
          <DateHolder>
            <ColumnGridCenter className="content">
              <Grid item>
                <Text color="#fff" size="10px" weight="bold">
                  Mar
                </Text>
              </Grid>
              <Grid item>
                <Text color="#fff" size="10px" weight="bold">
                  12
                </Text>
              </Grid>
            </ColumnGridCenter>
          </DateHolder>
        </Grid>
        <Grid item>
          <ColumnGridLeft>
            <Grid item>
              <Text color="#fff" size="14px" align="left" className="message">
                UPDATE: Paul Thomas’s cheque has been accepted.
              </Text>
            </Grid>
            <Grid item>
              <Text color="#fff" size="12px" weight="600" decoration="underline" cursor="pointer">
                View Client
              </Text>
            </Grid>
          </ColumnGridLeft>
        </Grid>
      </RowGridLeft>
    </Container>
  );
}

export default NotificationCard;
