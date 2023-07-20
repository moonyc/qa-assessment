

exports.CreateUser = class CreateUser {
    constructor(page) {
        this.page = page
        this.url = 'http://localhost:8081/create'
        this.nameInput = page.locator('#name')
        this.amountInput = page.locator('#balance')
        this.submitButton = page.locator('#createUser')
        this.addButton = page.locator('#newUser')
    }

    async visit() {
        await this.page.goto(this.url)
    }

    async createUser(name, amount) {
        await this.nameInput.fill(name)
        await this.amountInput.fill(amount)
        await this.submitButton.click()
    }

    async addUser() {
        await this.addButton.click()
    }

    async assertSuccess() {
        const isSuccessMessageVisible = await page.waitForSelector('#successMessage', { visible: true });
        expect(isSuccessMessageVisible).toBeTruthy();
    }

    async assertError() {
       const isMessageAbsent = this.page.evaluate(() => {
        return document.querySelector('#successMessage') == null
       })

       expect(isMessageAbsent).toBeTruthy()
    }
}
