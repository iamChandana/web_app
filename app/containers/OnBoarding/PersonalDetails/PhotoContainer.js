import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Text from 'components/Text';
import { RowGridCenter } from 'components/GridContainer';
import PhotoBox from './PhotoBox';
import IconQuestionCircle from './images/questions-circular-button.svg';
import Color from 'utils/StylesHelper/color';
import Button from 'components/Button';

function PhotoContainer(props) {
  const { uploadType, image, uploadPhoto, identificationNumber } = props;
  const frontImage = image && image[`${uploadType}_Front`];
  const backImage = image && image[`${uploadType}_Back`];
  const visaImage = image && image[`${uploadType}_Visa`];

  const StyledButton = styled(Button)`
  margin: 40px 0;
`;

  return (
    <React.Fragment>
      <Text size="16px" weight="bold" color="#000" style={{ marginBottom: 20 }}>
        {props.isExistingCustomer ? `Please upload a copy of your ${uploadType} with the IC No. ${identificationNumber}` : `Speed up the process by uploading your ${uploadType}`
        }
      </Text>

      <RowGridCenter spacing={24}>
        <Grid item>
          <PhotoBox
            name={`Your ${uploadType} Front`}
            type={uploadType}
            position="Front"
            upload={uploadPhoto}
            src={frontImage}
          />
        </Grid>
        <Grid item>
          <PhotoBox
            name={`Your ${uploadType} Back`}
            type={uploadType}
            position="Back"
            upload={uploadPhoto}
            src={backImage} />
        </Grid>
        {
          uploadType === 'Passport' ? (
            <Grid item>
              <PhotoBox
                name={`Visa`}
                type={uploadType}
                position="Visa"
                upload={uploadPhoto}
                src={visaImage} />
            </Grid>
          ) : null
        }
      </RowGridCenter>
      <RowGridCenter spacing={24} style={{ marginTop: '20px', marginBottom: '15px' }}>
        <img
          src={IconQuestionCircle}
          onClick={props.showGuideTakePhoto}
          style={{ marginRight: 10 }} />
        <Text>
          <a
            href="javascript:void(0);"
            onClick={props.showGuideTakePhoto}
            style={{ color: Color.C_LIGHT_BLUE }}>How to properly upload images</a>
        </Text>
      </RowGridCenter>
      {props.isExistingCustomer && <RowGridCenter spacing={24} >
        <Grid item>
          <StyledButton primary onClick={props.handleCloseDialog}>
            Back
              </StyledButton>
        </Grid>
        <Grid item>
          <StyledButton primary onClick={() => props.handleOpenModal(true)}>
            Next
              </StyledButton>
        </Grid>
      </RowGridCenter>}
    </React.Fragment>
  );
}

PhotoContainer.propTypes = {
  uploadType: PropTypes.string,
  image: PropTypes.object,
  uploadPhoto: PropTypes.func,
};

export default PhotoContainer;
