import React from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import _isEmpty from 'lodash/isEmpty';
import LoadingIndicator from 'components/LoadingIndicator';

import News from './News';
import { GridItemContent, Button, StyledCarousel } from './Atoms';

import { getMarketNews } from '../actions';
import { selectNews } from '../selectors';

const CarouselSettings = {
  showArrows: false,
  showThumbs: false,
  showStatus: false,
  autoPlay: true,
  interval: 5000,
  infiniteLoop: true,
  selectedItem: 0,
};

class InfoSlider extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.state = {
      isDialogOpen: false,
      news: null,
    };

    this.toggleDialog = this.toggleDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentWillMount() {
    this.props.getMarketNews();
  }

  // eslint-disable-next-line
  static information(infos, toggle) {
    return infos.map((info, i) => (
      <Grid container key={`information-${i + 1}`}>
        <Grid item xs={12} className="headline">
          <Text size="14px" weight="bold" color="#000" align="left">
            Latest Update
          </Text>
        </Grid>
        <GridItemContent item xs={12}>
          <Text size="28px" weight="bold" color="#000" align="left">
            {info.name}
          </Text>
        </GridItemContent>
        <Button onClick={() => toggle(i)}>Read More</Button>
      </Grid>
    ));
  }

  toggleDialog(id) {
    // hack way
    CarouselSettings.autoPlay = false;
    CarouselSettings.interval = 9999999;
    CarouselSettings.selectedItem = id;
    this.setState((prevState) => ({
      isDialogOpen: !prevState.isDialogOpen,
      news: this.props.news ? this.props.news.data[id] : '',
    }));
    ReactGA.event({
      category: 'Marketing',
      action: 'Read More',
    });
  }

  closeDialog() {
    CarouselSettings.autoPlay = true;
    CarouselSettings.interval = 5000;
    this.setState({
      isDialogOpen: false,
    });
  }

  get newsData() {
    const { news } = this.props;

    return !_isEmpty(news.data) ? (
      <StyledCarousel {...CarouselSettings}>{InfoSlider.information(news.data, this.toggleDialog)}</StyledCarousel>
    ) : (
      ''
    );
  }

  render() {
    const { news } = this.props;
    return (
      <React.Fragment>
        <Dialog
          open={this.state.isDialogOpen}
          closeHandler={this.closeDialog}
          content={<News {...this.state.news} />}
          dialogTitle="Latest Update"
        />

        {news.loading ? <LoadingIndicator show /> : this.newsData}
      </React.Fragment>
    );
  }
}

InfoSlider.propTypes = {
  news: PropTypes.object,
  getMarketNews: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  news: selectNews(),
});

function mapDispatchToProps(dispatch) {
  return {
    getMarketNews: () => dispatch(getMarketNews()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(InfoSlider);
