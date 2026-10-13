// Copies GOV.UK Frontend fonts and images into public/assets so the
// url(/assets/...) references in govuk-frontend.min.css resolve.
// Runs automatically before `npm run dev` and `npm run build`.
import { cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const from = fileURLToPath(new URL('../node_modules/govuk-frontend/dist/govuk/assets', import.meta.url));
const to = fileURLToPath(new URL('../public/assets', import.meta.url));

cpSync(from, to, { recursive: true });
console.log('Copied GOV.UK Frontend assets to public/assets');
