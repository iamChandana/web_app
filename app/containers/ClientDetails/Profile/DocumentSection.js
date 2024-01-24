/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable import/first */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import update from 'immutability-helper';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import { makeSelectProcessing, makeSelectError, makeSelectUploadError } from 'containers/OnBoarding/selectors';
import UploadIcon from '../images/shape.svg';
import Dropzone from 'react-dropzone';
import getPixels from 'get-pixels';
import moment from 'moment';
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

export class DocumentSection extends Component {
  constructor(props) {
    super(props);
    const getFormattedImages = (images) => {
      const result = Object.keys(images).map((image) => images[image]);
      return result;
    };

    const getDisplayableImages = (docs) => {
      const images = [];
      docs.forEach((doc) => {
        let obj = {};
        obj = { ...doc };
        images.push(obj);
      });
      return images;
    };

    this.state = {
      activeTableRow: props.docs ? props.docs[0].id : null,
      src: '',
      images: props.images ? getFormattedImages(props.images) : [],
      displayableImages: props.docs ? getDisplayableImages(props.docs) : [],
      activeDocType: props.docs ? props.docs[0].DocType : null,
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
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ images: updatedImages });
    }
  }

  onDrop(files, doc) {
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
      this.upload(results, event.target.result, file.name, doc);
    };

    reader.readAsDataURL(file);
  }

  getImage(id, docType) {
    const index = _findIndex(this.state.displayableImages, ['id', id]);
    let res = '';

    if (
      this.props.images &&
      Object.hasOwnProperty.call(this.props.images, `${docType}`) &&
      Object.hasOwnProperty.call(this.props.images[`${docType}`], 'image')
    ) {
      res = this.props.images[`${docType}`].base64img;
    } else if (index > -1) res = this.state.displayableImages[index].FileLocation;

    if (!res) {
      // res = `${BaseUrl}/api/getspImg/${this.props.docs[indexInDocs].customerId}/${
      //   this.props.docs[indexInDocs].id
      // }?bearer_token=${getItem('access_token')}`;
      res = this.props.documentsUrl[id];
    }

    return res;
  }

  getCurrentImage(activeId, docType) {
    const index = _findIndex(this.state.displayableImages, ['id', activeId]);
    let res = '';
    if (
      this.props.images &&
      Object.hasOwnProperty.call(this.props.images, `${docType}`) &&
      Object.hasOwnProperty.call(this.props.images[`${docType}`], 'image')
    ) {
      res = this.props.images[`${docType}`].base64img;
    } else if (index > -1) {
      res = this.props.documentsUrl[activeId];
    }

    return res;
  }

  // eslint-disable-next-line react/sort-comp
  upload(image, base64, name, doc) {
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
            const { DocType } = doc;
            const fileName = name || `${DocType}.jpeg`;
            const objectName = `${DocType}`;
            const imagePayload = {
              base64img: image,
              original: base64,
              DocType: objectName,
              Filename: fileName,
              docId: doc.id,
            };
            const index = _findIndex(this.state.displayableImages, ['id', doc.id]);

            this.setState(
              {
                displayableImages: update(this.state.displayableImages, {
                  [index]: { imageSrc: { $set: base64 }, payload: { $set: imagePayload } },
                }),
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

  handleActiveTableRow(id, docType) {
    this.setState({ activeTableRow: id, activeDocType: docType });
  }

  getFileName(id, docType) {
    const index = _findIndex(this.state.displayableImages, ['id', id]);
    let fileName;
    if (
      this.props.images &&
      Object.hasOwnProperty.call(this.props.images, `${docType}`) &&
      Object.hasOwnProperty.call(this.props.images[`${docType}`], 'fileName')
    ) {
      fileName = _find(this.props.images, ['type', docType]).fileName;
    } else {
      fileName = this.state.displayableImages[index].Filename;
    }
    return fileName;
  }

  getDate(doc, docType) {
    if (
      this.props.images &&
      Object.hasOwnProperty.call(this.props.images, [`${docType}`]) &&
      Object.hasOwnProperty.call(this.props.images[`${docType}`], 'createdAt')
    ) {
      return moment(this.props.images[`${docType}`].createdAt).format('DD/MM/YYYY');
    }
    return moment(
      new Date(doc.ScanDate)
        .toGMTString()
        .toString()
        .slice(0, 24),
    ).format('DD/MM/YYYY');
  }

  render() {
    const { docs, edit, accountStatus } = this.props;
    const { activeTableRow } = this.state;
    return (
      <React.Fragment>
        <Grid item>
          <ImagePreview>
            <ImgSrc
              src={this.getCurrentImage(this.state.activeTableRow, this.state.activeDocType)}
              onClick={this.handleOpenOrCloseDialogImage}
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
            {docs.map((doc, index) => (
              <CustomTableRow
                key={Object.hasOwnProperty.call(doc, 'id') ? doc.id : index}
                onClick={() => this.handleActiveTableRow(doc.id, doc.DocType)}>
                <CustomeTableCols style={activeTableRow === doc.id ? borderStyleForStart : {}}>
                  <ImagePreviewForRow
                    style={{
                      opacity: activeTableRow === doc.id ? 1 : 0.5,
                    }}>
                    <ImgSrcForRow src={this.getImage(doc.id, doc.DocType)} />
                    {/* <ImgSrcForRow
                      src={`https://cpamuat2.azurewebsites.net/api/getspImg/${doc.customerId}/${doc.id}?bearer_token=${getItem(
                        'access_token',
                      )}`}
                    /> */}
                  </ImagePreviewForRow>
                </CustomeTableCols>
                <CustomeTableCols style={activeTableRow === doc.id ? borderStyleForMiddle : {}}>{doc.DocType}</CustomeTableCols>
                <CustomeTableCols style={activeTableRow === doc.id ? borderStyleForMiddle : {}}>
                  {this.getFileName(doc.id, doc.DocType)}
                </CustomeTableCols>
                <CustomeTableCols style={activeTableRow === doc.id ? borderStyleForMiddle : {}}>
                  {this.getDate(doc, doc.DocType)}
                </CustomeTableCols>
                <CustomeTableCols style={activeTableRow === doc.id ? borderStyleForEnd : {}}>
                  <UploadContainer
                    style={edit || accountStatus !== 'S' ? disabledStyle : {}}
                    onDrop={(acceptedFiles) => this.onDrop(acceptedFiles, doc)}
                    accept="image/jpeg, image/png">
                    <Icon style={edit || accountStatus !== 'S' ? disabledCursorStyle : {}} src={UploadIcon} alt="Upload Photo" />
                  </UploadContainer>
                  {/* <UploadContainer
                    style={edit ? disabledStyle : {}}
                    onDrop={(acceptedFiles) => this.onDrop(acceptedFiles, doc)}
                    accept="image/jpeg, image/png">
                    <Icon style={edit ? disabledCursorStyle : {}} src={UploadIcon} alt="Upload Photo" />
                  </UploadContainer> */}
                </CustomeTableCols>
              </CustomTableRow>
            ))}
          </CustomTable>
          <UploadDocsButton docs={this.props.images} handleDocUpload={this.props.handleDocUpload} />
        </Grid>
      </React.Fragment>
    );
  }
}

DocumentSection.propTypes = {
  docs: PropTypes,
  images: PropTypes,
  uploadDocPhoto: PropTypes.func,
  documentsUrl: PropTypes.object,
  edit: PropTypes.bool,
  accountStatus: PropTypes.string,
  handleDocUpload: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  processing: makeSelectProcessing(),
  error: makeSelectError(),
  uploadError: makeSelectUploadError(),
});

export default connect(mapStateToProps)(DocumentSection);
