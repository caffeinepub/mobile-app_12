import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

export default function QuantitySelector({ quantity, onQuantityChange, max = 999, min = 1 }: QuantitySelectorProps) {
  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    onQuantityChange(clampedValue);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className="w-20 text-center"
        min={min}
        max={max}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
