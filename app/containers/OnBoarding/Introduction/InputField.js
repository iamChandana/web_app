import React from 'react';
import PropTypes from 'prop-types';
import StyledInput from 'components/Input';
import { withStyles } from 'material-ui/styles';
import Color from 'utils/StylesHelper/color';

const styles = (theme) => ({
  cssUnderline: {
    '&:after': {
      borderBottomColor: Color.C_GRAY,
    },
  },
});

class InputField extends React.Component {
  render() {
    const { input: { onChange, value }, meta: { touched, error, warning }, classes, ...rest } = this.props;
    return (
      <StyledInput
        {...rest}
        onChange={onChange}
        value={value}
        error={value && error}
        classes={{
          underline: classes.cssUnderline,
        }}
      />
    );
  }
}

InputField.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.any,
};

export default withStyles(styles)(InputField);
