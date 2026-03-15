import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const { data: order, isLoading } = useGetOrder(orderId);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Button onClick={() => navigate({ to: '/orders' })}>View Orders</Button>
      </div>
    );
  }

  const totalAmount = Number(order.totalAmount) / 100;

  return (
    <div className="container py-12 max-w-2xl">
      <div className="text-center mb-8">
        <img
          src="/assets/generated/order-success.dim_128x128.png"
          alt="Order success"
          className="h-24 w-24 mx-auto mb-4"
        />
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your order.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono font-semibold">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Shipping Address</p>
            <p className="whitespace-pre-line">{order.shippingAddress}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Items</p>
            <p>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1" onClick={() => navigate({ to: '/orders' })}>
          View All Orders
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => navigate({ to: '/products' })}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
