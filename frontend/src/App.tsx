import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import HomePage from './pages/HomePage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import InventoryDashboardPage from './pages/InventoryDashboardPage';

function Layout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductCatalogPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrderHistoryPage,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  component: OrderDetailPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: InventoryDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  ordersRoute,
  orderDetailRoute,
  inventoryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
