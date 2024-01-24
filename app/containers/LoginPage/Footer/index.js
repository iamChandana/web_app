import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Parser from 'html-react-parser';
import { withRouter } from 'react-router-dom';
import Dialog from 'components/Dialog';
import CustomerCare from 'components/CustomerCare';
import HelpButton from './HelpButton';
import ListItems from './ListItems';
import TermsOfUse from './TermsOfUse';
import { getPackageVersion } from '../../../utils/getPackageVersion';

import { GridMain, GridItem, HorizontalList, HorizontalListItem } from './Atoms';

class Footer extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false,
      type: '',
      modalTitle: '',
      modalContent: '',
      openHelp: false,
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    if (this.props.open && this.props.open !== 'support') {
      this.handleClickOpen(this.props.open);
    }
    if (this.props.open && this.props.open === 'support') {
      this.updateState({
        openHelp: true,
      });
    }
  }

  getModalContent() {
    if (this.state.type === 'term') {
      return <TermsOfUse />;
    }
    return Parser(this.state.modalContent);
  }

  showDialog(type) {
    const item = ListItems.find((listItem) => listItem.type === type);
    this.setState({
      open: true,
      type,
      modalTitle: item ? item.title : '',
      modalContent: item ? item.content : '',
    });
  }

  handleClickOpen(type) {
    const baseUrl = 'https://www.principal.com.my/en/';
    switch (type) {
      case 'faq':
        this.props.history.push('/faq');
        break;
      case 'privacy':
        window.open(`${baseUrl}privacy-notice-my`, '_blank');
        break;
      case 'internet':
        window.open(`${baseUrl}internet-risk-my`, '_blank');
        break;
      case 'cross':
        window.open(`${baseUrl}cross-trades-policy-my`, '_blank');
        break;
      case 'term':
        this.showDialog(type);
        break;
      case 'transaction':
        window.open(`${baseUrl}others/transaction-notice`, '_blank');
        break;
      default:
        this.props.history.push('/');
    }
  }

  handleClose() {
    if (this.props.open) {
      this.props.reset();
      this.props.history.replace('/login');
    }
    this.setState({ open: false });
  }

  updateState(data) {
    if (this.props.open && !data.openHelp) {
      this.props.reset();
      this.props.history.replace('/login');
    }
    this.setState(data);
  }

  get listItems() {
    return ListItems.map((listItem, i) => (
      <HorizontalListItem key={`list-${i + 1}`} onClick={() => this.handleClickOpen(listItem.type)}>
        {listItem.text}
      </HorizontalListItem>
    ));
  }

  render() {
    return (
      <GridMain container>
        <Dialog
          open={this.state.open}
          title={this.state.modalTitle}
          content={this.getModalContent()}
          closeHandler={this.handleClose}
          scroller
        />
        <GridItem item xs={12} md={10}>
          <HorizontalList>
            {this.listItems}
            <HorizontalListItem>
              App{'  '}
              <span>v</span>
              {getPackageVersion()}
            </HorizontalListItem>
          </HorizontalList>
        </GridItem>
        <GridItem item xs={12} md={2}>
          {!this.state.openHelp ? (
            <HelpButton onClickHandler={() => this.updateState({ openHelp: true })} />
          ) : (
            <CustomerCare onClose={() => this.updateState({ openHelp: false })} />
          )}
        </GridItem>
      </GridMain>
    );
  }
}

Footer.propTypes = {
  history: PropTypes.object,
  open: PropTypes.bool,
  reset: PropTypes.func,
};

export default compose(withRouter)(Footer);
