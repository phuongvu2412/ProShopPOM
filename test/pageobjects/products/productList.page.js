import Page from "../common/page.js";
import ProductDetailsPage from "./productDetails.page.js";
class ProductListPage extends Page {
    get productTitles() {
        return $$(".product-title.card-title strong");
    }
    get productLinks() {
        return $$(".card a");
    }
    get productPrices() {
        return $$("h3.card-text");
    }
    get searchBox() {
        return $("input[name='q'][placeholder='Search Products...']");
    }
    get btnSearch() {
        return $("button[type='submit']");
    }
    get cartIcon() {
        return $('a[href="/cart"]');
    }
    get cartBadge() {
        return $("span.badge.rounded-pill.bg-success");
    }

    async isLoaded() {
        await this.searchBox.waitForDisplayed({ timeout: 5000 });
    }

    async searchProduct(keyword) {
        await this.setInput(this.searchBox, keyword);
        await this.click(this.btnSearch);
    }

    async openFirstProduct() {
        await browser.waitUntil(
            async () => (await this.productLinks.length) > 0,
            {
                timeout: 10000,
                timeoutMsg: "No products found on the product list page",
            }
        );
        const firstProduct = this.productLinks[0];
        await firstProduct.scrollIntoView();
        await firstProduct.waitForClickable({ timeout: 5000 });
        await firstProduct.click();
    }
    async addFirstProductToCart(quantity = 1) {
        await this.openFirstProduct();
        await ProductDetailsPage.selectQuantity(quantity);
        await ProductDetailsPage.addToCart();
    }

    async openProductByIndex(index) {
        await browser.waitUntil(
            async () => (await this.productLinks.length) > index,
            {
                timeout: 10000,
                timeoutMsg: `No product found at index ${index}`,
            }
        );
        const product = this.productLinks[index];
        await product.scrollIntoView();
        await product.waitForClickable({ timeout: 5000 });
        await product.click();
    }
    async addProductByIndex(index, quantity = 1) {
        await this.openProductByIndex(index);
        await ProductDetailsPage.selectQuantity(quantity);
        await ProductDetailsPage.addToCart();
    }
    async getCartIconText() {
        await this.cartIcon.waitForDisplayed({ timeout: 5000 });
        return this.cartIcon.getText();
    }
    async getCartCount() {
        const text = await this.cartIcon.getText();
        return parseInt(text.replace(/\D/g, ""), 10) || 0;
    }

    async hasCartBadge() {
        return await this.cartBadge.isExisting();
    }
}

export default new ProductListPage();
