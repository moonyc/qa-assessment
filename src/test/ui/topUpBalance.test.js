const { TopUpBalance } = require("../../page-objects/topUpBalanceObject");

// VALID DATA

describe('GIVEN valid data for a topup', () => {
  const topup= '1000';

  describe('WHEN I fill in amount', () => {
    let topupBalancePage
    beforeAll(async () => {
      topupBalancePage = new TopUpBalance(page)
      await topupBalancePage.visit()
      await topupBalancePage.updateBalance(topup)
    });

    it('THEN I can see the success message', async () => await topupBalancePage.assertSuccess());
  });
});


// INVALID DATA

describe('GIVEN an empty topup', () => {
  const topup= '';

  describe('WHEN I fill in amount', () => {
    let topupBalancePage
    beforeAll(async () => {
      topupBalancePage = new TopUpBalance(page)
      await topupBalancePage.visit()
      await topupBalancePage.updateBalance(topup)
    });

    it('THEN I can see the success message', async () => await topupBalancePage.assertError());
  });
});

// INVALID DATA: top up = string

describe('GIVEN non numeric amount', () => {
  const topup = 'string';

  describe("WHEN I try to insert the amount, it doens't write in the input AND topup is considered equal to zero", () => {
    let topupBalancePage
    beforeAll(async () => {
      topupBalancePage = new TopUpBalance(page)
      await topupBalancePage.visit()
      await topupBalancePage.updateBalance(topup)
    });

    it('THEN I can see the error message', async () => {
      await topupBalancePage.assertError()}
      );
  });
});

// BACK TO USERS

describe('GIVEN I navigate to /users/{id}', () => {
    const amount = '';
  
    describe("WHEN I click on the 'go back' button", () => {
      let topupBalancePage
      beforeAll(async () => {
        topupBalancePage = new TopUpBalance(page)
        await topupBalancePage.visit()
        await topupBalancePage.navigateBackToUsers()
      });
  
      it('THEN I navigate back to /users', async () => {
        await page.waitForNavigation({ waitUntil: 'networkidle0'})
        await expect(page.url()).toMatch('/users')
      })
    });
});
