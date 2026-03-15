import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '../backend';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    pending: { label: 'Pending', className: 'bg-yellow-500 hover:bg-yellow-600' },
    shipped: { label: 'Shipped', className: 'bg-blue-500 hover:bg-blue-600' },
    delivered: { label: 'Delivered', className: 'bg-green-600 hover:bg-green-700' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-500 hover:bg-gray-600' },
  };

  const config = statusConfig[status];

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
