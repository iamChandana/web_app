import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import _isEmpty from 'lodash/isEmpty';
import Webcam from 'react-webcam';
import Color from 'utils/StylesHelper/color';
import styled from 'styled-components';
import Text from 'components/Text';
import { RowGridCenter } from 'components/GridContainer';
import { uploadPhoto, removePhoto, resetError } from 'containers/OnBoarding/actions';
import CameraIcon from './images/camera.svg';
import UploadIcon from './images/upload.svg';
import CloseIcon from './images/cross-out.svg';
import { makeSelectProcessing, makeSelectError, makeSelectUploadError } from '../selectors';
import {
  Container,
  UploadContainer,
  StyledButton,
  Icon,
  ImageName,
  ImgSrc,
  CaptureButton,
  CloseImage,
  ImgSrcBig,
} from './styles';
import getPixels from 'get-pixels';
import { isIOS, isAndroid, isSafari, isEdge, isMobile, isChrome } from 'react-device-detect';
import ReactTooltip from 'react-tooltip';
import Dialog from 'components/Dialog';
import Grid from 'material-ui/Grid';
import Button from 'components/Button';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #000 !important;
  padding: 10px !important;
  opacity: 1 !important;
`;

function hasGetUserMedia() {
  return !!(
    navigator.mediaDevices.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
}

const imageMinWidth = 1600;
const imageMinHeight = 900;
const maxFileSize = 5000000; // 5MB or 5000kb

const StyleDialogButton = styled(Button)`
  margin-bottom: 20px;
`;

class PhotoBox extends React.Component {
  constructor(props) {
    super(props);
    const { image, type, base64img } = props.src || {};
    let srcType;
    if (image) {
      srcType = type.split('_')[0];
    }
    this.state = {
      takePhoto: false,
      src: (srcType === props.type && base64img) || '',
      openDialogImage: false,
    };
    this.takePicture = this.takePicture.bind(this);
    this.takePhoto = this.takePhoto.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.offVideo = this.offVideo.bind(this);
    this.handleSubmitImage = this.handleSubmitImage.bind(this);
    this.handleRetakeImage = this.handleRetakeImage.bind(this);
    this.handleOpenOrCloseDialogImage = this.handleOpenOrCloseDialogImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.uploadError || this.props.src === undefined) {
    if (nextProps.uploadError && !this.props.src) {
      this.setState({
        src: '',
      });
    }

    if (nextProps.type !== this.props.type) {
      this.setState({
        src: nextProps.src ? nextProps.src.base64img : '',
      });
    }
  }

  onDrop(files) {
    const file = files[0];
    if (file && file.size > maxFileSize) {
      toast.error('Maximum file size is 5MB', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const results = event.target.result.split(',')[1];
      this.upload(results, event.target.result, file.name);
    };

    reader.readAsDataURL(file);
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  };

  offVideo() {
    this.setState({
      takePhoto: false,
    });
  }

  takePhoto() {
    if (!hasGetUserMedia) {
      toast.error('Unable to access your camera. Please allow/enable it from your browser setting.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    this.setState({
      takePhoto: true,
    });
  }

  deletePhoto() {
    const { id, type } = this.props.src;
    this.props.removePhoto({ id, type });
    this.setState({
      src: '',
    });
  }

  takePicture() {
    const imageSrc = this.webcam.getScreenshot();
    const results = imageSrc.split(',')[1];
    getPixels(imageSrc, (err, pixels) => {
      if (err) {
        toast.error('Failed to verify image resolution. Please try again.', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        const imageResolution = pixels.shape.slice();
        console.log('imageResolution', imageResolution);
        this.setState({
          srcImageTemp: imageSrc,
          resultsTakePic: results,
          dialogImageWidth: imageResolution[0] / 2,
          dialogImageHeight: imageResolution[1] / 2,
          openDialogImage: true,
        });
      }
    });
  }

  upload(image, base64, name, isTakePicture) {
    getPixels(base64, (err, pixels) => {
      if (err) {
        toast.error('Failed to verify image resolution. Please try again.', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        const imageResolution = pixels.shape.slice();
        if (imageResolution.length > 1) {
          if (!isTakePicture && (imageResolution[0] < imageMinWidth || imageResolution[1] < imageMinHeight)) {
            toast.error('Image resolution must have a minimum of 1600x900 (widthxheight) resolution', {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            const { type, position } = this.props;
            const fileName = name || `${type.toLowerCase()}_${position}.jpeg`;
            const objectName = `${type}_${position}`;
            const imagePayload = {
              base64img: image,
              original: base64,
              DocType: objectName,
              Filename: fileName,
            };
            this.props.uploadPhoto(imagePayload);
            this.setState(
              {
                src: base64,
                name: fileName,
              },
              () => {
                this.setState({
                  takePhoto: false,
                });
              },
            );
          }
        } else {
          toast.error('Failed to verify image resolution. Please try again.', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    });
  }

  handleSubmitImage() {
    this.upload(this.state.resultsTakePic, this.state.srcImageTemp, null, true);
    this.setState({
      openDialogImage: false,
      srcImageTemp: null,
      resultsTakePic: null,
    });
  }

  handleOpenOrCloseDialogImage() {
    this.setState((prevState) => ({
      openDialogImage: !prevState.openDialogImage,
    }));
  }

  handleRetakeImage() {
    this.setState({
      openDialogImage: false,
      srcImageTemp: null,
      resultsTakePic: null,
    });
  }

  render() {
    const { name, processing } = this.props;
    const videoConstraints = {
      width: 2400,
      height: 1500,
      facingMode: { exact: (isIOS || isAndroid) ? 'environment' : 'user' },
    };
    if (!isMobile && isChrome) {
      videoConstraints.facingMode = 'user';
    }
    return (
      <React.Fragment>
        <Container src={this.state.src}>
          {this.state.src && !processing && (
            <React.Fragment>
              <ImgSrc src={this.state.src} onClick={this.handleOpenOrCloseDialogImage} />
              <ImageName color="#000000" size="12px">
                {name}
              </ImageName>
              <Text
                color={Color.C_LIGHT_BLUE}
                decoration="underline"
                weight="600"
                size="12px"
                cursor="pointer"
                onClick={this.deletePhoto}
              >
                Remove
              </Text>
            </React.Fragment>
          )}
          {this.state.takePhoto && !processing && (
            <React.Fragment>
              <CloseImage src={CloseIcon} onClick={this.offVideo} />
              <RowGridCenter>
                {isEdge ? (
                  <Webcam
                    audio={false}
                    height={171}
                    width={2400}
                    ref={this.setRef}
                    style={{ marginLeft: -500 }}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                  />
                ) : (
                  <Webcam
                      audio={false}
                      height={171}
                      width={2400}
                      ref={this.setRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    />
                  )}
                <CaptureButton onClick={this.takePicture} />
              </RowGridCenter>
            </React.Fragment>
          )}
          {!this.state.takePhoto && !processing && !this.state.src && (
            <React.Fragment>
              {isIOS && !isSafari ? (
                <ReactTooltip1
                  id="btnCamera"
                  effect="float"
                  place="top"
                  style={{ cursor: 'pointer' }}
                  globalEventOff={'click'}
                  event={'click'}
                >
                  <Text size="12px" color="#fff" align="left">
                    Camera function is not available in this browser on iOS
                    </Text>
                </ReactTooltip1>
              ) : null}
              {isIOS && !isSafari ? (
                <a data-tip data-for="btnCamera">
                  <StyledButton>
                    <Icon src={CameraIcon} alt="Take Photo Function is Not Available On This Broser or Device" />
                    Take Photo
                  </StyledButton>
                </a>
              ) : (
                <StyledButton onClick={this.takePhoto}>
                    <Icon src={CameraIcon} alt="Take Photo" />
                    Take Photo
                </StyledButton>
                )}
              <UploadContainer onDrop={this.onDrop} accept="image/jpeg, image/png">
                <StyledButton>
                  <Icon src={UploadIcon} alt="Upload Photo" />
                  Upload
                </StyledButton>
              </UploadContainer>
            </React.Fragment>
          )}
          {/* {processing && <LoadingIndicator />} */}
        </Container>
        <Text color="#000" weight="bold">
          {name}
        </Text>
        <Text color="#1d1d26" weight="bold" size="10px" opacity="0.4">
          (Min Size 1600x900)
        </Text>
        <Dialog
          open={this.state.openDialogImage}
          title={name}
          maxWidth="md"
          closeHandler={this.handleOpenOrCloseDialogImage}
          content={
            <Grid container direction="column" justify="center" alignItems="center">
              {this.state.srcImageTemp &&
                <Grid item xs={12}>
                  <Text color="#000000" weight="bold" style={{ paddingBottom: 20, maxWidth: 700 }}>
                    Please confirm that the photo taken is clear and the text are readable.  For blurred IC/Passport photos, click on "Retake" to try again. Agents will be asked to resubmit a clear photo for their client's account to be processed.
                  </Text>
                </Grid>
              }
              <Grid item xs={12}>
                <ImgSrcBig
                  src={this.state.srcImageTemp ? this.state.srcImageTemp : this.state.src}
                  imgWidth={this.state.dialogImageWidth}
                  imgHeight={this.state.dialogImageHeight}
                />
              </Grid>
              {
                this.state.srcImageTemp &&
                <Grid item xs={12}>
                  <Grid container alignItems="center" justify="center">
                    <Grid item xs={6} alignContent="flex-end" alignItems="flex-end" justify="flex-end">
                      <StyleDialogButton
                        primary
                        onClick={this.handleSubmitImage}
                        style={{ marginRight: 5 }}
                      >
                        OK
                      </StyleDialogButton>
                    </Grid>
                    <Grid item xs={6} alignContent="flex-start" alignItems="flex-start" justify="flex-start">
                      <StyleDialogButton
                        primary
                        onClick={this.handleRetakeImage}
                        style={{ marginLeft: 5 }}
                      >
                        Retake
                      </StyleDialogButton>
                    </Grid>
                  </Grid>
                </Grid>
              }
            </Grid>
          }
        />
      </React.Fragment>
    );
  }
}

PhotoBox.propTypes = {
  name: PropTypes.string,
  uploadPhoto: PropTypes.func,
  src: PropTypes.object,
  type: PropTypes.string,
  position: PropTypes.string,
  processing: PropTypes.bool,
  error: PropTypes.string,
  removePhoto: PropTypes.func,
  resetError: PropTypes.func,
  uploadError: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  processing: makeSelectProcessing(),
  error: makeSelectError(),
  uploadError: makeSelectUploadError(),
});

function mapDispatchToProps(dispatch) {
  return {
    uploadPhoto: (payload) => dispatch(uploadPhoto(payload)),
    removePhoto: (payload) => dispatch(removePhoto(payload)),
    resetError: () => dispatch(resetError()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhotoBox);
