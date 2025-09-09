import Page from "./page.js";

class HeaderPage extends Page {
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

export default new HeaderPage();
