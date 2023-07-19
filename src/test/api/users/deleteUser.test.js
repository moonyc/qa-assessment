const { containsAll} = require("../../../utilities/common");
const { getUsers, getUser, createUser, deleteUser } = require("../../../utilities/users");

// DELETE USER

describe('GIVEN there is a user in persistence', () => {
    let user
    let users
    let fetchedUser
    let deleteResponse

    const balance = 100
    const expectedStatus = 404
  
    describe('WHEN I delete the user by id using DELETE', () => {
        
      beforeAll(async () => {
        user = await createUser('Sasha', balance)
        
        deleteResponse = await deleteUser(user.id)

        users = await getUsers()
        fetchedUser = await getUser(user.id, expectedStatus) 

      });
  
      it('THEN the user is not in persistence anymore', () => {
        expect(containsAll(users, [user])).toBe(false)
        expect(fetchedUser.message).toBe(`Cannot find User with id=${user.id}.`)
        expect(deleteResponse.message).toBe("User was deleted successfully.")
      });
    });
});

// DELETE NON-EXISTING USER

describe('GIVEN there is no user in persistence', () => {
    let user
    let deleteResponse

    const balance = 100
    const expectedStatus = 404
  
    describe('WHEN I delete the user by id using DELETE', () => {
        
      beforeAll(async () => {
        user = await createUser('Sasha', balance)
        
        await deleteUser(user.id)

        deleteResponse = await deleteUser(user.id, expectedStatus)
      });
  
      it('THEN the user is not in persistence anymore', () => {
        expect(deleteResponse.message).toBe(`Cannot find User with id=${user.id}.`)
      });
    });
});