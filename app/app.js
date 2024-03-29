/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import FontFaceObserver from 'fontfaceobserver';
import createHistory from 'history/createBrowserHistory';
import { PersistGate } from 'redux-persist/integration/react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import 'sanitize.css/sanitize.css';
import 'react-responsive-carousel/lib/styles/main.css';
import Color from 'utils/StylesHelper/color';
// carousel styles
import 'react-responsive-carousel/lib/styles/carousel.css';

// Import root app
import App from 'containers/App/Loadable';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Import CSS reset and Global Styles
import './global-styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'FSElliot-Pro',
  },
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: Color.C_LIGHT_BLUE,
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: 'white',
      },
    },
    MuiPickersDay: {
      selected: {
        backgroundColor: Color.C_LIGHT_BLUE,

        '&:hover': {
          backgroundColor: Color.C_LIGHT_BLUE,
        },
      },
      current: {
        color: Color.C_LIGHT_BLUE,
      },
    },
    MuiPickersModal: {
      dialogAction: {
        '& > button': {
          color: Color.C_LIGHT_BLUE,
        },
      },
    },
    typography: {
      fontFamily: 'FSElliot-Pro',
    },
  },
});

// Observe loading of FSElliot-Pro (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('FSElliot-Pro', {});

// When FSElliot-Pro is loaded, add a font-family using FSElliot-Pro to the body
openSansObserver.load().then(
  () => {
    document.body.classList.add('fontLoaded');
  },
  () => {
    document.body.classList.remove('fontLoaded');
  },
);

// Create redux store with history
const initialState = {};
const history = createHistory();
const { store, persistor } = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConnectedRouter history={history}>
          <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <App />
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </ConnectedRouter>
      </PersistGate>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise((resolve) => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js'), import('intl/locale-data/jsonp/de.js')]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
// if (process.env.NODE_ENV === 'production') {
//   require('offline-plugin/runtime').install(); // eslint-disable-line global-require
// }
