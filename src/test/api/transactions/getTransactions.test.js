const { containsAll } = require('../../../utilities/common');
const { createTransaction, getTransactions, getTransactionsByUserId } = require('../../../utilities/transactions');
const { createUser, deleteUser } = require('../../../utilities/users')


// SORT

function isSorted(transactions) {        
  for (let i = 0; i < transactions.length - 1; i++) {
      if (transactions[i].createdAt < transactions[i + 1].createdAt) {
          return false
      }
  }

  return true
}

// LIST ALL TRANSACTIONS

describe('GIVEN there are transactions in persistence', () => {
    let firstTransaction
    let secondTransaction
    let thirdTransaction
    let sender
    let receiver
    let transactions
  
    describe('WHEN I request all transactions using GET', () => {
      const amount = 10
    
      beforeAll(async () => {
        sender = await createUser('Sasha', 100)
        receiver = await createUser('Pan', 100)

        firstTransaction = await createTransaction(amount, sender.id, receiver.id)
        secondTransaction = await createTransaction(amount, sender.id, receiver.id)
        thirdTransaction = await createTransaction(amount, sender.id, receiver.id)

        transactions = await getTransactions()
      });
  
      it('THEN at least 3 transactions are returned AND transactions are sorted in descending order by createdAt', () => {
        expect(transactions.length >= 3).toBe(true)
        const createdTransactions = [ firstTransaction, secondTransaction, thirdTransaction].map(transaction => transaction.data)
        expect(containsAll(transactions, createdTransactions)).toBe(true)
      });
    });
  
    afterAll(async () => {
      deleteUser(sender.id)
      deleteUser(receiver.id)
    });
});

// LIST TRANSACTIONS BY USER ID

describe('GIVEN there are transactions for a user in persistence', () => {
  let firstTransaction
  let secondTransaction
  let thirdTransaction
  let sender
  let receiver
  let user
  let transactions

  describe("WHEN I request a user's transactions using  GET", () => {
    const amount = 10
  
    beforeAll(async () => {
      sender = await createUser('Sasha', 100)
      receiver = await createUser('Pan', 100)
      user = await createUser('User', 100)

      firstTransaction = await createTransaction(amount, user.id, receiver.id)
      secondTransaction = await createTransaction(amount, sender.id, user.id)
      thirdTransaction = await createTransaction(amount, user.id, receiver.id)
      await createTransaction(amount, sender.id, receiver.id)

      transactions = await getTransactionsByUserId(user.id)
    });

    it('THEN exactly 3 transactions are returned AND transactions are sorted in descending order by createdAt', () => {

      const stranger = transactions.some(
        trx => trx.sender !== user.id && trx.receiver !== user.id
      )

      expect(stranger).toBe(false)
      expect(isSorted(transactions)).toBe(true)
      expect(transactions.length).toBe(3)
      const createdTransactions = [ firstTransaction, secondTransaction, thirdTransaction].map(transaction => transaction.data)
      expect(containsAll(transactions, createdTransactions)).toBe(true)
    })
      
  });

  afterAll(async () => {
    deleteUser(sender.id)
    deleteUser(receiver.id)
    deleteUser(user.id)
  });
});


// NO TRANSACTIONS 

describe('GIVEN there are no transactions for a user in persistence', () => {
  let sender
  let receiver
  let user
  let transactions

  describe("WHEN I request a user's transactions using  GET", () => {
    const amount = 10
  
    beforeAll(async () => {
      sender = await createUser('Sasha', 100)
      receiver = await createUser('Pan', 100)
      user = await createUser('User', 100)

      
      await createTransaction(amount, sender.id, receiver.id)

      transactions = await getTransactionsByUserId(user.id)
    });

    it('THEN no transactions are returned', () => {
      expect(transactions.length).toBe(0)
    })
      
  });

  afterAll(async () => {
    deleteUser(sender.id)
    deleteUser(receiver.id)
    deleteUser(user.id)
  });
});

// NON-EXISTING USER

describe('GIVEN there are transactions for a user in persistence', () => {
  let firstTransaction
  let secondTransaction
  let thirdTransaction
  let sender
  let receiver
  let user
  let transactions

  describe("WHEN I delete the user AND request the user's transactions using  GET", () => {
    const amount = 10
  
    beforeAll(async () => {
      sender = await createUser('Sasha', 100)
      receiver = await createUser('Pan', 100)
      user = await createUser('User', 100)

      firstTransaction = await createTransaction(amount, user.id, receiver.id)
      secondTransaction = await createTransaction(amount, sender.id, user.id)
      thirdTransaction = await createTransaction(amount, user.id, receiver.id)
      await createTransaction(amount, sender.id, receiver.id)

      await deleteUser(user.id)

      transactions = await getTransactionsByUserId(user.id)
    });

    it('THEN exactly 3 transactions are returned AND transactions are sorted in descending order by createdAt', () => {

      const stranger = transactions.some(
        trx => trx.sender !== user.id && trx.receiver !== user.id
      )

      expect(stranger).toBe(false)
      expect(isSorted(transactions)).toBe(true)
      expect(transactions.length).toBe(3)
      const createdTransactions = [ firstTransaction, secondTransaction, thirdTransaction ].map(transaction => transaction.data)
      expect(containsAll(transactions, createdTransactions)).toBe(true)
    })
      
  });

  afterAll(async () => {
    deleteUser(sender.id)
    deleteUser(receiver.id)
  });
});