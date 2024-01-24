import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Dropzone from 'react-dropzone';
import { compose } from 'redux';
import Color from 'utils/StylesHelper/color';
import Text from 'components/Text';
import LoadingOverlay from 'components/LoadingOverlay';
import { toast } from 'react-toastify';
import _isEmpty from 'lodash/isEmpty';
import { RowGridCenter } from 'components/GridContainer';
import { makeSelectLOV } from 'containers/HomePage/selectors';
import Button from 'components/Button';
import { uploadTransactionFile, resetError } from 'containers/OnBoarding/actions';
import {
  makeSelectProcessing,
  makeSelectTransactionFile,
  makeSelectAddedFunds,
  makeSelectPersonalDetails,
  makeSelectError,
} from 'containers/OnBoarding/selectors';
import { makeSelectClientDetails } from 'containers/ClientDetails/selectors';
import getPixels from 'get-pixels';
import UploadIcon from './upload.svg';
import RemoveIcon from './cross-out.svg';

const Icon = styled.img`
  margin: 0 5%;
`;
const GridHere = styled(Grid)`
  display: flex;
  flex-direction: column;
  width: 50%;
`;
const UploadContainer = styled(Dropzone)`
  width: 100%;
  height: 42px;
  border: ${`dashed 1px ${Color.C_LIGHT_BLUE}`};
  button {
    width: 100%;
  }
`;
const File = styled.div`
  width: 100%;
  height: 42px;
  border: ${`dashed 1px ${Color.C_LIGHT_BLUE}`};
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
`;
const StyledField = styled(TextField)`
  > div {
    &::before,
    &::after {
      background-color: #cacaca;
    }
  }

  label {
    opacity: 0.4;
    font-size: 10px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.6;
    letter-spacing: normal;
    text-align: left;
    color: #000;
  }
  input,
  div {
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #1d1d26;
  }
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const StyledButton = styled(Button)`
  margin: 0;
  border: none;
`;

const Form = styled.div`
  position: relative;
  margin-top: 10px;
  width: 100%;
`;

const RemoveImg = styled.img`
  width: 11.5px;
  height: 11.5px;
  cursor: pointer;
`;

const imageMinWidth = 1600;
const imageMinHeight = 900;
const maxFileSize = 5000000; // 5MB or 5000kb

class TransactionFunds extends React.Component {
  constructor() {
    super();

    this.state = {
      fileUploaded: '',
    };

    this.onDrop = this.onDrop.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentWillMount() {
    if (this.props.data && this.props.data.docs && this.props.data.docs.fileName) {
      this.setState({
        fileUploaded: this.props.data.docs.fileName,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (_isEmpty(nextProps.data.docs)) {
      this.setState({
        fileUploaded: '',
      });
    }
    if (this.props.transactionFile !== nextProps.transactionFile && nextProps.transactionFile) {
      this.props.updateDocs({ TransactionDocId: nextProps.transactionFile.id }, this.props.index);
    }

    if (this.props.type !== nextProps.type) {
      this.setState({
        fileUploaded: '',
      });
    }

    if (nextProps.error !== this.props.error && !_isEmpty(nextProps.error)) {
      toast(nextProps.error);
      this.props.resetError();
      this.setState({
        fileUploaded: '',
      });
    }
  }

  onDrop(files) {
    const file = files[0];

    if (file) {
      if (file.size > maxFileSize) {
        toast.error('Maximum file size is 5MB', {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
    }

    const reader = new FileReader();
    let fileExtension = file.name.split('.');
    const fullName = !_isEmpty(this.props.clientDetails)
      ? this.props.clientDetails.info.fullName
      : !_isEmpty(this.props.personalDetails)
      ? this.props.personalDetails.fullName
      : '';

    let identificationInfo = !_isEmpty(this.props.clientDetails) ? this.props.clientDetails.info.identification[0] : '';
    if (!_isEmpty(this.props.clientDetails)) {
      identificationInfo = this.props.clientDetails.info.identification[0] || '';
    } else if (!_isEmpty(this.props.personalDetails)) {
      const idType = this.props.personalDetails.identificationType;
      const idNo = this.props.personalDetails.identificationNumber;
      identificationInfo = { identificationType: idType, identificationNumber: idNo };
    }

    if (fileExtension.length > 0) {
      fileExtension = fileExtension[1];
    }

    if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
      reader.onload = (event) => {
        const base64 = event.target.result;
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
                files.map((item) => {
                  this.setState({
                    fileUploaded: item.name,
                  });
                  this.props.updateDocs({ fileName: file.name }, this.props.index);
                });

                const results = event.target.result.split(',')[1];
                this.props.uploadFile({
                  base64img: results,
                  fileName: file.name,
                  transactionRequest: this.props.transactionRequest || {},
                  type: this.props.paymentCodeValue,
                  fullName: fullName || '',
                  identificationInfo,
                });
              }
            } else {
              toast.error('Failed to verify image resolution. Please try again.', {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
          }
        });
      };
    } else {
      files.map((item) => {
        this.setState({
          fileUploaded: item.name,
        });
        this.props.updateDocs({ fileName: file.name }, this.props.index);
      });

      reader.onload = (event) => {
        const results = event.target.result.split(',')[1];
        this.props.uploadFile({
          base64img: results,
          fileName: file.name,
          transactionRequest: this.props.transactionRequest || {},
          type: this.props.paymentCodeValue,
          fullName: fullName || '',
          identificationInfo,
        });
      };
    }

    reader.readAsDataURL(file);
  }

  remove() {
    this.setState(
      {
        fileUploaded: '',
      },
      () => {
        this.props.updateDocs(null, this.props.index);
      },
    );
  }

  render() {
    const { type, data, index, onChange, processing, onChangeChequeAmount, lov, initialInvestment, errorMessage } = this.props;
    const Type = type || 'Bank Draft';
    const Banks = lov.Dictionary[19].datadictionary;
    return (
      <Form autoComplete="off">
        <LoadingOverlay show={processing} />
        <RowGridCenter spacing={24}>
          <GridHere item>
            {this.state.fileUploaded && (
              <File>
                <Text
                  size="12px"
                  color={Color.C_LIGHT_BLUE}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace
                  style={{ maxWidth: '390px' }}>
                  {this.state.fileUploaded}
                </Text>
                <RemoveImg src={RemoveIcon} alt="remove" onClick={this.remove} />
              </File>
            )}
            {!this.state.fileUploaded && (
              <React.Fragment>
                <UploadContainer
                  onDrop={this.onDrop}
                  accept="application/pdf, image/jpeg, image/png, image/tiff, image/bmp, image/gif"
                  disablePreview>
                  <StyledButton>
                    <Icon src={UploadIcon} alt="Upload PDF/JPEG/PNG" />
                    Upload
                  </StyledButton>
                </UploadContainer>
              </React.Fragment>
            )}
          </GridHere>
          <GridHere item>
            <StyledField
              select
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => onChange(e, index)}
              label={`${Type.includes('Virtual') ? 'Remittance Bank' : 'ISSUING BANK'}`}
              value={data.BankName}
              margin="normal"
              name="BankName">
              {Banks.map((option) => (
                <MenuItem key={option.id} value={option.codevalue}>
                  {option.description}
                </MenuItem>
              ))}
            </StyledField>
          </GridHere>
        </RowGridCenter>
        <RowGridCenter spacing={24}>
          <GridHere item>
            <StyledField
              name="ChequeOrDDAmount"
              value={data.ChequeOrDDAmount}
              label={`${Type.includes('Virtual') ? 'Remittance Amount' : `${Type.toUpperCase()} AMOUNT`}`}
              placeholder="..."
              onChange={(e) => {
                onChangeChequeAmount(e, index);
              }}
              onBlur={(e) => {
                onChangeChequeAmount(e, index);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <Text color={Color.C_RED} size="10px" lineHeight="1.25" align="left">
              {errorMessage}
            </Text>
          </GridHere>
          <GridHere item>
            <StyledField
              name="ChequeOrDDNumber"
              onChange={(e) => {
                const { value } = e.target;
                if ((value && /^(\d*\.)?\d+$/.test(value)) || value === '') {
                  onChange(e, index);
                } else {
                  e.target.value = '';
                }
              }}
              value={data.ChequeOrDDNumber}
              label={`${Type.includes('Virtual') ? 'Virtual Payment Reference No' : `${Type.toUpperCase()} NUMBER`}`}
              placeholder="..."
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </GridHere>
        </RowGridCenter>
      </Form>
    );
  }
}
TransactionFunds.propTypes = {
  uploadPhoto: PropTypes.func,
  type: PropTypes.string,
  data: PropTypes.object,
  onChange: PropTypes.func,
  processing: PropTypes.bool,
  onChangeChequeAmount: PropTypes.func,
  lov: PropTypes.object,
  index: PropTypes.number,
  transactionRequest: PropTypes.object,
  personalDetails: PropTypes.object,
  clientDetails: PropTypes.object,
  transactionFile: PropTypes.object,
  updateDocs: PropTypes.func,
  resetError: PropTypes.func,
  paymentCodeValue: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  processing: makeSelectProcessing(),
  transactionFile: makeSelectTransactionFile(),
  lov: makeSelectLOV(),
  addedFunds: makeSelectAddedFunds(),
  clientDetails: makeSelectClientDetails(),
  personalDetails: makeSelectPersonalDetails(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    uploadFile: (payload) => dispatch(uploadTransactionFile(payload)),
    resetError: () => dispatch(resetError()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(TransactionFunds);
