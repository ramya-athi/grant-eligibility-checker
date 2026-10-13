// Checks how the cookie banner behaves and that the service sets no real cookies.
// Needs the app running (python3 server.py) and a browser: npx playwright install chromium
// Usage: npm run cookies            (BASE_URL=http://localhost:5002 by default)
// Exits with code 1 if any check fails.
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5002';
const COOKIE_KEY = 'green-home-grant-cookie-choice';
const ANSWERS_KEY = 'green-home-grant-answers';

let failures = 0;
function check(pass, message) {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${message}`);
  if (!pass) failures += 1;
}

const browser = await chromium.launch();
const banner = (page) => page.locator('.govuk-cookie-banner');
const stored = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);
const DAY = 24 * 60 * 60 * 1000;
async function savedChoice(page) {
  const raw = await stored(page, COOKIE_KEY);
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function freshPage(path = '/') {
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  const setCookieHeaders = [];
  page.on('request', (r) => requests.push(r.url()));
  page.on('response', async (r) => {
    const header = await r.headerValue('set-cookie').catch(() => null);
    if (header) setCookieHeaders.push(r.url());
  });
  await page.goto(BASE + path);
  await page.waitForSelector('h1');
  return { context, page, requests, setCookieHeaders };
}

// 1. First visit
{
  const { context, page } = await freshPage('/help');
  check((await banner(page).count()) === 1, 'The banner shows on a first visit, even on a page other than the start page');
  check(await banner(page).getByRole('button', { name: 'Accept cookies' }).isVisible(), 'It has an Accept cookies button');
  check(await banner(page).getByRole('button', { name: 'Reject cookies' }).isVisible(), 'It has a Reject cookies button');
  check(await banner(page).getByRole('link', { name: 'View cookies' }).isVisible(), 'It has a View cookies link');
  check((await banner(page).getAttribute('role')) === 'region' && !!(await banner(page).getAttribute('aria-label')), 'It is a labelled region for screen readers');
  check((await stored(page, COOKIE_KEY)) === null, 'Nothing is stored before the user chooses');
  await context.close();
}

// 2. Accept
{
  const { context, page } = await freshPage('/');
  await page.getByRole('button', { name: 'Accept cookies' }).click();
  await page.waitForTimeout(150);
  check((await banner(page).count()) === 0, 'Accept hides the banner straight away');
  const accepted = await savedChoice(page);
  check(accepted && accepted.choice === 'accepted', 'The choice is remembered as "accepted"');
  const daysKept = accepted ? (accepted.expires - Date.now()) / DAY : 0;
  check(daysKept > 364 && daysKept <= 365, `The choice is kept for 1 year (${daysKept.toFixed(1)} days left)`);
  await page.reload();
  await page.waitForSelector('h1');
  check((await banner(page).count()) === 0, 'The banner stays hidden after a reload');
  await page.getByRole('button', { name: 'Start now' }).click();
  await page.waitForTimeout(150);
  check((await banner(page).count()) === 0, 'The banner stays hidden on the next page');
  await context.close();
}

// 3. Reject
{
  const { context, page } = await freshPage('/');
  await page.getByRole('button', { name: 'Reject cookies' }).click();
  await page.waitForTimeout(150);
  check((await banner(page).count()) === 0, 'Reject hides the banner straight away');
  const rejected = await savedChoice(page);
  check(rejected && rejected.choice === 'rejected', 'The choice is remembered as "rejected"');
  await page.reload();
  await page.waitForSelector('h1');
  check((await banner(page).count()) === 0, 'The banner stays hidden after a reload');
  await context.close();
}

// 4. View cookies link
{
  const { context, page } = await freshPage('/');
  await banner(page).getByRole('link', { name: 'View cookies' }).click();
  await page.waitForTimeout(150);
  check(page.url() === `${BASE}/cookies` && (await page.locator('h1').innerText()) === 'Cookies', 'View cookies opens the cookies page');
  await context.close();
}

// 5. Keyboard only
{
  const { context, page } = await freshPage('/');
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // Accept cookies
  const focused = await page.evaluate(() => document.activeElement.textContent.trim());
  check(focused === 'Accept cookies', `With the keyboard, the second Tab stop is the banner's first button (${focused})`);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  check((await banner(page).count()) === 0, 'Enter on Accept cookies hides the banner');
  await context.close();
}

// 6. A new visitor gets the banner again
{
  const first = await freshPage('/');
  await first.page.getByRole('button', { name: 'Accept cookies' }).click();
  await first.context.close();
  const second = await freshPage('/');
  check((await banner(second.page).count()) === 1, 'A new browser with no stored choice sees the banner again');
  await second.context.close();
}

// 6b. Expiry
async function visitWithStoredValue(value) {
  const context = await browser.newContext();
  await context.addInitScript(([key, v]) => localStorage.setItem(key, v), [COOKIE_KEY, value]);
  const page = await context.newPage();
  await page.goto(BASE + '/');
  await page.waitForSelector('h1');
  return { context, page };
}
{
  const live = await visitWithStoredValue(JSON.stringify({ choice: 'accepted', expires: Date.now() + DAY }));
  check((await banner(live.page).count()) === 0, 'A choice with a day left is still respected');
  await live.context.close();

  const expired = await visitWithStoredValue(JSON.stringify({ choice: 'accepted', expires: Date.now() - 1000 }));
  check((await banner(expired.page).count()) === 1, 'An expired choice brings the banner back');
  check((await stored(expired.page, COOKIE_KEY)) === null, 'The expired choice is removed from storage');
  await expired.context.close();

  const legacy = await visitWithStoredValue('accepted');
  check((await banner(legacy.page).count()) === 0, 'A choice saved by an earlier version is still respected');
  const upgraded = await savedChoice(legacy.page);
  check(upgraded && upgraded.choice === 'accepted' && upgraded.expires > Date.now(), 'It is upgraded to include an expiry date');
  await legacy.context.close();

  const junk = await visitWithStoredValue('{"choice":"maybe"}');
  check((await banner(junk.page).count()) === 1, 'An unreadable stored value shows the banner instead of breaking the page');
  await junk.context.close();
}

// 6c. The cookies page explains the storage
{
  const { context, page } = await freshPage('/cookies');
  const text = await page.locator('main').innerText();
  check(/does not set any cookies/i.test(text), 'The cookies page says the service sets no cookies');
  check(text.includes(COOKIE_KEY) && text.includes(ANSWERS_KEY), 'The cookies page lists both items kept in browser storage');
  check(/1 year/.test(text) && /close this browser tab/i.test(text), 'It says how long each item is kept');
  check((await page.locator('table.govuk-table').count()) === 1, 'The storage is shown in a GOV.UK table');
  await context.close();
}

// 7. No real cookies, no tracking, answers kept in session storage only
{
  const { context, page, requests, setCookieHeaders } = await freshPage('/');
  await page.getByRole('button', { name: 'Accept cookies' }).click();
  await page.getByRole('button', { name: 'Start now' }).click();
  for (const value of ['own', 'under-20k', 'detached', 'no', 'gas']) {
    await page.locator(`input[type=radio][value="${value}"]`).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(150);
  }
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(200);
  const cookies = await context.cookies();
  check(cookies.length === 0, `The browser holds no cookies after a full journey (found ${cookies.length})`);
  check(setCookieHeaders.length === 0, 'The server never sends a Set-Cookie header');
  const origin = new URL(BASE).origin;
  const outside = requests.filter((u) => u.startsWith('http') && !u.startsWith(origin));
  check(outside.length === 0, `Every request goes to the service itself, with no analytics or third parties (${outside.length} outside)`);
  check((await page.evaluate((k) => sessionStorage.getItem(k) !== null, ANSWERS_KEY)) === true, 'Answers are kept in session storage');
  check((await stored(page, ANSWERS_KEY)) === null, 'Answers are not written to local storage, which would outlast the visit');
  await context.close();
}

await browser.close();
console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'}: ${failures === 0 ? 'all cookie checks passed' : failures + ' cookie check(s) failed'}.`);
process.exit(failures === 0 ? 0 : 1);
