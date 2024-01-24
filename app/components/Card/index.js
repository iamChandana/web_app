/**
 *
 * Card
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { withStyles } from 'material-ui/styles';

import { CardButton, CardNormal } from './Atoms';

const Styles = {
  root: {
    padding: '20px',
  },
  elevation: {
    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
  },
  rounded: {
    borderRadius: '5px',
  },
};

function Card(props) {
  const { children, classes, type } = props;
  // add props other than 'children', 'classes', and 'type' if needed
  const properties = {
    ...omit(props, ['children', 'classes', 'type']),
    classes: {
      root: classes.root,
      elevation2: classes.elevation,
      rounded: classes.rounded,
    },
  };

  switch (type) {
    case 'button':
      return <CardButton {...properties}>{children}</CardButton>;
    default:
      return <CardNormal {...properties}>{children}</CardNormal>;
  }
}

Card.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  classes: PropTypes.object,
  type: PropTypes.string,
};

export default withStyles(Styles)(Card);
