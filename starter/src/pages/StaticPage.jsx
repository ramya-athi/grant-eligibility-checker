import usePageTitle from '../hooks/usePageTitle';

const CONTENT = {
  privacy: {
    title: 'Privacy',
    body: [
      'This is a prototype. The answers you give are kept only in your browser while you use the service and are cleared when you close the tab or start again.',
      'We do not send your answers anywhere, store them on a server, or use them to identify you.',
    ],
  },
  cookies: {
    title: 'Cookies',
    body: [
      'This service uses only essential browser storage to remember your answers and your cookie choice.',
      'We do not use analytics or advertising cookies.',
    ],
  },
  terms: {
    title: 'Terms and conditions',
    body: [
      'The Green Home Grant is a fictional scheme used for this prototype. The result you get is an indication only and is not a real grant decision.',
      'You cannot apply for a real grant using this service.',
    ],
  },
  help: {
    title: 'Help',
    body: [
      'Answer five short questions about your home. At the end you will see whether you may be eligible, partially eligible or not eligible.',
      'You can go back to change an answer at any time before you see your result.',
    ],
  },
  apply: {
    title: 'Apply for the Green Home Grant',
    body: [
      'This is a placeholder for the application service. The Green Home Grant is a fictional scheme, so you cannot apply for a real grant here.',
    ],
  },
  contact: {
    title: 'Contact',
    body: [
      'This is a prototype, so there is no real contact service. In a live service, you would find the contact details for the scheme here.',
    ],
  },
};

export default function StaticPage({ pageKey }) {
  const page = CONTENT[pageKey];
  usePageTitle(page.title);

  return (
    <>
      <h1 className="govuk-heading-l">{page.title}</h1>
      {page.body.map((text) => (
        <p className="govuk-body" key={text}>
          {text}
        </p>
      ))}
    </>
  );
}
