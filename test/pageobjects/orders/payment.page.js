import Page from "../common/page.js";

class PaymentPage extends Page {
    get heading() {
        return $("h1=Payment Method");
    }
    get radioPaypal() {
        return $("#PayPal");
    }
    get labelPaypal() {
        return $("label[for='PayPal']");
    }
    get btnContinue() {
        return $("button[type='submit'].btn.btn-primary");
    }
    async selectPaypal() {
        await this.radioPaypal.waitForClickable();
        await this.radioPaypal.click();
    }
    async continue() {
        await this.btnContinue.waitForClickable();
        await this.btnContinue.click();
    }
    async completePayment() {
        await this.selectPaypal();
        await this.continue();
    }
}

export default new PaymentPage();
