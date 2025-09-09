import Page from "../common/page.js";

class ProductListPage extends Page {
    get productTitles() {
        return $$(".product-title.card-title strong");
    }
    get productLinks() {
        return $$(".product-title.card-title a");
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

    async searchProduct(keyword) {
        await this.setInput(this.searchBox, keyword);
        await this.click(this.btnSearch);
    }
}

export default new ProductListPage();
