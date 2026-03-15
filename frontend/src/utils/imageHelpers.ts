import type { Product } from '../backend';

const FALLBACK_IMAGES: Record<string, string> = {
  electronics: '/assets/generated/product-phone.dim_400x400.png',
  laptop: '/assets/generated/product-laptop.dim_400x400.png',
  accessories: '/assets/generated/product-headphones.dim_400x400.png',
  wearables: '/assets/generated/product-watch.dim_400x400.png',
};

const DEFAULT_FALLBACK = '/assets/generated/product-phone.dim_400x400.png';

export function getProductImageUrl(product: Product): string {
  try {
    if (product.image) {
      const directUrl = product.image.getDirectURL();
      if (directUrl) return directUrl;
    }
  } catch (error) {
    console.warn('Failed to get product image URL:', error);
  }

  const category = product.category.toLowerCase();
  return FALLBACK_IMAGES[category] || DEFAULT_FALLBACK;
}

export function getCategoryFallbackImage(category: string): string {
  const categoryLower = category.toLowerCase();
  return FALLBACK_IMAGES[categoryLower] || DEFAULT_FALLBACK;
}
