import Page from "../common/page.js";

class PaymentPage extends Page {
    get heading() {
        return $("h1=Payment Method");
    }

    get paypalDiv() {
        return $(".paypal-button.paypal-button-number-0");
    }

    get btnContinue() {
        return $("button[type='submit'].btn.btn-primary");
    }

    get inputEmail() {
        return $("#email");
    }

    get inputPassword() {
        return $("#password");
    }

    get btnLogin() {
        return $("#btnLogin");
    }

    get inputPaypalEmail() {
        return $('input[placeholder="Email or mobile number"]');
    }

    get btnNextPaypal() {
        return $("button=Next");
    }

    get inputPaypalPassword() {
        return $('input[placeholder="Password"]');
    }

    get btnLoginPaypal() {
        return $("button=Log In");
    }

    get btnCompletePaypal() {
        return $("button=Complete Purchase");
    }
    get radioPaypal() {
        return $("#PayPal");
    }

    async selectPaypal() {
        await this.paypalDiv.waitForExist({ timeout: 10000 });
        console.log("PayPal div exists:", this.paypalDiv);
        await this.paypalDiv.waitForClickable({ timeout: 10000 });
        await this.paypalDiv.click();
    }

    async continue() {
        await this.btnContinue.waitForClickable();
        await this.btnContinue.click();
    }

    async openOrderDetails() {
        // Wait for the url to change to the order/:id page
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/order/"),
            {
                timeout: 5000,
                timeoutMsg: "Expected to be on order details page after 5s",
            }
        );
        const orderUrl = await browser.getUrl();
        console.log("Order URL:", orderUrl);
    }

    async switchToPaypalFrame() {
        await browser.switchFrame("https://www.sandbox.paypal.com/");
        const paypalButton = await $('div[aria-label="PayPal"][role="link"]');
        await paypalButton.waitForExist({ timeout: 20000 });
        await paypalButton.waitForClickable({ timeout: 20000 });
        await paypalButton.click();

        // Expect a new window to open
        await browser.pause(5000);
        const windows = await browser.getWindowHandles();
        console.log("Windows:", windows);
        if (windows.length < 2) {
            throw new Error("PayPal window did not open");
        }
        // Switch to the PayPal window
        await browser.switchToWindow(windows[1]);
    }

    async switchToOriginalWindow() {
        const windows = await browser.getWindowHandles();
        await browser.switchToWindow(windows[0]);
    }

    async backtoOrderDetails() {
        const orderUrl = await browser.getUrl();
        await browser.waitUntil(
            async () => (await browser.getUrl()) === orderUrl,
            {
                timeout: 10000,
                timeoutMsg:
                    "Expected to be back on order details page after PayPal payment",
            }
        );
        const finalUrl = await browser.getUrl();
        console.log("Final URL:", finalUrl);
        await expect(finalUrl).toBe(orderUrl);
    }

    async fillPaypalEmail(email, password) {
        await this.inputPaypalEmail.waitForDisplayed({ timeout: 10000 });
        await this.inputPaypalEmail.setValue(email);
    }

    async clickNextPaypal() {
        await this.btnNextPaypal.waitForClickable({ timeout: 10000 });
        await this.btnNextPaypal.click();
    }

    async fillPaypalPassword(password) {
        await this.inputPaypalPassword.waitForDisplayed({ timeout: 10000 });
        await this.inputPaypalPassword.setValue(password);
    }

    async clickLoginPaypal() {
        await this.btnLoginPaypal.waitForClickable({ timeout: 10000 });
        await this.btnLoginPaypal.click();
    }

    async clickCompletePaypal() {
        await this.btnCompletePaypal.waitForClickable({ timeout: 10000 });
        await this.btnCompletePaypal.click();
    }
}

export default new PaymentPage();
