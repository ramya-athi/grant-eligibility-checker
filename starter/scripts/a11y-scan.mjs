// Automated accessibility scan of every page and state, using axe-core against WCAG 2.0 to 2.2 A and AA rules.
// Needs the app running (python3 server.py) and a browser: npx playwright install chromium
// Usage: npm run a11y            (BASE_URL=http://localhost:5002 by default)
// Exits with code 1 if any page has a violation.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5002';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const ANSWERS_KEY = 'green-home-grant-answers';
const COOKIE_KEY = 'green-home-grant-cookie-choice';

const ELIGIBLE = { ownership: 'own', income: 'under-20k', propertyType: 'detached', insulation: 'no', heating: 'gas' };
const PARTIAL = { ...ELIGIBLE, income: '40k-60k' };
const NOT_ELIGIBLE = { ...ELIGIBLE, ownership: 'rent' };

// Each entry: a name, a path, optional saved answers, and optional steps to reach the state.
const PAGES = [
  { name: 'Start page, cookie banner showing', path: '/', freshCookies: true },
  { name: 'Start page', path: '/' },
  { name: 'Question 1: housing situation', path: '/ownership' },
  { name: 'Question 2: household income', path: '/income' },
  { name: 'Question 3: property type', path: '/property-type' },
  { name: 'Question 4: insulation', path: '/insulation' },
  { name: 'Question 5: heating', path: '/heating' },
  { name: 'Question 5: heating, "Other" revealed', path: '/heating', steps: (p) => p.locator('#heating-other').check() },
  {
    name: 'Question 1 with error summary',
    path: '/ownership',
    steps: async (p) => {
      await p.getByRole('button', { name: 'Continue' }).click();
      await p.waitForSelector('.govuk-error-summary');
    },
  },
  {
    name: 'Question 5 "Other" with empty text box error',
    path: '/heating',
    steps: async (p) => {
      await p.locator('#heating-other').check();
      await p.getByRole('button', { name: 'Continue' }).click();
      await p.waitForSelector('.govuk-error-summary');
    },
  },
  { name: 'Check your answers', path: '/check-answers', answers: ELIGIBLE },
  { name: 'Result: eligible', path: '/result', answers: ELIGIBLE },
  { name: 'Result: partially eligible', path: '/result', answers: PARTIAL },
  { name: 'Result: not eligible', path: '/result', answers: NOT_ELIGIBLE },
  { name: 'Application service placeholder', path: '/apply' },
  { name: 'Accessibility statement', path: '/accessibility-statement' },
  { name: 'Privacy', path: '/privacy' },
  { name: 'Cookies', path: '/cookies' },
  { name: 'Terms and conditions', path: '/terms' },
  { name: 'Help', path: '/help' },
  { name: 'Contact', path: '/contact' },
  { name: 'Page not found', path: '/made-up-address' },
];

// Pages scanned again at a narrow phone width.
const NARROW = ['Start page', 'Question 1 with error summary', 'Check your answers', 'Result: eligible'];

async function scan(browser, entry, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  if (!entry.freshCookies) {
    await context.addInitScript(
      (key) => localStorage.setItem(key, JSON.stringify({ choice: 'accepted', expires: Date.now() + 86400000 })),
      COOKIE_KEY
    );
  }
  const page = await context.newPage();
  if (entry.answers) {
    await page.goto(BASE + '/');
    await page.evaluate(([k, v]) => sessionStorage.setItem(k, v), [ANSWERS_KEY, JSON.stringify(entry.answers)]);
  }
  await page.goto(BASE + entry.path);
  await page.waitForSelector('h1');
  if (entry.steps) await entry.steps(page);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  await context.close();
  return results;
}

const browser = await chromium.launch();
const rows = [];
for (const [width, list] of [
  [1000, PAGES],
  [320, PAGES.filter((p) => NARROW.includes(p.name))],
]) {
  for (const entry of list) {
    const results = await scan(browser, entry, width);
    rows.push({ name: entry.name, width, violations: results.violations, review: results.incomplete.length, passes: results.passes.length });
  }
}
await browser.close();

console.log(`Axe scan of ${BASE} (WCAG 2.0 to 2.2, levels A and AA)\n`);
for (const r of rows) {
  const status = r.violations.length === 0 ? 'PASS' : 'FAIL';
  console.log(`${status}  ${r.name} at ${r.width}px: ${r.violations.length} violations, ${r.review} to review, ${r.passes} rules passed`);
  for (const v of r.violations) {
    console.log(`      - [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 3)) console.log(`          ${node.target.join(' ')}`);
    console.log(`          ${v.helpUrl}`);
  }
}
const failed = rows.filter((r) => r.violations.length > 0).length;
const total = rows.reduce((n, r) => n + r.violations.length, 0);
console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'}: ${rows.length - failed} of ${rows.length} scans clean, ${total} violations in total.`);
process.exit(failed === 0 ? 0 : 1);
