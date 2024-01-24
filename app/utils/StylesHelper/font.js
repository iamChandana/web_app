import PrimaryFontEOT from '../../assets/fonts/FSElliotPro.eot';
import PrimaryFontTTF from '../../assets/fonts/FSElliotPro.ttf';
import PrimaryFontWOFF from '../../assets/fonts/FSElliotPro.woff';
import PrimaryFontWOFF2 from '../../assets/fonts/FSElliotPro.woff2';

const _default = {
  primary: {
    url: {
      eot: PrimaryFontEOT,
      ttf: PrimaryFontTTF,
      woff: PrimaryFontWOFF,
      woff2: PrimaryFontWOFF2,
    },
    name: 'FSElliot-Pro',
  },
};

export const primaryFont = _default.primary.name;
export default _default;
