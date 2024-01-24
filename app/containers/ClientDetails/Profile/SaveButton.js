import React from 'react';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import defaultFont from 'utils/StylesHelper/font';
// import SaveIcon from '../images/edit-ic.svg';
import Text from 'components/Text';
import ReactTooltip from 'react-tooltip';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #fff !important;
  padding: 7px !important;
  border-bottom: 5px solid #5d6d7e;
`;

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.7px;
  background-color: ${Color.C_LIGHT_BLUE};
  // margin-top: 32px;
  color: #ffffff;
  font-family: ${defaultFont.primary.name};
  outline: none;
  cursor: pointer;
`;
const disabledStyle = {
  opacity: '0.7',
  cursor: 'not-allowed',
};
function SaveButton(props) {
  const { isSaving, onClick, checkForAnyEmptyFields, isEmpty, accountStatus, getFormErrors } = props;
  const handleClick = () => {
    // eslint-disable-next-line no-empty
    if (isSaving || getFormErrors) {
    } else {
      onClick();
    }
  };
  const text = !isSaving ? <Text color="#ffffff">Save</Text> : <Text color="#ffffff">Save</Text>;

  return (
    <React.Fragment>
      <StyledBtn style={isSaving || getFormErrors ? disabledStyle : {}} onClick={handleClick} data-tip data-for="notEditable">
        {text}
      </StyledBtn>
      {(isEmpty || getFormErrors) && (
        <ReactTooltip1 id="notEditable" effect="solid" place="left">
          <Text size="12px" color="#000" align="left">
            All information is required to continue.
          </Text>
        </ReactTooltip1>
      )}
    </React.Fragment>
  );
}

export default SaveButton;
