import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Wholesale E-Commerce Platform
              </h1>
              <p className="text-lg text-muted-foreground">
                Streamline your reselling business with our comprehensive inventory management and order tracking system.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/products">Browse Products</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/inventory">View Inventory</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-96">
              <img
                src="/assets/generated/hero-banner.dim_1200x400.png"
                alt="E-commerce hero"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose ResellerHub?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Inventory Management</h3>
            <p className="text-muted-foreground">
              Track stock levels in real-time with low-stock alerts to never miss a sale.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy Ordering</h3>
            <p className="text-muted-foreground">
              Streamlined checkout process with comprehensive order tracking and history.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Business Growth</h3>
            <p className="text-muted-foreground">
              Scale your reselling business with powerful tools and insights.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of resellers who trust ResellerHub for their wholesale needs.
          </p>
          <Button size="lg" asChild>
            <Link to="/products">Explore Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
