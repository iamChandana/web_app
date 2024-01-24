import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Checkbox from 'material-ui/Checkbox';
import Parser from 'html-react-parser';
import Dialog from 'components/Dialog';
import Color from 'utils/StylesHelper/color';

import { RowGridCenter } from 'components/GridContainer';
import TermContent from 'utils/TermsContent/accountCreation';
import TermOfUseContent from 'utils/TermsContent/firstTimeLogin';
import Text from 'components/Text';
import Button from 'components/Button';

const Container = styled.div`
  width: 100%;
  display: flex;
`;
const StyledCheckbox = styled(Checkbox)`
  width: 20px !important;
  height: 20px !important;
  margin-right: 16px !important;
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
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
      modalContent: TermContent,
      acknowledgeSIWF: false,
      modalContentOfTermOfUse: TermOfUseContent,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.showDisclaimerModal,
      acknowledgeSIWF: nextProps.acknowledgeSIWF,
    });
  }

  render() {
    const {
      SIWFPresence,
      acknowledge,
      acknowledgeSIWF,
      onChange,
      onChangeSIWFAck,
      showDisclaimerModal,
      handleClose,
      onClickDisclaimer,
      showTermOfUseModal,
      onClickTermOfUse,
      handleCloseTermOfUseModal,
    } = this.props;
    return (
      <Container>
        <Dialog
          open={showDisclaimerModal}
          closeHandler={handleClose}
          title=""
          content={
            <React.Fragment>
              {Parser(this.state.modalContent)}

              <RowGridCenter
                style={{
                  display: SIWFPresence ? 'flex' : 'none',
                }}>
                <Grid item>
                  <StyledCheckbox checked={acknowledgeSIWF} onChange={onChangeSIWFAck} value="true" />
                </Grid>
                <Grid item>
                  <Text size="12px" color="#000000" lineHeight="1.67" opacity="1" weight="bold" align="left">
                    I agreed to Terms and conditions of SIWF – sophisticate investors for wholesale funds.
                  </Text>
                </Grid>
              </RowGridCenter>
            </React.Fragment>
          }
          scroller
        />

        <Dialog
          open={showTermOfUseModal}
          closeHandler={handleCloseTermOfUseModal}
          title="PLEASE READ THESE NOTES BEFORE COMPLETING THIS APPLICATION."
          content={<React.Fragment>{Parser(this.state.modalContentOfTermOfUse)}</React.Fragment>}
          scroller
          textNoBold
          textSize="16px"
        />

        <RowGridCenter>
          <Grid item style={{ height: '225px', position: 'relative', verticalAlign: 'top' }}>
            <StyledCheckbox checked={acknowledge} onChange={onChange} value="true" />
          </Grid>
          <Grid item style={{ position: 'relative', width: '550px', height: '233px' }}>
            <Text size="10px" weight="bold" lineHeight="1.6" color="#000" opacity="0.4" align="left">
              Applicant's Declaration:
            </Text>
            <Text
              size="12px"
              color="#000000"
              lineHeight="1.67"
              opacity="1"
              weight="bold"
              align="left"
              style={{
                textAlign: 'justify',
                textJustify: 'inter-word',
              }}>
              I have read and understood, and agree:
              <br />
              {/*
              (a) to be bound by the <DisclaimerText onClick={onClickDisclaimer}>terms and conditions</DisclaimerText> and <DisclaimerText onClick={onClickTermOfUse}>terms of use</DisclaimerText> of Principal;
              */}
              (a) to be bound by the{' '}
              <a
                href="https://www.principal.com.my/others/account-opening-terms-conditions"
                target="_blank"
                style={{ color: Color.C_LIGHT_BLUE }}>
                terms and conditions
              </a>{' '}
              and{' '}
              <a href="https://www.principal.com.my/en/terms-of-use-my" target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                terms of use
              </a>{' '}
              of Principal (as may be amended from time to time);
              <br />
              (b) to the contents of Clause 30 - “Personal Data” of the terms and conditions. I confirm that all personal
              information that I have provided is true and correct;
              <br />
              (c) to the contents of the{' '}
              <a href="https://www.principal.com.my/en/download-centre" target="_blank" style={{ color: Color.C_LIGHT_BLUE }}>
                Offering Documents
              </a>{' '}
              (as may be amended from time to time) for the relevant fund; and
              <br />
              (d) to the contents of the unit trust Loan Financing Risk Disclosure Statement, a copy of which I have received (if
              applicable).
              <br />
              <br />I also agree to pay all fees and charges which may be incurred directly or indirectly from time to time, when
              investing in the relevant fund.
            </Text>
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
