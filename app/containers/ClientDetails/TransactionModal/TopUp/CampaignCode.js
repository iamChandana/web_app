import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import Text from 'components/Text';
import { primaryFont } from 'utils/StylesHelper/font';
import color from 'utils/StylesHelper/color';
import { verifyCampaignCodeRequest, removeCampaignCode } from '../../actions';
import { CampaignErrorModal } from '../../../OnBoarding/SelectFunds/AllocateFunds/CampaignErrorModal';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    '& > div': {
      flexGrow: 1,
    },
  },
  button: {
    backgroundColor: color.C_LIGHT_BLUE,
    cursor: 'pointer',
    color: '#fff',
    fontFamily: primaryFont,
    fontSize: 14,
    padding: '10px 15px',
    marginLeft: 2,
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.4,
    },
  },
  outlinedInput: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
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
  sliderWrapper: {
    paddingRight: 45,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    color: '#35C12F',
  },
  buttonFlatPrimary: {
    color: color.C_LIGHT_BLUE,
    minWidth: 70,
    minHeight: 0,
    padding: '0 8px',
  },
  buttonLabel: {
    textTransform: 'capitalize',
  },
  outlinedInputError: {
    '& > input': {
      borderColor: '#EA212D',
      color: '#EA212D',
    },
  },
});

export class CampaignCode extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      campaignCode: '',
      error: false,
    };
    this.handleVerifyCampaignCode = this.handleVerifyCampaignCode.bind(this);
    this.handleRemoveCampaignCode = this.handleRemoveCampaignCode.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.campaignErrorMessage !== this.props.campaignErrorMessage) {
      if (this.props.campaignErrorMessage && typeof this.props.campaignErrorMessage === 'string') {
        if (!this.props.campaignErrorMessage.includes('The investment is less than')) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            ...this.state,
            error: true,
          });
        } else if (this.props.campaignErrorMessage.includes('The investment is less than')) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            ...this.state,
            error: false,
          });
        }
      }
    }

    if (prevProps.appliedCampaignCode !== this.props.appliedCampaignCode) {
      if (typeof this.props.appliedCampaignCode === 'string') {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          ...this.state,
          error: false,
        });
      }
    }
  }

  handleVerifyCampaignCode() {
    const { verifyCampaignCode, fundCode, fundName, minimumInvestment, accountType } = this.props;
    const { campaignCode } = this.state;

    verifyCampaignCode({
      fundCode,
      fundName,
      minimumInvestment,
      accountType,
      campaignCode,
    });
  }

  handleRemoveCampaignCode() {
    const { handleRemoveCampaignCode, fundCode } = this.props;
    handleRemoveCampaignCode(fundCode);
  }

  render() {
    const { classes, isCampaignCodeApplied = false, campaignErrorMessage, appliedCampaignCode } = this.props;

    if (isCampaignCodeApplied) {
      return (
        <div className={classes.flexContainer}>
          <CheckCircleIcon />
          <Text size="18px" weight="bold">
            {appliedCampaignCode}
          </Text>
          <Button
            color="primary"
            classes={{ root: classes.buttonFlatPrimary, label: classes.buttonLabel }}
            onClick={this.handleRemoveCampaignCode}>
            Remove
          </Button>
        </div>
      );
    }

    const isError = campaignErrorMessage !== null;

    return (
      <React.Fragment>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <div className={classes.wrapper}>
              <TextField
                error={this.state.error}
                value={this.state.campaignCode}
                onChange={(e) => {
                  this.setState({
                    campaignCode: e.target.value,
                  });
                }}
                id="campaign-code-input"
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    input: classes.outlinedInput,
                    error: classes.outlinedInputError,
                  },
                }}
              />
              <button
                className={classes.button}
                disabled={this.state.campaignCode === ''}
                onClick={this.handleVerifyCampaignCode}>
                Apply
              </button>
            </div>
          </Grid>
        </Grid>
        {isError ? (
          <CampaignErrorModal
            handleCloseModal={this.handleRemoveCampaignCode}
            open={isError}
            campaignErrorMessage={campaignErrorMessage}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

CampaignCode.propTypes = {
  classes: PropTypes.object.isRequired,
  isCampaignCodeApplied: PropTypes.bool,
  appliedCampaignCode: PropTypes.string,
  campaignErrorMessage: PropTypes.string,
  minimumInvestment: PropTypes.number.isRequired,
  accountType: PropTypes.string.isRequired,
  fundCode: PropTypes.string.isRequired,
  fundName: PropTypes.string.isRequired,
  verifyCampaignCode: PropTypes.func.isRequired,
  handleRemoveCampaignCode: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  verifyCampaignCode: (payload) => dispatch(verifyCampaignCodeRequest(payload)),
  handleRemoveCampaignCode: (fundCode) => dispatch(removeCampaignCode(fundCode)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
)(CampaignCode);
