import loginPage from "../../pageobjects/auth/login.page";
import HeaderPage from "../../pageobjects/common/header.page.js";
import profilePage from "../../pageobjects/auth/profile.page.js";

describe("EP01.3: View Profile - Proshop v2", () => {
    beforeEach(async () => {
        await browser.reloadSession();
        await HeaderPage.open("/");
    });

    it("EP01.3_1 - EP01.3_3: Successfully Profile View", async () => {
        await HeaderPage.loginLink.waitForClickable({ timeout: 5000 });
        await HeaderPage.loginLink.click();
        expect(await browser.getUrl()).toContain("/login");
        await loginPage.login("group5@gmail.com", "123456");

        await HeaderPage.userMenu.waitForDisplayed({ timeout: 5000 });
        await HeaderPage.Navbar.click();
        await HeaderPage.ProfileLink.waitForDisplayed({ timeout: 5000 });
        await HeaderPage.clickProfileLink();

        expect(await browser.getUrl()).toContain("/profile");

        await profilePage.inputName.waitForDisplayed({ timeout: 5000 });
        expect(await profilePage.inputName.getValue()).toBe("New User Name");
        expect(await profilePage.inputEmail.getValue()).toBe(
            "group5@gmail.com"
        );
        expect(await profilePage.inputPassword.getValue()).toBe("");
        expect(await profilePage.inputConfirmPassword.getValue()).toBe("");
        expect(await profilePage.btnUpdate.getText()).toContain("Update");

        await profilePage.ordersTable.waitForDisplayed({ timeout: 5000 });
        expect(await profilePage.ordersTable.getText()).toContain("ID");
        expect(await profilePage.ordersTable.getText()).toContain("DATE");
        expect(await profilePage.ordersTable.getText()).toContain("TOTAL");
        expect(await profilePage.ordersTable.getText()).toContain("PAID");
        expect(await profilePage.ordersTable.getText()).toContain("DELIVERED");
    });

    it("EP01.3_4: Block Profile Access for Unauthenticated User", async () => {
        await HeaderPage.loginLink.isDisplayed({ timeout: 5000 });
        await profilePage.open("/profile");

        await browser.waitUntil(async () => await loginPage.open("/login"), {
            timeout: 5000,
            timeoutMsg: "Not redirected to login page",
        });
        expect(await browser.getUrl()).toContain("/login");
        await expect(HeaderPage.loginLink).toBeDisplayed();
    });
});
