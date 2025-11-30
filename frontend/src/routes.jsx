import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from './store/userStore';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Account = lazy(() => import('./pages/Account'));
const Orders = lazy(() => import('./pages/Orders'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));

// Private route wrapper
function PrivateRoute({ children }) {
  const { user } = useUserStore();
  return user ? children : <Navigate to="/signin" replace />;
}

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/catalog',
    element: <Catalog />,
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/checkout',
    element: (
      <PrivateRoute>
        <Checkout />
      </PrivateRoute>
    ),
  },
  {
    path: '/order-confirmation',
    element: (
      <PrivateRoute>
        <OrderConfirmation />
      </PrivateRoute>
    ),
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/account',
    element: (
      <PrivateRoute>
        <Account />
      </PrivateRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <PrivateRoute>
        <Orders />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <PrivateRoute>
        <AdminUsers />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/products',
    element: (
      <PrivateRoute>
        <AdminProducts />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
