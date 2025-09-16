import LoginPage from "../../pageobjects/auth/login.page.js";
import ProfilePage from "../../pageobjects/auth/profile.page.js";
import HeaderPage from "../../pageobjects/common/header.page.js";

describe("EPIC 1.5: Change Password", () => {
    const originalName = "group5";
    const originalEmail = "group5@gmail.com";
    const originalPassword = "123456";

    before(async () => {
        await LoginPage.open("/login");
        await LoginPage.login(originalEmail, originalPassword);

        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) !== null,
            { timeout: 5000, timeoutMsg: "Login failed - userInfo not found" }
        );
    });

    afterEach(async () => {
        await ProfilePage.open("/profile");

        await ProfilePage.inputPassword.waitForDisplayed({ timeout: 5000 });
        await ProfilePage.inputPassword.setValue(originalPassword);

        await ProfilePage.inputConfirmPassword.waitForDisplayed({
            timeout: 5000,
        });
        await ProfilePage.inputConfirmPassword.setValue(originalPassword);
        await ProfilePage.btnUpdate.click();

        await expect(ProfilePage.successMsg).toHaveText(
            "Profile updated successfully"
        );
    });

    it("EP01.5_01 - Change password successfully with valid data", async () => {
        await ProfilePage.open("/profile");
        await ProfilePage.setInputValue(
            ProfilePage.inputPassword,
            "Nguoidung@278"
        );
        await ProfilePage.setInputValue(
            ProfilePage.inputConfirmPassword,
            "Nguoidung@278"
        );
        await ProfilePage.btnUpdate.click();

        await expect(ProfilePage.successMsg).toHaveText(
            "Profile updated successfully"
        );

        await HeaderPage.logout1();

        expect(await browser.getUrl()).toContain("/login");

        //LOG IN UNSUCCESS WITH OLD PASSWORD
        await LoginPage.loginfailed(originalEmail, "123456");
        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) === null,
            {
                timeout: 5000,
                timeoutMsg: "Expected login to fail but userInfo found",
            }
        );
        expect(await ProfilePage.errorMsg).toHaveText(
            "Invalid email or password"
        );

        expect(await browser.getUrl()).toContain("/login");
        //LOG IN SUCCESS WITH NEW PASSWORD
        await LoginPage.login(originalEmail, "Nguoidung@278");
        await browser.waitUntil(
            async () =>
                (await browser.execute(() =>
                    localStorage.getItem("userInfo")
                )) !== null,
            { timeout: 5000, timeoutMsg: "Login failed - userInfo not found" }
        );

        expect(await HeaderPage.isLoggedIn());
    });

    it("EP01.5_02- Verify unsuccessful password change with invalid formats", async () => {
        const invalidCases = [
            { pwd: "Qw1357", expected: "Invalid password format" },
            { pwd: "Qwerty", expected: "Invalid password format" },
            { pwd: "348922", expected: "Invalid password format" },
            { pwd: "qwerty", expected: "Invalid password format" },
            { pwd: "QWERTY", expected: "Invalid password format" },
            { pwd: "Qwerty1237", expected: "Invalid password format" },
            { pwd: "Qwertyui.", expected: "Invalid password format" },
            { pwd: "Qwert.1111", expected: "Invalid password format" },
            { pwd: "password", expected: "Password is too common" },
            { pwd: "iloveyou", expected: "Password is too common" },
            {
                pwd: "12345678",
                expected: "Password cannot contain sequential characters",
            },
            {
                pwd: "John123!",
                expected: "Password cannot contain personal info",
            },
        ];
        await ProfilePage.open("/profile");
        for (const { pwd, expected } of invalidCases) {
            await ProfilePage.inputPassword.waitForDisplayed({ timeout: 5000 });
            await ProfilePage.inputPassword.clearValue();
            await ProfilePage.inputConfirmPassword.waitForDisplayed({
                timeout: 5000,
            });
            await ProfilePage.inputConfirmPassword.clearValue();

            await ProfilePage.setInputValue(ProfilePage.inputPassword, pwd);
            await ProfilePage.setInputValue(
                ProfilePage.inputConfirmPassword,
                pwd
            );

            await ProfilePage.btnUpdate.click();
            await ProfilePage.expectErrorMessage(expected);
            expect(await ProfilePage.successMsg).not.toBeDisplayed();
        }
    });

    it("EP01.5_03- Reject password change when 'password' field is empty", async () => {
        await ProfilePage.inputPassword.clearValue();
        await ProfilePage.setInputValue(
            ProfilePage.inputConfirmPassword,
            "Nguoidung@278"
        );
        await ProfilePage.btnUpdate.click();
        await ProfilePage.expectErrorMessage("Password is required");
    });

    it("EP01.5_04 Reject password change when 'confirm password' field is empty", async () => {
        await ProfilePage.setInputValue(
            ProfilePage.inputPassword,
            "Nguoidung@278"
        );
        await ProfilePage.inputConfirmPassword.clearValue();
        await ProfilePage.btnUpdate.click();
        await ProfilePage.expectErrorMessage("Confirm Password is required");
    });

    it("EP01.5_05- Reject password change when passwords do not match", async () => {
        await ProfilePage.open("/profile");
        await ProfilePage.setInputValue(
            ProfilePage.inputPassword,
            "Nguoidung@278"
        );
        await ProfilePage.setInputValue(
            ProfilePage.inputConfirmPassword,
            "Nguoidung@2780"
        );
        await ProfilePage.btnUpdate.click();
        await ProfilePage.errorMsg.waitForExist({ timeout: 3000 });
        await expect(ProfilePage.errorMsg).toHaveText("Passwords do not match");
    });

    it("EP01.5_06- Verify unsuccessful password change with new password is the same as current password", async () => {
        await ProfilePage.setInputValue(
            ProfilePage.inputPassword,
            "Nguoidung@278"
        );
        await ProfilePage.setInputValue(
            ProfilePage.inputConfirmPassword,
            "Nguoidung@278"
        );

        await ProfilePage.btnUpdate.click();
        await ProfilePage.successMsg.waitForExist({ timeout: 3000 });
        await expect(ProfilePage.successMsg).toHaveText(
            "Profile updated successfully"
        );

        await ProfilePage.open("/profile");

        await ProfilePage.setInputValue(
            ProfilePage.inputPassword,
            "Nguoidung@278"
        );
        await ProfilePage.setInputValue(
            ProfilePage.inputConfirmPassword,
            "Nguoidung@278"
        );
        await ProfilePage.btnUpdate.click();

        await ProfilePage.expectErrorMessage(
            "New password cannot be the same as current password"
        );
    });
});
