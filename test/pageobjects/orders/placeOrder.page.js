import Page from "../common/page.js";

class PlaceOrderPage extends Page {
    get heading() {
        return $("h2=Order Summary");
    }

    get orderItems() {
        return $$(".list-group-item");
    }
    get btnPlaceOrder() {return $("button=Place Order");}
    async getOrderSummary() {
        const items = await this.orderItems.map(
            async (el) => await el.getText()
        );
        return Promise.all(items);
    }

    async placeOrder() {
        await this.btnPlaceOrder.waitForClickable();
        await this.btnPlaceOrder.click();
    }
}

export default new PlaceOrderPage();
