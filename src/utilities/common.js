const axios = require('axios');

exports.makeAxiosRequestWithExpectedStatus = async (requestParams, expectedStatus) => {
  const cleanedRequestParams = {
    ...requestParams,
    headers: exports.removeUndefinedValuesFromObject(requestParams.headers),
  };
  
  const response = await axios({ ...defaultAxiosRequestParams, ...cleanedRequestParams });
  
  expect(response.status).toBe(expectedStatus)

  return response;
};

const defaultAxiosRequestParams = {
  /* Allow any status so we always get the standard axios response
  even when we are expecting a typically unhealthy status response */
  validateStatus: () => true,
};

exports.removeUndefinedValuesFromObject = (object) => {
  if (!object) {
    return undefined;
  }
  return Object.fromEntries(Object.entries(object).filter((entry) => entry[1] !== undefined));
};

exports.containsObject = (array, obj) => {
  return array.some(element => element.id == obj.id)
}
exports.containsAll = (array, target) => {
  for (let element of target) {
    if (!this.containsObject(array, element)) {
      return false
    }
  }

  return true
}