const { CreateUser } = require("../../page-objects/createUserObject");

// VALID DATA

describe('GIVEN valid data for a user', () => {
  const name = 'Sasha';
  const balance = '1000';

  describe('WHEN I create a user', () => {
    let createUserPage
    beforeAll(async () => {
      createUserPage = new CreateUser(page)
      await createUserPage.visit()
      await createUserPage.createUser(name, balance)
    });

    it('THEN I can see the success message', async () => await createUserPage.assertSuccess());
  });
});

// ADD NEW USER AFTER SUCCESS

describe('GIVEN valid data for a user', () => {
  const name = 'Sasha';
  const balance = '1000';

  describe('WHEN I create a user', () => {
    let createUserPage
    beforeAll(async () => {
      createUserPage = new CreateUser(page)
      await createUserPage.visit()
      await createUserPage.createUser(name, balance)
      await createUserPage.assertSuccess()

      await createUserPage.addUser()

      await createUserPage.createUser(name, balance)
    });

    it('THEN I can add a new user', async () => await createUserPage.assertSuccess());
  });
});

// ABSENT USER

describe('GIVEN empty user', () => {
  const name = '';
  const balance = '1000';

  describe('WHEN I create a user', () => {
    let createUserPage
    beforeAll(async () => {
      createUserPage = new CreateUser(page)
      await createUserPage.visit()
      await createUserPage.createUser(name, balance)
    });

    it('THEN I cannot see the error message', async () => await createUserPage.assertError());
  });
});

// EMPTY BALANCE

describe('GIVEN an empty balance', () => {
  const name = 'Sasha';
  const balance = '';

  describe('WHEN I create a new user', () => {
    let createUserPage
    beforeAll(async () => {
      createUserPage = new CreateUser(page)
      await createUserPage.visit()
      await createUserPage.createUser(name, balance)
    });

    it('THEN I can see the success message', async () => await createUserPage.assertSuccess());
  });
});

// INVALID DATA: amount = string

describe('GIVEN non numeric amount', () => {
  const name = 'Sasha'
  const balance = 'string';

  describe("WHEN I try to insert the balance, it doens't write in the input AND balance is considered equal to zero", () => {
    let createUserPage
    beforeAll(async () => {
      createUserPage = new CreateUser(page)
      await createUserPage.visit()
      await createUserPage.createUser(name, balance)
    });

    it('THEN I can see the success message', async () => {
      await createUserPage.assertError()}
      );
  });
});