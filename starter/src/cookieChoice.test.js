import test from 'node:test';
import assert from 'node:assert/strict';
import { readChoice, saveChoice, COOKIE_CHOICE_KEY, CHOICE_LIFETIME_DAYS } from './cookieChoice.js';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 13);

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    has: (k) => data.has(k),
  };
}

test('no choice yet gives null', () => {
  assert.equal(readChoice(fakeStorage(), NOW), null);
});

test('a saved choice is read back', () => {
  const storage = fakeStorage();
  saveChoice('accepted', storage, NOW);
  assert.equal(readChoice(storage, NOW + DAY), 'accepted');
  saveChoice('rejected', storage, NOW);
  assert.equal(readChoice(storage, NOW + DAY), 'rejected');
});

test('a choice lasts for a year, then people are asked again and the old value is removed', () => {
  const storage = fakeStorage();
  saveChoice('accepted', storage, NOW);
  assert.equal(readChoice(storage, NOW + (CHOICE_LIFETIME_DAYS - 1) * DAY), 'accepted');
  assert.equal(readChoice(storage, NOW + CHOICE_LIFETIME_DAYS * DAY), null);
  assert.equal(storage.has(COOKIE_CHOICE_KEY), false);
});

test('the earlier bare-word format is kept and given an expiry date', () => {
  const storage = fakeStorage({ [COOKIE_CHOICE_KEY]: 'accepted' });
  assert.equal(readChoice(storage, NOW), 'accepted');
  assert.equal(JSON.parse(storage.getItem(COOKIE_CHOICE_KEY)).expires, NOW + CHOICE_LIFETIME_DAYS * DAY);
});

test('unreadable or tampered values give null instead of an error', () => {
  for (const bad of ['not json', '{"choice":"maybe","expires":99999999999999}', '{"choice":"accepted"}', '[]', 'null']) {
    assert.equal(readChoice(fakeStorage({ [COOKIE_CHOICE_KEY]: bad }), NOW), null, bad);
  }
});

test('unavailable storage does not throw', () => {
  const broken = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('blocked');
    },
    removeItem: () => {
      throw new Error('blocked');
    },
  };
  assert.equal(readChoice(broken, NOW), null);
  assert.doesNotThrow(() => saveChoice('accepted', broken, NOW));
});
