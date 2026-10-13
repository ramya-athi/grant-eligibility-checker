import { useEffect } from 'react';
import { SERVICE_NAME } from '../data/questions';

// Sets a unique page title (A11Y-08), prefixed with "Error: " when the page has errors (VAL-06)
export default function usePageTitle(heading, hasError = false) {
  useEffect(() => {
    const parts = heading === SERVICE_NAME ? [SERVICE_NAME, 'GOV.UK'] : [heading, SERVICE_NAME, 'GOV.UK'];
    document.title = `${hasError ? 'Error: ' : ''}${parts.join(' – ')}`;
  }, [heading, hasError]);
}
