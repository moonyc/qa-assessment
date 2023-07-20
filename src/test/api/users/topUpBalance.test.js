const { getUser, createUser, topUpBalance, deleteUser } = require("../../../utilities/users");


// TOPUP USER BALANCE BY ID

describe('GIVEN a user exists in persistence AND a valid topup value is supplied', () => {
    let user
    let updateResponse
    let updatedUser

    const expectedStatus = 201
    const balance = 0
    const topup = 1
  
    describe("WHEN I request to update the users balance by id using PUT", () => {
    
      beforeAll(async () => {
        user = await createUser('Sasha', balance)
        updateResponse = await topUpBalance(user.id, topup, expectedStatus)
        updatedUser = await getUser(user.id)
      });
  
      it("THEN the user's balance is updated", () => {
        expect(updatedUser.balance - user.balance).toBe(topup)
        expect(updateResponse.message).toBe("User was updated successfully.")
      });
    });
  
    afterAll(async () => {
        deleteUser(user.id)
    });
});

// NON-EXISTING USER

describe('GIVEN a user does not exist in persistence AND a valid topup value is supplied', () => {
    let user
    let updateResponse
    const expectedStatus = 500
    const balance = 0
    const topup = 1
  
    describe("WHEN I request to update the users balance by id using PUT", () => {
    
      beforeAll(async () => {
        user = await createUser('Sasha', balance)
        await deleteUser(user.id)
        updateResponse = await topUpBalance(user.id, topup, expectedStatus)
      });
  
      it("THEN an error message is returned", () => {
        expect(updateResponse.message).toBe("Error retrieving User with id=" + user.id)
      });
    });
});

// EMPTY TOPUP

describe('GIVEN a user exists in persistence AND an falsy topup value is supplied', () => {
    let user
    let updateResponse
    let updatedUser

    const expectedStatus = 400
    const balance = 0
    const topup = undefined
  
    describe("WHEN I request to update the users balance by id using PUT", () => {
    
      beforeAll(async () => {
        user = await createUser('Sasha', balance)
        updateResponse = await topUpBalance(user.id, topup, expectedStatus)
        updatedUser = await getUser(user.id)
      });
  
      it("THEN an error message is returned", () => {
        expect(updatedUser.balance - user.balance).toBe(0)
        expect(updateResponse.message).toBe("Content can not be empty!")
      });
    });
  
    afterAll(async () => {
        deleteUser(user.id)
    });
});

/* 
* =============================================================================
* Warning! The below test will break the app and will require a server restart!
*
//  _._     _,-'""`-._
// (,-.`._,'(       |\`-/|
//     `-.-' \ )-`( , o o)
//           `-    \`_`"'-
* =============================================================================
*/

// NON-NUMERIC TOPUP

// describe('GIVEN a user exists in persistence AND a non-numeric topup value is supplied', () => {
//     let user
//     let updateResponse
//     let updatedUser

//     const expectedStatus = 422
//     const balance = 100
//     const topup = 'string'
  
//     describe("WHEN I request to update the users balance by id using PUT", () => {
    
//       beforeAll(async () => {
//         user = await createUser('Sasha', balance)
//         updateResponse = await topUpBalance(user.id, topup, expectedStatus)
//         updatedUser = await getUser(user.id)
//       });
  
//       it("THEN an error message is returned", () => {
//         expect(updatedUser.balance - user.balance).toBe(0)
//         expect(updateResponse.message).toBe("Value must be a number!")
//       });
//     });
  
//     afterAll(async () => {
//         deleteUser(user.id)
//     });
// });

// NEGATIVE TOPUP

describe('GIVEN a user exists in persistence AND a negative topup value is supplied', () => {
    let user
    let updateResponse
    let updatedUser

    const expectedStatus = 422
    const balance = 100
    const topup = -10
  
    describe("WHEN I request to update the users balance by id using PUT", () => {
    
      beforeAll(async () => {
        user = await createUser('Sasha', balance)
        updateResponse = await topUpBalance(user.id, topup, expectedStatus)
        updatedUser = await getUser(user.id)
      });
  
      it("THEN an error message is returned", () => {
        expect(updatedUser.balance - user.balance).toBe(0)
        expect(updateResponse.message).toBe("Value must be a positive number!")
      });
    });
  
    afterAll(async () => {
        deleteUser(user.id)
    });
});
