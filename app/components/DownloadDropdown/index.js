// replicas for the download button in the FundCard component
import React, { Component } from 'react';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import _has from 'lodash/has';

// todo: move this to here once this component is fully component-ise
import DownloadContent from '../FundCard/DownloadContent';
import DownloadIcon from './download.svg';

const Download = styled.img`
  float: right;
  margin-right: ${(props) => (props.type === 'ALLOCATE' ? '8px' : 0)};
  cursor: pointer;
`;

const DLContentWrapper = styled.div`
  justify-content: flex-end;
  display: flex;
  @media (max-width: 583px) {
    display: block;
    margin-left: 20px;
  }
`;

class DownloadDropdown extends Component {
  constructor() {
    super();
    this.state = {
      showDownloadPdf: false,
      presenceOfSelectedValue: false,
      selectedFund: [],
    };
    this.toggleDownloadPdf = this.toggleDownloadPdf.bind(this);
    this.togglePDFMenu = this.togglePDFMenu.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.togglePDFMenu(nextProps.switchFundInfo, nextProps.allFunds);
  }

  toggleDownloadPdf() {
    this.setState((prevState) => ({
      showDownloadPdf: !prevState.showDownloadPdf,
    }));
  }

  redirectToUrl(url) {
    window.open(url, '_blank');
  }

  togglePDFMenu(switchFundInfo, allFunds) {
    if (!_isEmpty(switchFundInfo)) {
      allFunds.map((fund) => {
        if (fund.fundcode === switchFundInfo) {
          this.setState({
            presenceOfSelectedValue: true,
            selectedFund: fund.fundDetails,
          });
        }
      });
    }
  }

  render() {
    const { type, data } = this.props;
    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/ false || !!document.documentMode;
    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;
    if (type === 'ALLOCATE' && _has(data, 'fundDetails')) {
      const { fundDetails } = data;
      return (
        <div
          style={{
            display: 'inline-block',
          }}>
          <Download src={DownloadIcon} alt="Download" onClick={this.toggleDownloadPdf} type={type} />
          {this.state.showDownloadPdf &&
            (fundDetails.productHighlightSheet || fundDetails.fundFactsheet || fundDetails.prospectus) && (
              <DLContentWrapper>
                <DownloadContent
                  data={fundDetails}
                  toggle={this.toggleDownloadPdf}
                  download={this.redirectToUrl}
                  type={type}
                  isIEBrowser={isIE}
                  isEdgeBrowser={isEdge}
                />
              </DLContentWrapper>
            )}
        </div>
      );
    }
    return (
      <div
        style={{
          display: this.state.presenceOfSelectedValue ? 'inline-block' : 'none',
        }}>
        <Download src={DownloadIcon} alt="Download" onClick={this.toggleDownloadPdf} type={type} />
        {this.state.showDownloadPdf &&
          (this.state.selectedFund.productHighlightSheet ||
            this.state.selectedFund.fundFactsheet ||
            this.state.selectedFund.prospectus) && (
            <DLContentWrapper>
              <DownloadContent
                data={this.state.selectedFund}
                toggle={this.toggleDownloadPdf}
                download={this.redirectToUrl}
                type={type}
              />
            </DLContentWrapper>
          )}
      </div>
    );
  }
}

export default DownloadDropdown;
