// @vitest-environment jsdom
// Journey tests: drive the whole app the way a user would, then run axe-core on each page.
// jsdom has no layout, so colour contrast and 320px reflow still need the manual check (spec.md §12.2).
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import App from './App';

beforeAll(() => {
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});
afterEach(cleanup);

function renderApp(path = '/') {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  );
  return user;
}

// Two known, deliberate differences from axe's defaults:
// - colour contrast can't be measured in jsdom (checked manually instead)
// - GOV.UK Frontend sets aria-expanded on radios that reveal conditional content
//   (see govuk-frontend radios.mjs); axe reports this as aria-allowed-attr. We follow GOV.UK.
// The cookie banner comes before the skip link (GOV.UK cookie banner guidance), so the skip
// link is outside a landmark; it is excluded from the "region" check only.
async function expectNoAxeViolations() {
  const results = await axe.run(
    { include: [document.body], exclude: [['.govuk-skip-link']] },
    { rules: { 'color-contrast': { enabled: false } } }
  );
  results.violations = results.violations
    .map((v) =>
      v.id === 'aria-allowed-attr'
        ? { ...v, nodes: v.nodes.filter((n) => !n.html.includes('aria-controls="conditional-')) }
        : v
    )
    .filter((v) => v.nodes.length > 0);
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`);
  expect(summary).toEqual([]);
}

const continueButton = () => screen.getByRole('button', { name: 'Continue' });

async function answer(user, label) {
  await user.click(await screen.findByLabelText(label));
  await user.click(continueButton());
}

async function answerAll(user, labels) {
  await user.click(await screen.findByRole('button', { name: /Start now/ }));
  for (const label of labels) await answer(user, label);
}

const ELIGIBLE = ['Detached house', 'I own my home', 'Less than £20,000', 'No', 'Gas boiler'];

describe('eligible journey', () => {
  it('goes from start page to an eligible result, with no axe violations on any page', async () => {
    const user = renderApp();
    expect(await screen.findByRole('heading', { level: 1, name: 'Check if you can get a Green Home Grant' })).toBeTruthy();
    await expectNoAxeViolations();

    await user.click(await screen.findByRole('button', { name: /Start now/ }));
    for (const label of ELIGIBLE) {
      await screen.findByLabelText(label);
      expect(document.title).toMatch(/– Check if you can get a Green Home Grant – GOV.UK$/);
      await expectNoAxeViolations();
      await answer(user, label);
    }

    expect(await screen.findByRole('heading', { level: 1, name: 'Check your answers' })).toBeTruthy();
    const summary = document.querySelector('dl.govuk-summary-list');
    expect(within(summary).getByText('Detached house')).toBeTruthy();
    expect(within(summary).getByText('Gas boiler')).toBeTruthy();
    expect(await screen.findByRole('link', { name: 'Change property type' })).toBeTruthy();
    await expectNoAxeViolations();

    await user.click(await screen.findByRole('button', { name: 'Submit' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'You can apply for a Green Home Grant' })).toBeTruthy();
    expect(document.querySelector('.govuk-panel--confirmation')).toBeTruthy();
    await expectNoAxeViolations();
  });
});

describe('not eligible and partial results', () => {
  it('shows the grey panel and reason for a flat', async () => {
    const user = renderApp();
    await answerAll(user, ['Flat or apartment', 'I own my home', 'Less than £20,000', 'No', 'Gas boiler']);
    await user.click(await screen.findByRole('button', { name: 'Submit' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'You cannot apply for a Green Home Grant' })).toBeTruthy();
    expect(document.querySelector('.app-panel--not-eligible')).toBeTruthy();
    expect(await screen.findByText(/only available for houses and bungalows/)).toBeTruthy();
    await expectNoAxeViolations();
  });

  it('lists every partial reason for a renter on £40k–£59k with insulation', async () => {
    const user = renderApp();
    await answerAll(user, ['Terraced house (including mid-terraced)', 'I rent my home', '£40,000 to £59,999', 'Yes', 'Electric heating']);
    await user.click(await screen.findByRole('button', { name: 'Submit' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'You can apply for part of the Green Home Grant' })).toBeTruthy();
    expect(await screen.findByText(/permission from your landlord/)).toBeTruthy();
    expect(await screen.findByText(/reduced grant/)).toBeTruthy();
    expect(await screen.findByText(/heat pump only/)).toBeTruthy();
  });
});

describe('validation (GOV.UK error pattern)', () => {
  it('shows the error summary and inline error, focuses the summary and prefixes the title', async () => {
    const user = renderApp('/property-type');
    await user.click(continueButton());

    const summary = document.querySelector('.govuk-error-summary');
    expect(within(summary).getByRole('heading', { name: 'There is a problem' })).toBeTruthy();
    expect(summary.querySelector('[role="alert"]')).toBeTruthy();
    expect(document.activeElement).toBe(summary);
    expect(document.title.startsWith('Error: ')).toBe(true);

    const inline = document.getElementById('propertyType-error');
    expect(inline.textContent).toContain('Select the type of property you live in');
    expect(document.querySelector('fieldset').getAttribute('aria-describedby')).toContain('propertyType-error');
    await expectNoAxeViolations();

    await user.click(within(summary).getByRole('link', { name: 'Select the type of property you live in' }));
    expect(document.activeElement).toBe(document.getElementById('propertyType'));
  });

  it('reveals the "Other" text box and requires it', async () => {
    const user = renderApp('/heating');
    const other = screen.getByLabelText('Other');
    expect(other.getAttribute('aria-expanded')).toBe('false');

    await user.click(other);
    expect(other.getAttribute('aria-expanded')).toBe('true');
    const textBox = screen.getByLabelText('Tell us how your home is heated');
    await user.click(continueButton());
    expect(screen.getAllByText('Enter how your home is heated').length).toBe(2);
    expect(textBox.className).toContain('govuk-input--error');
    await expectNoAxeViolations();
  });
});

describe('navigation and state', () => {
  it('keeps answers when going Back', async () => {
    const user = renderApp();
    await answerAll(user, ['Bungalow']);
    await user.click(await screen.findByRole('link', { name: 'Back' }));
    expect((await screen.findByLabelText('Bungalow')).checked).toBe(true);
  });

  it('Change returns to Check your answers with the new answer, and keeps "Other" text', async () => {
    const user = renderApp();
    await answerAll(user, ELIGIBLE.slice(0, 4));
    await user.click(await screen.findByLabelText('Other'));
    await user.type(screen.getByLabelText('Tell us how your home is heated'), '  Wood stove  ');
    await user.click(continueButton());
    expect(await screen.findByText('Other: Wood stove')).toBeTruthy();

    await user.click(await screen.findByRole('link', { name: 'Change annual household income' }));
    expect((await screen.findByLabelText('Less than £20,000')).checked).toBe(true);
    expect((await screen.findByRole('link', { name: 'Back' })).getAttribute('href')).toBe('/check-answers');
    await answer(user, '£20,000 to £39,999');
    expect(await screen.findByRole('heading', { level: 1, name: 'Check your answers' })).toBeTruthy();
    expect(await screen.findByText('£20,000 to £39,999')).toBeTruthy();
    expect(await screen.findByText('Other: Wood stove')).toBeTruthy();
  });

  it('clears the "Other" text when a different heating answer is chosen', async () => {
    const user = renderApp();
    await answerAll(user, ELIGIBLE.slice(0, 4));
    await user.click(await screen.findByLabelText('Other'));
    await user.type(screen.getByLabelText('Tell us how your home is heated'), 'Wood stove');
    await user.click(continueButton());
    await user.click(await screen.findByRole('link', { name: 'Change main heating' }));
    await answer(user, 'Gas boiler');
    await screen.findByRole('heading', { level: 1, name: 'Check your answers' });
    expect(screen.queryByText(/Wood stove/)).toBeNull();
  });

  it('sends users to the start page if they open the result with no answers', async () => {
    renderApp('/result');
    expect(await screen.findByRole('heading', { level: 1, name: 'Check if you can get a Green Home Grant' })).toBeTruthy();
  });

  it('Start again clears all answers', async () => {
    const user = renderApp();
    await answerAll(user, ELIGIBLE);
    await user.click(await screen.findByRole('button', { name: 'Submit' }));
    await user.click(await screen.findByRole('link', { name: 'Start again' }));
    await user.click(await screen.findByRole('button', { name: /Start now/ }));
    expect((await screen.findByLabelText('Detached house')).checked).toBe(false);
  });
});

describe('layout and Service Standard signals', () => {
  it('has a skip link, phase banner and footer links, with one <main>', () => {
    renderApp();
    expect(document.querySelectorAll('main').length).toBe(1);
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeTruthy();
    expect(screen.getByText('Alpha')).toBeTruthy();
    ['Accessibility statement', 'Cookies', 'Privacy', 'Terms and conditions', 'Help', 'Contact'].forEach((name) =>
      expect(screen.getByRole('link', { name })).toBeTruthy()
    );
  });

  it('cookie banner: accept shows a confirmation, then hides', async () => {
    const user = renderApp();
    await user.click(await screen.findByRole('button', { name: 'Accept analytics cookies' }));
    expect(await screen.findByText(/You’ve accepted analytics cookies/)).toBeTruthy();
    await user.click(await screen.findByRole('button', { name: 'Hide cookie message' }));
    expect(screen.queryByRole('region', { name: /Cookies on/ })).toBeNull();
  });

  it.each(['/accessibility-statement', '/cookies', '/privacy', '/terms-and-conditions', '/help', '/contact', '/feedback', '/no-such-page'])(
    '%s renders with one h1 and no axe violations',
    async (path) => {
      renderApp(path);
      expect(screen.getAllByRole('heading', { level: 1 }).length).toBe(1);
      await expectNoAxeViolations();
    }
  );
});
