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
    async clickDetailsById(orderId) {
        const rows = await this.orderRows;
        for (const row of rows) {
            const idCell = await row.$("td:nth-child(1)");
            if ((await idCell.getText()) === orderId) {
                const detailsBtn = await row.$("td:last-child a");
                await detailsBtn.waitForClickable({ timeout: 5000 });
                await detailsBtn.click();
                return;
            }
        }
        throw new Error(`Order with ID = ${orderId} not found`);
    }
}

export default new ProfilePage();
