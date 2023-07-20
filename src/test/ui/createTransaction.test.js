const { CreateTransaction } = require("../../page-objects/createTransactionObject");

// VALID DATA

describe('GIVEN valid data for a transaction', () => {
  const amount = '1000';

  describe('WHEN I create a transaction', () => {
    let createTransactionPage
    beforeAll(async () => {
      createTransactionPage = new CreateTransaction(page)
      await createTransactionPage.visit()
      await createTransactionPage.createTransaction(amount)
    });

    it('THEN I can see the success message', async () => await createTransactionPage.assertSuccess());
  });
});

// INVALID DATA: amount = 0

describe('GIVEN invalid data for a transaction', () => {
    const amount = '';
  
    describe('WHEN I try to create a transaction', () => {
      let createTransactionPage
      beforeAll(async () => {
        createTransactionPage = new CreateTransaction(page)
        await createTransactionPage.visit()
        await createTransactionPage.createTransaction(amount)
      });
  
      it('THEN I can see the error message', async () => await createTransactionPage.assertError());
    });
});

// INVALID DATA: negative amount

describe('GIVEN negative amount for a transaction', () => {
  const amount = '-100';

  describe('WHEN I try to create a transaction', () => {
    let createTransactionPage
    beforeAll(async () => {
      createTransactionPage = new CreateTransaction(page)
      await createTransactionPage.visit()
      await createTransactionPage.createTransaction(amount)
    });

    it('THEN I can see the error message', async () => await createTransactionPage.assertError());
  });
});

// INVALID DATA: amount = string

describe('GIVEN non numeric amount', () => {
    const amount = 'string';
  
    describe("WHEN I try to insert the amount, it doens't write in the input AND amount is considered equal to zero", () => {
      let createTransactionPage
      beforeAll(async () => {
        createTransactionPage = new CreateTransaction(page)
        await createTransactionPage.visit()
        await createTransactionPage.createTransaction(amount)
      });
  
      it('THEN I can see the error message', async () => {
        await createTransactionPage.assertError()}
        );
    });
});

// BACK TO USERS

describe('GIVEN I navigate to /transfer/{senderId}', () => {
  
    describe("WHEN I click on the 'go back' button", () => {
      let createTransactionPage
      beforeAll(async () => {
        createTransactionPage = new CreateTransaction(page)
        await createTransactionPage.visit()
        await createTransactionPage.navigateBackToUsers()
      });
  
      it('THEN I navigate back to /users', async () => {
        await page.waitForNavigation({ waitUntil: 'networkidle0'})
        await expect(page.url()).toMatch('/users')
      })
    });
});

// EMPTY DATA

describe('GIVEN empty data for a transaction', () => {
  
    describe('WHEN I try to create a transaction', () => {
      let createTransactionPage
      beforeAll(async () => {
        createTransactionPage = new CreateTransaction(page)
        await createTransactionPage.visit()
        await createTransactionPage.submitEmptyTransaction()
      });
  
      it('THEN I can see the error message', async () => await createTransactionPage.assertError());
    });
});

