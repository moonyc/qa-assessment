
exports.TopUpBalance = class TopUpBalance {
    constructor(page) {
        this.page = page
        this.url = `http://localhost:8081/users/1`
        this.topupInput = page.locator('#topup')
        this.addBalanceButton = page.locator('#updateBalance')
        this.goBackButton = page.locator('#goBack')
    }

    async visit() {
        await this.page.goto(this.url)
    }

    async updateBalance(topup) {
        await this.topupInput.fill(topup)
        await this.addBalanceButton.click()
    }

    async submitEmptyTransaction() {
        await this.addBalanceButton.click()
    }

    async navigateBackToUsers() {
        await this.goBackButton.click()
    }

    async assertSuccess() {
        const isSuccessMessageVisible = await page.waitForSelector('text=The User was updated successfully!', { visible: true , timeout: 2000})
        expect(isSuccessMessageVisible).toBeTruthy();
    }

    async assertError() {
       const isFailureMessageVisible = await this.page.waitForSelector('text=AxiosError: Request failed with status code 400', { visible: true, timeout: 2000 })

       expect(isFailureMessageVisible).toBeTruthy()
    }
}