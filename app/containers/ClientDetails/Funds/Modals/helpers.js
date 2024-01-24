export const getMappableFunds = (data) => {
  if (!data || !data.length) return [];

  return data.map((item, idx) => ({
    id: `${idx} - ${item.fundcode}`,
    fundcode: item.fundcode,
    initialInvestment: item.transactionAmount,
    name: item.name,
    transactionRequestId: item.transactionRequestId ? item.transactionRequestId : '',
    refNo: item.refNo ? item.refNo : '',
  }));
};

export const generatePayloadForCancelTransaction = ({ pendingTrxData, isRspPayment }) => {
  let payload = {};

  if (isRspPayment) {
    payload = {
      rspRefNo: pendingTrxData[0].rspRefNo,
    };
  } else {
    payload = {
      TransactionRequests: pendingTrxData.map((item) => item.transactionRequestId),
    };
  }

  return payload;
};
