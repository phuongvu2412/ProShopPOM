import Page from "../common/page.js";

class OrderDetailsPage extends Page {
    get paypalButton() {
        return $(".paypal-button[data-funding-source='paypal']");
    }

    get creditCardButton() {
        return $(".paypal-button[data-funding-source='card']");
    }

    get notPaidAlert() {
        return $("div.alert-danger*=Not Paid");
    }

    get paidAlert() {
        return $("div.alert-success*=Paid");
    }

    async clickPaypal() {
        await this.paypalButton.waitForClickable();
        await this.paypalButton.click();
    }

    async clickCreditCard() {
        await this.creditCardButton.waitForClickable();
        await this.creditCardButton.click();
    }

    async isOrderPaid() {
        return this.paidAlert.isDisplayed();
    }

    async isOrderNotPaid() {
        return this.notPaidAlert.isDisplayed();
    }
}

export default new OrderDetailsPage();
