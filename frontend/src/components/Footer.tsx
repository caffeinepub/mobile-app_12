import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'reseller-hub');

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">ResellerHub</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for wholesale e-commerce solutions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/products" className="hover:text-foreground transition-colors">Products</a></li>
              <li><a href="/orders" className="hover:text-foreground transition-colors">Orders</a></li>
              <li><a href="/inventory" className="hover:text-foreground transition-colors">Inventory</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} ResellerHub. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
