import React from 'react';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import defaultFont from 'utils/StylesHelper/font';
import EditIcon from '../images/edit-ic.svg';
import Text from 'components/Text';
import ReactTooltip from 'react-tooltip';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #fff !important;
  padding: 10px !important;
  border-bottom: 5px solid #5d6d7e;
`;

const StyledBtn = styled.button`
  width: 160px;
  height: 40px;
  border-radius: 5.3px;
  border: ${`solid 1px ${Color.C_LIGHT_BLUE}`};
  color: ${Color.C_LIGHT_BLUE};
  font-family: ${defaultFont.primary.name};
  cursor: pointer;
`;
const Img = styled.img`
  margin-left: 8px;
`;
function EditButton(props) {
  const { edit, onClick, isEditable, isRiskExpired } = props;
  /* const text = !edit ? (
    <React.Fragment>
      Edit
      <Img src={EditIcon} />
    </React.Fragment>
  ) : (
    'Cancel'
  ); */

  const disabledStyle = {
    opacity: '0.7',
    cursor: 'not-allowed',
  };

  const handleClick = () => {
    // eslint-disable-next-line no-empty
    if (!isEditable || isRiskExpired) {
    } else {
      onClick();
    }
  };
  return (
    <React.Fragment>
      <StyledBtn onClick={handleClick} style={!isEditable || isRiskExpired ? disabledStyle : {}} data-tip data-for="notEditable">
        {/* <StyledBtn onClick={onClick}> */}
        <Text display="inline" color={Color.C_LIGHT_BLUE}>
          Edit
        </Text>
        <Img src={EditIcon} />
      </StyledBtn>
      {!isEditable && (
        <ReactTooltip1 id="notEditable" effect="solid" place="left">
          <Text size="12px" color="#000" align="left">
            Updating profile for this account will be enabled after 2 business days.
          </Text>
        </ReactTooltip1>
      )}
      {isRiskExpired && (
        <ReactTooltip1 id="notEditable" effect="solid" place="left">
          <Text size="12px" color="#000" align="left">
            Risk Assessment has been expired, Please do update the risk assessment to edit the profile.
          </Text>
        </ReactTooltip1>
      )}
    </React.Fragment>
  );
}

export default EditButton;
