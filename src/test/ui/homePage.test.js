const { HomePage } = require("../../page-objects/usersObject");
const { getTransactionsByUserId } = require("../../utilities/transactions");
const { getUser } = require("../../utilities/users")

// INITIALIZATION

describe('GIVEN the default route', () => {

  describe('WHEN I open the application', () => {
    let homePage

    beforeAll(async () => {
      homePage = new HomePage(page)
      await homePage.visit()
      
    });

    it('THEN I expect to see a list of users AND a message', async () => await homePage.assertInitialPageLoadSuccess());
  });
});


// DISPLAY USER DETAIL

describe('GIVEN the list of users is visible', () => {

    describe('WHEN I click on a user', () => {
      let homePage
      let fetchedUser
      beforeAll(async () => {
        homePage = new HomePage(page)
        await homePage.visit()
        await homePage.openUserDetail()
        fetchedUser = await getUser(1)
        fetchedTransactions = await getTransactionsByUserId(1)
      });
  
      it("THEN I expect to see the user's detail", async () => {
        await homePage.assertUserDetailsLoadSuccess()
        await homePage.assertUserDetailsCorrectness(fetchedUser.name, fetchedUser.balance, fetchedTransactions.length)
      });
    });
  });

  // NAVIGATE TO USERS/{ID}

describe('GIVEN I want to top up the user balance', () => {

  describe("WHEN I click on the 'add Balance' button", () => {
    let homePage
    beforeAll(async () => {
      homePage = new HomePage(page)
      await homePage.visit()
      await homePage.openUserDetail()
      await homePage.navigateToUserId()
    });

    it('THEN I navigate to users/id', async () => {
      await page.waitForNavigation({ waitUntil: 'networkidle0'})
      await expect(page.url()).toMatch('/users/1')
    })
  });
});

// NAVIGATE TO TRANSFER/{ID}

describe('GIVEN I want to make a transaction', () => {

  describe("WHEN I click on the 'make transaction' button", () => {
    let homePage
    beforeAll(async () => {
      homePage = new HomePage(page)
      await homePage.visit()
      await homePage.openUserDetail()
      await homePage.navigateToTransfer()
    });

    it('THEN I navigate back to /users', async () => {
      await page.waitForNavigation({ waitUntil: 'networkidle0'})
      await expect(page.url()).toMatch('/transfer/1')
    })
  });
});
