/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';
import Parser from 'html-react-parser';
import Dialog from 'components/Dialog';

import Color from 'utils/StylesHelper/color';
import TermContent from 'utils/FooterLinkContents/term';
import TransactionTermContent from 'utils/TermsContent/transaction';
import RedemptionContent from 'utils/TermsContent/redeem';
import TransactionDisclaimer from 'utils/TermsContent/TransactionDisclaimer';
import TermOfUseContent from 'utils/TermsContent/firstTimeLogin';

import Text from 'components/Text';

const Container = styled.div`
  width: 100%;
  background-color: rgba(0, 145, 218, 0.05);
  padding: 20px;
`;
const StyledCheckbox = styled(Checkbox)`
  width: 20px;
  height: 20px;
  margin-right: 16px;
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;
const StyledText = styled(Text)`
  max-width: 600px;
  width: 591px;
  word-spacing: ${(props) => props.wordSpacing || '2.1px'};
`;

// this is  a hack for "alignment" problem, TODO: find a better solution
const Wrapper = styled.div`
  padding-top: 12px;
`;
class Disclaimer extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false,
      modalTitle: 'Disclaimer',
      modalContent: TermContent,
      openModalOfTermOfUse: false,
      modalTitleOfTermOfUse: 'Term Of Use',
      modalContentOfTermOfUse: TermOfUseContent,
    };

    this.showModal = this.showModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showModalOfTermOfUse = this.showModalOfTermOfUse.bind(this);
    this.handleCloseModalOfTermOfUse = this.handleCloseModalOfTermOfUse.bind(this);
  }

  showModal() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({ open: false });
  }

  showModalOfTermOfUse() {
    this.setState({
      openModalOfTermOfUse: true,
    });
  }

  handleCloseModalOfTermOfUse() {
    this.setState({ openModalOfTermOfUse: false });
  }

  render() {
    const { acknowledge, onChange, type } = this.props;
    const content = type === 'redeem' ? RedemptionContent : TransactionTermContent;
    const baseUrl = 'https://www.principal.com.my/others/';
    let tncUrl = `${baseUrl}transaction-terms-conditions`;
    if (type === 'redeem') {
      tncUrl = `${baseUrl}redemption-terms-conditions`;
    }
    return (
      <Container>
        <Dialog
          open={this.state.open}
          closeHandler={this.handleClose}
          content={
            <Grid container direction="column" justify="flex-start">
              <Grid item xs={12}>
                {Parser(content)}
              </Grid>
            </Grid>
          }
          title="PLEASE READ BEFORE ACCEPTING THE TERMS AND CONDITIONS IN THIS APPLICATION."
          scroller
        />

        <Dialog
          open={this.state.openModalOfTermOfUse}
          closeHandler={this.handleCloseModalOfTermOfUse}
          content={
            <Grid container direction="column" justify="flex-start">
              <Grid item xs={12}>
                {Parser(this.state.modalContentOfTermOfUse)}
              </Grid>
            </Grid>
          }
          title="PLEASE READ BEFORE ACCEPTING THE TERMS AND CONDITIONS IN THIS APPLICATION."
          scroller
        />

        <Grid justify="center" container>
          <Grid item>
            <StyledCheckbox checked={acknowledge} onChange={onChange} value="true" />
          </Grid>
          <Grid item>
            <Wrapper>
              <StyledText size="10px" weight="bold" lineHeight="1.6" color="#000" opacity="0.4" align="left">
                Applicant&#8217;s Declaration:
              </StyledText>
              <StyledText size="12px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
                I have read and understood, and agree:
              </StyledText>
              <StyledText size="12px" wordSpacing="3px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
                (a) to be bound by the{' '}
                <a href={tncUrl} target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                  terms and conditions
                </a>{' '}
                and{' '}
                <a href="https://www.principal.com.my/en/terms-of-use-my" target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                  terms of use
                </a>{' '}
                of Principal (as may be amended from time to time);
              </StyledText>
              <StyledText size="12px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
                (b) to the contents of Clause 30 - “Personal Data” of the terms and conditions. I confirm that all personal
                information that I have provided is true and correct;
              </StyledText>
              <StyledText size="12px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
                (c) to the contents of the{' '}
                <a href="https://www.principal.com.my/en/download-centre" target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                  Offering Documents
                </a>{' '}
                (as may be amended from time to time) for the relevant fund; and
              </StyledText>

              {TransactionDisclaimer.map((d, i) => (
                <StyledText
                  key={`disclaimer-${i + 1}`}
                  size="12px"
                  color="#000000"
                  lineHeight="1.67"
                  opacity="1"
                  weight="bold"
                  align="left">
                  {d}
                </StyledText>
              ))}
              {type === 'redeem' && (
                <StyledText size="12px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
                  (e) I am aware on the option to switch my investment(s) without incurring any fee and/or charge (unless
                  otherwise stated*), and that any new investment(s) in the future will incur new sales fees and/or charges, if
                  any, as stated* <br /> *in the Prospectus, Information Memorandum and/or Disclosure Document of the said
                  fund(s).
                </StyledText>
              )}
              <StyledText
                size="12px"
                color="#000000"
                lineHeight="1.67"
                opacity="1"
                weight="bold"
                align="left"
                style={{ marginTop: 8 }}>
                I also agree to pay all fees and charges which may be incurred directly or indirectly from time to time, when
                investing in the relevant fund.
              </StyledText>
            </Wrapper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

Disclaimer.propTypes = {
  acknowledge: PropTypes.any,
  onChange: PropTypes.func,
  type: PropTypes.string,
};
export default Disclaimer;
