import { Badge } from '@/components/ui/badge';

interface StockIndicatorProps {
  stock: number;
  threshold?: number;
}

export default function StockIndicator({ stock, threshold = 10 }: StockIndicatorProps) {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className="text-xs">
        Out of Stock
      </Badge>
    );
  }

  if (stock <= threshold) {
    return (
      <Badge className="text-xs bg-orange-500 hover:bg-orange-600">
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge className="text-xs bg-green-600 hover:bg-green-700">
      In Stock
    </Badge>
  );
}
