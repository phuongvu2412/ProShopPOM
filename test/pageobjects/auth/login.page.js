import Page from "../common/page.js";
import HeaderPage from "../common/header.page.js";

class LoginPage extends Page {
    get inputEmail() {
        return $("#email");
    }
    get inputPassword() {
        return $("#password");
    }

    async login(email, password) {
        await this.inputEmail.waitForDisplayed({ timeout: 10000 });
        await this.inputPassword.waitForDisplayed({ timeout: 10000 });

        await this.setInput(this.inputEmail, email);
        await this.setInput(this.inputPassword, password);

        await this.inputPassword.click();
        await browser.keys("Enter");

        await browser.waitUntil(async () => await HeaderPage.isLoggedIn(), {
            timeout: 10000,
            timeoutMsg: "User menu (#username) not visible after login",
        });
    }
    async loginfailed(email, password) {
        await this.setInput(this.inputEmail, email);
        await this.setInput(this.inputPassword, password);
        await this.inputPassword.click();
        await browser.keys("Enter");

        await browser.waitUntil(async () => !(await HeaderPage.isLoggedIn()), {
            timeout: 10000,
            timeoutMsg: "Login failed",
        });
    }
}
export default new LoginPage();
