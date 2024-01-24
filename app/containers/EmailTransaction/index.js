/**
 *
 * EmailTransaction
 *
 */

import React from 'react';
import Header from 'components/Header';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import styled from 'styled-components';
import base64 from 'base-64';
import _isEmpty from 'lodash/isEmpty';
import { ColumnGridCenter } from 'components/GridContainer';
import LoadingOverlay from 'components/LoadingOverlay';
import CheckIcon from './check.svg';
import { isIE } from "react-device-detect";

const Icon = styled.img`
  width: 48px;
  height: 48px;
  align-self: center;
`;

export class EmailTransaction extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.redirectToLogin = this.redirectToLogin.bind(this);
    this.state = {
      message: null
    }
  }

  componentDidMount() {

    const param = this.props.location.search;
    
    if (!param) {
      this.setState ({
        message: 'Invalid email verification parameters!'
      });
      return;
    }

    let value = param.split('?');
    value = value[1].split('=')[1];
    
    if (!_isEmpty(value)) {
      try {
        this.setState ({
          message: decodeURIComponent(base64.decode(value))
        });
      } catch (err) {
        console.error (err);
        this.setState ({
          message: 'Invalid email verification parameters!'
        });
      }
    } else {
      this.setState ({
        message: 'Invalid email verification parameters!'
      });
    }
  }

  redirectToLogin() {
    this.props.history.push('/login');
  }

  renderMessage () {
    return (
      <ColumnGridCenter style={{ marginTop: '50px' }}>
        <Grid item>
          <Text size="18px">
            {
              this.state.message
            }
          </Text>
        </Grid>   
      </ColumnGridCenter>
    );
  }

  render() {

    return (
      <React.Fragment>
        <Header hideActionItem/>
        <LoadingOverlay show={!this.state.message}/>
        <ColumnGridCenter style={{ marginTop: '50px' }}>
          <Grid item xs={12} style={{ marginBottom: '20px' }}>
            <Icon src={CheckIcon} alt="Tick Icon" />
          </Grid> 
          {
            isIE &&
            <Grid item xs={12} style={{ marginBottom: '40px' }}>
            </Grid>
          }    
          {
            !isIE &&      
            <Grid item xs={12} style={{ marginBottom: '20px' }}>
              <Text size="18px" weight="bold">
                {
                  this.state.message
                }
              </Text>
            </Grid>
          }
          {
            isIE &&
            <React.Fragment>
              <Grid item xs={12}>
                <Text size="18px" weight="bold">
                  {
                    this.state.message
                  }
                </Text>
              </Grid>
              <Grid item xs={12} style={{ marginBottom: '40px' }}>
              </Grid>
            </React.Fragment>
          }  
          <Grid item xs={12} style={{ width: "550px" }}>
            <Text size="14px">
              If you did not make this request and believe an unauthorized person has accessed your account, please email us on service@principal.com.my or contact our Customer Care Hotline on +(603) 7718 3000.
            </Text>
          </Grid>
          {/*
          <Grid item>
            <StyledButton primary onClick={this.redirectToLogin}>
              Back To Log In
            </StyledButton>
          </Grid>    
          */}      
        </ColumnGridCenter>
      </React.Fragment>
    );
  }
}

export default EmailTransaction;
