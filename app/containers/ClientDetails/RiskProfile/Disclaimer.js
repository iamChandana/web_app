import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Checkbox from 'components/Checkbox';
import Parser from 'html-react-parser';
import Modal from 'components/Modal';

import Color from 'utils/StylesHelper/color';
import { RowGridCenter } from 'components/GridContainer';
import DisclaimerContent from 'utils/TermsContent/disclaimer';
import Text from 'components/Text';

const Container = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  margin-top: 40px;
  background-color: rgba(0, 145, 218, 0.05);
`;
const StyledCheckbox = styled(Checkbox)`
  width: 20px;
  height: 20px;
  margin-right: 16px;
`;
const StyledText = styled(Text)`
  max-width: 526px;
`;

const DisclaimerText = styled.span`
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: ${Color.C_LIGHT_BLUE};
  text-decoration: underline;
  cursor: pointer;
`;
class Disclaimer extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false,
      modalTitle: 'Disclaimer',
      modalContent: DisclaimerContent,
    };

    this.showModal = this.showModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  showModal() {
    this.setState({
      open: true,
    });
  }
  handleClose() {
    this.setState({ open: false });
  }
  render() {
    const { acknowledge, onChange } = this.props;
    return (
      <Container>
        <Modal showClose open={this.state.open} handleClose={this.handleClose}>
          {Parser(this.state.modalContent)}
        </Modal>
        <RowGridCenter>
          <Grid item>
            <StyledCheckbox checked={acknowledge} onChange={onChange} value="true" />
          </Grid>
          <Grid item>
            <StyledText size="12px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
              I have read and I acknowledge the&nbsp;
              <DisclaimerText onClick={this.showModal}>Disclaimer</DisclaimerText>
              &nbsp;of Principal Asset Management Berhad (
              <Text fontStyle="italic" display="inline" size="12px">
                formerly known as CIMB-Principal Asset Management Berhad
              </Text>
              ) and I accept and bear the risk of risk profile I have selected.
            </StyledText>
          </Grid>
        </RowGridCenter>
      </Container>
    );
  }
}

Disclaimer.propTypes = {
  acknowledge: PropTypes.any,
  onChange: PropTypes.func,
};
export default Disclaimer;
