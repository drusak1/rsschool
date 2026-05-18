import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { NavBar } from './components/NavBar/NavBar';
import { MainPage } from './pages/MainPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CharacterDetail } from './components/CharacterDetail/CharacterDetail';

export function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="character/:id" element={<CharacterDetail />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
