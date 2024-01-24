import React from 'react';
import Radio from 'material-ui/Radio';
// import { RadioGroup } from '@material-ui/core';
// import RadioGroup from '@mui/material/RadioGroup';
import Grid from 'material-ui/Grid';
import { ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Text from 'components/Text';
import { required } from 'components/FormUtility/FormValidators';
import { CustomIcon, DisabledRadioButton, StyledRadioButton, BolderText, StyledDetails, StyledPanel, ContentItem } from '../Utility/formFields';


function doesExist(jointAccountHolderArray, accountNumber, holderType) {
  const isExisting = jointAccountHolderArray.find((accountItem) => accountItem.accountNumber === accountNumber);
  if (isExisting) {
    return isExisting[holderType];
  } return null;
}

export default function JointAccountContainer(props) {
  const { jointAccountHolderArray, accountNumberList, edit, handleJointAccountHolderName, expandedBankSection } = props;
  return (
    <ContentItem>
      <StyledPanel
        expanded={expandedBankSection}
      >
        <ExpansionPanelSummary expandIcon={<CustomIcon />}>
          <Text color="#1d1d26" weight="bold">
            <BolderText>ADDITIONAL DETAILS</BolderText>
          </Text>
        </ExpansionPanelSummary>
        <StyledDetails>
          {
            accountNumberList.map((accountItem) =>
              <Grid container justify="flex-start" spacing={20} alignItems="center">
                <Grid item xs={12} sm={5} container justify="flex-start" >
                  <Text>
                    For transactions under this Joint Account  <BolderText style={{ color: '#000000' }}>{accountItem.partnerAccountMappingId}</BolderText>, require the OTP/Signature of:
                </Text>
                </Grid>
                <Grid item xs={12} sm={7} container justify="space-between">
                  <Grid item xs={12} sm={3} spacing={20} container>
                    <DisabledRadioButton
                      disabled
                      checked={false}
                      value=""
                      control={<Radio />}
                      label="Both Account Holders"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} spacing={20} container>
                    <StyledRadioButton
                      disabled={edit}
                      checked={!!doesExist(jointAccountHolderArray, accountItem.partnerAccountMappingId, 'mainHolder')}
                      value={`${accountItem}_mainHolder`}
                      control={<Radio />}
                      label="Main Account Holder Only"
                      validate={[required]}
                      onChange={() => handleJointAccountHolderName(1, accountItem.partnerAccountMappingId)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5} spacing={20} container>
                    <StyledRadioButton
                      disabled={edit}
                      checked={!!doesExist(jointAccountHolderArray, accountItem.partnerAccountMappingId, 'mainSecondaryHolder')}
                      value={`${accountItem}_mainSecondaryHolder`}
                      control={<Radio />}
                      label="Only One Account Holder (Main or Second)"
                      validate={[required]}
                      onChange={() => handleJointAccountHolderName(2, accountItem.partnerAccountMappingId)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )
          }
        </StyledDetails>
      </StyledPanel>
    </ContentItem>
  );
}
