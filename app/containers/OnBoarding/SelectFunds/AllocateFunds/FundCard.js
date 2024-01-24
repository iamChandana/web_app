import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import NumberFormat from 'react-number-format';
import CloseIcon from '@material-ui/icons/Close';

import DownloadDropdown from 'components/DownloadDropdown';
import Text from 'components/Text';
import { primaryFont } from 'utils/StylesHelper/font';
import getSalesCharge from 'utils/getSalesCharge';
import { FundCardField } from './FundCardField';
import CampaignCode from './CampaignCode';
import { CampaignErrorModal } from './CampaignErrorModal';

const styles = (theme) => ({
  cardRoot: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '24px 24px 40px 24px',
  },
  cardRounded: {
    borderRadius: 5,
  },
  chipRoot: {
    backgroundColor: '#77777c',
    color: '#fff',
    height: 24,
    minWidth: 72,
  },
  chipLabel: {
    fontFamily: primaryFont,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  headWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  flexContainer: {
    display: 'flex',
  },
  flexGrow: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: theme.palette.common.white,
    borderBottom: '1px solid #ced4da',
    fontSize: 18,
    padding: 0,
    fontFamily: [
      primaryFont,
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontWeight: 'bold',
    width: '100%',
  },
  outlinedInput: {
    backgroundColor: theme.palette.common.white,
    borderBottom: '1px solid #ced4da',
    fontSize: 18,
    padding: '8px 12px',
    fontFamily: [
      primaryFont,
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontWeight: 'bold',
    width: '100%',
  },
  inputError: {
    backgroundColor: theme.palette.common.white,
    borderBottom: '1px solid #ced4da',
    color: 'red',
    fontSize: 18,
    fontFamily: [
      primaryFont,
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontWeight: 'bold',
    width: '100%',
  },
  sliderWrapper: {
    paddingRight: 45,
  },
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      thousandSeparator
      allowNegative={false}
      prefix={'RM '}
      isNumericString
      decimalScale={2}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

function FundCard(props) {
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(null);
  const { classes, data, onSliderChange, allFunds, onClose, handleRemoveCampaignCode, accountType } = props;
  const assetClass = data.assetbreakdown && data.assetbreakdown.length > 0 ? data.assetbreakdown[0].class : '-';
  const minInitialInvestment =
    data.campaignCode === null || data.campaignMinInitialInvestment === null
      ? data.minInitialInvestmentAmt
      : data.campaignMinInitialInvestment;
  const SLIDER_MIN = minInitialInvestment || 0;
  const SLIDER_MAX = data.maxInitialInvestmentAmt || 99000;

  useEffect(() => {
    if (data.campaignCode === 'ERR' || data.campaignCode === 'MIN') {
      setError(data.campaignCode);
      setErrorModalOpen(true);
    } else if (data.campaignCode !== null) {
      setError(null);
    }
  }, [data.campaignCode]);

  useEffect(() => {
    if (data.campaignErrorMessage) {
      setErrorModalOpen(true);
    }
  }, [data.campaignErrorMessage]);

  return (
    <React.Fragment>
      <Card elevation={0} classes={{ root: classes.cardRoot, rounder: classes.cardRounded }}>
        <Grid spacing={8} container>
          <Grid item xs={12}>
            <div className={classes.headWrapper}>
              <div className={classes.flexGrow}>
                <Chip classes={{ root: classes.chipRoot, label: classes.chipLabel }} label={assetClass} />
              </div>
              <IconButton onClick={() => onClose(data)}>
                <CloseIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid spacing={16} alignItems="center" container>
              <Grid item xs={12} sm={4}>
                <div className={classes.flexContainer}>
                  <DownloadDropdown allFunds={allFunds} switchFundInfo={data.fundcode} type="ALLOCATE" data={data} />
                  <Text size="18px" weight="bold" color="#1d1d26" align="left">
                    {data.fundcode} &nbsp; {data.name}
                  </Text>
                </div>
              </Grid>
              <Grid item xs={6} sm={2}>
                <FundCardField label="Initial Investment">
                  <TextField
                    value={data.initialInvestment ? data.initialInvestment : ''}
                    onChange={(e) => {
                      const { value } = e.target;

                      if (value && value.trim() !== '.') {
                        onSliderChange(data, value, SLIDER_MIN, SLIDER_MAX);
                      }
                      if (!value) {
                        onSliderChange(data, value, SLIDER_MIN, SLIDER_MAX);
                      }
                    }}
                    id="formatted-numberformat-input"
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        input: data.campaignCode === 'MIN' ? classes.inputError : classes.input,
                      },
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                  {data.initialInvestment < minInitialInvestment ? (
                    <Text fontSize="12px" color="red" align="left">
                      <NumberFormat
                        displayType="text"
                        value={minInitialInvestment}
                        thousandSeparator
                        prefix="Min. investment RM "
                        thou
                      />
                    </Text>
                  ) : null}
                </FundCardField>
              </Grid>
              <Grid item xs={6} sm={2}>
                <FundCardField label="Sales Charge">
                  <Text size="18px" weight="bold" align="left">
                    <NumberFormat
                      displayType="text"
                      value={getSalesCharge(data.campaignCodeSalesCharge, data.defaultSalesCharge)}
                      suffix="%"
                    />
                  </Text>
                </FundCardField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FundCardField label="Campaign Code">
                  <CampaignCode
                    isError={data.campaignCode === 'ERR' || error === 'ERR'}
                    isCampaignCodeApplied={data.campaignSalesCharge !== null && data.campaignCode !== null}
                    appliedCampaignCode={data.campaignCode}
                    fundCode={data.fundcode}
                    fundName={data.name}
                    initialInvestment={data.initialInvestment}
                    accountType={accountType}
                  />
                </FundCardField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
      {isErrorModalOpen ? (
        <CampaignErrorModal
          campaignErrorMessage={errorMessage || data.campaignErrorMessage}
          open={isErrorModalOpen}
          handleCloseModal={() => {
            setErrorModalOpen(false);
            setErrorMessage('');
            handleRemoveCampaignCode();
          }}
        />
      ) : null}
    </React.Fragment>
  );
}

FundCard.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.is,
  onSliderChange: PropTypes.func.isRequired,
  allFunds: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  handleRemoveCampaignCode: PropTypes.func.isRequired,
  accountType: PropTypes.string.isRequired,
};

export default withStyles(styles)(FundCard);
