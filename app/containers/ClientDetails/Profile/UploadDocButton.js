import React from 'react';
import styled from 'styled-components';
import Color from 'utils/StylesHelper/color';
import defaultFont from 'utils/StylesHelper/font';
// import SaveIcon from '../images/edit-ic.svg';
import Text from 'components/Text';
import ReactTooltip from 'react-tooltip';
import Grid from 'material-ui/Grid';
import _isEmpty from 'lodash/isEmpty';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #fff !important;
  padding: 7px !important;
  opacity: 0.75 !important;
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
`;
const disabledStyle = {
  opacity: '0.7',
  cursor: 'not-allowed',
};
function UploadDocsButton(props) {
  const { isSaving, docs, getFormErrors, handleDocUpload, disabled } = props;
  const handleClick = () => {
    // eslint-disable-next-line no-empty
    if (!_isEmpty(docs) && !disabled) {
      handleDocUpload(docs);
    }
  };
  const text = !isSaving ? <Text color="#ffffff">Upload</Text> : <Text color="#ffffff">Upload</Text>;

  return (
    <Grid container justify="flex-end" alignItems="center" >
      <StyledBtn
        style={_isEmpty(docs) || disabled ? disabledStyle : {}}
        onClick={handleClick}
        data-tip
        data-for="notEditable"
      >
        {text}
      </StyledBtn>
    </Grid >
  );
}

export default UploadDocsButton;
