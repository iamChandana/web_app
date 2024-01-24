import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import StyledTextField from 'components/TextField';
// import { withStyles } from 'material-ui/styles';

// const styles = () => ({
//   cssUnderline: {
//     '&:after': {
//       borderBottomColor: Color.C_GRAY,
//     },
//   },
// });
const TextError = styled.p`
  font-size: 10px;
  color: ${Color.C_RED};
  text-align: left;
`;
class InputField extends React.Component {

  constructor() {
    super();
    this.formatInputFieldValue = this.formatInputFieldValue.bind(this);
  }

  formatInputFieldValue(meta) {
    const { initial } = meta;
    return initial ? !initial.trim().length : true;
  }

  render() {
    const {
      input,
      meta: { touched, error },
      // classes,
      width,
      ...rest,
    } = this.props;
    return (
      <div>
        <StyledTextField width={width} {...rest} {...input} error={touched && error} />
        {(rest.edit || touched) && error && <TextError>{error}</TextError>}
        {
          (rest.edit && rest.shouldCheckIfEmpty && this.formatInputFieldValue(this.props.meta)) ?
            <TextError size="12px" color="#fff" align="left">
              {`To update ${rest.checkIfEmptyLabel}, client must contact Customer Care Center`}
            </TextError> :
            ''
        }
      </div>
    );
  }
}

InputField.propTypes = {
  input: PropTypes.object,
  rest: PropTypes.any,
  meta: PropTypes.object,
};

export default InputField;
