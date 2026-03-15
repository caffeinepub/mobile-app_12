import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Package, Menu, X, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function Header() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: cart } = useGetCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const cartItemCount = cart?.length || 0;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/orders', label: 'Orders', authRequired: true },
    { to: '/inventory', label: 'Inventory', authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Store className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">ResellerHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            if (link.authRequired && !isAuthenticated) return null;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>
          )}

          <Button
            onClick={handleAuth}
            disabled={loginStatus === 'logging-in'}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="hidden md:flex"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => {
                  if (link.authRequired && !isAuthenticated) return null;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-sm font-medium transition-colors hover:text-primary py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Button
                  onClick={() => {
                    handleAuth();
                    setMobileMenuOpen(false);
                  }}
                  disabled={loginStatus === 'logging-in'}
                  variant={isAuthenticated ? 'outline' : 'default'}
                  className="mt-4"
                >
                  {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
