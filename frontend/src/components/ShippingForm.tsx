import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ShippingFormProps {
  address: string;
  onAddressChange: (address: string) => void;
}

export default function ShippingForm({ address, onAddressChange }: ShippingFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Shipping Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Enter your complete shipping address"
          rows={4}
          required
        />
      </div>
    </div>
  );
}
