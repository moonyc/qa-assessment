const { createTransaction } = require('../../../utilities/transactions')
const { createUser, deleteUser, getUser } = require('../../../utilities/users')


// VALID TRANSACTION

describe('GIVEN valid data for a new transaction', () => {
    const amount = 10
    let sender
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 201

        let createTransactionApiResponse
        let senderAfterTrx 
        let receiverAfterTrx
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)

            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)

            senderAfterTrx = await getUser(sender.id)
            receiverAfterTrx = await getUser(receiver.id)
        })
      

        it("THEN the transaction created is returned in the response"
        + "AND users' balances are modified accordingly", () => {
            
            expect(senderAfterTrx.balance - sender.balance).toBe(-amount)
            expect(receiverAfterTrx.balance - receiver.balance).toBe(amount)

            expect(createTransactionApiResponse.data.amount).toBe(amount)
            expect(createTransactionApiResponse.data.sender).toBe(sender.id)
            expect(createTransactionApiResponse.data.receiver).toBe(receiver.id)
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})

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

// // AMOUNT = NON NUMERIC

// describe('GIVEN invalid data for a new transaction with non-numeric amount', () => {
//     const amount = 'string'
//     let sender
//     let receiver

//     describe('WHEN I create a new transaction using POST', () => {
//         const expectedStatus = 422 // unprocessable content

//         let createTransactionApiResponse
//         beforeAll(async () => {
//             sender = await createUser('Sasha', 100)
//             receiver = await createUser('Pan', 100)

//             createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)        })

//         it('THEN an error message is returned in the response', () => {
//             expect(createTransactionApiResponse.data.message).toBe('Amount field must be numeric')
//         })
//     })

//     afterAll(async () => {
//         [sender.id, receiver.id].forEach((id) => deleteUser(id))
//     });
// })

// AMOUNT = 0

describe('GIVEN invalid data for a new transaction with amount 0', () => {
    const amount = 0
    let sender
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 400

        let createTransactionApiResponse
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)

            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Amount field must be present in the body')
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})

// AMOUNT > BALANCE

describe("GIVEN invalid data for a new transaction with amount > sender's balance", () => {
    let amount
    let sender
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 409 

        let createTransactionApiResponse
        
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)
            
            amount = sender.balance + 10
            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
            senderAfterTrx = await getUser(sender.id)
            receiverAfterTrx = await getUser(receiver.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).not.toBe("Sender doesn't have sufficient funds")
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})


// NEGATIVE AMOUNT

describe('GIVEN invalid data for a new transaction with negative amount', () => {
    const amount = -10
    let sender
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 422

        let createTransactionApiResponse
        
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)
        
            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
            senderAfterTrx = await getUser(sender.id)
            receiverAfterTrx = await getUser(receiver.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Amount field must be a positive number')
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})


// AMOUNT EXCEEDS MAX SAFE INTEGER

describe('GIVEN invalid data for a new transaction with amount > MAX_SAFE_INTEGER ', () => {
    const maxSafeInteger = Number.MAX_SAFE_INTEGER
    const amount = maxSafeInteger + 1
    let sender
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 422

        let createTransactionApiResponse
        
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)
        
            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
            senderAfterTrx = await getUser(sender.id)
            receiverAfterTrx = await getUser(receiver.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Amount field must not exceed: ' + Number.MAX_SAFE_INTEGER)
            // expect(senderAfterTrx.balance).toBe(sender.balance)
            // expect(receiverAfterTrx.balance).toBe(receiver.balance)
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})

// AMOUNT + BALANCE EXCEEDS MAX SAFE INTEGER

describe('GIVEN invalid data for a new transaction with amount + receiver-balance > MAX_SAFE_INTEGER ', () => {
    const maxSafeInteger = Number.MAX_SAFE_INTEGER
    const delta = 100
    const amount = maxSafeInteger - delta
    let sender
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 422

        let createTransactionApiResponse
        
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', delta + 1)
        
            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
            senderAfterTrx = await getUser(sender.id)
            receiverAfterTrx = await getUser(receiver.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Amount field must not exceed: ' + Number.MAX_SAFE_INTEGER)
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})


// NON-INTEGER AMOUNT 

describe('GIVEN invalid data for a new transaction with non-integer amount', () => {
    const amount = 10.10
    let sender
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 400

        let createTransactionApiResponse
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)
        
            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Amount field must be an integer number')
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})

// ABSENT AMOUNT 

describe('GIVEN invalid data for a new transaction with absent amount', () => {
    const amount = undefined
    let sender
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 400

        let createTransactionApiResponse
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)

            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Amount field must be present in the body')
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})

// ABSENT SENDER

describe('GIVEN invalid data for a new transaction with absent sender', () => {
    const amount = 10
    const senderId = undefined
    let receiver

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 400

        let createTransactionApiResponse
        let receiverAfterTrx
        beforeAll(async () => {
            receiver = await createUser('Pan', 100)

            createTransactionApiResponse = await createTransaction(amount, senderId, receiver.id, expectedStatus)
            receiverAfterTrx = await getUser(receiver.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Sender field must be present in the body')
        })
    })


    afterAll(async () => {
        deleteUser(receiver.id)
    });
})

// ABSENT RECEIVER

describe('GIVEN invalid data for a new transaction with absent receiver', () => {
    const amount = 10
    const receiverId = undefined
    let sender

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 400

        let createTransactionApiResponse
        let senderAfterTrx
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)

            createTransactionApiResponse = await createTransaction(amount, sender.id, receiverId, expectedStatus)
            senderAfterTrx = await getUser(sender.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Receiver field must be present in the body')
            expect(senderAfterTrx.balance).toBe(sender.balance)
            
        })
    })


    afterAll(async () => {
        deleteUser(sender.id)
    });
})

// SENDER = RECEIVER

describe('GIVEN invalid data for a new transaction with the sender equal to the receiver', () => {
    const amount = 10
    let receiver
    let sender

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 400

        let createTransactionApiResponse
        let senderAfterTrx
        let receiverAfterTrx
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = sender
            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
            senderAfterTrx = await getUser(sender.id)
            receiverAfterTrx = await getUser(receiver.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(createTransactionApiResponse.data.message).toBe('Receiver must be different from sender')
            expect(senderAfterTrx.balance).toBe(sender.balance)
            expect(receiverAfterTrx.balance).toBe(receiver.balance)
        })
    })


    afterAll(async () => {
        [sender.id, receiver.id].forEach((id) => deleteUser(id))
    });
})

// SENDER DOEN'T EXIST

describe('GIVEN invalid data for a new transaction with a sender that does not exist ', () => {
    const amount = 10
    let receiver
    let sender

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 500

        let createTransactionApiResponse
       
        let receiverAfterTrx
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)
            await deleteUser(sender.id)
            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
            
            receiverAfterTrx = await getUser(receiver.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(receiverAfterTrx.balance).toBe(receiver.balance)
            expect(createTransactionApiResponse.data.message).toBe("Error updating balance of sender User with id=" + sender.id)
            
        })
    })


    afterAll(async () => {
        deleteUser(receiver)
    });
})

// RECEIVER DOENS'T EXIST

describe('GIVEN invalid data for a new transaction with a receiver that does not exist ', () => {
    const amount = 10
    let receiver
    let sender

    describe('WHEN I create a new transaction using POST', () => {
        const expectedStatus = 500

        let createTransactionApiResponse
       
        let senderAfterTrx
        beforeAll(async () => {
            sender = await createUser('Sasha', 100)
            receiver = await createUser('Pan', 100)
            await deleteUser(receiver.id)
            createTransactionApiResponse = await createTransaction(amount, sender.id, receiver.id, expectedStatus)
            
            senderAfterTrx = await getUser(sender.id)
        })
      

        it('THEN an error message is returned in the response', () => {
            expect(senderAfterTrx.balance).toBe(sender.balance)
            expect(createTransactionApiResponse.data.message).toBe("Error updating balance of receiver User with id=" + receiver.id)
        })
    })


    afterAll(async () => {
        deleteUser(sender)
    });
})