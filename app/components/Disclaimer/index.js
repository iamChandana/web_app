import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Checkbox from 'components/Checkbox';
import Parser from 'html-react-parser';
import Modal from 'components/Modal';

import Color from 'utils/StylesHelper/color';
import { RowGridCenter } from 'components/GridContainer';
import TermContent from 'utils/TermsContent/disclaimer';
import Text from 'components/Text';

const Container = styled.div`
  width: 100%;
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
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: left;
  color: ${Color.C_LIGHT_BLUE};
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
`;
class Disclaimer extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false,
      modalContent: TermContent,
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
    return (
      <Container>
        <Modal showClose open={this.state.open} handleClose={this.handleClose} title={this.state.modalTitle}>
          {Parser(this.state.modalContent)}
        </Modal>
        <RowGridCenter>
          <Grid item>
            <StyledText size="14px" color="#000000" lineHeight="1.43" align="left">
              You may proceed if you acknowledge the <DisclaimerText onClick={this.showModal}>Disclaimer</DisclaimerText> and accept the risk.
            </StyledText>
          </Grid>
        </RowGridCenter>
      </Container>
    );
  }
}

Disclaimer.propTypes = {};
export default Disclaimer;
