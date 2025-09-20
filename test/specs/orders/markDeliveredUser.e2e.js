import LoginPage from "../../pageobjects/auth/login.page.js";
import OrdersSummaryPage from "../../pageobjects/orders/ordersSummary.page.js";

describe("EPIC 3.5 (User): Mark as Delivered", () => {
    before(async () => {
        await LoginPage.open("/login");
        await LoginPage.login("group5@gmail.com", "123456");

        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) !== null,
            { timeout: 3000 }
        );
    });

    it("EP03.5_01 - User xem order Paid + Delivered → không có nút Mark As Delivered", async () => {
        await browser.url("/order/68c95cf54084cdc891d43b36");

        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });

        const paid = await OrdersSummaryPage.isPaid();
        const delivered = await OrdersSummaryPage.isDelivered();
        const hasBtn = await OrdersSummaryPage.hasMarkDeliveredBtn();

        expect(paid).toBe(true);
        expect(delivered).toBe(true);
        expect(hasBtn).toBe(false);
    });

    it("EP03.5_02 - User xem order Not Paid + Not Delivered → không có nút Mark As Delivered", async () => {
        await browser.url("/order/68c95d5a4084cdc891d43b5f");

        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });

        const notPaid = await OrdersSummaryPage.isNotPaid();
        const notDelivered = await OrdersSummaryPage.isNotDelivered();
        const hasBtn = await OrdersSummaryPage.hasMarkDeliveredBtn();

        expect(notPaid).toBe(true);
        expect(notDelivered).toBe(true);
        expect(hasBtn).toBe(false); // User không được phép mark delivered
    });

    it("EP03.5_03 - User xem order Paid + Not Delivered → cũng không có nút Mark As Delivered", async () => {
        await browser.url("/order/68c95ef24084cdc891d44244");

        await OrdersSummaryPage.heading.waitForDisplayed({ timeout: 5000 });

        const paid = await OrdersSummaryPage.isPaid();
        const notDelivered = await OrdersSummaryPage.isNotDelivered();
        const hasBtn = await OrdersSummaryPage.hasMarkDeliveredBtn();

        expect(paid).toBe(true);
        expect(notDelivered).toBe(true);
        expect(hasBtn).toBe(false); // User không thể thay đổi trạng thái
    });
});
