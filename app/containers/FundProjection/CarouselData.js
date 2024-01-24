import React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';

import Icon from 'containers/Dashboard/images/icon_light_bulb.png';

const Img = styled.img`
  width: 40px !important;
  height: 40px !important;
`;

const CarouselData = ({ text }) => (
  <Grid container alignItems="center" justify="center">
    <Grid item xs={2}>
      <Img src={Icon} alt="bulb-ic" />
    </Grid>
    <Grid item xs={10}>
      <Text weight="bold">{text}</Text>
    </Grid>
  </Grid>
);

const Data = (data) => [
  <CarouselData text={data.pricePerformanceMsg} />,
  <CarouselData text={data.expenseRatioMsg} />,
  <CarouselData text={data.minInitialInvestMsg} />,
  <CarouselData text={data.assetClassMsg} />,
];

export default Data;
