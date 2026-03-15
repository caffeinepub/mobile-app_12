import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CartItem as CartItemType, Product } from '../backend';
import ProductImage from './ProductImage';
import { useRemoveFromCart } from '../hooks/useQueries';

interface CartItemProps {
  item: CartItemType;
  product: Product | null;
}

export default function CartItem({ item, product }: CartItemProps) {
  const removeFromCart = useRemoveFromCart();

  if (!product) return null;

  const price = Number(product.price) / 100;
  const quantity = Number(item.quantity);
  const subtotal = price * quantity;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
            <ProductImage product={product} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
            <p className="text-sm font-medium mt-1">${price.toFixed(2)} each</p>
          </div>
          <div className="flex flex-col items-end justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFromCart.mutate(item.productId)}
              disabled={removeFromCart.isPending}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <p className="font-bold text-lg">${subtotal.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
