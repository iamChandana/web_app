import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
import { primaryFont } from 'utils/StylesHelper/font';

import SearchIcon from './search.svg';
import SmallSearchIcon from './search-small.svg';

const Input = styled(TextField)`
  height: 40px !important;
  border-radius: 5px !important;
  border: solid 1px #cacaca !important;
  width: 100% !important;
  padding: 0px !important;
  padding-left: 30px !important;
  font-size: 16px;
  font-family: ${primaryFont};
  > div {
    &::before,
    &::after {
      display: none;
    }
    input {
      height: 25px;
      &::before,
      &::after {
        display: none;
      }
      &::placeholder {
        line-height: 1.8;
      }
    }
  }

  &:focus {
    outline: none;
  }
  &:disabled {
    background-color: #f5f5f5;
    border: none;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  padding: 0;
  border-radius: 5px;
  /* margin-right: ${(props) => (props.right ? props.right : '20px')}; */
  width: ${(props) => (props.width ? props.width : '456px')};
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: ${(props) => (props.width ? 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.4)' : '')};
  @media (max-width: 1400px) {
    max-width: 500px;
  }
  height: 40px !important;
  input {
    font-size: 14px;
    vertical-align: middle;
    line-height: 40px !important;
    @media (min-width: 1200px) {
      font-size: 16px;
    }
  }
  img {
    width: 15.7px;
    height: 16px;
    position: absolute;
    top: 10px;
    cursor: pointer;
    opacity: 0.8;
    left: 10px;
    &.small {
      width: 11.8px;
      height: 12px;
      top: 14px;
    }
  }
`;

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.FullName;
}

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight: 200,
    overflow: 'auto',
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

class SearchAutoComplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.searchText || '',
      suggestions: [],
    };

    this.renderInput = this.renderInput.bind(this);
    this.getSelectedSuggestion = this.getSelectedSuggestion.bind(this);
  }

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSelectedSuggestion = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    this.props.handleSearch(suggestion.name);
  };

  getSuggestions(value) {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }
    const { data } = this.props;
    const regex = new RegExp(escapedValue, 'i');

    //console.log( data )

    let tmp = [];

    if (data.data) {
      tmp = data.data.filter((fund) => {
        if (
          regex.test(fund.FullName) ||
          regex.test(fund.AccMobileNo) ||
          regex.test(fund.AccEmail) ||
          regex.test(fund.MainHolderlDNo)
        ) {
          return fund.FullName;
        }
      });
    } else {
      tmp = data.filter((fund) => {
        if (regex.test(fund.name)) {
          return fund.name;
        }
      });
    }
    return tmp;
  }
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue, method }) => {
    if (method !== 'type') {
      if (newValue) {
        this.props.handleSearch(newValue);
      } else if (event.target.value) {
        this.props.handleSearch(event.target.value);
      } else {
        //this.props.handleSearch(event.target.attributes[3].value);
        this.props.handleSearch(this.state.value);
      }
    }
    this.setState({
      value: typeof newValue !== 'undefined' ? newValue : event.target.value ? event.target.value : this.state.value,
    });

    if (newValue === '') {
      this.props.handleSearch(newValue);
    }
  };

  renderSuggestion(suggestion, { query, isHighlighted }) {
    let matches;
    let parts;
    if (suggestion.FullName) {
      matches = match(suggestion.FullName, query);
      parts = parse(suggestion.FullName, matches);
    } else {
      matches = match(suggestion.name, query);
      parts = parse(suggestion.name, matches);
    }
    return (
      <MenuItem className={'test'} selected={isHighlighted} component="div" id={suggestion.partnerIdentificationNumber}>
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  }

  renderInput(inputProps) {
    const { classes, ref, value, ...other } = inputProps;
    const isDashboard = this.props.type === 'dashboard';
    const fullWidth = isDashboard;
    const Icon = isDashboard ? SearchIcon : SmallSearchIcon;
    const ImageClassName = isDashboard ? 'big' : 'small';
    return (
      <InputWrapper width={fullWidth ? '100%' : this.props.width}>
        <Input
          fullWidth
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              // Do code here
              ev.preventDefault();
              this.props.handleSearch(value);
            }
          }}
          InputProps={{
            inputRef: ref,
            classes: {
              input: classes.input,
            },
            ...other,
          }}
          defaultValue={value}
        />
        <img role="button" className={ImageClassName} src={Icon} alt="Search" onClick={() => this.props.handleSearch(value)} />
      </InputWrapper>
    );
  }

  render() {
    const { classes, placeholder, data } = this.props;
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={this.renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.getSelectedSuggestion}
        inputProps={{
          classes,
          placeholder,
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
    );
  }
}

SearchAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchAutoComplete);
