import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { AnimatePresence } from 'framer-motion';

import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// Layouts
import Layout from '@/components/layout/Layout';

// Public Pages
import Home from '@/pages/home';
import About from '@/pages/about';
import Services from '@/pages/services';
import Community from '@/pages/community';
import Reviews from '@/pages/reviews';
import Events from '@/pages/events';
import Resources from '@/pages/resources';
import Contact from '@/pages/contact';
import Join from '@/pages/join';

// Admin pages (lazy-ish imports)
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import DashboardHome from '@/pages/admin/DashboardHome';
import PostsManager from '@/pages/admin/PostsManager';
import ReviewsManager from '@/pages/admin/ReviewsManager';
import EventsManager from '@/pages/admin/EventsManager';
import MembersManager from '@/pages/admin/MembersManager';
import TeamManager from '@/pages/admin/TeamManager';
import StatsManager from '@/pages/admin/StatsManager';

const queryClient = new QueryClient();

// ─── Admin Auth Guard ────────────────────────────────────────────────────────

function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: '#f8f9fb' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: 14 }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}

// ─── Admin Dashboard Routes ──────────────────────────────────────────────────

function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <Switch>
        <Route path="/admin/posts">
          <AdminLayout title="Posts Manager"><PostsManager /></AdminLayout>
        </Route>
        <Route path="/admin/reviews">
          <AdminLayout title="Reviews Manager"><ReviewsManager /></AdminLayout>
        </Route>
        <Route path="/admin/events">
          <AdminLayout title="Events Manager"><EventsManager /></AdminLayout>
        </Route>
        <Route path="/admin/members">
          <AdminLayout title="Members Manager"><MembersManager /></AdminLayout>
        </Route>
        <Route path="/admin/team">
          <AdminLayout title="Team Manager"><TeamManager /></AdminLayout>
        </Route>
        <Route path="/admin/stats">
          <AdminLayout title="Stats Manager"><StatsManager /></AdminLayout>
        </Route>
        <Route path="/admin">
          <AdminLayout title="Dashboard"><DashboardHome /></AdminLayout>
        </Route>
      </Switch>
    </AdminAuthGuard>
  );
}

// ─── Router ──────────────────────────────────────────────────────────────────

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    let title = 'Home';
    if (location.startsWith('/about')) title = 'About Us';
    else if (location.startsWith('/services')) title = 'Our Services';
    else if (location.startsWith('/community')) title = 'Community';
    else if (location.startsWith('/reviews')) title = 'Reviews & Testimonials';
    else if (location.startsWith('/events')) title = 'Events';
    else if (location.startsWith('/resources')) title = 'Resources';
    else if (location.startsWith('/contact')) title = 'Contact Us';
    else if (location.startsWith('/join')) title = 'Join BEC';
    else if (location.startsWith('/admin')) title = 'Admin Portal';
    
    document.title = `${title} | Bangladesh Executive Chamber`;
  }, [location]);

  return (
    <RoutedErrorBoundary>
      <Switch location={location}>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/:rest*" component={AdminDashboard} />
        <Route>
          <Layout>
            <AnimatePresence mode="wait">
              <Switch location={location} key={location}>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/services" component={Services} />
                <Route path="/community" component={Community} />
                <Route path="/reviews" component={Reviews} />
                <Route path="/events" component={Events} />
                <Route path="/resources" component={Resources} />
                <Route path="/contact" component={Contact} />
                <Route path="/join" component={Join} />
                <Route component={NotFound} />
              </Switch>
            </AnimatePresence>
          </Layout>
        </Route>
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
        <SonnerToaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
