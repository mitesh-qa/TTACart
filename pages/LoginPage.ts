import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly errorMessage: Locator;
  readonly loginCredentials: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator('[data-test="login-button"]');
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginCredentials = page.locator('[data-test="login-credentials"]');
  }

  async goto() {
    await this.page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
  }

  async openLoginForm() {
    await this.loginButton.first().click();
    await expect(this.passwordInput).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.openLoginForm();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.last().click();
  }

  async submitWithBypass() {
    // Bypass HTML5 validation to test blank-field scenarios
    await this.page.evaluate(() => {
      const form = document.getElementById('login-form') as HTMLFormElement;
      form?.setAttribute('novalidate', '');
      form?.requestSubmit();
    });
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent();
  }

  async expectError(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }

  async expectNoError() {
    await expect(this.errorMessage).toBeHidden();
  }
}
