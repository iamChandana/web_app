import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import {
  getItem,
  clearItem,
} from './tokenStore';
import BaseUrl from 'utils/getDomainUrl';
import { confirmAlert } from 'react-confirm-alert';
import 'containers/App/style/react-confirm-alert.css';
import moment from 'moment';
import React from 'react';
import Modal from 'components/Modal';

axios.defaults.baseURL = `${BaseUrl}/api`;
axios.defaults.timeout = 180000; // api call timeout

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do something with response error
    if (error.response && error.response.status) {
      if (error.response.status === 401 || error.response.status === 403) {
        const token = getItem('access_token');
        if (token) {
          clearItem('access_token');
          const now = moment();
          confirmAlert({
            message: 'This session is no longer valid or you have two login sessions open at the same time. For security reason, this session will be terminated.',
            buttons: [
              {
                label: 'Ok',
                onClick: () => {
                  if (window.location.href.indexOf('login') < 0) {
                    window.location.replace('/login');
                  }
                },
              },
            ],
            willUnmount: () => {
              // console.log('willUnmount');
            },
            childrenElement: () => <p>Logged out on {now.format('dddd, DD MMM YYYY')} at {now.format('HH:mm:ss')}</p>,
          });
        }
      }

      if (error.response.status === 500 || error.response.status === 502) {
        // window.location.href = '/server-down';
        confirmAlert({
          // message: 'System temporarily unavailable, please try again after 1 minute.',
          // buttons: [
          //   {
          //     label: 'Back',
          //     onClick: () => {
          //       window.location.reload();
          //     },
          //   },
          // ],
          customUI: ({ onClose }) => (
            <Modal open handleClose={onClose} showClose modalWidth={'45%'} zIndex={'2000'}>
              <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '16px' }}>System is busy. Please try again later.</p>
            </Modal>
          ),
        });
      }
      return Promise.reject(error);
    }
    const errObj = {
      status: 500,
      message: 'System is temporarily unavailable. Please try again later',
    };
    return Promise.reject(errObj);
  },
);
axios.interceptors.request.use((config) => {
  const token = getItem('access_token');
  if (token === null || !token) return config;
  config.headers.common.Authorization = `Bearer ${token}`; // eslint-disable-line
  return config;
});

export function post(endpoint, payload) {
  const postFunc = axios.post(endpoint, payload);

  return postFunc.then((response) => response).catch(errorHandler);
}

export function patch(endpoint, payload) {
  const patchFunc = axios.patch(endpoint, payload);

  return patchFunc.then((response) => response).catch(errorHandler);
}

export function update(endpoint, payload) {
  const putFunc = axios.put(endpoint, payload);

  return putFunc.then((response) => response).catch(errorHandler);
}

export function get(endpoint) {
  const getFunc = axios.get(endpoint);

  return getFunc.then((response) => response).catch(errorHandler);
}

export function remove(endpoint) {
  const getFunc = axios.delete(endpoint);

  return getFunc.then((response) => response).catch(errorHandler);
}

function errorHandler(error) {
  if (_isEmpty(error.response)) {
    throw error;
  } else {
    throw error.response.data;
  }
}
