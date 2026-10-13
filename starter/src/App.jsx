import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SkipLink from './components/SkipLink';
import CookieBanner from './components/CookieBanner';
import GovukHeader from './components/GovukHeader';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import useAnswers from './hooks/useAnswers';
import StartPage from './pages/StartPage';
import PropertyTypePage from './pages/PropertyTypePage';
import OwnershipPage from './pages/OwnershipPage';
import IncomePage from './pages/IncomePage';
import InsulationPage from './pages/InsulationPage';
import HeatingPage from './pages/HeatingPage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
import StaticPage from './pages/StaticPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { answers, setAnswer, resetAnswers, reference, setReference } = useAnswers();
  const questionProps = { answers, setAnswer };

  // A new page in a single-page app does not reset keyboard focus the way a full page load does.
  // Put focus back at the very top so the next Tab press reaches the skip link first.
  const location = useLocation();
  const topRef = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    if (topRef.current) topRef.current.focus();
  }, [location.pathname, location.search]);

  return (
    <>
      <div ref={topRef} tabIndex={-1} className="page-top" />
      <SkipLink />
      <CookieBanner />
      <GovukHeader />
      <PhaseBanner phase="alpha" feedbackTo="/contact" />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content" role="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/ownership" element={<OwnershipPage {...questionProps} />} />
            <Route path="/income" element={<IncomePage {...questionProps} />} />
            <Route path="/property-type" element={<PropertyTypePage {...questionProps} />} />
            <Route path="/insulation" element={<InsulationPage {...questionProps} />} />
            <Route path="/heating" element={<HeatingPage {...questionProps} />} />
            <Route
              path="/check-answers"
              element={<CheckAnswersPage answers={answers} setReference={setReference} />}
            />
            <Route
              path="/result"
              element={<ResultPage answers={answers} reference={reference} resetAnswers={resetAnswers} />}
            />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
            <Route path="/privacy" element={<StaticPage pageKey="privacy" />} />
            <Route path="/cookies" element={<StaticPage pageKey="cookies" />} />
            <Route path="/terms" element={<StaticPage pageKey="terms" />} />
            <Route path="/help" element={<StaticPage pageKey="help" />} />
            <Route path="/contact" element={<StaticPage pageKey="contact" />} />
            <Route path="/apply" element={<StaticPage pageKey="apply" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
