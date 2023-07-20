const { makeAxiosRequestWithExpectedStatus } = require('./common')

exports.createTransaction = async (amount, senderId, receiverId, expectedStatus = 201) => {
    const requestParams = {
        url: 'http://localhost:8080/api/transactions',
        method: 'POST',
        data: {
            amount, 
            sender: senderId,
            receiver: receiverId
        }
    }

    createTransactionApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus)
    return createTransactionApiResponse
}

exports.getTransactions = async (expectedStatus = 200) => {
    const requestParams = {
      url: `http://localhost:8080/api/transactions`,
      method: 'GET'
    };

    const getTrasactionsApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    return getTrasactionsApiResponse.data
}

exports.getTransactionsByUserId = async (userId, expectedStatus = 200) => {
  const requestParams = {
    url: `http://localhost:8080/api/transactions/${userId}`,
    method: 'GET'
  };

  const getTrasactionsApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
  return getTrasactionsApiResponse.data
}