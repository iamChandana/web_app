import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';

import Text from 'components/Text';
import Checkbox from 'components/Checkbox';
import Divider from 'material-ui/Divider';

import { NoData, Headers } from './ListOfFunds';

const FlexBox = styled.div`
  display: flex;
  align-items: center;
`;

const DividerWrapper = styled.div`
  padding: 0 12px;

  hr {
    background-color: #cccccc;
  }
`;

export const ListOfFundsWithSelection = ({ funds, handleSaveSelectedFunds, selectedFunds, showCheckBox, showRefId }) => {
  if (!funds || (funds && funds.length === 0)) {
    return <NoData showText />;
  }

  const checkIfTransactionReqIdExists = (value) => selectedFunds.map((item) => item.transactionRequestId).includes(value);
  const hasDifferentTrxId = (index, prev, current) => index > 0 && prev.transactionRequestId !== current.transactionRequestId;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Headers withPadding={showCheckBox} hideFinalCol={showCheckBox} />
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          {funds.map((fund, idx) => (
            <Grid key={fund.id} item xs={12}>
              <Grid spacing={8} container alignItems="center">
                {showRefId && hasDifferentTrxId(idx, funds[idx - 1], fund) && (
                  <Grid item xs={12}>
                    <DividerWrapper>
                      <Divider />
                    </DividerWrapper>
                  </Grid>
                )}

                <Grid item xs={12} sm={8}>
                  <FlexBox>
                    {showCheckBox && (
                      <Checkbox
                        checked={checkIfTransactionReqIdExists(fund.transactionRequestId)}
                        value
                        onChange={() => handleSaveSelectedFunds(fund)}
                      />
                    )}
                    <Text weight="bold" align="left">
                      {`${fund.fundcode} ${fund.name}`}
                    </Text>
                  </FlexBox>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Text weight="bold" align="left">
                    <NumberFormat displayType="text" value={fund.initialInvestment} prefix="RM " />
                  </Text>
                </Grid>
                {showRefId && (
                  <Grid item xs={12} sm={2}>
                    <Text weight="bold" align="left">
                      {fund.refNo}
                    </Text>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

ListOfFundsWithSelection.defaultProps = {
  showRefId: false,
};

ListOfFundsWithSelection.propTypes = {
  funds: PropTypes.array,
  handleSaveSelectedFunds: PropTypes.func.isRequired,
  selectedFunds: PropTypes.array.isRequired,
  showCheckBox: PropTypes.bool,
  showRefId: PropTypes.bool,
};
