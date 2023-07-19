

exports.CreateTransaction = class CreateTransaction {
    constructor(page) {
        this.page = page
        this.url = `http://localhost:8081/transfer/1`
        this.amountInput = page.locator('#amount')
        this.receiverSelect = page.locator('#receiver')
        this.receiverOption = page.locator('#receiver-1')
        this.makeTransactionButton = page.locator('#createTransaction')
        this.goBackButton = page.locator('#goBack')
    }

    async visit() {
        await this.page.goto(this.url)
    }

    async createTransaction(amount) {
        await this.receiverSelect.click()
        this.page.evaluate(() => {
            document.querySelector('#receiver-1').selected = true
        })
        await this.amountInput.fill(amount)
        await this.makeTransactionButton.click()
    }

    async submitEmptyTransaction() {
        await this.makeTransactionButton.click()
    }

    async navigateBackToUsers() {
        await this.goBackButton.click()
    }

    async assertSuccess() {
        const isSuccessMessageVisible = await this.page.waitForSelector('#message', { visible: true });
        expect(isSuccessMessageVisible).toBeTruthy();
    }

    async assertError() {
       const isFailureMessageVisible = await this.page.waitForSelector('text=AxiosError: Request failed with status code 400', { visible: true })

       expect(isFailureMessageVisible).toBeTruthy()
    }
}
