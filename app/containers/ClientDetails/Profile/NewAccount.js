import React from 'react';
import PropTypes from 'prop-types';
import Text from 'components/Text';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import Color from 'utils/StylesHelper/color';
import defaultFont from 'utils/StylesHelper/font';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #fff !important;
  padding: 7px !important;
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
  margin-right: 16px;
  outline: none;
`;

const disabledStyle = {
  opacity: '0.7',
  cursor: 'not-allowed',
};

function NewCashAccountButton({ isRiskExpired, mandatoryFieldsMissing, onCreateNonExistentAccount, accountType }) {
  const accountTypeDescription = accountType === 'CS' ? 'Cash' : 'KWSP';
  const mandateFieldsText = 'Please fill all the mandatory fields to create a';

  const handleClick = () => {
    if (!(isRiskExpired || mandatoryFieldsMissing)) {
      onCreateNonExistentAccount(accountType === 'CS' ? 'CS' : 'KW');
    }
  };

  return (
    <React.Fragment>
      <StyledBtn
        onClick={handleClick}
        style={mandatoryFieldsMissing || isRiskExpired ? disabledStyle : {}}
        data-tip
        // eslint-disable-next-line react/jsx-closing-bracket-location
        data-for={`newCashAccount-${accountTypeDescription}`}>
        <Text display="inline" color={Color.C_LIGHT_BLUE}>
          {`New ${accountTypeDescription} Account`}
        </Text>
      </StyledBtn>
      {!isRiskExpired && mandatoryFieldsMissing && (
        <ReactTooltip1 id={`newCashAccount-${accountTypeDescription}`} effect="solid" place="left">
          <Text size="12px" color="#000" align="left">
            {`${mandateFieldsText} ${accountTypeDescription}.`}
          </Text>
        </ReactTooltip1>
      )}

      {isRiskExpired && (
        <ReactTooltip1 id={`newCashAccount-${accountTypeDescription}`} effect="solid" place="left">
          <Text size="12px" color="#000" align="left">
            {`Risk Assessment has been expired, Please do update the risk assessment to create a ${accountTypeDescription}`}.
          </Text>
        </ReactTooltip1>
      )}
    </React.Fragment>
  );
}

NewCashAccountButton.propTypes = {
  accountType: PropTypes.string,
  isRiskExpired: PropTypes.bool,
  mandatoryFieldsMissing: PropTypes.bool,
  onCreateNonExistentAccount: PropTypes.func.isRequired,
};

export default NewCashAccountButton;
