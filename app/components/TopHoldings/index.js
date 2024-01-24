import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import IconImportant from 'containers/FundDetails/image/important.png';

const ContentGrid = styled(Grid)`
  height: 73px;
`;
const FullWidthDivider = styled(Divider)`
  width: 100%;
`;

const DisclaimerSection = styled.div`
  display: flex;
`;
const DisclaimerImage = styled.div`
  flex: 5%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-cntent: flex-start;
  height: 50px;

  @media only screen 
    and (min-width: 768px)
    and (-webkit-min-device-pixel-ratio: 1.5) {
      flex: 10%;
      height: 80px;
  }  
`;
const DisclaimerText = styled.div`
  flex: 95%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-cntent: flex-start;
  height: 50px;

  @media only screen 
    and (min-width: 768px)
    and (-webkit-min-device-pixel-ratio: 1.5) {
      flex: 90%;
      height: 80px;
  }   
`;

function TopHoldings(props) {
  const { data } = props;
  if (data) {
    return (
      <Grid container>
        <FullWidthDivider />
        {data.map((item, i) => (
          <Grid item key={i} xs={12}>
            <ContentGrid container direction="row" justify="flex-start" alignItems="center">
              <Grid item xs={2} lg={1}>
                <Text size="20px" color="#a3a3a3" align="left">
                  {i + 1}
                </Text>
              </Grid>
              <Grid item xs={8} lg={9}>
                <Grid container direction="column">
                  <Grid item>
                    <Text soze="14px" weight="600" align="left">
                      {item.AllocationItem.Name}
                    </Text>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Text size="16px" weight="600" color="#28333e" align="right">{`${item.Value}%`}</Text>
              </Grid>
            </ContentGrid>
            <Divider />
          </Grid>
        ))}
        <Grid item key={30} xs={12}>
          <DisclaimerSection>
            <DisclaimerImage>
              <img src={IconImportant} alt="important" width={props.imageSize?props.imageSize:30} height={props.imageSize?props.imageSize:30} />
            </DisclaimerImage>
            <DisclaimerText>
              <Text size={props.fontSize?props.fontSize:'14px'} weight="900" align="left">
                Disclaimer: This data may not be the most updated security holdings of the fund
              </Text>
            </DisclaimerText>
          </DisclaimerSection>
        </Grid>
      </Grid>
    );
  }
  <p style={{ padding: '25px' }}>
    <Text>No Top Holdings Found</Text>
  </p>;
}

TopHoldings.propTypes = {
  data: PropTypes.array,
};

export default TopHoldings;
