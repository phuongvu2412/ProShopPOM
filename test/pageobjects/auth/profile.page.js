import Page from "../common/page.js";

class ProfilePage extends Page {
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
    get btnUpdate() {
        return $('button[type="submit"]');
    }

    async updateProfile(name, email) {
        if (name) {
            await this.setInput(this.inputName, name);
        }
        if (email) {
            await this.setInput(this.inputEmail, email);
        }
        await this.click(this.btnUpdate);
    }

    async changePassword(password, confirmPassword) {
        await this.setInput(this.inputPassword, password);
        await this.setInput(this.inputConfirmPassword, confirmPassword);
        await this.click(this.btnUpdate);
    }
}

export default new ProfilePage();
