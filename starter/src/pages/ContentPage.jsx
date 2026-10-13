import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

const CONTACT_EMAIL = 'greenhomegrant@example.gov.uk';

// Placeholder content pages linked from the footer and phase banner (LAY-08)
const PAGES = {
  cookies: {
    title: 'Cookies',
    paragraphs: [
      'This is a prototype. It does not set any cookies, including analytics cookies.',
      'The cookie banner shows how a live service would ask for your permission. Your choice is only kept until you refresh or close the page.',
    ],
  },
  privacy: {
    title: 'Privacy',
    paragraphs: [
      'This is a prototype. We do not collect, store or share any personal data.',
      'Your answers are kept in your browser only while you use the service, and are cleared when you refresh or close the page.',
    ],
  },
  'terms-and-conditions': {
    title: 'Terms and conditions',
    paragraphs: [
      'This is a prototype of a fictional government scheme, built for training purposes.',
      'The result you get is not a decision on a real grant application.',
    ],
  },
  help: {
    title: 'Help',
    paragraphs: [
      'If you are not sure how to answer a question, choose the option that is closest to your situation. You can change any answer before you submit.',
      'For other help to make your home more energy efficient, contact your local council.',
    ],
  },
  contact: {
    title: 'Contact',
    paragraphs: [`Email: ${CONTACT_EMAIL}`, 'We aim to reply within 5 working days.'],
  },
  feedback: {
    title: 'Give feedback',
    paragraphs: [
      'A feedback form is coming soon.',
      `Until then, email your feedback to ${CONTACT_EMAIL}.`,
    ],
  },
};

export const CONTENT_PAGE_SLUGS = Object.keys(PAGES);

export default function ContentPage({ slug }) {
  const page = PAGES[slug];
  usePageTitle(page.title);

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">{page.title}</h1>
        {page.paragraphs.map((text) => (
          <p className="govuk-body" key={text}>
            {text}
          </p>
        ))}
        <p className="govuk-body">
          <Link to="/" className="govuk-link">
            Go to the start of the service
          </Link>
        </p>
      </div>
    </div>
  );
}
