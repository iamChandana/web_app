import React from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

const InputOption = ({ isFocused, isSelected, children, innerProps, ...rest }) => {
  const [isActive, setIsActive] = React.useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = 'transparent';
  if (isFocused) bg = '#e6e6e6';
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

function MultiSelect(props) {
  const { options, onChange, placeholder } = props;
  return (
    <Select
      {...props}
      options={options}
      onChange={(option) => onChange(option.map((ele) => ele.value))}
      placeholder={placeholder}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          border: 'none',
          borderRadius: 0,
          borderBottom: '1px solid',
        }),
        input: (base) => ({
          ...base,
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
        option: (styles, { isDisabled, isFocused, isSelected }) => ({
          ...styles,
          backgroundColor: isFocused ? '#e6e6e6' : undefined,
          cursor: isDisabled ? 'not-allowed' : 'default',
          color: isSelected ? 'black' : undefined,
          fontSize: 16,

          ':active': {
            ...styles[':active'],
            backgroundColor: isSelected ? undefined : '#e6e6e6',
          },
        }),
      }}
      components={{
        Option: InputOption,
      }}
    />
  );
}

MultiSelect.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

InputOption.propTypes = {
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
  children: PropTypes.node,
  innerProps: PropTypes.object,
};

export default MultiSelect;
