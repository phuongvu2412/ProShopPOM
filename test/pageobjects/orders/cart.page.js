import Page from "../common/page.js";

class CartPage extends Page {
    get cartItems() {
        return $$(".list-group-item");
    }

    get quantitySelects() {
        return $$("select.form-control");
    }

    get deleteButtons() {
        return $$("button=Remove");
    }

    get subtotalText() {
        return $("h2*=Subtotal");
    }

    get btnProceedToCheckout() {
        return $(".btn-block.btn.btn-primary");
    }

    get searchInput() {
        return $("input[name='q']");
    }

    get btnSearch() {
        return $("button.btn-outline-success");
    }

    get emptyCartMessage() {
        return $("div.alert-info=Your cart is empty");
    }

    async proceedToCheckout() {
        await this.click(this.btnProceedToCheckout);
    }

    async searchProduct(keyword) {
        await this.setInput(this.searchInput, keyword);
        await this.click(this.btnSearch);
    }

    async getSubtotal() {
        return await this.getText(this.subtotalText);
    }

    async clearCart() {
        while ((await this.deleteButtons).length > 0) {
            const btns = await this.deleteButtons;
            await btns[0].click();
            await browser.pause(500); 
        }
    }

    async isCartEmpty() {
        return await this.emptyCartMessage.isDisplayed();
    }
}

export default new CartPage();
