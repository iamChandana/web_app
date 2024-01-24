import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import io from 'socket.io-client';
import getDomain from 'utils/getDomainUrl';
const connectionOptions = {
  path: '/api/gateway/socket.io',
};
const socket = io(getDomain, connectionOptions);
import { logout } from 'containers/HomePage/actions';
import Dialog from 'components/Dialog';
import moment from 'moment';
import { selectUserInfo } from 'containers/LoginPage/selectors';
import Grid from 'material-ui/Grid';
import Text from 'components/Text';
import Button from 'components/Button';
import styled from 'styled-components';
import { confirmAlert } from 'react-confirm-alert'; 
import 'containers/App/style/react-confirm-alert.css';

const StyleButton = styled(Button)`
  margin-top: 16px;
`;

class SessionWebSocket extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpenDialogSessionTimeout: false,
    };
    this.handleCloseDialogSessionTimeout = this.handleCloseDialogSessionTimeout.bind(this);
  }
  
  componentDidMount () {
    //console.log('componentDidMount SessionWebSocket');
    if (!socket.connected && !this.state.isOpenDialogSessionTimeout) {
      socket.open();
    }
    socket.on('connect', (res) => {
      console.log('is socket connected?', socket.connected);
    });
    socket.on('invalidTokenBroadcast', (msg) => {
      if (this.props.userInfo && this.props.userInfo.access_token === msg) {
        this.setState ({
          isOpenDialogSessionTimeout: true,
        }, () => {
          //this.props.logout();
        });
        /*
        localStorage.clear();
        sessionStorage.clear();
        this.props.logout();
        const now = moment();
        confirmAlert({
          message: 'You have two login sessions open at the same time. For security reason, this session will be terminated.',
          buttons: [
            {
              label: 'Ok',
              onClick: () => {
                // socket.disconnect();
              },
            },
          ],
          willUnmount: () => {
            // console.log('willUnmount');
          },
          childrenElement: () => (
            <p>
              Logged out on {now.format('dddd, DD MMM YYYY')} at {now.format('HH:mm:ss')}
            </p>
          ),
        });     
        */   
      }
    }); 
    
    socket.on('disconnect', (res) => {
      console.log('socket.io disconnected: ', res); 
    });   
  }

  componentWillUnmount () {
    //console.log('componentWillUnmount SessionWebSocket');
  }

  handleCloseDialogSessionTimeout () {
    this.setState ({
      isOpenDialogSessionTimeout: false,
    }, () => {
      this.props.logout();
    });
    socket.disconnect();
  }

  render() {
    return (
      <Dialog 
        open={this.state.isOpenDialogSessionTimeout} 
        closeHandler={this.handleCloseDialogSessionTimeout} 
        maxWidth="sm"
        content={
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid container justify="center" align="left" alignItems="center" style={{ marginBottom: 20 }}>
              <Grid item xs={12}>
                <Text size="14px" weight="bold" display="block">
                  You have two login sessions open at the same time. 
                </Text>
                <Text size="14px" weight="bold" display="block">
                  For security reason, this session will be terminated.
                </Text>                 
              </Grid>
              <Grid item xs={12} style={{ marginTop: 10 }}>
                <Text size="14px" weight="bold">
                  Logged out on {moment().format('dddd, DD MMM YYYY')} at {moment().format('HH:mm:ss')}
                </Text>
              </Grid>               
              <Grid item xs={12} style={{ marginTop: 5 }}>
                  <Grid container justify="center" align="center" alignItems="center">
                    <Grid item xs={12} align="center">
                      <StyleButton
                        primary
                        onClick={this.handleCloseDialogSessionTimeout}>
                          Ok
                      </StyleButton>
                    </Grid>
                  </Grid>                  
                </Grid>                                                                         
            </Grid>
          </Grid> 
        }/>
      );  
  }

}

//export default SessionWebSocket;
const mapStateToProps = createStructuredSelector({
  userInfo: selectUserInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    logout: () => dispatch(logout()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SessionWebSocket);