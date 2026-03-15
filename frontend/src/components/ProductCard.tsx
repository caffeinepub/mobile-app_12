import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../backend';
import ProductImage from './ProductImage';
import StockIndicator from './StockIndicator';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = Number(product.price) / 100;

  return (
    <Link to="/products/$productId" params={{ productId: product.id }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <ProductImage product={product} size="md" />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-2 flex-1">{product.name}</h3>
            <StockIndicator stock={Number(product.stock)} />
          </div>
          <Badge variant="secondary" className="text-xs mb-2">
            {product.category}
          </Badge>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-2xl font-bold">${price.toFixed(2)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
