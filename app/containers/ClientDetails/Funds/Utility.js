import _isEmpty from 'lodash/isEmpty';
import _indexOf from 'lodash/indexOf';
import _findIndex from 'lodash/findIndex';

export const ValidateRedemption = (value, data) => {
  let errorMessage = '';
  if (!value) {
    if (data.units - data.fund.minRedemptionUnits < data.fund.minHoldingUnits) {
      errorMessage =
        'With your current holding, you do not satisfy the minimum redemption units and the minimum investment unit for this fund';
    }
  } else if (value > data.units) {
    errorMessage = 'Input units cannot be more than available units in the fund.';
  } else if (value < data.fund.minRedemptionUnits) {
    errorMessage = `Input value must not be less than minimum redemption unit, which is ${data.fund.minRedemptionUnits} units.`;
  } else if (value > data.units - data.fund.minHoldingUnits && value < data.units) {
    errorMessage = `You can redeem beyond minimum investment unit of ${data.fund.minHoldingUnits} units or full holding`;
  }

  return errorMessage;
};

export const ValidateTopUp = (value, data, salesCharges) => {
  let errorMessage = '';
  let minInvestment = data.units > 0 ? data.fund.minAdditionalInvestmentAmt : data.fund.minInitialInvestmentAmt;

  if (salesCharges.length > 0) {
    const campaign = salesCharges.find((item) => item.NEWFUNDCODE.trim() === data.fund.fundcode);

    if (campaign && campaign !== null) {
      if (campaign.campaignMinInitialInvestment !== null) {
        minInvestment = campaign.campaignMinInitialInvestment;
      }
    }
  }

  if (value < minInvestment) {
    errorMessage = `Value must not be less than minimum additional amount, which is ${minInvestment}.`;
  } else if (value > data.fund.maxAdditionalInvestmentAmt) {
    errorMessage = `Value must not be greater than maximum additional amount, which is ${data.fund.maxAdditionalInvestmentAmt}.`;
  }

  return errorMessage;
};

export const ValidateRsp = (value, data) => {
  let errorMessage = '';
  const minAmount = data.fund.fundcode === '187' ? 500 : data.fund.minAdditionalInvestmentAmt;
  if (value < minAmount) {
    errorMessage = `Value must not be less than minimun additional amount, which is ${minAmount}}.`;
  } else if (value > data.fund.maxAdditionalInvestmentAmt) {
    errorMessage = `Value must not be greater than maximum additional amount, which is ${data.fund.maxAdditionalInvestmentAmt}.`;
  }
  // else if (value > 30000) {
  //   errorMessage = 'The daily limit for Online Transaction is RM 300,000.';
  // }

  return errorMessage;
};

export const ValidateSwitch = (value, data, selectedIndex, switchInFund) => {
  let errorMessage = '';

  if (!value) {
    if (data.units - data.fund.minRedemptionUnits < data.fund.minHoldingUnits) {
      errorMessage =
        'With your current holding, you do not satisfy the minimum switch units and the minimum investment unit for this fund';
    }
  } else if (value > data.units) {
    errorMessage = 'Input units cannot be more than available units in the fund.';
  } else if (value < data.fund.minRedemptionUnits) {
    errorMessage = `Value must not be less than minimum switching unit, which is ${data.fund.minRedemptionUnits} units.`;
  } else if (!_isEmpty(switchInFund) && switchInFund.fund && value < switchInFund.fund.minAdditionalInvestmentAmt) {
    errorMessage = `Value must not be less than minimum additional amount, which is ${switchInFund.fund.minAdditionalInvestmentAmt}.`;
  } else if (!_isEmpty(data.switchToInfo) && data.switchToInfo.length > 0) {
    let totalSwitch = 0;
    data.switchToInfo.map((item, index) => {
      totalSwitch += parseFloat(item.amountToSwitch);
    });

    if (totalSwitch > data.units) {
      errorMessage = 'Input units cannot be more than available units in the fund.';
    } else if (totalSwitch > data.units - data.fund.minHoldingUnits && totalSwitch < data.units) {
      //errorMessage = `You switch beyond minimum investment unit, which is ${data.fund.minHoldingUnits} units.`;
      //errorMessage = `You can switch beyond minimum investment unit of ${data.fund.minHoldingUnits} units or full holding`;
      errorMessage = `Switch out value should be either in entirety <= total available units - min holding units(${data.fund.minHoldingUnits})`;
    }
  }

  console.error('errorMessage: ', errorMessage);
  return errorMessage;
};

export const getAccountDetailsByFund = (fund, accounts) => {
  const selectedFund = accounts.find((item) => item.partnerAccountMappingId == fund.partnerAccountNo);
  return selectedFund;
};

const guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

export const HasSameRefNoIndexes = (portfolioData, schemeType, lov) => {
  let disabledHolderClassArr = [];
  let disabledHolderClass = [];
  if (lov && lov.Dictionary) {
    disabledHolderClassArr = lov.Dictionary.find((item) => item.id == 32);
    disabledHolderClass = disabledHolderClassArr ? disabledHolderClassArr.datadictionary.map((item) => item.codevalue) : [];
  }

  //mapping productbreakdown data
  const getProductBreakDown = (portfolioData, schemeType) => {
    const result = [];
    let parentData = [];
    if (schemeType && schemeType !== 'all') {
      parentData = portfolioData.filter((item) => item.partnerAccountType.toLowerCase() === schemeType.toLowerCase());
    } else {
      parentData = [...portfolioData];
    }
    parentData.forEach((data) => {
      data.productbreakdown.map((d) => {
        d.accountType = data.partnerAccountType;
        result.push(d);
      });
    });
    return result;
  };

  //creating disable flag for KWSP funds
  const portfolioDataClone = [...portfolioData];
  let isKWSPAvailable;
  const kwspIndex = _findIndex(portfolioDataClone, ['partnerAccountType', 'KW']);
  if (kwspIndex !== -1) {
    isKWSPAvailable = true;
  }
  if (isKWSPAvailable) {
    portfolioData[kwspIndex].productbreakdown.forEach((item) => {
      item['isKWSP'] = true;
    });
  }

  //creating disable flag for holderclass funds
  portfolioData.forEach((item, index) => {
    if (disabledHolderClass && disabledHolderClass.includes(item.partnerHolderClass)) {
      portfolioData[index].productbreakdown.forEach((item) => {
        item['isFoundInDisabledHolderClass'] = true;
      });
    }
  });

  let productbreakdown;
  if (schemeType) {
    productbreakdown = getProductBreakDown(portfolioDataClone, schemeType);
  } else {
    productbreakdown = getProductBreakDown(portfolioDataClone);
  }

  // CHECKING IF THE FUNDS HAS MULTIPLE RSPREFNO
  const superProductbreakdownClone = [...productbreakdown];
  productbreakdown.forEach((fund) => {
    const refNo = fund.rspRefNo;
    const hasSameRefNoIndexs = [];
    fund.pid = guid();
    productbreakdown.forEach((f, i) => {
      if (f.rspRefNo === refNo) {
        hasSameRefNoIndexs.push(i);
        superProductbreakdownClone[i].hasSameRefNoIndexs = hasSameRefNoIndexs;
      }
    });
  });

  const productbreakdownClone = [...superProductbreakdownClone];
  superProductbreakdownClone.forEach((fund, i) => {
    const indexSelected = _indexOf(fund.hasSameRefNoIndexs, i);
    const fundHasRefNo = [...fund.hasSameRefNoIndexs];
    fundHasRefNo.splice(indexSelected, 1);
    productbreakdownClone[i].hasSameRefNoIndexs = fundHasRefNo;
  });

  //  Adding NonPDAFund flag
  const filteringNonPDAFund = [...productbreakdownClone];
  productbreakdownClone.forEach((item) => {
    if (item && item.fund && item.fund.description && item.fund.description === 'NonPdaFund') {
      item.isNonPDA = true;
    }
  });

  return filteringNonPDAFund;
};

export function checkInHolderClass(item, portfolio, lov) {
  if (portfolio && lov && lov.Dictionary) {
    const currentIndex = _findIndex(portfolio, ['accountId', item.partnerAccountMappingId]);
    const disabledHolderClassArr = lov.Dictionary.find((item) => item.id == 32);
    const disabledHolderClass = disabledHolderClassArr ? disabledHolderClassArr.datadictionary.map((item) => item.codevalue) : [];
    if (portfolio[currentIndex] && disabledHolderClass.includes(portfolio[currentIndex].partnerHolderClass)) {
      return true;
    }
  }
  return false;
}
