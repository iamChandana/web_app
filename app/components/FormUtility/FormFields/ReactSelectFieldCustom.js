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
import Radio from 'material-ui/Radio';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';

const StyledRadioButton = styled(Radio)`
  height: 0 !important;
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
  padding: 0;
`;

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

function MenuItemOption(props) {
  const selectedCodeValue = props.options.filter((data) => data.label === props.children);
  return (
    <Grid
      container
      spacing={8}
      direction="row"
      alignItems="flex-start"
      justify="flex-start"
    >
      <Grid item xs={2}>
        <StyledRadioButton checked={props.isSelected} style={{ marginLeft: -15, marginTop: 5 }} />
      </Grid>
      <Grid item xs={10}>
        <Text color="#1d1d26" weight="bold" display="inline">
          {
            selectedCodeValue[0].value
          }
        </Text>
        {
          ` - ${props.children}`
        }
      </Grid>
    </Grid>
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
        fontSize: '12px',
        height: '100%',
        whiteSpace: 'normal',
      }}
      {...props.innerProps}
    >
      <MenuItemOption {...props}>
      </MenuItemOption>
    </MenuItem>
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
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
  const selectedCodeValue = props.options.filter((data) => data.label === props.children);
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {selectedCodeValue[0].value}
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

class ReactSelectFieldCustom extends React.PureComponent {
  render() {
    const {
      input: { value, onChange, onBlur },
      showUnderline,
      classes,
      theme,
      data,
      label,
      meta: { touched, error },
      disabled,
      edit,
      input,
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
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };
    // hack to get disable feel of option
    const options = data.map((item) => {
      const optionObject = { label: item.description, value: item.codevalue };
      return optionObject;
    });
    const hide = showUnderline ? 'hideWithUnderline' : 'hide';
    //  validate = this.props && this.props.validation;
    return (
      <div className={`cimb-select ${disabled ? hide : ''}`}>
        <Select
          {...this.props}
          classes={classes}
          styles={selectStyles}
          textFieldProps={{
            label,
            InputLabelProps: {
              shrink: true,
              FormLabelClasses: {
                root: classes.formLabelRoot,
              },
            },
          }}
          isDisabled={disabled}
          options={options}
          components={components}
          value={typeof value === 'string' ? options.filter((option) => option.value === value) : value}
          onChange={(option) => onChange(option.value)}
          onBlur={(option) => onBlur(option.value)}
          placeholder="..."
          menuPortalTarget={document.body}
          maxMenuHeight={400}
        />
        {(edit || touched) && error && <TextError>{error}</TextError>}
      </div>
    );
  }
}

ReactSelectFieldCustom.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  input: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(ReactSelectFieldCustom);
