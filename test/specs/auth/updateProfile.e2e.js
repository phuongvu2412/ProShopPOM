import LoginPage from "../../pageobjects/auth/login.page.js";
import ProfilePage from "../../pageobjects/auth/profile.page.js";

describe("EPIC 1.4: Edit Profile", () => {
    const originalName = "John Doe";
    const originalEmail = "john@email.com";

    before(async () => {
        await LoginPage.open("/login");
        await LoginPage.login(originalEmail, "123456");

        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) !== null,
            { timeout: 5000, timeoutMsg: "Login failed - userInfo not found" }
        );
    });

    beforeEach(async () => {
        await ProfilePage.open("/profile");
        await ProfilePage.resetProfileToDefault();
    });

    it("EP01.4_01 - Update profile successfully with valid data", async () => {
        await ProfilePage.setInputValue(
            ProfilePage.inputEmail,
            "newuser@gmail.com"
        );
        await ProfilePage.setInputValue(ProfilePage.inputName, "New User Name");
        await ProfilePage.btnUpdate.click();
        // await ProfilePage.successMsg.waitForDisplayed({ timeout: 3000 });
        await ProfilePage.successMsg.waitForExist({ timeout: 3000 });
        await expect(ProfilePage.successMsg).toHaveText(
            "Profile updated successfully"
        );
        await expect(ProfilePage.inputEmail).toHaveValue("newuser@gmail.com");
        await expect(ProfilePage.inputName).toHaveValue("New User Name");
    });

    it("EP01.4_02 - Reject profile update with invalid email format", async () => {
        // Clear and update email address
        const invalidEmail = [
            "user@@gmail.com",
            "user.gmail.com",
            "user@domain,com",
        ];
        for (let item of invalidEmail) {
            await ProfilePage.inputEmail.clearValue();
            await ProfilePage.inputEmail.setValue(item);
            await ProfilePage.btnUpdate.click();

            // expect(await ProfilePage.successMsg.not.toBeDisplayed());
            await expect(ProfilePage.successMsg).not.toBeDisplayed();

            // const isValid = await browser.execute(
            //   (el) => el.checkValidity(),
            //   await ProfilePage.inputEmail
            // );
            // await expect(isValid).toBe(false);
        }
    });
    it("EP01.4_03 - Reject profile update when name are empty", async () => {
        await ProfilePage.inputName.clearValue();
        await ProfilePage.btnUpdate.click();
        await expect(ProfilePage.successMsg).not.toBeDisplayed();
        await ProfilePage.expectErrorMessage("Name is required");
    });

    it("EP01.4_04 - Reject profile update when email are empty", async () => {
        await ProfilePage.inputEmail.clearValue();
        await ProfilePage.btnUpdate.click();
        await expect(ProfilePage.successMsg).not.toBeDisplayed();
        await ProfilePage.expectErrorMessage("Email is required");
    });

    it("EP01.4_05 - Reject profile update when both name and email are empty", async () => {
        await ProfilePage.inputName.clearValue();
        await ProfilePage.inputEmail.clearValue();
        await ProfilePage.btnUpdate.click();
        await expect(ProfilePage.successMsg).not.toBeDisplayed();
        await ProfilePage.expectErrorMessage("Name is required");
        await ProfilePage.expectErrorMessage("Email is required");
    });

    it("EP01.4_06 - Reject profile update when name and email contain only whitespace", async () => {
        await ProfilePage.setInputValue(ProfilePage.inputName, "   ");
        await ProfilePage.setInputValue(ProfilePage.inputEmail, "   ");

        await ProfilePage.btnUpdate.click();
        await expect(ProfilePage.successMsg).not.toBeDisplayed();
        await ProfilePage.expectErrorMessage("Name is required");
        await ProfilePage.expectErrorMessage("Email is required");
    });

    it("EP01.4_07 - Verify 'Update' Button in User Profile", async () => {
        await expect(ProfilePage.btnUpdate).toBeDisplayed();
        await expect(ProfilePage.btnUpdate).toHaveText("Update");
        const isEnabled = await ProfilePage.btnUpdate.isEnabled();
        await expect(isEnabled).toBe(true);
        await ProfilePage.setInputValue(ProfilePage.inputName, "Test User");
        await ProfilePage.setInputValue(
            ProfilePage.inputEmail,
            "testuser@gmail.com"
        );
        await ProfilePage.btnUpdate.click();
        await ProfilePage.successMsg.waitForDisplayed({ timeout: 3000 });
        await expect(ProfilePage.successMsg).toHaveText(
            "Profile updated successfully"
        );
    });
});
