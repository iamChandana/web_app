import { injectGlobal } from 'styled-components';
import defaultFont from 'utils/StylesHelper/font';
import Color from 'utils/StylesHelper/color';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  @font-face {
    font-family: ${defaultFont.primary.name};
    src: url(${defaultFont.primary.url.eot}) format('embedded-opentype'),
    url(${defaultFont.primary.url.woff2}) format('woff2'),
    url(${defaultFont.primary.url.woff}) format('woff'),
    url(${defaultFont.primary.url.eot})  format('truetype');

    font-weight: normal;
    font-style: normal;
  }

  html,
  body {
    height: 100vh;
    width: 100%;
    background-color: #fafafa;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: ${defaultFont.primary.name}, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    height: 100vh;
  }

  p,
  span,
  label {
    font-family: ${defaultFont.primary.name}, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.5em;
  }

  .carousel {
    .slide {
      background: transparent !important;
      height: 250px !important;
      color: white !important;
    }
  }

  /* react-select hackish style override (refactor needed)*/
  .cimb-select {
    width: 280px;
  }
  .hide {
    div {
      div {
        &::before {
          display: none
        }
        div {
          div {
            padding-left: 0;
           div:last-child {
            div {
              visibility: hidden;
            }
           }
          }
        }
      }
    }
  }
  .hideWithUnderline {
    div {
      div {
        div {
          div {
            padding-left: 0;
           div {
            div {
              visibility: hidden;
            }
           }
          }
        }
      }
    }
  }
  #tooltip-fab {
    padding: 16px;
    max-width: 320px;
    border-radius: 5px;
    background-color: #1d1d26
  }
  .red-toast {
    color: #fff !important;
    background-color: ${Color.C_RED} !important;
    font-family: ${defaultFont.primary.name};
    p {
      font-size: 14px;
      font-family: ${defaultFont.primary.name};
    }

    ul , ol {
      li {
        font-size: 14px;
      }
    }

    .title {
      font-family: ${defaultFont.primary.name};
      font-weight: bold;
      text-align: center;
    }

    button {
      color: #fff;
      opacity: 1;
      font-family: ${defaultFont.primary.name};
    }
  }

  /* slider component overrides */
  .rc-slider {
    height: 4px;
    .rc-slider-rail {
      height: 4px;
      border-radius: 100px;
      background-color: #e4e4e5;
    }
    .rc-slider-track {
      height: 4px;
      border-radius: 100px;
      background-color: ${Color.C_LIGHT_BLUE};
    }
    .rc-slider-handle {
      width: 20px;
      height: 20px;
      box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.1);
      background-image: linear-gradient(to top, #f2f4f8, #feffff);
      border-color: ${`${Color.C_LIGHT_BLUE} !important`};
      border-style: solid;
      border-width: 5px;
      border-image-slice: 1;
      margin-top: -8px;
      margin-left: -5px;
    }
    .rc-slider-mark-text {
      top: 10px;
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #8e8e8e;
    }
    .rc-slider-dot {
      display: none;
    }
  }
  /* table override */
  .ReactTable {
    border: none !important;
  .rt-td {
    padding: 11px 5px !important;
  }
  .rt-th {
    outline: none;
  }
  &.expanded {
    .rt-thead {
    .rt-th {
      border-color: none;
      &:first-of-type {
        display: none;
      }
    }
    }
  }
  .rt-thead {
    height: 40px;
    background-color: #f5f5f5;
    .rt-tr {
      text-align: left !important;
    }
    .rt-th {
      border-color: none;
      &:first-of-type {
        /* display: none; */
      }
    }
    .rt-th,
    .rt-td {
      padding: 15px 5px !important;
      border-right: none !important;
      box-shadow: none !important;
      font-size: 10px;
      font-weight: bold;
      line-height: 2;
      text-align: left !important;
      color: #000000;
    }
  }
  .rt-tbody {
    .rt-td {
      border: none !important;
      font-size: 12px !important;
      line-height: 1.67;
      text-align: left;
      height: 40px;
      color: #1d1d26;
    }
    .-odd {
      background-color: #fff !important;
    }
    .-even {
      background-color: #f5f5f5 !important;
    }
  }
  .rt-expandable {
    display: none;
  }

  .label {
    width: 200px;
    opacity: 0.4;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: left;
    color: #1d1d26;
    font-family: ${defaultFont.primary.name};
  }
  .value {
    width: 300px;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: left;
    color: #10151a;
  }
  /* please change this */
  .fck-align {
    width: 100% !important;
    padding-left: 62%;
  }
  @media (max-width: 1150px) {
    .fck-align {
      padding-left: 63%;
    }
  }
  .change-placeholder::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    opacity: 0.8;
    font-family: ${defaultFont.primary.name};
    font-size: 13px;
    font-weight: normal;
    font-style: italic;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    line-height: 1.14;
    color: #979797;
  }
  .change-placeholder::-moz-placeholder { /* Firefox 19+ */
    opacity: 0.4;
    font-family: ${defaultFont.primary.name};
    font-size: 13px;
    font-weight: normal;
    font-style: italic;
    font-stretch: normal;
    letter-spacing: normal;
    text-align: left;
    line-height: 1.14;
    color: #979797;
    width: 393px;
  height: 16px;
  }
  .change-placeholder:-ms-input-placeholder { /* IE 10+ */
    opacity: 0.4;
    font-family: ${defaultFont.primary.name};
    font-size: 13px;
    font-weight: normal;
    font-style: italic;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    line-height: 1.14;
    color: #979797;
    width: 393px;
  height: 16px;
  }
  .change-placeholder:-moz-placeholder { /* Firefox 18- */
    opacity: 0.4;
    font-family: ${defaultFont.primary.name};
    font-size: 13px;
    font-weight: normal;
    font-style: italic;
    font-stretch: normal;
    letter-spacing: normal;
    text-align: left;
    line-height: 1.14;
    color: #979797;
  }
  .ReactModal__Overlay--after-open {
    z-index: 2;
  }
`;
