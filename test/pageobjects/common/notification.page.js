import Page from "./page.js";

class NotificationPage extends Page {
    get toastContainer() {
        return $("div.Toastify__toast-container");
    }
    get toastBody() {
        return $(".Toastify__toast-body");
    }
    get successToast() {
        return $("div.Toastify__toast--success");
    }
    get errorToast() {
        return $("div.Toastify__toast--error");
    }

    get infoToast() {
        return $("div.Toastify__toast--info");
    }

    get warningToast() {
        return $("div.Toastify__toast--warning");
    }

    async getToastMessage() {
        await this.toastContainer.waitForDisplayed({ timeout: 5000 });
        return this.toastContainer.getText();
    }

    async hasSuccessMessage(text) {
        await this.successToast.waitForDisplayed({ timeout: 5000 });
        const msg = await this.successToast.getText();
        return msg.includes(text);
    }

    async hasErrorMessage(text) {
        await this.errorToast.waitForDisplayed({ timeout: 5000 });
        const msg = await this.errorToast.getText();
        return msg.includes(text);
    }

}

export default new NotificationPage();
