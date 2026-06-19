import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator('[data-test="login-button"]');
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
  }

  async goto() {
    await this.page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
  }

  async login(username: string, password: string) {
    await this.loginButton.first().click();
    await expect(this.passwordInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.last().click();
  }
}
