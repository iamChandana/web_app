import React from 'react';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Radio from 'material-ui/Radio';
import Color from 'utils/StylesHelper/color';
import { FormControlLabel } from 'material-ui/Form';


export default function DoesHoldPoliticalParty(props) {
    const { isCustomerPoliticallyRelated } = props;
    const DisclaimerText = styled.span`
  font-size: 14px;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
`;

    const StyledSpacingContainer = styled.div`
    margin: 15px;
    `;

    const StyledRadioButton = styled(FormControlLabel)`
  svg {
    color: ${Color.C_LIGHT_BLUE};
  }
`;

    return (
        <React.Fragment>
            <StyledSpacingContainer>
                <Grid container direction="row" justify="between" alignItems="center">
                    <Grid item xs={8}>
                        <DisclaimerText>Do you hold any (or are related to such persons) Public or Political Office, including committee/council positions?
                      </DisclaimerText>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container direction="row" justify="between" alignItems="center">
                            <Grid item xs={6}>
                                <StyledRadioButton
                                    control={<Radio />}
                                    label="Yes"
                                    onChange={() => props.handleDisclaimerRadio(true)}
                                    checked={isCustomerPoliticallyRelated !== null ? isCustomerPoliticallyRelated : false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <StyledRadioButton
                                    control={<Radio />}
                                    label="No"
                                    onChange={() => props.handleDisclaimerRadio(false)}
                                    checked={isCustomerPoliticallyRelated !== null ? !isCustomerPoliticallyRelated : false}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </StyledSpacingContainer>
        </React.Fragment>
    );
}
