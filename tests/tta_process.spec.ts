import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('Complete product purchase flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'tta_secret');
  await expect(inventoryPage.title).toBeVisible();

  await inventoryPage.addItemToCart();
  await inventoryPage.goToCart();
  await expect(cartPage.inventoryItem).toBeVisible();

  await cartPage.proceedToCheckout();
  await checkoutPage.fillCheckoutInfo('Test', 'QA', '12345');
  await expect(checkoutPage.title).toBeVisible();

  await checkoutPage.finishOrder();
  await expect(checkoutPage.completeHeader).toContainText('Thank you for your order!');
  await expect(checkoutPage.backToProductsButton).toBeVisible();
  await checkoutPage.backToProducts();
});
