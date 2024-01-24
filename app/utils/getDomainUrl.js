import Config from 'config';
function getDomain() {
  if (window.location.host.indexOf('localhost') !== -1) {
    return Config.API_ROOT_URL_UAT2_TEST;
  } else if (window.location.host.indexOf('cpamsit.azurewebsites.net') !== -1) {
    return Config.API_ROOT_URL_SIT;
  } else if (window.location.host.indexOf('cpamuat.dev.bambu.life') !== -1) {
    return Config.API_ROOT_URL_UAT;
  } else if (window.location.host.indexOf('cpamuat.azurewebsites.net') !== -1) {
    return Config.API_ROOT_URL_UAT_TEST;
  } else if (window.location.host.indexOf('cpamuat2.azurewebsites.net') !== -1) {
    return Config.API_ROOT_URL_UAT2_TEST;
  } else if (window.location.host.indexOf('rckt.azurewebsites.net') !== -1) {
    return Config.API_ROOT_URL_PROD;
  } else if (window.location.host.indexOf('principal-my-dev.bambu.life') !== -1) {
    return Config.API_ROOT_URL_BAMBUDEV;
  }
  return '';
}

export default getDomain();
