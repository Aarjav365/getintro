import { Route, Routes } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { CodePage } from './pages/claim/CodePage';
import { EmailPage } from './pages/claim/EmailPage';
import { ErrorPage } from './pages/claim/ErrorPage';
import { SuccessPage } from './pages/claim/SuccessPage';
import { LandingPage } from './pages/LandingPage';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="claim/email" element={<EmailPage />} />
        <Route path="claim/code" element={<CodePage />} />
        <Route path="claim/success" element={<SuccessPage />} />
        <Route path="claim/error" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}
