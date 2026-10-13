import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateReference, ukDate, REFERENCE_ALPHABET } from './reference.js';

const FORMAT = /^ELG-\d{6}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

test('reference has the format ELG-ddmmyy-XXXXXX', () => {
  const reference = generateReference(new Date('2026-10-13T13:05:00Z'));
  assert.match(reference, FORMAT);
  assert.ok(reference.startsWith('ELG-131026-'), reference);
});

test('random part never uses the look-alike characters 0, O, 1, I or L', () => {
  for (let i = 0; i < 2000; i += 1) {
    const random = generateReference().slice(-6);
    assert.doesNotMatch(random, /[0O1IL]/, random);
  }
  assert.equal(REFERENCE_ALPHABET.length, 31);
});

test('date is the UK date, even just after midnight in British Summer Time', () => {
  // 23:30 UTC on 30 June is 00:30 on 1 July in the UK
  assert.equal(ukDate(new Date('2026-06-30T23:30:00Z')), '010726');
  // In winter the UK is on UTC
  assert.equal(ukDate(new Date('2026-12-31T23:30:00Z')), '311226');
});

test('uses the random source it is given', () => {
  const zeros = (array) => array.fill(0);
  assert.equal(generateReference(new Date('2026-10-13T12:00:00Z'), zeros), 'ELG-131026-AAAAAA');
});

test('two references are different', () => {
  assert.notEqual(generateReference(), generateReference());
});
