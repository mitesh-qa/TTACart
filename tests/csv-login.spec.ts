import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

interface LoginTestCase {
  username: string;
  password: string;
  expected: string;
  errorMessage: string;
}

function parseCSV(filePath: string): LoginTestCase[] {
  const content = fs.readFileSync(filePath, 'utf-8').trim();
  const lines = content.split('\n');
  const records: LoginTestCase[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    records.push({
      username: values[0]?.trim() ?? '',
      password: values[1]?.trim() ?? '',
      expected: values[2]?.trim() ?? '',
      errorMessage: values.slice(3).join(',').trim(),
    });
  }

  return records;
}

const testCases = parseCSV(path.resolve(__dirname, '..', 'test-data', 'login.csv'));

test.describe('Data-driven login tests', () => {
  for (const { username, password, expected, errorMessage } of testCases) {
    const label = username ? `"${username}"` : 'empty username';
    const passLabel = password ? `"${password}"` : 'empty password';
    const testName = `login with ${label} / ${passLabel} should ${expected}`;

    test(testName, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.goto();

      if (!username || !password) {
        await loginPage.openLoginForm();
        if (username) await loginPage.usernameInput.fill(username);
        if (password) await loginPage.passwordInput.fill(password);
        await loginPage.submitWithBypass();
      } else {
        await loginPage.login(username, password);
      }

      if (expected === 'success') {
        await expect(loginPage.errorMessage).toBeHidden();
        await expect(inventoryPage.title).toBeVisible();
      } else {
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(errorMessage);
      }
    });
  }
});
