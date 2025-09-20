import RegisterPage from "../../pageobjects/auth/register.page.js";
import HeaderPage from "../../pageobjects/common/header.page.js";
import NotificationPage from "../../pageobjects/common/notification.page.js";


describe('EP01.1: Account Registration - Proshop v2', () => {
    beforeEach(async () => {
    await browser.reloadSession();
    await RegisterPage.open("/register?redirect=/");
    })

    it('EP01.1_1: Valid Registration', async () => {
        await RegisterPage.register('myname', 'maail00@email.com', 'Hgri@120', 'Hgri@120'); //Remember change email

        await browser.waitUntil(async () => await HeaderPage.isLoggedIn(), {
                        timeout: 10000,
                        timeoutMsg: "User menu (#username) not visible after login",
                    });

        await expect(HeaderPage.userMenu).toHaveText('myname');
        expect(await browser.getUrl()).toContain("localhost:3000"); 
    })
    

    it('EP01.1_2: Registration with Registered Email', async () => {
        await RegisterPage.register('newname', 'john@email.com', 'Hgri@120', 'Hgri@120');

        await browser.waitUntil(async () => await NotificationPage.hasErrorMessage('User already exists'), {
            timeout: 5000,
            timeoutMsg: "Toastify not displayed"
        });
        expect(await browser.getUrl()).toContain("/register?redirect=/");
    })

    it('EP01.1_3: Registration with Invalid Email', async () => {
        const invalidEmails = [
        'username', // Missing '@' and domain
        '@missingusername.com', // Missing username
        'user@.com', // Wrong domain format
        'user@domain..com', // Consecutive dots
        'user@domain,com', // Comma instead of dot
        'user@@domain.com', // Another '@' after '@'
        'user@.domain.com', // Wrong dot position usage
        'user @domain.com', // Space before '@'
        'user@', // Incomplete email
        'user.domain.com', // Missing '@'
        'user?????@domain.com', // Invalid special characters
]

    for (const sampleemails of invalidEmails) {
        await RegisterPage.register('name', sampleemails, 'Hgri@120', 'Hgri@120');
        await browser.waitUntil(async () => {
            const text = await NotificationPage.hasErrorMessage();
            return (await text.includes('missing') || text.includes('wrong'));
        }, {
            timeout: 5000,
            timeoutMsg: "Toastify not displayed"
        });

        expect(await browser.getUrl()).toContain("/register?redirect=/");
    }
})

    it('EP01.1_4: Registration with Invalid Password', async () => {
        const invalidPass = [
    '1234', //Sequential characters
    'Hg1230', //Less than 8 characters
    'H123091', //No lowercase
    'h123091', //No uppercase
    'hgrivsea', //No number
    'Hgrivsea1230', //No special character
    'Hhhh1357.', //Repeated characters
    'password.135', //Common password
    'User.1230', // contains name/ email
]
    for (const samplepassword of invalidPass) {
        await RegisterPage.register('name', 'mail003@mail.com', samplepassword, samplepassword);

        await browser.waitUntil(async () => await NotificationPage.hasErrorMessage('Invalid password'), {
            timeout: 5000,
            timeoutMsg: "Toastify not displayed"
        });

        expect(await browser.getUrl()).toContain("/register?redirect=/");
    }
})

    it('EP01.1_5: Registration with Mismatched Password', async () => {
        await RegisterPage.register('name', 'mail003@mail.com', 'Hgri@120', 'donotmatch');

        await browser.waitUntil(async () => await NotificationPage.getToastMessage('Passwords do not match'), 
        {
            timeout: 5000,
            timeoutMsg: "Toastify not displayed"
        });

        expect(await browser.getUrl()).toContain("/register?redirect=/");
    })

    it('EP01.1_6: Registration with Empty Field', async () => {
        await RegisterPage.register('', '', '', '');

        await browser.waitUntil(async () => {
            const text = await NotificationPage.getToastMessage();
            return (await text.includes('Path') || text.includes('is required'));
        }, {
            timeout: 5000,
            timeoutMsg: "Toastify not displayed"
        });

        expect(await browser.getUrl()).toContain("/register?redirect=/");
    })

})