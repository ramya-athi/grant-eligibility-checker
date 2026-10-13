import { useEffect } from 'react';

// Keeps the browser tab title in step with the page's main heading.
export default function usePageTitle(heading) {
  useEffect(() => {
    document.title = `${heading} - Green Home Grant - GOV.UK`;
  }, [heading]);
}
