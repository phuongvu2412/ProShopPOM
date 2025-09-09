import Page from "../common/page.js";

class RegisterPage extends Page {
    get inputName() {
        return $("#name");
    }
    get inputEmail() {
        return $("#email");
    }
    get inputPassword() {
        return $("#password");
    }
    get inputConfirmPassword() {
        return $("#confirmPassword");
    }
    get btnSubmit() {
        return $('button[type="submit"]');
    }

    async register(name, email, password, confirmPassword = password) {
        await this.setInput(this.inputName, name);
        await this.setInput(this.inputEmail, email);
        await this.setInput(this.inputPassword, password);
        await this.setInput(this.inputConfirmPassword, confirmPassword);
        await this.click(this.btnSubmit);
    }
}
export default new RegisterPage();
