import React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import Button from 'components/Button';
import Text from 'components/Text';
import Color from 'utils/StylesHelper/color';
import TextField from 'material-ui/TextField';
import Modal from '../../TransactionModal/Modal';
import Select from 'components/Select';
import { MenuItem } from 'material-ui/Menu';
import VerticalDivider from 'components/VerticalDivider';

const StyleButton = styled(Button)`
  margin-top: 16px;
`;
// const FullWidthGrid = styled(Grid)`
// `
const ButtonWrapper = styled(Grid)`
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
`;
const NoPadGrid = styled(Grid)`
  padding: 0 !important;
`;

const DividerGrid = styled(Grid)`
  /* padding-right: 40px; */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledField = styled(TextField)`
  width: 85%;

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
`;
const GridContentContainer = styled(Grid)`
  background-color: #f5f5f5;
  padding: 24px;
`;
class AddBank extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bankAcctNumber: '',
      bankCode: '',
      bankName: '',
      bankAcctName: '',
      bankNumber: '',
      swift_bic_code: '',
      branchCode: '',
      source: '',
      iban: '',
      receivingBank: '',
    };

    this.onChange = this.onChange.bind(this);
  }
  onChange(e) {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  }
  render() {
    const { bankAcctName, bankName, bankAcctNumber, swift_bic_code, bankCode, source, branchCode, iban } = this.state;
    const { handleClose, open, submit } = this.props;
    const DividerHeight = '260px';
    return (
      <Modal open={open} handleClose={handleClose} title="Add Bank Account">
        <GridContentContainer container direction="row" justify="flex-start" alignItems="flex-start">
          <Grid item xs={3}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Text size="14px" weight="bold" color={Color.C_GRAY} align="left">
                  Receiving Bank Details
                </Text>
                <Text color={Color.C_GRAY} size="10px" fontStyle="italic" lineHeight="1.25" align="left">
                  Strictly NO 3rd party account transfers.
                </Text>
              </Grid>
            </Grid>
          </Grid>
          <DividerGrid item xs={1}>
            <VerticalDivider height={DividerHeight} />
          </DividerGrid>
          <Grid item xs={8}>
            <Grid container spacing={24}>
              <NoPadGrid item xs={6}>
                <StyledField
                  name="bankAcctName"
                  value={bankAcctName}
                  label="RECEIVING ACCOUNT NAME"
                  placeholder="Account name"
                  onChange={(e) => this.onChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </NoPadGrid>
              <NoPadGrid item xs={6}>
                <StyledField
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => this.onChange(e)}
                  label="RECEIVING BANK NAME"
                  margin="normal"
                  name="bankName"
                  value={bankName}
                >
                  {/* <MenuItem value={bankName} disabled>
                              Select
                            </MenuItem> */}
                  <MenuItem value="cimb">CIMB</MenuItem>
                </StyledField>
              </NoPadGrid>
              <NoPadGrid item xs={6}>
                <StyledField
                  name="bankAcctNumber"
                  value={bankAcctNumber}
                  label="RECEIVING ACCOUNT NUMBER"
                  placeholder="Account number"
                  onChange={(e) => this.onChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </NoPadGrid>
              <NoPadGrid item xs={6}>
                <StyledField
                  name="bankCode"
                  value={bankCode}
                  label="BANK CODE"
                  placeholder="(optional)"
                  onChange={(e) => this.onChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </NoPadGrid>
              <NoPadGrid item xs={6}>
                <StyledField
                  name="iban"
                  value={iban}
                  label="IBAN"
                  placeholder="(optional)"
                  onChange={(e) => this.onChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </NoPadGrid>
              <NoPadGrid item xs={6}>
                <StyledField
                  name="branchCode"
                  value={branchCode}
                  label="BRANCH CODE"
                  placeholder="(optional)"
                  onChange={(e) => this.onChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </NoPadGrid>
              <NoPadGrid item xs={6}>
                <StyledField
                  name="swift_bic_code"
                  value={swift_bic_code}
                  label="SWIFT CODE"
                  placeholder="(optional)"
                  onChange={(e) => this.onChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </NoPadGrid>
              <NoPadGrid item xs={6}>
                <StyledField
                  name="source"
                  value={source}
                  label="SOURCE"
                  placeholder="(optional)"
                  onChange={(e) => this.onChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                />
              </NoPadGrid>
            </Grid>
          </Grid>
        </GridContentContainer>
        <ButtonWrapper item xs={12}>
          <StyleButton primary onClick={() => submit(this.state)} disabled={!bankAcctNumber || !bankAcctName || !bankName}>
            Add
          </StyleButton>
        </ButtonWrapper>
      </Modal>
    );
  }
}

AddBank.propTypes = {};
export default AddBank;
