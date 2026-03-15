import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShoppingCart } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import QuantitySelector from '../components/QuantitySelector';
import StockIndicator from '../components/StockIndicator';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' });
  const { data: product, isLoading } = useGetProduct(productId);
  const { identity, login } = useInternetIdentity();
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = !!identity;

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => navigate({ to: '/products' })}>Back to Products</Button>
      </div>
    );
  }

  const price = Number(product.price) / 100;
  const stock = Number(product.stock);
  const isOutOfStock = stock === 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      await login();
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: BigInt(quantity) });
  };

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          <ProductImage product={product} size="lg" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <StockIndicator stock={stock} />
            </div>
            <Badge variant="secondary">{product.category}</Badge>
          </div>

          <p className="text-3xl font-bold">${price.toFixed(2)}</p>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Stock Information</h3>
              <p className="text-muted-foreground">
                {isOutOfStock ? 'Out of stock' : `${stock} units available`}
              </p>
            </CardContent>
          </Card>

          {!isOutOfStock && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={stock}
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                {addToCart.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
                  </>
                )}
              </Button>
            </div>
          )}

          {isOutOfStock && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">This product is currently out of stock.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
