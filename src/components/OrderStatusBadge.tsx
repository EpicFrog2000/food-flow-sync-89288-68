import { OrderStatus } from '@/types/order';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  new: { label: 'Nowe Zamówienie', className: 'bg-accent text-accent-foreground' },
  preparing: { label: 'W Przygotowaniu', className: 'bg-primary text-primary-foreground' },
  ready: { label: 'Gotowe', className: 'bg-success text-success-foreground' },
  completed: { label: 'Zakończone', className: 'bg-muted text-muted-foreground' },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};
