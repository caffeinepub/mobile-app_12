import type { Product } from '../backend';
import { getProductImageUrl } from '../utils/imageHelpers';

interface ProductImageProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProductImage({ product, size = 'md', className = '' }: ProductImageProps) {
  const imageUrl = getProductImageUrl(product);
  
  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-full w-full',
    lg: 'h-full w-full',
  };

  return (
    <img
      src={imageUrl}
      alt={product.name}
      className={`object-cover ${sizeClasses[size]} ${className}`}
      loading="lazy"
    />
  );
}
