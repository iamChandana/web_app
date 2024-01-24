import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';

import Text from 'components/Text';
import Button from 'components/Button';
import Color from 'utils/StylesHelper/color';
import { RowGridLeft, ColumnGridCenter } from 'components/GridContainer';
import CardDrawer from './CardDrawer';
import ReactTooltip from 'react-tooltip';

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  min-height: 104px;
  background-color: #ffffff;
  box-shadow: 0 -4px 12px 0 rgba(0, 0, 0, 0.15);
  margin-top: 100px;
  z-index: 101;
`;

const StyledButton = styled(Button)`
  margin: 0 4px;
  width: 160px;
`;

const StyledLink = styled(Text)`
  margin-top: 8px;
  cursor: pointer;
`;

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #000 !important;
  padding: 10px !important;
  opacity: 0.75 !important;
`;

function BottomDrawer(props) {
  const { addToPorfolio, fundsDrawer, select, removeAll, compareFunds, disableCompareFund } = props;
  const drawerData = fundsDrawer || [];
  return (
    <Container>
      <Grid container alignItems="center" justify="space-around">
        <Grid item>
          <RowGridLeft spacing={16}>
            {/* {fundsDrawer.map((data) => (
              <Grid item>
                <CardDrawer data={data} select={select} />
              </Grid>
            ))} */}
            <Grid item>
              <CardDrawer data={drawerData[0]} select={select} />
            </Grid>
            <Grid item>
              <CardDrawer data={drawerData[1]} select={select} />
            </Grid>
            <Grid item>
              <CardDrawer data={drawerData[2]} select={select} />
            </Grid>
          </RowGridLeft>
        </Grid>
        <Grid item>
          <ColumnGridCenter>
            <Grid item>
              <RowGridLeft>
                <Grid item>
                  <StyledButton onClick={compareFunds} disabled={drawerData.length < 2 || drawerData.length > 3 || disableCompareFund}>
                    {
                      drawerData.length > 3?
                       (<a data-tip data-for='max3Fund'>Compare Funds</a>)
                       :'Compare Funds'
                    }
                  </StyledButton>
                  {
                    drawerData.length > 3?                  
                      <ReactTooltip1 id='max3Fund' effect='solid' place='top'>
                        <Text size="12px" color="#fff" align="left">
                          You can only compare a maximum of 3 funds
                        </Text>
                      </ReactTooltip1>:
                      '' 
                  }                   
                </Grid>
                <Grid item>
                  <StyledButton primary onClick={addToPorfolio} disabled={drawerData.length === 0}>
                    Add to Portfolio
                  </StyledButton>
                </Grid>
              </RowGridLeft>
            </Grid>
            <Grid item>
              <StyledLink color={Color.C_LIGHT_BLUE} size="12px" weight="600" decoration="underline" align="center" onClick={removeAll}>
                Remove All
              </StyledLink>
            </Grid>
          </ColumnGridCenter>
        </Grid>
      </Grid>
    </Container>
  );
}

BottomDrawer.propTypes = {
  addToPorfolio: PropTypes.func,
  fundsDrawer: PropTypes.array,
  select: PropTypes.func,
  removeAll: PropTypes.func,
  compareFunds: PropTypes.func,
};

export default BottomDrawer;
