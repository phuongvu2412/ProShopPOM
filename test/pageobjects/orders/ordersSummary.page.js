import Page from "../common/page.js";

class OrdersSummaryPage extends Page {
    get heading() {
        return $("h1*=Order");
    }
    get heading2() {
        return $("h2=Order Summary");
    }

    get itemsRow() {
        return $("div.list-group-item*=Items");
    }
    get shippingRow() {
        return $("div.list-group-item*=Shipping");
    }
    get taxRow() {
        return $("div.list-group-item*=Tax");
    }
    get totalRow() {
        return $("div.list-group-item*=Total");
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

    async getItemsValue() {
        return (await this.itemsRow.getText()).replace("Items", "").trim();
    }
    async getShippingValue() {
        return (await this.shippingRow.getText())
            .replace("Shipping", "")
            .trim();
    }
    async getTaxValue() {
        return (await this.taxRow.getText()).replace("Tax", "").trim();
    }
    async getTotalValue() {
        return (await this.totalRow.getText()).replace("Total", "").trim();
    }

    async getAllSummary() {
        return {
            items: await this.getItemsValue(),
            shipping: await this.getShippingValue(),
            tax: await this.getTaxValue(),
            total: await this.getTotalValue(),
        };
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
}

export default new OrdersSummaryPage();
