import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from 'components/Text';
import Grid from 'material-ui/Grid';
const Title = styled.div`
  margin-bottom: 16px !important;
`;

const GridValue = styled(Grid)`
  padding-top: 4px !important;
  padding-bottom: 4px !important;
`;
function TransactionTypesTooltip({ data }) {
  return (
    <div style={{width:370, paddingBottom: 15, paddingTop: 15}}>
      <Title>
        <Text size="12px" color="#fff" align="left" weight="bold">
          Transaction Types
        </Text>
      </Title>

      <Grid container spacing={24}>
        {data.map(({ codevalue, description, i }) => (
          <GridValue item xs={12} sm={6} key={i}>
            <Text size="12px" color="#fff" align="left">
              <strong>{codevalue}: </strong>
              {description}
            </Text>
          </GridValue>
        ))}
      </Grid>
    </div>
  );
}

TransactionTypesTooltip.propTypes = {
  data: PropTypes.array,
};

export default TransactionTypesTooltip;
