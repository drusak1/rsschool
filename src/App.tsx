import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { NavBar } from './components/NavBar/NavBar';
import { MainPage } from './pages/MainPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CharacterDetail } from './components/CharacterDetail/CharacterDetail';
import { Flyout } from './components/Flyout/Flyout';

export function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider>
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
        <Flyout />
      </ThemeProvider>
    </Provider>
  );
}
