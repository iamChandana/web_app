import React, { Component } from 'react';
import Grid from 'material-ui/Grid';

class Section extends Component {
  render() {
    const { key } = this.props;

    return (
      <Grid item xs={12} key={key}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item style={{ width: 80 }}>
            {i < 1 ? (
              <Grid container>
                <Grid item>
                  <Text size="10px" weight="bold" color={Color.C_GRAY} opacity="0.4">
                    NO. OF UNITS
                  </Text>
                  <Text color="#000" size="16px" weight="bold" lineHeight="1.25" align="left">
                    <NumberFormat 
                      value={data.units} 
                      displayType={'text'} 
                      thousandSeparator 
                      decimalScale={2}
                      fixedDecimalScale                      
                    />
                  </Text>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
          <Grid item>
            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
              <VerticalDivider />
            </div>
          </Grid>
          <Grid item xs={2}>
            <StyledTextField
              InputLabelProps={{
                shrink: true,
                error: true,
              }}
              InputProps={{
                shrink: true,
                error: true,
              }}
              width="200px"
              value={totalSection[i].amountToSwitch ? totalSection[i].amountToSwitch : 0}
              onChange={(e) => {
                const unit = Number(e.target.value);

                const maxSwitchOutUnit = data.units - (data.fund ? data.fund.minHoldingUnits : 0);

                if (unit <= maxSwitchOutUnit) {
                  handleAmountSwitchToChange(data, unit, i);
                } else {
                  this.notify(`Minimum investment unit for ${data.fund.name} is ${data.fund.minHoldingUnits} units`);

                  handleAmountSwitchToChange(data, maxSwitchOutUnit, i);
                }
              }}
              label="No. of units to switch out"
              margin="normal"
              placeholder="No. of units"
            />
          </Grid>
          <Grid item>
            <div style={{ marginLeft: 80, marginRight: 20 }}>
              <img src={RightArrowIcon} />
            </div>
          </Grid>
          <Grid item>
            <Grid container>
              <Grid item>
                <Grid flexDirection={'row'}>
                  <Text
                    size="10px"
                    weight="bold"
                    color={Color.C_GRAY}
                    opacity="0.4"
                    style={{ textAlign: 'left', marginLeft: 17 }}
                  >
                    I WANT TO SWITCH TO
                  </Text>

                  <div style={{ display: 'inline-block' }}>
                    <StyledSelect
                      value={totalSection[i].fundToSwitchTo}
                      onChange={(e) => {
                        handleSelectFundChange(data, e.target.value, i);
                      }}
                    >
                      {/* Menu */}
                      {fundsToSelectToSwitch.map((item, index) => this.renderMenu(item, index, data.investmentProductId))}
                    </StyledSelect>

                    <DownloadDropdown
                      data={data.fund}
                      allFunds={fundsToSelectToSwitch}
                      switchFundInfo={
                        data.switchFundInfo ? (data.switchFundInfo[i] ? data.switchFundInfo[i].fundToSwitchTo : '') : ''
                      }
                      presenceOfSelectedValue={data.switchFundInfo}
                    />
                  </div>
                </Grid>
                {this.renderAddSwitchFundSection(i, addSectionNew)}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Section;
