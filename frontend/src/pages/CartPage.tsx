import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useGetAllProducts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingCart } from 'lucide-react';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { identity, login } = useInternetIdentity();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: allProducts } = useGetAllProducts();
  const navigate = useNavigate();

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

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="text-muted-foreground mb-6">Please login to view your cart.</p>
        <Button onClick={login}>Login</Button>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container py-12 text-center">
        <img
          src="/assets/generated/cart-icon.dim_128x128.png"
          alt="Empty cart"
          className="h-32 w-32 mx-auto mb-4 opacity-50"
        />
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Add some products to get started!</p>
        <Button onClick={() => navigate({ to: '/products' })}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartWithProducts.map(({ item, product }) => (
            <CartItem key={item.productId} item={item} product={product} />
          ))}
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items ({cart.length})</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate({ to: '/checkout' })}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
