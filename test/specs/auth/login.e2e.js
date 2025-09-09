import LoginPage from '../../pageobjects/auth/login.page.js';

describe('Login Feature - ProShop v2', () => {
  it('should login successfully', async () => {
    await LoginPage.open('/login');
    await LoginPage.login('seves2@gmail.com', '123456As');

    // chờ userInfo xuất hiện trong localStorage
    await browser.waitUntil(
      async () => (await browser.execute(() => localStorage.getItem('userInfo'))) !== null,
      { timeout: 10000, timeoutMsg: 'userInfo not stored in localStorage' }
    );

    const userInfo = await browser.execute(() => localStorage.getItem('userInfo'));
    console.log('LocalStorage userInfo:', userInfo);

    const nav = await $('header nav');
    console.log('Navbar text:', await nav.getText());

    await browser.pause(5000);
  });
});
