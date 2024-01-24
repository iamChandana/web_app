import React from 'react';
import Color from 'utils/StylesHelper/color';
import ReactTooltip from 'react-tooltip';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import Text from 'components/Text';

const ReactTooltip1 = styled(ReactTooltip)`
  background-color: #676775 !important;
  padding: 15px !important;
  opacity: 0.85 !important;
  margin-right: 50px !important;
`;

export default function AccountExists() {
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Text size="14px" color="#1d1d26" lineHeight="1.43" style={{ marginTop: 10 }}>
                    Please contact our
          <span style={{ color: Color.C_LIGHT_BLUE, marginLeft: 3, textDecoration: 'underline' }}>
                        <a data-tip data-for="customerCare" style={{ opacity: 0.9 }}>
                            Customer Care{' '}
                        </a>
                    </span>
                    for further details.
        </Text>
                <ReactTooltip1 id="customerCare" effect="solid" place="right">
                    <Text size="14px" weight="bold" color="#fff" align="left">
                        Agency Hotline
          </Text>
                    <Text size="12px" color="#fff" align="left">
                        03-77237261
          </Text>
                    <Text size="12px" color="#fff" align="left">
                        Monday to Friday: 8:45 am to 5:45 pm
          </Text>
                    <Text size="12px" weight="bold" color="#fff" align="left">
                        (except on Kuala Lumpur and national public holidays)
          </Text>
                </ReactTooltip1>
            </Grid>
        </React.Fragment>
    );
}