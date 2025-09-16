import Page from "./page.js";
import LoginPage from "../auth/login.page.js";

class HeaderPage extends Page {
    get userMenu() {
        return $("#username");
    }
    get logoutLink() {
        return $("a.dropdown-item=Logout");
    }
    get loginLink() {
        return $("a=Sign In");
    }
    get cartLink() {
        return $('a[href="/cart"]');
    }
    get searchInput() {
        return $("input[name='q']");
    }
    get btnSearch() {
        return $("button.btn-outline-success");
    }
    get Navbar() {
        return $("a[href='#']");
    }
    async openCart() {
        await this.cartLink.waitForClickable({ timeout: 5000 });
        await this.cartLink.click();
    }
    async login(email, password) {
        await LoginPage.open("/login");
        await LoginPage.login(email, password);
        await browser.waitUntil(async () => await this.isLoggedIn(), {
            timeout: 10000,
            timeoutMsg: "Login did not succeed",
        });
    }
    async logout() {
        await this.userMenu.waitForDisplayed({ timeout: 5000 });
        await this.userMenu.click();
        await this.logoutLink.waitForDisplayed({ timeout: 5000 });
        await this.logoutLink.click();
    }
    async isLoggedIn() {
        return this.isDisplayed(this.userMenu);
    }
    async isLoggedOut() {
        return this.isDisplayed(this.loginLink);
    }

    async logout1() {
        await $("#username").click();
        await $("=Logout").click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/login"),
            {
                timeout: 5000,
                timeoutMsg: "Expected to be on login page after logout",
            }
        );
    }
}

export default new HeaderPage();
