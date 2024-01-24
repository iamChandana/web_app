import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
// import update from 'immutability-helper';
import { getItem } from 'utils/tokenStore';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import { makeSelectProcessing, makeSelectError, makeSelectUploadError } from 'containers/OnBoarding/selectors';
import UploadIcon from '../images/shape.svg';
import Dropzone from 'react-dropzone';
import getPixels from 'get-pixels';
import UploadDocsButton from './UploadDocButton';

const ImagePreview = styled.div`
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  background-color: #f5f5f5;
  height: 312px;
  width: 486px;
`;

const ImgSrc = styled.img`
  width: 100%;
  height: ${(props) => (props.src ? '100%' : '100%')};
  padding: 5px;
`;

const ImagePreviewForRow = styled.div`
  width: 70px;
  height: 44px;
  border: 1px solid #cacaca;
`;

const ImgSrcForRow = styled.img`
  width: 100%;
  height: 100%;
  padding: 1px;
`;

const CustomTable = styled.table`
  border-collapse: separate;
  width: 100%;
  border-spacing: 0 8px;
  margin-top: -20px;
  font-size: 15px;
`;

const CustomeTableCols = styled.td`
  padding: 17px;
  text-align: left;
`;

const CustomeTableHeaders = styled.th`
  padding: 17px;
  padding-bottom: 3px;
  text-align: left;
`;

const CustomTableRow = styled.tr`
  background-color: #f5f5f5;
`;

const borderStyleForStart = {
  borderLeft: '2px solid #0091da',
  borderTop: '2px solid #0091da',
  borderBottom: '2px solid #0091da',
};

const borderStyleForMiddle = {
  borderTop: '2px solid #0091da',
  borderBottom: '2px solid #0091da',
};

const borderStyleForEnd = {
  borderTop: '2px solid #0091da',
  borderBottom: '2px solid #0091da',
  borderRight: '2px solid #0091da',
};

const Icon = styled.img`
  margin: 0 15%;
`;

const UploadContainer = styled(Dropzone)`
  width: auto;
  height: auto;
  border: none;
  cursor: pointer;
`;

const disabledStyle = {
  opacity: '0.7',
  pointerEvents: 'none',
};
const disabledCursorStyle = {
  cursor: 'not-allowed',
};

const imageMinWidth = 1600;
const imageMinHeight = 900;
const maxFileSize = 5000000; // 5MB or 5000kb

export class EmptyDocumentSection extends Component {
  constructor(props) {
    super(props);
    const getFormattedImages = (images) => {
      const result = Object.keys(images).map((image) => images[image]);
      return result;
    };

    this.docsArray = [];

    this.state = {
      activeTableRow: 0,
      src: '',
      images: props.images ? getFormattedImages(props.images) : [],
      displayableImages: [],
      activeDocType: null,
    };
    this.handleActiveTableRow = this.handleActiveTableRow.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.getImage = this.getImage.bind(this);
    this.getCurrentImage = this.getCurrentImage.bind(this);
    this.getFileName = this.getFileName.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.images !== this.props.images && this.props.images) {
      const updatedImages = Object.keys(this.props.images).map((image) => this.props.images[image]);
      this.setState({ images: updatedImages });
    }
  }

  onDrop(files, docKey) {
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
      this.upload(results, event.target.result, file.name, docKey);
    };

    reader.readAsDataURL(file);
  }

  getImage(id, docType) {
    let res = '';

    if (this.props.images && Object.hasOwnProperty.call(this.props.images, `${docType}`) && Object.hasOwnProperty.call(this.props.images[`${docType}`], 'image')) {
      res = this.props.images[`${docType}`].base64img;
    }

    return res;
  }

  getCurrentImage(docType) {
    let res = '';
    if (this.props.images && Object.hasOwnProperty.call(this.props.images, `${docType}`) && Object.hasOwnProperty.call(this.props.images[`${docType}`], 'image')) {
      res = this.props.images[`${docType}`].base64img;
    }
    return res;
  }

  upload(image, base64, name, DocType) {
    const tempDisplayableImageArray = this.state.displayableImages;

    getPixels(base64, (err, pixels) => {
      if (err) {
        toast.error('Failed to verify image resolution. Please try again.', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        const imageResolution = pixels.shape.slice();
        if (imageResolution.length > 1) {
          if (imageResolution[0] < imageMinWidth || imageResolution[1] < imageMinHeight) {
            toast.error('Image resolution must have a minimum of 1600x900 (widthxheight) resolution', {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            const fileName = name || `${DocType}.jpeg`;
            const objectName = `${DocType}`;
            const imagePayload = {
              base64img: image,
              original: base64,
              DocType: objectName,
              Filename: fileName,
              docId: null,
            };
            const index = _findIndex(this.docsArray, (docItem) => docItem === DocType);
            tempDisplayableImageArray[index] = { imageSrc: base64, payload: imagePayload };

            this.setState(
              {
                displayableImages: tempDisplayableImageArray,
              },
              () => {
                this.props.uploadDocPhoto(this.state.displayableImages[index], index);
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

  handleActiveTableRow(currentDocType) {
    this.setState({
      activeTableRow: _findIndex(this.docsArray, (docTypeItem) => docTypeItem === currentDocType),
      activeDocType: currentDocType,
    });
  }

  getFileName(idType) {
    const { images } = this.props;
    let fileName;
    if (images && images[`${idType}`]) {
      fileName = images[`${idType}`].fileName;
    }
    return fileName;
  }

  getDate(docType) {
    if (this.props.images && Object.hasOwnProperty.call(this.props.images, [`${docType}`]) && Object.hasOwnProperty.call(this.props.images[`${docType}`], 'createdAt')) {
      return moment(this.props.images[`${docType}`].createdAt).format('DD/MM/YYYY');
    }
  }

  getIdTypeGenre(idType) {
    switch (idType) {
      case 'PSPORT': {
        return 'Passport';
      } default: {
        return 'IC';
      }
    }
  }

  checkIfImageAllUploaded() {
    const { identificationType, images } = this.props;

    if (images) {
      if ((identificationType === 'PSPORT' && Object.keys(images).length < 3) || (identificationType !== 'PSPORT' && Object.keys(images).length < 2)) {
        return true;
      } return false;
    } return true;
  }

  render() {
    const { identificationType, images, edit, accountStatus } = this.props;
    const { activeTableRow, src } = this.state;
    const idType = this.getIdTypeGenre(identificationType);
    this.docsArray = idType === 'IC' ? ['Front', 'Back'] : ['Front', 'Back', 'Visa'];
    const docsArray = this.docsArray;
    this.docsArray = docsArray.map((docTypeItem) => `${this.getIdTypeGenre(identificationType)}_${docTypeItem}`);

    return (
      <React.Fragment>
        <Grid item>
          <ImagePreview>
            <ImgSrc
              src={this.getCurrentImage(this.state.activeDocType || this.docsArray[0])}
            />
          </ImagePreview>
        </Grid>
        <Grid item style={{ marginLeft: '14px' }}>
          <CustomTable>
            <tr>
              <CustomeTableHeaders>Thumbnail</CustomeTableHeaders>
              <CustomeTableHeaders>Document Type</CustomeTableHeaders>
              <CustomeTableHeaders>File Name</CustomeTableHeaders>
              <CustomeTableHeaders>Date</CustomeTableHeaders>
              <CustomeTableHeaders>Action</CustomeTableHeaders>
            </tr>
            {this.docsArray.map((docItem, index) => (
              <CustomTableRow key={index} onClick={() => this.handleActiveTableRow(docItem)}>
                <CustomeTableCols style={activeTableRow === index ? borderStyleForStart : {}}>
                  <ImagePreviewForRow
                    style={{
                      opacity: activeTableRow === index ? 1 : 0.5,
                    }}
                  >
                    <ImgSrcForRow src={this.getImage(index, docItem)} />
                    {/* <ImgSrcForRow
                      src={`https://cpamuat2.azurewebsites.net/api/getspImg/${doc.customerId}/${doc.id}?bearer_token=${getItem(
                        'access_token',
                      )}`}
                    /> */}
                  </ImagePreviewForRow>
                </CustomeTableCols>
                <CustomeTableCols style={activeTableRow === index ? borderStyleForMiddle : {}}>{docItem}</CustomeTableCols>
                <CustomeTableCols style={activeTableRow === index ? borderStyleForMiddle : {}}>{this.getFileName(docItem)}</CustomeTableCols>
                <CustomeTableCols style={activeTableRow === index ? borderStyleForMiddle : {}}>
                  {this.getDate(docItem)}
                </CustomeTableCols>
                <CustomeTableCols style={activeTableRow === index ? borderStyleForEnd : {}}>
                  <UploadContainer
                    style={edit || accountStatus !== 'S' ? disabledStyle : {}}
                    onDrop={(acceptedFiles) => this.onDrop(acceptedFiles, docItem)}
                    accept="image/jpeg, image/png"
                  >
                    <Icon style={edit || accountStatus !== 'S' ? disabledCursorStyle : {}} src={UploadIcon} alt="Upload Photo" />
                  </UploadContainer>
                </CustomeTableCols>
              </CustomTableRow>
            ))}
          </CustomTable>
          <UploadDocsButton disabled={this.checkIfImageAllUploaded()} docs={this.props.images} handleDocUpload={this.props.handleDocUpload} />
        </Grid>
      </React.Fragment>
    );
  }
}

EmptyDocumentSection.propTypes = {
  name: PropTypes.string,
  docs: PropTypes,
  images: PropTypes,
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

export default connect(mapStateToProps)(EmptyDocumentSection);
