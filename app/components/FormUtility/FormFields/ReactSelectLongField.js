import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
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
      style={{width:props.selectProps.dropdownWidth?props.selectProps.dropdownWidth:'100%'}}>
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
const components = {
  Control,
  Option,
  Menu,
  Placeholder,
  SingleValue,
};

class ReactSelectLongField extends React.PureComponent {
  render() {
    const {
      input: { value, onChange, onBlur, name },
      showUnderline,
      classes,
      theme,
      data,
      label,
      meta: { touched, error },
      uploadType,
      disabled,
      isState,
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
      menuPortal: base => ({ 
        ...base, 
        zIndex: 9999 
      }),  
      singleValue: (base) => ({
        ...base,
      }),
    };
    // hack to get disable feel of option
    const options = data.map((item) => {
      let optionObject = { label: item.description, value: item.codevalue };
      if (uploadType === 'IC' && item.codevalue === 'PSPORT') {
        optionObject = { ...optionObject, disabled: true };
      }
      return optionObject;
    });
    const hide = showUnderline ? 'hideWithUnderline' : 'hide';

    let InputLabelProps = {
      shrink: true,
      FormLabelClasses: {
        root: classes.formLabelRoot,
      },
    };
    /*if (!isEditing) {
      InputLabelProps = {
        shrink: true,
        FormLabelClasses: {
          root: classes.formLabelRoot,
        },
        overflow: 'visible',
      };
    };*/

    return (
      <div className={`cimb-select ${disabled ? hide : ''}`}>
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
          components={components}
          value={typeof value === 'string' ? options.filter((option) => option.value === value) : value}
          onChange={(option) => onChange(option.value)}
          onBlur={(option) => onBlur(option.value)}
          placeholder="..."
          menuPortalTarget={document.body}
        />
        {touched && error && <TextError>{error}</TextError>}
      </div>
    );
  }
}

ReactSelectLongField.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  input: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(ReactSelectLongField);
