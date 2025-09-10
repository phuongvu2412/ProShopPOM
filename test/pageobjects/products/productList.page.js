import Page from "../common/page.js";

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

    async getCartIconText() {
        await this.cartIcon.waitForDisplayed({ timeout: 5000 });
        return this.cartIcon.getText();
    }
}

export default new ProductListPage();
