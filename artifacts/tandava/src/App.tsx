import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setBaseUrl } from "@workspace/api-client-react";

// Configure the generated API client. When VITE_API_URL is set (split Vercel
// deployment), every relative `/api/...` request is prefixed with the API
// origin. When unset, requests stay relative and hit the same origin (works
// in dev via the Vite proxy and in single-origin deployments).
const apiBaseUrl = import.meta.env.VITE_API_URL;
if (apiBaseUrl) {
  setBaseUrl(apiBaseUrl);
}
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingActions } from "@/components/FloatingActions";
import { PageLoader } from "@/components/PageLoader";
import Home from "@/pages/home";
import Packages from "@/pages/packages";
import PackageDetail from "@/pages/package-detail";
import Fleet from "@/pages/fleet";
import FleetDetail from "@/pages/fleet-detail";
import Gallery from "@/pages/gallery";
import About from "@/pages/about";
import Contact from "@/pages/contact";

import AdminLogin from "@/pages/admin/login";
import AdminLayout from "@/pages/admin/layout";
import Dashboard from "@/pages/admin/dashboard";
import AdminPackages from "@/pages/admin/packages";
import AdminVehicles from "@/pages/admin/vehicles";
import AdminGallery from "@/pages/admin/gallery";
import AdminInstagram from "@/pages/admin/instagram";
import AdminReviews from "@/pages/admin/reviews";
import AdminSettings from "@/pages/admin/settings";
import AdminChangePassword from "@/pages/admin/change-password";

const queryClient = new QueryClient();

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/packages">
        <PublicLayout><Packages /></PublicLayout>
      </Route>
      <Route path="/packages/:id">
        <PublicLayout><PackageDetail /></PublicLayout>
      </Route>
      <Route path="/fleet">
        <PublicLayout><Fleet /></PublicLayout>
      </Route>
      <Route path="/fleet/:id">
        <PublicLayout><FleetDetail /></PublicLayout>
      </Route>
      <Route path="/gallery">
        <PublicLayout><Gallery /></PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout><About /></PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout><Contact /></PublicLayout>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />

      <Route path="/admin">
        <AdminLayout><Dashboard /></AdminLayout>
      </Route>
      <Route path="/admin/packages">
        <AdminLayout><AdminPackages /></AdminLayout>
      </Route>
      <Route path="/admin/vehicles">
        <AdminLayout><AdminVehicles /></AdminLayout>
      </Route>
      <Route path="/admin/gallery">
        <AdminLayout><AdminGallery /></AdminLayout>
      </Route>
      <Route path="/admin/instagram">
        <AdminLayout><AdminInstagram /></AdminLayout>
      </Route>
      <Route path="/admin/reviews">
        <AdminLayout><AdminReviews /></AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout><AdminSettings /></AdminLayout>
      </Route>
      <Route path="/admin/change-password">
        <AdminLayout><AdminChangePassword /></AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PageLoader />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
