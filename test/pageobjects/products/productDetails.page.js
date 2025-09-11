import Page from "../common/page.js";

class ProductDetailsPage extends Page {
    get productTitle() {
        return $("h3");
    }
    get productDescription() {
        return $("div.list-group-item*=Description");
    }
    get productPrice() {
        return $("div.list-group-item*=Price");
    }
    get quantitySelect() {
        return $("select.form-control");
    }
    get btnAddToCart() {
        return $("button.btn-block.btn.btn-primary");
    }
    get ratingSelect() {
        return $("#rating.form-control");
    }
    get commentBox() {
        return $("#comment.form-control");
    }
    get btnSubmitReview() {
        return $("button.btn.btn-primary[type='submit']");
    }
    async selectQuantity(qty) {
        await this.quantitySelect.waitForDisplayed({ timeout: 5000 });
        await this.quantitySelect.selectByAttribute("value", qty.toString());
    }
    async addToCart() {
        await this.click(this.btnAddToCart);
    }
    async submitReview(rating, comment) {
        await this.ratingSelect.waitForDisplayed({ timeout: 5000 });
        await this.ratingSelect.selectByAttribute("value", rating.toString());
        await this.setInput(this.commentBox, comment);
        await this.click(this.btnSubmitReview);
    }
}

export default new ProductDetailsPage();
