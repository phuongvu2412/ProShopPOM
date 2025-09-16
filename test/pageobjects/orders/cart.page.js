import Page from "../common/page.js";

class CartPage extends Page {
    get cartheadingText() {
        return $("h1=Shopping Cart");
    }
    get cartItems() {
        return $$(".list-group-item .row");
    }
    get quantitySelects() {
        return $$("select.form-control");
    }
    get deleteButtons() {
        return $$("button.btn-light");
    }
    get subtotalText() {
        return $("h2*=Subtotal");
    }
    get btnProceedToCheckout() {
        return $(".btn-block.btn.btn-primary");
    }
    get emptyCartMessage() {
        return $("div.alert-info=Your cart is empty");
    }
    async proceedToCheckout() {
        await this.click(this.btnProceedToCheckout);
    }
    async getSubtotal() {
        return await this.getText(this.subtotalText);
    }
    async isCartEmpty() {
        if (await this.emptyCartMessage.isDisplayed()) {
            return true;
        }
        const items = await this.cartItems;
        return items.length === 0;
    }
}

export default new CartPage();
