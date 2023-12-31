import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
});

let username = 'standard_user';
const password = 'secret_sauce';

test.describe('Home Screen', () => {
  
  test('Title should be Swag Labs', async ({ page }) => {
    expect(await page.title()).toContain('Swag Labs');
  });

  test('should allow me to enter a username', async ({ page }) => {
    
    const usernameBox = page.getByPlaceholder('Username');

    await usernameBox.fill(username);

    expect(await usernameBox.getAttribute('value')).toBe(username);
  });

  test('should allow me to enter a password', async ({ page }) => {

    const passwordBox = page.getByPlaceholder('Password');

    await passwordBox.fill(password);

    expect(await passwordBox.getAttribute('value')).toBe(password);   
  });

  test('should allow me to log in', async ({ page }) => {

    const usernameBox = page.getByPlaceholder('Username');
    const passwordBox = page.getByPlaceholder('Password');
    const newUrl = 'https://www.saucedemo.com/inventory.html';

    await usernameBox.fill(username);
    await passwordBox.fill(password);
    await page.locator('[data-test="login-button"]').click();

    expect(page.url()).toBe(newUrl);
  });
});

test.describe('Standard  User', () => {

  test.beforeEach(async ({ page }) => {
    const usernameBox = page.getByPlaceholder('Username');
    const passwordBox = page.getByPlaceholder('Password');
  
    await usernameBox.fill(username);
    await passwordBox.fill(password);
  
    await page.locator('[data-test="login-button"]').click();
  });

  test('should be able to log out', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('#logout_sidebar_link').click();

    expect(await page.url()).toBe('https://www.saucedemo.com/');
  })
  
  test('should be able to add an item to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('#shopping_cart_container a').click();

    expect(await page.locator('.cart_item').count()).toBeGreaterThan(0); 
  });

  test('should display number of items in cart on cart icon', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    expect (Number(await page.locator('.shopping_cart_badge').textContent())).toBeGreaterThan(0);  
  });
});

test.describe('Locked Out User', () => {
  test('should display error message when logging in and be able to close error message button', async ({ page }) => {
    const usernameBox = page.getByPlaceholder('Username');
    const passwordBox = page.getByPlaceholder('Password');
  
    await usernameBox.fill('locked_out_user');
    await passwordBox.fill(password);
  
    await page.locator('[data-test="login-button"]').click();

    expect(await page.locator('h3:has-text("Epic sadface: Sorry, this user has been locked out.")'));

    expect(await page.locator('.error-button').click());  
  });
});

/**test('template', async ({ page }) => {

});*/