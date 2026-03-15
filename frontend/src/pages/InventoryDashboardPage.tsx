import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts, useGetLowStockProducts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertTriangle } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import StockIndicator from '../components/StockIndicator';

export default function InventoryDashboardPage() {
  const { identity, login } = useInternetIdentity();
  const { data: allProducts, isLoading: allLoading } = useGetAllProducts();
  const { data: lowStockProducts, isLoading: lowStockLoading } = useGetLowStockProducts(BigInt(10));
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Inventory Dashboard</h1>
        <p className="text-muted-foreground mb-6">Please login to view inventory.</p>
        <Button onClick={login}>Login</Button>
      </div>
    );
  }

  if (allLoading || lowStockLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Dashboard</h1>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Products ({allProducts?.length || 0})</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock ({lowStockProducts?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allProducts && allProducts.length > 0 ? (
            allProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                      <ProductImage product={product} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="text-sm font-medium mt-1">
                        ${(Number(product.price) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StockIndicator stock={Number(product.stock)} />
                      <p className="text-sm text-muted-foreground">
                        {Number(product.stock)} units
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products in inventory.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          {lowStockProducts && lowStockProducts.length > 0 ? (
            <>
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    {lowStockProducts.length} {lowStockProducts.length === 1 ? 'product' : 'products'} running low on stock
                  </p>
                </div>
              </div>
              {lowStockProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow border-orange-200 dark:border-orange-900">
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                        <ProductImage product={product} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-sm font-medium mt-1">
                          ${(Number(product.price) / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StockIndicator stock={Number(product.stock)} />
                        <p className="text-sm font-semibold text-orange-600">
                          Only {Number(product.stock)} left!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No low stock products.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
