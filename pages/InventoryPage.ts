import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly shoppingCartLink: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart-test-allthethings-tshirt-red"]');
  }

  async addItemToCart() {
    await this.addToCartButton.click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }
}
