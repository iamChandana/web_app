import React from 'react';
import PropTypes from 'prop-types';
import StyledInput from 'components/Input';
import { withStyles } from 'material-ui/styles';
import Color from 'utils/StylesHelper/color';
import NumberFormatCustom from 'components/NumberFormatCustom';

const styles = (theme) => ({
  cssUnderline: {
    '&:after': {
      borderBottomColor: Color.C_GRAY,
    },
  },
});

class NumberInputField extends React.Component {
  render() {
    const { input: { onChange, value }, meta: { touched, error, warning }, classes, ...rest } = this.props;
    return (
      <StyledInput
        {...rest}
        onChange={onChange}
        value={value}
        inputComponent={NumberFormatCustom}
        error={value === 0 && error}
        classes={{
          underline: classes.cssUnderline,
        }}
      />
    );
  }
}

NumberInputField.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.any,
};

export default withStyles(styles)(NumberInputField);
