import Page from "../common/page.js";

class OrdersSummaryPage extends Page {
    get heading() {
        return $("h1*=Order");
    }
    get paidAlert() {
        return $("div.alert-success*=Paid on");
    }
    get notPaidAlert() {
        return $("div.alert-danger*=Not Paid");
    }

    get deliveredAlert() {
        return $("div.alert-success*=Delivered on");
    }
    get notDeliveredAlert() {
        return $("div.alert-danger*=Not Delivered");
    }

    get btnMarkAsDelivered() {
        return $("button=Mark As Delivered");
    }

    async isPaid() {
        return await this.paidAlert.isDisplayed();
    }
    async isNotPaid() {
        return await this.notPaidAlert.isDisplayed();
    }

    async isDelivered() {
        return await this.deliveredAlert.isDisplayed();
    }
    async isNotDelivered() {
        return await this.notDeliveredAlert.isDisplayed();
    }

    async getPaidText() {
        if (await this.paidAlert.isDisplayed()) {
            return this.paidAlert.getText(); // "Paid on ..."
        } else {
            return this.notPaidAlert.getText(); // "Not Paid"
        }
    }

    async getDeliveredText() {
        if (await this.deliveredAlert.isDisplayed()) {
            return this.deliveredAlert.getText(); // "Delivered on ..."
        } else {
            return this.notDeliveredAlert.getText(); // "Not Delivered"
        }
    }

    async hasMarkDeliveredBtn() {
        return await this.btnMarkAsDelivered.isExisting();
    }

    async clickMarkAsDelivered() {
        await this.btnMarkAsDelivered.waitForClickable({ timeout: 5000 });
        await this.btnMarkAsDelivered.click();

        const confirmYes = await $("button=Yes");
        if (await confirmYes.isExisting()) {
            await confirmYes.click();
        }
    }
}

export default new OrdersSummaryPage();
