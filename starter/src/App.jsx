import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CookieBanner from './components/CookieBanner';
import SkipLink from './components/SkipLink';
import GovukHeader from './components/GovukHeader';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import ScrollToTop from './components/ScrollToTop';
import StartPage from './pages/StartPage';
import PropertyTypePage from './pages/PropertyTypePage';
import OwnershipPage from './pages/OwnershipPage';
import IncomePage from './pages/IncomePage';
import InsulationPage from './pages/InsulationPage';
import HeatingPage from './pages/HeatingPage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
import ContentPage, { CONTENT_PAGE_SLUGS } from './pages/ContentPage';
import NotFoundPage from './pages/NotFoundPage';
import { initialAnswers, isComplete } from './data/questions';

// Sends users back to the start if they reach a page that needs every answer (NAV-05)
function RequireAnswers({ answers, children }) {
  return isComplete(answers) ? children : <Navigate to="/" replace />;
}

function App() {
  // All answers live here so they survive Back, Continue and Change (ST-01)
  const [answers, setAnswers] = useState(initialAnswers);
  // 'unset' | 'accepted' | 'rejected' | 'hidden' – session only, no real cookies
  const [cookieChoice, setCookieChoice] = useState('unset');

  const questionProps = { answers, setAnswers };

  return (
    <>
      {cookieChoice !== 'hidden' && (
        <CookieBanner choice={cookieChoice} onChoose={setCookieChoice} onHide={() => setCookieChoice('hidden')} />
      )}
      <SkipLink />
      {/* Phase banner sits inside the header landmark so all content is in a landmark */}
      <header className="govuk-template__header">
        <GovukHeader />
        <PhaseBanner />
      </header>
      <ScrollToTop />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/property-type" element={<PropertyTypePage {...questionProps} />} />
            <Route path="/ownership" element={<OwnershipPage {...questionProps} />} />
            <Route path="/income" element={<IncomePage {...questionProps} />} />
            <Route path="/insulation" element={<InsulationPage {...questionProps} />} />
            <Route path="/heating" element={<HeatingPage {...questionProps} />} />
            <Route
              path="/check-answers"
              element={
                <RequireAnswers answers={answers}>
                  <CheckAnswersPage answers={answers} />
                </RequireAnswers>
              }
            />
            <Route
              path="/result"
              element={
                <RequireAnswers answers={answers}>
                  <ResultPage {...questionProps} />
                </RequireAnswers>
              }
            />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
            {CONTENT_PAGE_SLUGS.map((slug) => (
              <Route key={slug} path={`/${slug}`} element={<ContentPage slug={slug} />} />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
