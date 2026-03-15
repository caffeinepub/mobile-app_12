import { useNavigate } from '@tanstack/react-router';
import { useGetUserOrders } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Loader2, Package } from 'lucide-react';
import OrderCard from '../components/OrderCard';

export default function OrderHistoryPage() {
  const { identity, login } = useInternetIdentity();
  const { data: orders, isLoading } = useGetUserOrders();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Order History</h1>
        <p className="text-muted-foreground mb-6">Please login to view your orders.</p>
        <Button onClick={login}>Login</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container py-12 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
        <Button onClick={() => navigate({ to: '/products' })}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
