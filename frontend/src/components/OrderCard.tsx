import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import type { Order } from '../backend';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const totalAmount = Number(order.totalAmount) / 100;
  const itemCount = order.items.length;

  return (
    <Link to="/orders/$orderId" params={{ orderId: order.id }}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
              <p className="text-lg font-bold mt-2">${totalAmount.toFixed(2)}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
