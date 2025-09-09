// import LoginPage from '../../pageobjects/auth/login.page.js';

// describe('Login Feature - ProShop v2', () => {
//   it('should login successfully', async () => {
//     await LoginPage.open('/login');
//     await LoginPage.login('seves2@gmail.com', '123456As');

//     // chờ userInfo xuất hiện trong localStorage
//     await browser.waitUntil(
//       async () => (await browser.execute(() => localStorage.getItem('userInfo'))) !== null,
//       { timeout: 10000, timeoutMsg: 'userInfo not stored in localStorage' }
//     );

//     const userInfo = await browser.execute(() => localStorage.getItem('userInfo'));
//     console.log('LocalStorage userInfo:', userInfo);

//     const nav = await $('header nav');
//     console.log('Navbar text:', await nav.getText());

//     await browser.pause(5000);
//   });
// });


// import LoginPage from '../../pageobjects/auth/login.page.js'
// import ProductDetailsPage from '../../pageobjects/products/productDetails.page.js'

// describe('Product Details - ProShop v2', () => {
//   before(async () => {
//     await LoginPage.open('/login')
//     await LoginPage.login('seves2@gmail.com', '123456As')

//     // chờ userInfo trong localStorage để confirm login
//     await browser.waitUntil(
//       async () => (await browser.execute(() => localStorage.getItem('userInfo'))) !== null,
//       { timeout: 10000 }
//     )
//   })

//   it('should open product details page from homepage', async () => {
//     await browser.url('/') // quay lại homepage

//     // lấy sản phẩm đầu tiên trong danh sách
//     const firstProduct = await $('.card a')   // 👈 an toàn hơn ".card-title a"
//     await firstProduct.waitForDisplayed({ timeout: 10000 })
//     const productName = await firstProduct.getText()
//     await firstProduct.click()

//     // xác nhận chuyển sang trang chi tiết sản phẩm
//   const url = await browser.getUrl()
// expect(url).toContain('/product/')

// const title = await ProductDetailsPage.productTitle.getText()
// expect(title).toContain(productName)

// const priceDisplayed = await ProductDetailsPage.productPrice.isDisplayed()
// expect(priceDisplayed).toBe(true)

//     await expect(ProductDetailsPage.btnAddToCart).toBeDisplayed()

//     await browser.pause(3000)
//   })

//   it('should add product to cart from details page', async () => {
//     await browser.url('/') // về lại trang home
//     const firstProduct = await $('.card a')
//     await firstProduct.waitForDisplayed({ timeout: 10000 })
//     await firstProduct.click()

//     // chọn số lượng và thêm vào giỏ
//     await ProductDetailsPage.selectQuantity(2)
//     await ProductDetailsPage.addToCart()

//     // xác nhận chuyển sang trang cart
// const url = await browser.getUrl()
// expect(url).toContain('/cart')
//     await browser.pause(3000)
//   })
// })
