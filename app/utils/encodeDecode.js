import CryptoJS from 'crypto-js';
const myKey = 'xZR5g&MKMLT^mZoYoQcA9!4rUW@Pk38BekwODpuAUD';

export const encriptObject = (obj) => CryptoJS.AES.encrypt(JSON.stringify(obj), myKey).toString();

export const decriptObject = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, myKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
