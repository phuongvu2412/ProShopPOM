import Page from "./page.js";

class HeaderPage extends Page {
    get userMenu() {
        return $('#username');  
    }
    get logoutLink() {
        return $('a.dropdown-item=Logout');
    }
    get loginLink() {
        return $('a=Sign In');
    }

    async logout() {
        await this.userMenu.waitForDisplayed({ timeout: 5000 });
        await this.userMenu.click();
        await this.logoutLink.waitForDisplayed({ timeout: 5000 });
        await this.logoutLink.click();
    }

    async isLoggedIn() {
        return this.isDisplayed(this.userMenu);  // chỉ cần check #username
    }

    async isLoggedOut() {
        return this.isDisplayed(this.loginLink);
    }
}

export default new HeaderPage();
