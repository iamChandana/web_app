/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import { withStyles } from 'material-ui/styles';
import _isEmpty from 'lodash/isEmpty';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';

const styles = (theme) => ({
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  singleValue: {
    fontSize: 14,
    maxWidth: '500px !important',
  },
  placeholder: {
    fontSize: 14,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  formLabelRoot: {
    fontSize: 10,
    opacity: 0.4,
    fontWeight: 'bold',
    lineHeight: 1.6,
    color: '#000',
  },
});

const TextError = styled.p`
  font-size: 10px;
  color: ${Color.C_RED};
  text-align: 'left';
`;

const MULTI_SELECT_FIELD_NAMES = ['investmentExperience', 'existingCommitments'];

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      error={props.selectProps.meta.touched && !_isEmpty(props.selectProps.meta.error)}
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
        opacity: props.data.disabled ? 0.5 : 1,
      }}
      {...props.innerProps}>
      {props.children}
    </MenuItem>
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
      style={{ width: props.selectProps.dropdownWidth ? props.selectProps.dropdownWidth : '100%' }}>
      {props.children}
    </Paper>
  );
}

function Placeholder(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

const MultiSelectOption = ({ isFocused, isSelected, children, innerProps, ...rest }) => {
  const [isActive, setIsActive] = React.useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = 'transparent';
  if (isFocused) bg = '#d9d9d9';
  if (isActive) bg = '#b3b3b3';

  const style = {
    alignItems: 'center',
    backgroundColor: bg,
    color: 'inherit',
    display: 'flex ',
    gap: '7px',
    paddingTop: 10,
    paddingBottom: 10,
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
  };

  return (
    <components.Option {...rest} isFocused={isFocused} isSelected={isSelected} innerProps={props}>
      <input type="checkbox" checked={isSelected} />
      {children}
    </components.Option>
  );
};

const customComponents = {
  Control,
  Menu,
  Placeholder,
  SingleValue,
};

class ReactSelectLongField extends React.PureComponent {
  constructor() {
    super();
    this.formatInputFieldValue = this.formatInputFieldValue.bind(this);
  }

  formatInputFieldValue(props) {
    const {
      label,
      meta: { initial },
    } = props;
    if (label === 'ID TYPE') {
      switch (initial) {
        case 'ARID': {
          return false;
        }
        case 'NRIC': {
          return false;
        }
        case 'POID': {
          return false;
        }
        case 'PSPORT': {
          return false;
        }
        default: {
          return true;
        }
      }
    }
  }

  checkInitialAndFinalValue(initialValue, finalValue) {
    if (!initialValue) initialValue = '';
    return initialValue === finalValue || initialValue.toLowerCase() === finalValue.toLowerCase();
  }

  handleChange(option, event, name) {
    const {
      input: { onChange, onBlur },
      isBank,
    } = this.props;

    const getValuesFromArr = (options) => {
      if (Array.isArray(options)) {
        const values = options.map((item) => item.value);
        return values.join(',');
      }
      return '';
    };

    if (isBank) {
      if (event === 'onChange') onChange(option.label);
      onBlur(option.label);
    } else {
      const value = MULTI_SELECT_FIELD_NAMES.includes(name) ? getValuesFromArr(option) : option.value;
      if (event === 'onChange') {
        onChange(value);
      } else if (event === 'onBlur' && !MULTI_SELECT_FIELD_NAMES.includes(name)) {
        onBlur(value);
      }
    }
  }

  getValue(value) {
    const { data } = this.props;
    if (!value) return [];
    const options = value.split(',').map((ele) => {
      const currentData = data.find((ele2) => ele2.codevalue === ele);
      if (currentData) {
        return {
          value: currentData.codevalue,
          label: currentData.description,
        };
      }
      return false;
    });
    return options;
  }

  render() {
    const {
      input: { value, name },
      showUnderline,
      classes,
      theme,
      data,
      label,
      meta: { touched, error, initial, dirty },
      uploadType,
      disabled,
      isState,
      shouldCheckIfEmpty,
      edit,
    } = this.props;
    const selectStyles = {
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 14,
          paddingLeft: 0,
        },
        '& valueContainer': {
          paddingLeft: 0,
        },
        '& input > div': {
          paddingLeft: 0,
        },
      }),
      menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
      }),
      singleValue: (base) => ({
        ...base,
      }),
    };

    // hack to get disable feel of option
    const options = data.map((item) => {
      let optionObject = { label: item.description, value: item.codevalue };
      // console.log('The options are', optionObject);
      if (uploadType === 'IC' && item.codevalue === 'PSPORT') {
        optionObject = { ...optionObject, disabled: true };
      }
      return optionObject;
    });
    const hide = showUnderline ? 'hideWithUnderline' : 'hide';
    const InputLabelProps = {
      shrink: true,
      FormLabelClasses: {
        root: classes.formLabelRoot,
      },
    };
    /* if (!isEditing) {
      InputLabelProps = {
        shrink: true,
        FormLabelClasses: {
          root: classes.formLabelRoot,
        },
        overflow: 'visible',
      };
    }; */

    return (
      <div className={`cimb-select ${disabled ? hide : ''}`} style={{ width: '100%' }}>
        <Select
          {...this.props}
          classes={classes}
          styles={selectStyles}
          textFieldProps={{
            label,
            InputLabelProps,
          }}
          isDisabled={disabled || isState}
          isOptionDisabled={(option) => (uploadType === 'IC' && option.value === 'PSPORT') || name.includes('State')}
          options={options}
          components={{
            ...customComponents,
            Option: this.props.isMulti ? MultiSelectOption : Option,
          }}
          value={
            MULTI_SELECT_FIELD_NAMES.includes(name)
              ? this.getValue(value)
              : typeof value === 'string'
              ? this.props.isBank
                ? options.filter((option) => this.checkInitialAndFinalValue(option.label, value))
                : options.filter((option) => this.checkInitialAndFinalValue(option.value, value))
              : value
          }
          onChange={(option) => this.handleChange(option, 'onChange', name)}
          onBlur={(option) => this.handleChange(option, 'onBlur', name)}
          // placeholder="..."
          menuPortalTarget={document.body}
        />
        {!this.props.isBank &&
          !MULTI_SELECT_FIELD_NAMES.includes(name) &&
          edit &&
          _isEmpty(options.filter((option) => this.checkInitialAndFinalValue(option.value, value))) &&
          !shouldCheckIfEmpty && <TextError>Required</TextError>}

        {MULTI_SELECT_FIELD_NAMES.includes(name) && !value && edit && <TextError>Required</TextError>}
        {/* {
          label === 'COUNTRY OF COMPANY' && console.log('FIELDS', data, value)
        } */}
        {edit && shouldCheckIfEmpty && this.formatInputFieldValue(this.props) ? (
          <TextError size="12px" color="#fff" align="left">
            {`To update ${this.props.checkIfEmptyLabel}, client must contact Customer Care Center`}
          </TextError>
        ) : (
          ''
        )}
      </div>
    );
  }
}

ReactSelectLongField.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  input: PropTypes.object,
  isBank: PropTypes,
  data: PropTypes.array,
  showUnderline: PropTypes.bool,
  checkIfEmptyLabel: PropTypes.string,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
};

inputComponent.propTypes = {
  inputRef: PropTypes.func,
};

MultiSelectOption.propTypes = {
  innerProps: PropTypes.object,
  children: PropTypes.node,
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
};

SingleValue.propTypes = {
  innerProps: PropTypes.object,
  children: PropTypes.node,
  selectProps: PropTypes.object,
};

Control.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  innerRef: PropTypes.func,
  children: PropTypes.node,
};

Option.propTypes = {
  innerRef: PropTypes.func,
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
  data: PropTypes.object,
  innerProps: PropTypes.object,
  children: PropTypes.node,
};

Placeholder.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  children: PropTypes.node,
};

Menu.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  children: PropTypes.node,
};

export default withStyles(styles, { withTheme: true })(ReactSelectLongField);
