/**
 *
 * Clients
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import { MenuItem } from 'material-ui/Menu';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import { compose } from 'redux';
import { reset as resetReduxForm } from 'redux-form';
import { RowGridLeft, RowGridSpaceBetween, ColumnGridCenter } from 'components/GridContainer';
import { getClients } from 'containers/Clients/actions';
import Text from 'components/Text';
import LoadingOverlay from 'components/LoadingOverlay';
import Pagination from 'components/Pagination';
import SearchAutoComplete from 'components/SearchAutoComplete';
import UserCard from 'components/UserCard';
import { reset as resetOnBoarding } from 'containers/OnBoarding/actions';
import { reset as resetClientDetails, saveClientAccDetail } from 'containers/ClientDetails/actions';

import Notifications from './Notifications';
import FullNotifications from './FullNotifications';
import RefreshIcon from './images/refresh.svg';
import { makeSelectClients, makeSelectProcessing } from './selectors';

import {
  ListContainer,
  PaddedGrid,
  Filter,
  FullWidthGrid,
  StyledSelect,
  CardContainer,
  RefreshBtn,
  LastUpdatedText,
  ContentWrapper,
  FilterContainerSmall,
  SearchAutoCompleteWrapper,
} from './styles';
import Container from '../Dashboard/Container';

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const INITIAL_STATE = {
  currentPage: 1,
  showNotificationsContent: false,
  sortBy: 'createdAt',
  lastUpdated: null,
  searchInput: '',
};

export class Clients extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.state = {
      ...INITIAL_STATE,
    };

    this.viewClientDetails = this.viewClientDetails.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.search = this.search.bind(this);
    this.paginate = this.paginate.bind(this);
    this.refresh = this.refresh.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.setLastUpdatedTime = this.setLastUpdatedTime.bind(this);
  }

  componentWillMount() {
    // reset client details, onboarding, redux-form
    const searchText = this.props.match.params.searchText;
    this.props.resetOnBoarding();
    this.props.resetClientDetails();
    this.props.resetReduxForm();
    if (!searchText) {
      this.props.getClients({ orderBy: 'createdAt' });
    } else {
      this.props.getClients({ orderBy: 'createdAt', search: searchText });
    }
    this.setLastUpdatedTime();
  }

  getSkipValue() {
    return this.state.currentPage !== 1 ? (this.state.currentPage - 1) * 12 : 0;
  }
  setLastUpdatedTime() {
    this.setState({
      lastUpdated: moment().format('D MMMM  YYYY, h:mm a'),
    });
  }
  sortBy(e) {
    const { value } = e.target;
    const skip = 0;
    this.props.getClients({ skip, orderBy: value, search: this.state.searchInput });
    this.setState({
      sortBy: value,
      currentPage: 1,
    });
    this.setLastUpdatedTime();
  }

  search(data) {
    this.setState(
      {
        searchInput: data,
      },
      () => {
        const skip = 0;
        this.props.getClients({ skip, search: this.state.searchInput, orderBy: this.state.sortBy });
        this.setLastUpdatedTime();
      },
    );
  }

  refresh() {
    this.setState(
      {
        ...INITIAL_STATE,
      },
      () => {
        this.props.getClients({ orderBy: this.state.sortBy });
        this.setLastUpdatedTime();
      },
    );
  }

  toggleNotifications() {
    this.setState((prevState) => ({
      showNotificationsContent: !prevState.showNotificationsContent,
    }));
  }

  viewClientDetails(id) {
    if (id) {
      const { data } = this.props.clients;
      const index = _findIndex(data, ['customerId', id]);
      this.props.saveClientAccDetail(data[index]);
      this.props.history.push({
        pathname: `/clients/${id}/funds`,
      });
    }
  }

  paginate(current) {
    // current
    this.setState(
      {
        currentPage: current,
      },
      () => {
        const skip = this.getSkipValue();
        this.props.getClients({
          skip,
          search: this.state.searchInput,
          orderBy: this.state.sortBy,
        });
        this.setLastUpdatedTime();
      },
    );
  }

  isSearchNumberBelongsToClientId(searchNum) {
    return this.props.clients.data.filter((client) => client.customerId === Number(searchNum)).length;
  }

  render() {
    const {
      clients,
      processing,
      match: { params },
    } = this.props;
    if (!_isEmpty(clients)) {
      const count = clients.count;
      // const time = moment().format('D MMMM YYYY, h:mm A');
      return (
        <React.Fragment>
          <LoadingOverlay show={processing} />
          <Container>
            <ContentWrapper>
              <RowGridSpaceBetween>
                <Grid item>
                  <Text color="#000" weight="600" size="18px" style={{ marginBottom: '15px' }}>
                    Active Clients
                  </Text>
                </Grid>
              </RowGridSpaceBetween>

              <Grid container direction="row" justify="space-between" alignItems="flex-start">
                <Grid item xs={7} md={8} lg={6} style={{ marginBottom: '16px' }}>
                  <SearchAutoCompleteWrapper>
                    <SearchAutoComplete
                      placeholder="Search Existing Client Mobile No. / ID No. / Email Address / UTR Account no."
                      // data={this.props.clients}
                      data={[]}
                      handleSearch={(data) => {
                        // check if data is client id
                        if (data && !isNaN(data) && this.isSearchNumberBelongsToClientId(data) > 0) {
                          this.props.history.push(`/clients/${data}/funds`);
                        } else {
                          this.search(data);
                        }
                      }}
                      type="dashboard"
                      searchText={params.searchText}
                    />
                  </SearchAutoCompleteWrapper>
                </Grid>
                <Grid item xs={5} md={4} lg={6}>
                  <Grid container>
                    <Grid item lg={10} md={7} xs={7} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                      <FilterContainerSmall>
                        <Filter name="fundFilter">
                          <Text className="label">Sort By</Text>
                          <StyledSelect value={this.state.sortBy} onChange={(e) => this.sortBy(e)} width="200px">
                            <MenuItem value="FullName">Alphabetic</MenuItem>
                            <MenuItem value="createdAt">Most Recent</MenuItem>
                            {/* <MenuItem value="AccountStatus">Client Status</MenuItem> */}
                            {/* <MenuItem value="totalNetAssetValue">Asset Value - Lower to High</MenuItem> */}
                            <MenuItem value="ISAF_PERFORMANCE_DATE">Assessment Expired</MenuItem>
                          </StyledSelect>
                        </Filter>
                      </FilterContainerSmall>
                    </Grid>
                    <Grid item lg={2} md={5} xs={5}>
                      <RefreshBtn onClick={this.refresh}>
                        <img src={RefreshIcon} />
                        Refresh
                      </RefreshBtn>
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <LastUpdatedText color="#979797" size="10px" weight="bold" align="right">
                        Last updated <span>{this.state.lastUpdated}</span>
                      </LastUpdatedText>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid container spacing={24}>
                {this.props.processing === false && !_isEmpty(clients.data)
                  ? clients.data.map((item) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={item.customerId}
                        onClick={() => this.viewClientDetails(item.customerId)}>
                        <UserCard data={item} />
                      </Grid>
                    ))
                  : null}
                {this.props.processing === false && _isEmpty(clients.data) ? (
                  <Grid item>
                    <Text color="#000" size="24px" style={{ padding: '20px' }}>
                      No client found
                    </Text>
                  </Grid>
                ) : null}
              </Grid>

              {this.props.processing === false && !_isEmpty(clients.data) ? (
                <PaginationWrapper>
                  <Pagination current={this.state.currentPage} count={count} onChange={this.paginate} />
                </PaginationWrapper>
              ) : null}
            </ContentWrapper>
          </Container>
        </React.Fragment>
      );
    }

    return <LoadingOverlay show={processing} />;
  }
}

Clients.propTypes = {
  getClients: PropTypes.func,
  clients: PropTypes.object,
  processing: PropTypes.bool,
  resetOnBoarding: PropTypes.func,
  resetClientDetails: PropTypes.func,
  resetReduxForm: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  clients: makeSelectClients(),
  processing: makeSelectProcessing(),
});

function mapDispatchToProps(dispatch) {
  return {
    getClients: (payload) => dispatch(getClients(payload)),
    saveClientAccDetail: (payload) => dispatch(saveClientAccDetail(payload)),
    resetOnBoarding: () => dispatch(resetOnBoarding()),
    resetClientDetails: () => dispatch(resetClientDetails()),
    resetReduxForm: () => dispatch(resetReduxForm()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Clients);
