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
import TermOfUseContent from 'utils/TermsContent/firstTimeLogin';
import Text from 'components/Text';

const Container = styled.div`
  width: 100%;
  background-color: rgba(0, 145, 218, 0.07);
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

class CWADisclaimer extends React.Component {
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
                Unit Trust Scheme Consultant (“Consultant”) Declaration;
              </StyledText>
            </Wrapper>
            <StyledText wordSpacing="4px" size="12px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
              The Consultant hereby declares that the Consultant has read and understood, and agrees to the declaration contained
              in the “Declaration by Consultant” in the{' '}
              <a href={tncUrl} target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                terms and conditions
              </a>{' '}
              and the{' '}
              <a href="https://www.principal.com.my/en/terms-of-use-my" target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                terms of use{' '}
              </a>
              (as may be amended from time to time).
            </StyledText>
            {type === 'redeem' && (
              <StyledText size="12px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
                I would like to perform the redemption as requested by the Investor. I hereby acknowledge that I have informed the
                investor on the option to switch his/her investment(s) without incurring any fee and/or charge (unless otherwise
                stated*), and that any new investment(s) in the future will be subject to new sales fees and/or charges, if any,
                as stated* <br /> *in the Prospectus, Information Memorandum and/or Disclosure Document of the said fund(s).
              </StyledText>
            )}
          </Grid>
        </Grid>
      </Container>
    );
  }
}

CWADisclaimer.propTypes = {
  acknowledge: PropTypes.any,
  onChange: PropTypes.func,
  type: PropTypes.string,
};
export default CWADisclaimer;
