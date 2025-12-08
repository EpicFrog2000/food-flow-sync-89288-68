import { Order } from '@/types/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Clock, User } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  children?: React.ReactNode;
}

export const OrderCard = ({ order, children }: OrderCardProps) => {
  const timeAgo = Math.floor((Date.now() - order.createdAt.getTime()) / 60000);
  const timeLabel = timeAgo === 1 ? 'minutę temu' : timeAgo < 5 ? `${timeAgo} minuty temu` : `${timeAgo} minut temu`;

  return (
    <Card className="shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Stolik {order.tableNumber}</CardTitle>
            {order.customerName && (
              <p className="text-sm text-muted-foreground mt-1">Klient: {order.customerName}</p>
            )}
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{order.waiterName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeLabel}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="py-2 border-b border-border/50 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-primary font-semibold mt-1">
                    {(item.price * item.quantity).toFixed(2)} zł
                    <span className="text-muted-foreground font-normal ml-1">
                      ({item.price.toFixed(2)} zł × {item.quantity})
                    </span>
                  </div>
                  {item.notes && (
                    <div className="text-sm text-muted-foreground italic mt-1">{item.notes}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Suma:</span>
              <span className="text-primary">
                {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} zł
              </span>
            </div>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
};
