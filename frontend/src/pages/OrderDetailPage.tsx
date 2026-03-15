import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetOrder, useGetAllProducts } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { useMemo } from 'react';

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' });
  const { data: order, isLoading: orderLoading } = useGetOrder(orderId);
  const { data: allProducts } = useGetAllProducts();
  const navigate = useNavigate();

  const orderItems = useMemo(() => {
    if (!order || !allProducts) return [];
    return order.items.map((item) => ({
      item,
      product: allProducts.find((p) => p.id === item.productId) || null,
    }));
  }, [order, allProducts]);

  if (orderLoading) {
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
        <Button onClick={() => navigate({ to: '/orders' })}>Back to Orders</Button>
      </div>
    );
  }

  const totalAmount = Number(order.totalAmount) / 100;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/orders' })}>
          ← Back to Orders
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Order #{order.id.slice(-8)}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map(({ item, product }) => {
              if (!product) return null;
              const price = Number(product.price) / 100;
              const quantity = Number(item.quantity);
              const subtotal = price * quantity;

              return (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${price.toFixed(2)} × {quantity}
                    </p>
                  </div>
                  <p className="font-semibold">${subtotal.toFixed(2)}</p>
                </div>
              );
            })}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{order.shippingAddress}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
