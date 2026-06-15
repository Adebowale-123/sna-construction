import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function PublicLayout() {
  useScrollReveal();
  const location = useLocation();
  // Re-trigger reveal on route change (useEffect in hook fires on every render)
  void location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
