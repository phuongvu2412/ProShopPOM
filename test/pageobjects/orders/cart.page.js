import Page from "../common/page.js";

class CartPage extends Page {
    get cartItems() {
        return $$(".list-group-item");
    }

    get quantitySelects() {
        return $$("select.form-control");
    }

    get deleteButtons() {
        return $$("button.btn.btn-light");
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
}

export default new CartPage();
