/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Tooltip from 'material-ui/Tooltip';
import { createStructuredSelector } from 'reselect';

import Text from 'components/Text';
import Branch from 'components/Branch';
import Button from 'components/Button';
import Dialog from 'components/Dialog';
import CustomerCare from 'components/CustomerCare';
import CancelIcon from './assets/cancel.svg';
import { queryISAFAmlaReset } from 'containers/OnBoarding/actions';
import { makeSelectQueryISAFAmlaFailObj } from 'containers/OnBoarding/selectors';

const TextLink = styled(Text)`
  display: inline;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ModalContentWrapper = styled.div`
  padding-top: 24px;
  padding-bottom: 24px;
`;

const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 12px;

  img {
    height: 71px;
  }
`;

class QueryISAFAmlaErrorModal extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isBranchTooltipOpen: false,
      isCustomerCareTooltipOpen: false,
    };
    this.handleBackToClientDetails = this.handleBackToClientDetails.bind(this);
    this.handleToggleBranchTooltip = this.handleToggleBranchTooltip.bind(this);
    this.handleToggleCustomerCareTooltip = this.handleToggleCustomerCareTooltip.bind(this);
  }

  handleToggleBranchTooltip() {
    this.setState((prevState) => ({
      isBranchTooltipOpen: !prevState.isBranchTooltipOpen,
    }));
  }

  handleToggleCustomerCareTooltip() {
    this.setState((prevState) => ({
      isCustomerCareTooltipOpen: !prevState.isCustomerCareTooltipOpen,
    }));
  }

  handleBackToClientDetails() {
    const { handleResetAmlaErrorObject, isFromClientsFundPage, navigateToClientFundPage } = this.props;

    handleResetAmlaErrorObject();
    if (isFromClientsFundPage) {
      // bad UX but will do
      window.location.reload();
    } else {
      navigateToClientFundPage();
    }
  }

  render() {
    const { open, amlaFailObj, isFromOnboardingPage } = this.props;
    const { isBranchTooltipOpen, isCustomerCareTooltipOpen } = this.state;
    const { name } = amlaFailObj;
    let isGenericErr = false;

    if (name && name.toLowerCase() === 'high') {
      isGenericErr = true;
    }

    return (
      <Dialog
        open={open}
        maxWidth="sm"
        noClose
        content={
          <ModalContentWrapper>
            <Grid spacing={24} container>
              <Grid item xs={12}>
                <Grid spacing={8} container>
                  <Grid item xs={12}>
                    {isGenericErr ? (
                      <Text weight="bold">Principal is unable to proceed with your online application request.</Text>
                    ) : (
                      <ImgWrapper>
                        <img src={CancelIcon} alt="Cancel" />
                      </ImgWrapper>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    {isGenericErr ? (
                      <Text weight="bold">
                        Please visit the nearest{' '}
                        <Tooltip title={<Branch onClose={this.handleToggleBranchTooltip} />} open={isBranchTooltipOpen}>
                          <TextLink
                            role="button"
                            onClick={this.handleToggleBranchTooltip}
                            decoration="underline"
                            cursor="pointer">
                            branch
                          </TextLink>
                        </Tooltip>{' '}
                        for further assistance.
                      </Text>
                    ) : (
                      <Text weight="bold">System has encountered an error.</Text>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Text weight="bold">
                      Please contact our{' '}
                      <Tooltip
                        title={<CustomerCare onClose={this.handleToggleCustomerCareTooltip} />}
                        open={isCustomerCareTooltipOpen}>
                        <TextLink
                          role="button"
                          onClick={this.handleToggleCustomerCareTooltip}
                          decoration="underline"
                          cursor="pointer">
                          Customer Care
                        </TextLink>
                      </Tooltip>{' '}
                      if you have further question.
                    </Text>
                  </Grid>
                  <Grid item xs={12}>
                    {isGenericErr ? (
                      <Text weight="bold">Error Details: AMLA</Text>
                    ) : (
                      <Text weight="bold">Error Details: {amlaFailObj.message ? amlaFailObj.message : '-'}</Text>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <ButtonWrapper>
                  <Button primary onClick={this.handleBackToClientDetails}>
                    Back to {isFromOnboardingPage ? 'Personal Details' : 'Client Fund Page'}
                  </Button>
                </ButtonWrapper>
              </Grid>
            </Grid>
          </ModalContentWrapper>
        }
      />
    );
  }
}

QueryISAFAmlaErrorModal.propTypes = {
  open: PropTypes.bool,
  amlaFailObj: PropTypes.object.isRequired,
  handleResetAmlaErrorObject: PropTypes.func.isRequired,
  isFromClientsFundPage: PropTypes.bool,
  navigateToClientFundPage: PropTypes.func,
  isFromOnboardingPage: PropTypes.bool,
};

const mapDispatchToProps = (dispatch) => ({
  handleResetAmlaErrorObject: () => dispatch(queryISAFAmlaReset()),
});

const mapStateToProps = createStructuredSelector({
  amlaFailObj: makeSelectQueryISAFAmlaFailObj(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(QueryISAFAmlaErrorModal);
