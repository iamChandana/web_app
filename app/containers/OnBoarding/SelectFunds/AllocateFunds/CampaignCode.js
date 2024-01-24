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
    };
    this.handleVerifyCampaignCode = this.handleVerifyCampaignCode.bind(this);
    this.handleRemoveCampaignCode = this.handleRemoveCampaignCode.bind(this);
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.appliedCampaignCode !== this.props.appliedCampaignCode && this.props.appliedCampaignCode === null) {
  //     // eslint-disable-next-line react/no-did-update-set-state
  //     this.setState({
  //       campaignCode: '',
  //     });
  //   }
  // }

  handleVerifyCampaignCode() {
    this.props.verifyCampaignCode(
      {
        fundCode: this.props.fundCode,
        campaignCode: this.state.campaignCode,
        minimumInvestment: this.props.initialInvestment,
        fundName: this.props.fundName,
        accountType: this.props.accountType,
      },
      this.props.initialInvestment,
    );
  }

  handleRemoveCampaignCode() {
    this.setState({ campaignCode: '' });
    this.props.handleRemoveCampaignCode(this.props.fundCode);
  }

  render() {
    const { classes, isCampaignCodeApplied = false, appliedCampaignCode, isError } = this.props;

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

    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <div className={classes.wrapper}>
            <TextField
              error={isError}
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
            <button className={classes.button} disabled={this.state.campaignCode === ''} onClick={this.handleVerifyCampaignCode}>
              Apply
            </button>
          </div>
        </Grid>
      </Grid>
    );
  }
}

CampaignCode.propTypes = {
  classes: PropTypes.object.isRequired,
  verifyCampaignCode: PropTypes.func.isRequired,
  handleRemoveCampaignCode: PropTypes.func.isRequired,
  accountType: PropTypes.string.isRequired,
  fundCode: PropTypes.string.isRequired,
  fundName: PropTypes.string.isRequired,
  isCampaignCodeApplied: PropTypes.bool,
  appliedCampaignCode: PropTypes.string,
  isError: PropTypes.bool,
  initialInvestment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  verifyCampaignCode: (payload, initialInvestment) =>
    dispatch(verifyCampaignCodeRequest(verifyCampaignCodeRequest(payload, initialInvestment))),
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
