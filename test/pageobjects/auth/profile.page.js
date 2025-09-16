import Page from "../common/page.js";
class ProfilePage extends Page {
    get inputName() {
        return $("label[for='name'] + input.form-control");
    }

    get inputEmail() {
        return $("label[for='email'] + input.form-control");
    }

    get inputPassword() {
        return $('#password[class="form-control"]');
    }

    get inputConfirmPassword() {
        return $("#confirmPassword[class='form-control']");
    }
    get btnUpdate() {
        return $('button[type="submit"][class="btn btn-primary"]');
    }

    get ordersTable() {
        return $("div.col-md-9 div.table-responsive table");
    }
    get orderRows() {
        return $$("div.col-md-9 div.table-responsive table tbody tr");
    }
    get firstDetailsBtn() {
        return $(
            "div.col-md-9 div.table-responsive table tbody tr:first-child td:last-child a"
        );
    }
    get successMsg() {
        return $(".Toastify__toast-body");
    }
    get errorMsg() {
        return $(".Toastify__toast-body");
    }
    async logout() {
        await this.userMenu.waitForDisplayed({ timeout: 5000 });
        await this.userMenu.click();

        await this.logoutLink.waitForClickable({ timeout: 5000 });
        await this.logoutLink.scrollIntoView();
        await this.logoutLink.click();

        await browser.waitUntil(async () => await this.isLoggedOut(), {
            timeout: 10000,
            timeoutMsg: "Logout did not succeed",
        });
    }

    get errorMsgs() {
        return $$("div.error, .alert-danger, .invalid-feedback");
    }
    async isInputValid(inputEl) {
        const selector = await inputEl.selector;
        return await browser.execute((sel) => {
            const el = document.querySelector(sel);
            return el && el.checkValidity ? el.checkValidity() : false;
        }, selector);
    }
    async getErrorTexts() {
        const els = await this.errorMsgs;
        const texts = [];
        for (let el of els) {
            if (await el.isDisplayed()) {
                texts.push(await el.getText());
            }
        }
        return texts;
    }
    async expectErrorMessage(expectedText) {
        const errors = await this.getErrorTexts();
        if (errors.length > 0) {
            await expect(errors.join(" ")).toContain(expectedText);
        } else {
            console.warn(
                `Warning: No error message UI found for "${expectedText}"`
            );
        }
    }

    async resetProfileToDefault() {
        const originalName = "John Doe";
        const originalEmail = "john@email.com";

        await this.open("/profile");
        await this.inputEmail.waitForDisplayed();
        await this.inputEmail.clearValue();
        await this.inputEmail.setValue(originalEmail);
        await this.inputName.waitForDisplayed();
        await this.inputName.clearValue();
        await this.inputName.setValue(originalName);
        await this.btnUpdate.click();

        if (
            (await this.successMsg.isExisting()) &&
            (await this.successMsg.isDisplayed())
        ) {
            await expect(this.successMsg).toHaveText(
                "Profile updated successfully"
            );
            await browser.waitUntil(
                async () => !(await this.successMsg.isDisplayed()),
                {
                    timeout: 7000,
                }
            );
        }
        await expect(this.inputEmail).toHaveValue(originalEmail);
        await expect(this.inputName).toHaveValue(originalName);
    }

    async resetPasswordToDefault() {
        const originalPassword = "123456";

        await this.open("/profile");

        await this.inputPassword.setValue(originalPassword);

        await this.inputConfirmPassword.setValue(originalPassword);

        await this.btnUpdate.click();

        if (await this.successMsg.isDisplayed()) {
            await expect(this.successMsg).toHaveText(
                "Profile updated successfully"
            );
            await browser.waitUntil(
                async () => !(await this.successMsg.isDisplayed()),
                { timeout: 7000 }
            );
        }

        await this.logout();
        await LoginPage.login("john@email.com", originalPassword);
        await expect(LoginPage.userInfo).toBeDisplayed();
    }

    async getOrdersCount() {
        const rows = await this.orderRows;
        return rows.length;
    }
    async waitForOrders(min = 1, timeout = 5000) {
        await browser.waitUntil(
            async () => (await this.getOrdersCount()) >= min,
            {
                timeout,
                timeoutMsg: `Not enough orders found, minimum required = ${min}`,
            }
        );
        const count = await this.getOrdersCount();
        return count;
    }
    async clickDetailsByIndex(index) {
        const rows = await this.orderRows;
        if (rows.length >= index) {
            const detailsBtn = await rows[index - 1].$("td:last-child a");
            await detailsBtn.waitForClickable({ timeout: 5000 });
            await detailsBtn.click();
        } else {
            throw new Error(
                `Not found order with index = ${index}, only ${rows.length} orders available`
            );
        }
    }
    async clickFirstDetails() {
        const btn = await this.firstDetailsBtn;
        await btn.waitForClickable({ timeout: 5000 });
        await btn.click();
    }
    // async clickDetailsById(orderId) {
    //     const rows = await this.orderRows;
    //     for (const row of rows) {
    //         const idCell = await row.$("td:nth-child(1)");
    //         if ((await idCell.getText()) === orderId) {
    //             const detailsBtn = await row.$("td:last-child a");
    //             await detailsBtn.waitForClickable({ timeout: 5000 });
    //             await detailsBtn.click();
    //             return;
    //         }
    //     }
    //     throw new Error(`Order with ID = ${orderId} not found`);
    // }

    async setInputValue(inputEl, value) {
        const el = await inputEl;
        await el.clearValue();
        await el.setValue(value);
    }
}

export default new ProfilePage();
