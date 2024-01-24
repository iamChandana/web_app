/**
 *
 * NavPillTab
 *
 */
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RowGridSpaceBetween } from 'components/GridContainer';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { makeSelectFundPlans } from 'containers/FundProjection/selectors';
import { deleteFundPlan } from 'containers/FundProjection/actions';

import CloseICon from './cancel.svg';
import CloseBlackIcon from './close_black.svg';

const Container = styled.div`
  background-color: ${Color.C_GRAY};
  display: flex;
  padding: 10px 40px 0;
`;

const TabGrid = styled(Grid)`
  width: 98%;
  overflow: auto;
`;

const CloseGrid = styled(Grid)`
  position: absolute;
  right: 10px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  display: flex;
  cursor: pointer;
`;

const CloseImage = styled.img`
  margin-left: 5px;
  width: 9.4px;
  height: 9.4px;
  cursor: pointer;
`;

const TabWrapper = styled.ul`
  display: flex;
`;

const TabItem = styled.li`
  min-width: 176px;
  height: 40px;
  position: relative;
  background-color: #fafafa;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  margin: 0 2px;
  opacity: 0.4;
  color: white;
  display: inline-block;
  padding: 12px;
  position: relative;

  &.active {
    background-color: #fafafa;
    opacity: 1;
  }

  span {
    width: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const StyledLink = styled(Link)`
  display: inline-block;
  text-decoration: none;
  width: 100%;
`;

const CloseIcon = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  right: 5px;
  cursor: pointer;
`;

class NavPillTab extends React.Component {
  constructor() {
    super();

    this.close = this.close.bind(this);
    this.handleCloseFund = this.handleCloseFund.bind(this);
  }

  close() {
    this.props.history.push('/');
  }

  handleCloseFund(fundId) {
    const { fundPlans, handleDeletePlan, match } = this.props;
    const { path, params } = match;
    const inListPage = path.includes('funds');
    const currentFundId = !inListPage ? params.id : null;

    if (currentFundId === fundId) {
      const currentIndex = fundPlans.findIndex((plan) => plan.fundId === currentFundId);
      if (fundPlans.length === 1) {
        this.props.history.push('/funds');
      } else {
        const isLastIndex = currentIndex === fundPlans.length - 1;
        const nextFundPlan = fundPlans[currentIndex + (isLastIndex ? -1 : 1)];
        this.props.history.push(`/fund-projection/${nextFundPlan.fundId}`);
      }
    }

    handleDeletePlan(fundId);
  }

  render() {
    const { fundPlans = [], match } = this.props;
    const { path, params } = match;
    const inListPage = path.includes('funds');
    const currentFundId = !inListPage ? params.id : null;
    return (
      <Container>
        <RowGridSpaceBetween>
          <TabGrid item>
            <TabWrapper className="tabs group">
              <TabItem className={inListPage ? 'active ---first' : '--first'}>
                <StyledLink to="/funds">
                  <Text size="14px" color={Color.C_GRAY} weight={600} decoration={'none'}>
                    Fund List
                  </Text>
                </StyledLink>
              </TabItem>
              {fundPlans.map((fund) => (
                <TabItem key={fund.fundId} className={currentFundId === fund.fundId ? 'active' : ''}>
                  <StyledLink to={`/fund-projection/${fund.fundId}`}>
                    <Text size="14px" color={Color.C_GRAY} weight={600} decoration={'none'} display="inline" style={{ padding: '15px'}}>
                      {fund.fundName}
                    </Text>
                  </StyledLink>
                  <CloseIcon
                    role="button"
                    tabIndex="0"
                    onClick={() => {
                      this.handleCloseFund(fund.fundId);
                    }}>
                    <img src={CloseBlackIcon} alt="Close" width="10" height="10" />
                  </CloseIcon>
                </TabItem>
              ))}
            </TabWrapper>
          </TabGrid>
          <CloseGrid item onClick={this.close} role="button">
            <Text size="12px" color="#ffffff" weight="600" lineHeight="1.67" decoration="underline">
              Close
            </Text>
            <CloseImage src={CloseICon} alt="Close" />
          </CloseGrid>
        </RowGridSpaceBetween>
      </Container>
    );
  }
}
NavPillTab.propTypes = {
  fundPlans: PropTypes.array,
  history: PropTypes.object,
  match: PropTypes.object,
  handleDeletePlan: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  fundPlans: makeSelectFundPlans(),
});
function mapDispatchToProps(dispatch) {
  return {
    handleDeletePlan: (payload) => dispatch(deleteFundPlan(payload)),
  };
}

// export default connect(mapStateToProps, mapDispatchToProps)(Funds);
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(NavPillTab);
