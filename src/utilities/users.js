const { makeAxiosRequestWithExpectedStatus } = require('./common')

exports.createUser = async (name, balance, expectedStatus = 201) => {
    const requestParams = {
      url: 'http://localhost:8080/api/users',
      method: 'POST',
      data: {
        name,
        balance,
      }
    };

    const createUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    return createUserApiResponse.data
}

exports.getUsers = async ( expectedStatus = 200) => {
  const requestParams = {
    url: `http://localhost:8080/api/users/`,
    method: 'GET'
  };

  const getUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    return getUserApiResponse.data
}

exports.getUser = async (id, expectedStatus = 200) => {
    const requestParams = {
      url: `http://localhost:8080/api/users/${id}`,
      method: 'GET'
    };

    const getUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    return getUserApiResponse.data
}

exports.topUpBalance = async (userId, topup, expectedStatus = 201) => {
  const requestParams = {
    url: `http://localhost:8080/api/users/${userId}`,
    method: 'PUT',
    data: {
      topup
    }
  };

  const updateUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
  return updateUserApiResponse.data
}

exports.deleteUser = async (userId, expectedStatus = 200) => {
    const requestParams = {
      url: `http://localhost:8080/api/users/${userId}`,
      method: 'DELETE',
    };
    const getUserApiResponse = await makeAxiosRequestWithExpectedStatus(requestParams, expectedStatus);
    return getUserApiResponse.data
}
