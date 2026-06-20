import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('Checkout validation - First Name is required', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'tta_secret');
  await expect(inventoryPage.title).toBeVisible();

  await inventoryPage.goToCart();
  await cartPage.proceedToCheckout();

  // Submit checkout form without filling any info to trigger validation
  await checkoutPage.continueButton.click();
  await expect(checkoutPage.errorMessage).toContainText('Error: First Name is required');
  await expect(checkoutPage.errorMessage).toBeVisible();
});