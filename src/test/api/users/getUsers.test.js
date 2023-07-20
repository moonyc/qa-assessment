const { containsAll} = require("../../../utilities/common");
const { getUsers, getUser, createUser, deleteUser } = require("../../../utilities/users");

// LIST ALL USERS

describe('GIVEN there are users in persistence', () => {
    let firstUser
    let secondUser
    let thirdUser
    let users
    const balance = 100
  
    describe('WHEN I request all users using GET', () => {
    
      beforeAll(async () => {
        firstUser = await createUser('Sasha', balance)
        secondUser = await createUser('Pan', balance)
        thirdUser = await createUser('Lyra', balance)

        users = await getUsers()

      });
  
      it('THEN at least 3 users are returned', () => {
        expect(users.length >= 3).toBe(true)
        const createdUsers= [ firstUser, secondUser, thirdUser ]
        expect(containsAll(users, createdUsers)).toBe(true)

      });
    });
  
    afterAll(async () => {
        [ firstUser, secondUser, thirdUser ].forEach((id) => deleteUser(id))
    });
});

// FIND A USER BY ID

describe('GIVEN a user exists in persistence', () => {
    let user
    const balance = 100
  
    describe('WHEN I request the user by id using GET', () => {
    
      beforeAll(async () => {
        user = await createUser('Sasha', balance)

        fetchedUser = await getUser(user.id)

      });
  
      it('THEN the user is returned', () => {
        expect(user.id).toBe(fetchedUser.id)
        expect(user.name).toBe(fetchedUser.name)
        expect(user.createdAt).toBe(fetchedUser.createdAt)
        expect(user.updatedAt).toBe(fetchedUser.updatedAt)
      });
    });
  
    afterAll(async () => {
        deleteUser(user.id)
    });
});

// NON-EXISTING USER 

describe('GIVEN a user does not exist in persistence', () => {
    let user
    let fetchedUser
    
    const balance = 100
    const expectedStatus = 404

    describe('WHEN I request the user by id using GET', () => {
    
      beforeAll(async () => {
        user = await createUser('Sasha', balance)
        await deleteUser(user.id)
        fetchedUser = await getUser(user.id, expectedStatus)

      });
  
      it('THEN an error message is returned', () => {
        expect(fetchedUser.message).toBe(`Cannot find User with id=${user.id}.`)
      });
    });
});
