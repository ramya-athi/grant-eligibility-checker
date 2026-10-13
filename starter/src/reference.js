// Reference number for a submitted check, made in the browser and only shown on the result page.
// Nothing is sent to or stored on a server (spec.md requirements 54-60).

// Upper-case letters and numbers without the look-alikes 0, O, 1, I and L (31 characters)
export const REFERENCE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

// ddmmyy for the date in the UK (Europe/London), whatever time zone the device is set to
export function ukDate(now) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).formatToParts(now);
  const part = (type) => parts.find((p) => p.type === type).value;
  return `${part('day')}${part('month')}${part('year')}`;
}

// One random index into the alphabet. Values that would favour some characters are thrown away.
function randomIndex(getRandomValues) {
  const limit = Math.floor(2 ** 32 / REFERENCE_ALPHABET.length) * REFERENCE_ALPHABET.length;
  const value = new Uint32Array(1);
  do {
    getRandomValues(value);
  } while (value[0] >= limit);
  return value[0] % REFERENCE_ALPHABET.length;
}

// ELG-ddmmyy-XXXXXX, for example ELG-131026-7KQ2ZD
export function generateReference(now = new Date(), getRandomValues = (array) => crypto.getRandomValues(array)) {
  let random = '';
  for (let i = 0; i < 6; i += 1) random += REFERENCE_ALPHABET[randomIndex(getRandomValues)];
  return `ELG-${ukDate(now)}-${random}`;
}
