exports.HomePage = class HomePage {
    constructor(page) {
        this.page = page
        this.url = 'http://localhost:8081/users'
        this.userList = page.locator('#userList')
        this.infoMessage = page.locator('#infoMessage')
        this.listItem = page.locator(`#user-1`)
        this.addBalanceButton = page.locator('#addBalance')
        this.makeTransactionButton = page.locator('#makeTransaction')
        this.name = page.locator('#name')
        this.balance = page.locator('#balance')
        this.transactionList = page.locator('#transactionList')
        this.transactionItems = page.locator('id^=transaction-')

    }

    getListItemLocator(index) {
        page.locator(`#user-${index}`)
    }

    async visit() {
        await this.page.goto(this.url)
    }

    async navigateToUserId() {
        await this.addBalanceButton.click()
    }

    async navigateToTransfer() {
       await this.makeTransactionButton.click()
    }

    async openUserDetail() {
       await this.listItem.click()
    }


    async assertInitialPageLoadSuccess() {
        const isListVisible  = await this.page.waitForSelector('#userList', { visible: true, timeout: 2000 });
        const isInfoMessageVisible = await this.page.waitForSelector('#infoMessage', { visible: true, timeout: 2000 });
        expect(isListVisible).toBeTruthy()
        expect(isInfoMessageVisible).toBeTruthy()
    }
    
    async assertUserDetailsLoadSuccess() {
        const isAddBalanceButtonVisible  = await this.page.waitForSelector('#addBalance', { visible: true, timeout: 2000 });
        const isMakeTransactionButtonVisible = await this.page.waitForSelector('#makeTransaction', { visible: true, timeout: 2000 });
        const isTransactionListVisible = await this.page.waitForSelector('#transactionList', { visible: true, timeout: 2000 });
        
        expect(isAddBalanceButtonVisible).toBeTruthy()
        expect(isMakeTransactionButtonVisible).toBeTruthy()
        expect(isTransactionListVisible).toBeTruthy()
    }

    async assertUserDetailsCorrectness(expectedName, expectedBalance, expectedTransactionsCount) {
        
        const name = await this.page.evaluate(() => {
            const name =  document.querySelector('#name').innerText
            return name
        })

        const balance = await this.page.evaluate(() => {
            const balance =  document.querySelector('#balance').innerText.slice(0, -1)
            return +balance
        })

        const transactionsCount = await this.page.evaluate(() => {
            const transactionsCount = document.querySelectorAll('#transactionList > li').length
            return transactionsCount
        })

        expect(name).toBe(expectedName)
        expect(balance).toBe(expectedBalance)
        expect(transactionsCount).toBe(expectedTransactionsCount)
    }

}
