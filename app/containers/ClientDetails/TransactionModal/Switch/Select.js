import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

function CustomSelect({ options, onChange }) {
  return (
    <Select
      options={options}
      onChange={(option) => onChange(option.value)}
      styles={{
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
        option: (styles, { isDisabled, isFocused, isSelected }) => {
          return {
            ...styles,
            backgroundColor: isFocused ? '#ccc' : undefined,
            cursor: isDisabled ? 'not-allowed' : 'default',
            color: isSelected ? 'black' : undefined,

            ':active': {
              ...styles[':active'],
              backgroundColor: isSelected ? undefined : '#ccc',
            },
          };
        },
      }}
    />
  );
}

CustomSelect.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
};

export default CustomSelect;
