// import LoginPage from '../../pageobjects/auth/login.page.js';
import ProductDetailsPage from '../../pageobjects/products/productDetails.page.js'

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

// import LoginPage from "../../pageobjects/auth/login.page.js";
// import ProductDetailsPage from "../../pageobjects/products/productDetails.page.js";

// describe("Product Details - ProShop v2", () => {
//     before(async () => {
//         await LoginPage.open("/login");
//         await LoginPage.login("seves2@gmail.com", "123456As");

//         // chờ userInfo trong localStorage để confirm login
//         await browser.waitUntil(
//             async () =>
//                 (await browser.execute(() =>
//                     localStorage.getItem("userInfo")
//                 )) !== null,
//             { timeout: 10000 }
//         );
//     });

//     it("should open product details page from homepage", async () => {
//         const firstProduct = await $(".card a"); 
//         await firstProduct.waitForDisplayed({ timeout: 10000 });
//         const productName = await firstProduct.getText();
//         await firstProduct.click();

//         const url = await browser.getUrl();
//         expect(url).toContain("/product/");

//         const title = await ProductDetailsPage.productTitle.getText();
//         expect(title).toContain(productName);

//         const priceDisplayed =
//             await ProductDetailsPage.productPrice.isDisplayed();
//         expect(priceDisplayed).toBe(true);

//         await expect(ProductDetailsPage.btnAddToCart).toBeDisplayed();

//         await browser.pause(3000);
//     });

    // it("should add product to cart from details page", async () => {
    //     await browser.url("/"); 
    //     const firstProduct = await $(".card a");
    //     await firstProduct.waitForDisplayed({ timeout: 10000 });
    //     await firstProduct.click();

    //     await ProductDetailsPage.selectQuantity(2);
    //     await ProductDetailsPage.addToCart();

    //     const url = await browser.getUrl();
    //     expect(url).toContain("/cart");
    //     await browser.pause(3000);
    // });
// });

// import LoginPage from '../../pageobjects/auth/login.page.js'
// import ProductDetailsPage from '../../pageobjects/products/productDetails.page.js'

// describe('Cart Feature - ProShop v2', () => {
//   before(async () => {
//     await LoginPage.open('/login')
//     await LoginPage.login('seves2@gmail.com', '123456As')

//     // chờ userInfo trong localStorage để confirm login
//     await browser.waitUntil(
//       async () => (await browser.execute(() => localStorage.getItem('userInfo'))) !== null,
//       { timeout: 10000 }
//     )
//   })

//   it('EP03.1_01 - Verify whether adding products to cart successfully', async () => {
//     await browser.url('/') // về homepage

//     // chọn sản phẩm đầu tiên
//     const firstProduct = await $('.card a')
//     await firstProduct.waitForDisplayed({ timeout: 10000 })
//     await firstProduct.click()

//     // chọn quantity = 2 và add to cart
//     await ProductDetailsPage.selectQuantity(2)
//     await ProductDetailsPage.addToCart()

//     // verify chuyển sang giỏ hàng
//     const url = await browser.getUrl()
//     expect(url).toContain('/cart')

//     // verify trong giỏ có sản phẩm và số lượng đúng
//     const cartItem = await $('.list-group-item')
//     expect(await cartItem.isDisplayed()).toBe(true)

//     const qtySelect = await $('select.form-control')
//     const selectedQty = await qtySelect.getValue()
//     expect(selectedQty).toBe('2')

//     await browser.pause(3000)
//   })
// })

import LoginPage from '../../pageobjects/auth/login.page.js'

describe('Cart Feature - ProShop v2', () => {
  before(async () => {
    await LoginPage.open('/login')
    await LoginPage.login('seves2@gmail.com', '123456As')

    // chờ userInfo trong localStorage để confirm login
    await browser.waitUntil(
      async () => (await browser.execute(() => localStorage.getItem('userInfo'))) !== null,
      { timeout: 10000 }
    )
  })

  // it('EP03.1_02 - Verify Cart button can be clicked', async () => {
  //   // click nút cart trên navbar
  //   const cartButton = await $('a[href="/cart"]')
  //   await cartButton.waitForDisplayed({ timeout: 5000 })
  //   await cartButton.click()

  //   // verify URL điều hướng sang trang cart
  //   const url = await browser.getUrl()
  //   expect(url).toContain('/cart')

  //   // verify heading/cart container hiển thị
  //   const cartHeading = await $('h1=Shopping Cart')
  //   expect(await cartHeading.isDisplayed()).toBe(true)

  //   await browser.pause(3000)
  // })
  it('EP03.1_03 - Verify product quantity can display on Cart icon', async () => {
    await browser.url('/') // về homepage

    // Chọn sản phẩm đầu tiên
    const firstProduct = await $('.card a')
    await firstProduct.waitForDisplayed({ timeout: 10000 })
    await firstProduct.click()

    // Chọn số lượng = 2 và Add to Cart
    await ProductDetailsPage.selectQuantity(2)
    await ProductDetailsPage.addToCart()

    // Quay lại homepage để xem icon cart
    await browser.url('/')

    // Lấy text từ nút giỏ hàng trên navbar
    const cartIcon = await $('a[href="/cart"]')
    await cartIcon.waitForDisplayed({ timeout: 5000 })
    const cartText = await cartIcon.getText()

    console.log('Cart icon text:', cartText)

    // Verify có hiển thị số "2"
    expect(cartText).toContain('2')

    await browser.pause(3000)
  })
})
