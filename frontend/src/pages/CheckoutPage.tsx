import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useGetAllProducts, useCheckout } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ShippingForm from '../components/ShippingForm';

export default function CheckoutPage() {
  const { identity, login } = useInternetIdentity();
  const { data: cart } = useGetCart();
  const { data: allProducts } = useGetAllProducts();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');

  const isAuthenticated = !!identity;

  const cartWithProducts = useMemo(() => {
    if (!cart || !allProducts) return [];
    return cart.map((item) => ({
      item,
      product: allProducts.find((p) => p.id === item.productId) || null,
    }));
  }, [cart, allProducts]);

  const totalAmount = useMemo(() => {
    return cartWithProducts.reduce((sum, { item, product }) => {
      if (!product) return sum;
      const price = Number(product.price) / 100;
      const quantity = Number(item.quantity);
      return sum + price * quantity;
    }, 0);
  }, [cartWithProducts]);

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      return;
    }

    try {
      const orderId = await checkout.mutateAsync(shippingAddress);
      navigate({ to: '/order-confirmation/$orderId', params: { orderId } });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-muted-foreground mb-6">Please login to continue.</p>
        <Button onClick={login}>Login</Button>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Button onClick={() => navigate({ to: '/products' })}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ShippingForm address={shippingAddress} onAddressChange={setShippingAddress} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartWithProducts.map(({ item, product }) => {
              if (!product) return null;
              const price = Number(product.price) / 100;
              const quantity = Number(item.quantity);
              const subtotal = price * quantity;

              return (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {product.name} × {quantity}
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
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

        <Button
          size="lg"
          onClick={handleCheckout}
          disabled={checkout.isPending || !shippingAddress.trim()}
        >
          {checkout.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Confirm Order'
          )}
        </Button>
      </div>
    </div>
  );
}
