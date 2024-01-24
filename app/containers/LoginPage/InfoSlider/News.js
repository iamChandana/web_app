import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Grid from 'material-ui/Grid';
import Parser from 'html-react-parser';
import Text from 'components/Text';
import { GridItemNewsHeader } from './Atoms';
import Color from 'utils/StylesHelper/color';

function News(props) {
  const { name, description, modifiedAt } = props;

  return (
    <Grid container>
      <GridItemNewsHeader item xs={12}>
        <Text align="left" color="#333">
          {moment(modifiedAt).format('dddd, D MMMM  YYYY, h:mm a')}
        </Text>
        <Text align="left" color={Color.C_LIGHT_BLUE} size="30px" weight="bold">
          {name}
        </Text>
        <Text align="left" color="#333" weight="bold">
          By Principal Team
        </Text>
      </GridItemNewsHeader>
      <Grid item xs={12}>
        {Parser(description)}
      </Grid>
    </Grid>
  );
}

News.propTypes = {
  name: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  modifiedAt: PropTypes.string,
};

export default News;
