const {  createUser, deleteUser } = require('../../../utilities/users');

// CREATE VALID USER

describe('GIVEN valid data for a user', () => {
  const name = 'Alex';
  const balance = 1000;
  const expectedStatus = 201;

  let createdUser;

  describe('WHEN I create a new user using POST', () => {
    beforeAll(async () => {
      createdUser = await createUser(name, balance,  expectedStatus);
    });

    it('THEN the user created is returned in the response', () => {
      expect(createdUser.name).toBe(name);
      expect(createdUser.balance).toBe(balance);
    });
  });

  afterAll(async () => {
    deleteUser(createdUser.id)
  });
});


// EMPTY NAME

describe('GIVEN an empty name for a user', () => {
  const name = '';
  const balance = 1000;
  const expectedStatus = 400;

  let createdUser;

  describe('WHEN I create a new user using POST', () => {

    beforeAll(async () => {
      createdUser = await createUser(name, balance,  expectedStatus);
    });

    it('THEN an error message is returned', () => {
      expect(createdUser.message).toBe("Name field must be present in the body");
    });
  });
});

// UNDEFINED BALANCE

describe('GIVEN an undefined balance for a user', () => {
  const name = 'Sasha';
  const balance = undefined;
  const expectedStatus = 201;
  const expectedBalance = 0;

  let createdUser;

  describe('WHEN I create a new user using POST', () => {

    beforeAll(async () => {
      createdUser = await createUser(name, balance,  expectedStatus);
    });

    it('THEN the user created is returned in the response', () => {
      expect(createdUser.name).toBe(name);
      expect(createdUser.balance).toBe(expectedBalance);
    });
  });

  afterAll(async () => {
    deleteUser(createdUser.id)
  });
});

// NEGATIVE BALANCE

describe('GIVEN a negative balance for a user', () => {
  const name = 'Sasha';
  const balance = -100;
  const expectedStatus = 422;

  let createdUser;

  describe('WHEN I create a new user using POST', () => {

    beforeAll(async () => {
      
      createdUser = await createUser(name, balance, expectedStatus);
      
    });

    it('THEN an error message is returned', () => {
      expect(createdUser.message).toBe("Some error occurred while creating the User.");
    });
  });

  afterAll(async () => {
    deleteUser(createdUser.id)
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

// // NON-NUMERIC BALANCE

// describe('GIVEN a non-numeric balance for a user', () => {
//   const name = 'Sasha';
//   const balance = 'string';
//   const expectedStatus = 422;

//   let createdUser;

//   describe('WHEN I create a new user using POST', () => {

//     beforeAll(async () => {
//       createdUser = await createUser(name, balance, expectedStatus);
//     });

//     it('THEN an error message is returned', () => {
//       expect(createdUser.message).toBe("Some error occurred while creating the User.");
//     });
//   });

//   afterAll(async () => {
    
//   });
// });