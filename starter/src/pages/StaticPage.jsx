import PageBackLink from '../components/PageBackLink';
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
      'This service does not set any cookies, and it does not use analytics or advertising.',
      'It does use your browser\'s storage. This is a small amount of information kept on your own device, and it is never sent to us. The table shows what is kept.',
    ],
    table: {
      caption: 'Browser storage used by this service',
      head: ['Name', 'What it is for', 'How long it is kept'],
      rows: [
        ['green-home-grant-answers', 'Remembers your answers while you use the service, so you can go back and change them.', 'Until you close this browser tab'],
        ['green-home-grant-reference', 'Remembers your reference number, so it stays the same if you reload your result.', 'Until you close this browser tab'],
        ['green-home-grant-cookie-choice', 'Remembers that you have seen the message about cookies, so we do not show it on every page.', '1 year'],
      ],
    },
    after: ['You can clear all of these at any time in your browser settings. If you do, you will start again from the first question.'],
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
      <PageBackLink />
      <h1 className="govuk-heading-l">{page.title}</h1>
      {page.body.map((text) => (
        <p className="govuk-body" key={text}>
          {text}
        </p>
      ))}
      {page.table && (
        <table className="govuk-table">
          <caption className="govuk-table__caption govuk-table__caption--m">{page.table.caption}</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              {page.table.head.map((heading) => (
                <th scope="col" className="govuk-table__header" key={heading}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {page.table.rows.map((row) => (
              <tr className="govuk-table__row" key={row[0]}>
                <th scope="row" className="govuk-table__header">
                  {row[0]}
                </th>
                {row.slice(1).map((cell) => (
                  <td className="govuk-table__cell" key={cell}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(page.after || []).map((text) => (
        <p className="govuk-body" key={text}>
          {text}
        </p>
      ))}
    </>
  );
}
