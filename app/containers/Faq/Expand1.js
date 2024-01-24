import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import Parser from 'html-react-parser';
import Text from 'components/Text';
import downIcon from './images/down.svg';
import { primaryFont } from 'utils/StylesHelper/font';

const CustomIcon = () => <img src={downIcon} alt="test" />;

const StyledPanel = styled(ExpansionPanel)`
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`;

const StyledDetails = styled(ExpansionPanelDetails)`
  flex-direction: column;
  font-family: ${primaryFont};
`;

class Expand1 extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };
  render() {
    const { title, details, identifier } = this.props;
    return (
      <StyledPanel expanded={this.state.expanded === identifier} onChange={this.handleChange(identifier)}>
        <ExpansionPanelSummary expandIcon={<CustomIcon />}>
          <Text color="#1d1d26" weight="bold">
            {title}
          </Text>
        </ExpansionPanelSummary>
        <StyledDetails>{Parser(details)}</StyledDetails>
      </StyledPanel>
    );
  }
}

Expand1.propTypes = {
  title: PropTypes.string,
  details: PropTypes.string,
};

export default Expand1;
