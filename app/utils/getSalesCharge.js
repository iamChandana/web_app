// eslint-disable-next-line consistent-return
function getSalesCharge(campaignCodeSalesCharge, defaultSalesCharge) {
  if (campaignCodeSalesCharge === 0 || campaignCodeSalesCharge) {
    return campaignCodeSalesCharge;
  } else if (!campaignCodeSalesCharge) {
    return defaultSalesCharge;
  }
}

export default getSalesCharge;
