import { lazy, Suspense } from 'react';
import { Route, Router, Switch } from 'wouter';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthPage } from './pages/AuthPage';

const ShooterPage = lazy(() => import('./pages/ShooterPage')
  .then((module) => ({ default: module.ShooterPage })));
const FitnessPage = lazy(() => import('./pages/FitnessPage')
  .then((module) => ({ default: module.FitnessPage })));

// Здесь живут только маршруты. Сами экраны складывай в src/pages/.
export default function App() {
  const base = window.location.hostname.endsWith('github.io') ? '/112345' : undefined;
  return (
    <Router base={base}>
      <Suspense fallback={<main className="container">Загрузка игры…</main>}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/game" component={GamePage} />
          <Route path="/shooter" component={ShooterPage} />
          <Route path="/fitness/:section" component={FitnessPage} />
          <Route path="/fitness" component={FitnessPage} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    </Router>
  );
}
