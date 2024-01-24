import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import Text from 'components/Text';
import { RowGridCenter } from 'components/GridContainer';

import { ClientInfo } from './ClientInfo';
import { TabContainer } from '../styles';

class Headline extends React.Component {
  redirect = (url) => {
    const {
      location: { pathname },
    } = this.props;
    if (url === pathname && pathname.split('/').indexOf('profile') !== -1) return false;
    this.props.history.push(url);
  };
  render() {
    const {
      clientDetails,
      id,
      resendConfirmationEmailToClient,
      messageResentConfirmationEmailStatus,
      clearStateOfConfirmationEmailResent,
      newEmail,
      isProfilePage,
      retakeQuestions,
      getRiskProfiles,
      lov,
    } = this.props;

    return (
      <React.Fragment>
        <ClientInfo
          clientDetails={clientDetails}
          resendConfirmationEmailToClient={resendConfirmationEmailToClient}
          messageResentConfirmationEmailStatus={messageResentConfirmationEmailStatus}
          clearStateOfConfirmationEmailResent={clearStateOfConfirmationEmailResent}
          newEmail={newEmail}
          redirect={this.redirect}
          retakeQuestions={retakeQuestions}
          getRiskProfiles={getRiskProfiles}
          lov={lov}
        />
        <TabContainer>
          <RowGridCenter
            item
            xs={6}
            onClick={() => this.redirect(`/clients/${id}/funds`)}
            //className={`/clients/${id}/funds` === locationUrl ? 'active' : ''}
            className={!isProfilePage ? 'active' : ''}>
            {/* <StyledLink to={`/clients/${id}/funds`}> */}
            <Text color="#fff" size="12px">
              FUNDS
            </Text>
            {/* </StyledLink> */}
          </RowGridCenter>
          <RowGridCenter
            item
            xs={6}
            onClick={() => this.redirect(`/clients/${id}/profile`)}
            //className={`/clients/${id}/profile` === locationUrl ? 'active' : ''}
            className={isProfilePage ? 'active' : ''}>
            {/* <StyledLink to={`/clients/${id}/profile`}> */}
            <Text color="#ccc" size="12px">
              PROFILE
            </Text>
            {/* </StyledLink> */}
          </RowGridCenter>
        </TabContainer>
      </React.Fragment>
    );
  }
}

Headline.propTypes = {
  clientDetails: PropTypes.object,
  id: PropTypes.any,
  resendConfirmationEmailToClient: PropTypes.func,
};

export default compose(withRouter)(Headline);
