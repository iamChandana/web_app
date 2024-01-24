import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import { RowGridCenter } from 'components/GridContainer';
import Text from 'components/Text';
import Ledger from './Ledger';
import FundPerformance from './FundPerformance';

const TabContainer = styled.div`
  height: 48px;
  background-color: rgb(0, 112, 168);
  width: 100%;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  cursor: pointer;
  .active {
    background-color: ${Color.C_LIGHT_BLUE};
  }
`;

class Details extends React.Component {
  constructor() {
    super();

    this.state = {
      activeTab: 1,
    };
    this.setActiveTab = this.setActiveTab.bind(this);
  }
  setActiveTab(tab) {
    this.setState({
      activeTab: tab,
    });
  }
  get content() {
    const { data } = this.props;
    return this.state.activeTab === 1 ? <Ledger data={data} /> : <FundPerformance data={data} />;
  }
  render() {
    return (
      <React.Fragment>
        <TabContainer>
          <RowGridCenter item xs={6} onClick={() => this.setActiveTab(1)} className={this.state.activeTab === 1 ? 'active' : ''}>
            <Text color="#fff" size="12px">
              MY LEDGER
            </Text>
          </RowGridCenter>
          <RowGridCenter item xs={6} onClick={() => this.setActiveTab(2)} className={this.state.activeTab === 2 ? 'active' : ''}>
            <Text color="#fff" size="12px">
              FUND PERFORMANCE
            </Text>
          </RowGridCenter>
        </TabContainer>
        <div style={{ paddingBottom: this.state.activeTab === 1 ? '40px' : '0' }}>{this.content}</div>
      </React.Fragment>
    );
  }
}

Details.propTypes = {
  data: PropTypes.object,
};
export default Details;
