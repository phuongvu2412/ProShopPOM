import Page from "../common/page.js";

class LoginPage extends Page {
    get inputEmail() {
        return $("#email");
    }
    get inputPassword() {
        return $("#password");
    }
    get btnSubmit() {
        return $('button[type="submit"]');
    }

    async login(email, password) {
        await this.setInput(this.inputEmail, email);
        await this.setInput(this.inputPassword, password);
        await this.click(this.btnSubmit);
    }
}

export default new LoginPage();
