import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, CartItem, Order, UserProfile } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useSearchProducts(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.length > 0,
  });
}

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

// Cart Queries
export function useGetCart() {
  const { actor, isFetching } = useActor();

  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add to cart');
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Removed from cart');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove from cart');
    },
  });
}

// Order Queries
export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shippingAddress: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkout(shippingAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Checkout failed');
    },
  });
}

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrder(orderId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

// Inventory Queries
export function useGetLowStockProducts(threshold: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'lowStock', threshold.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLowStockProducts(threshold);
    },
    enabled: !!actor && !isFetching,
  });
}
