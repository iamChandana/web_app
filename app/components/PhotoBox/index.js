import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Button from 'components/Button';
import Text from 'components/Text';
import { ColumnGridCenter } from 'components/GridContainer';

// import CameraIcon from

const Container = styled.div`
  width: 280px;
  height: 184px;
  border: dashed 1px rgb(0, 145, 218);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const StyledButton = styled(Button)`
  margin: 4px;
`;

function PhotoBox(props) {
  const { name } = props;
  return (
    <ColumnGridCenter>
      <Grid item xs={12}>
        <Container>
          <ColumnGridCenter>
            <Grid item>
              <StyledButton>Take Photo</StyledButton>
            </Grid>
            <Grid item>
              <StyledButton>Upload</StyledButton>
            </Grid>
          </ColumnGridCenter>
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Text color="#000" weight="bold">
          Your {name}
        </Text>
      </Grid>
      <Grid item xs={12}>
        <Text color="#1d1d26" weight="bold" size="10px" opacity="0.4">
          (Min Size 1600x900)
        </Text>
      </Grid>
    </ColumnGridCenter>
  );
}

PhotoBox.propTypes = {
  name: PropTypes.string,
};

export default PhotoBox;
