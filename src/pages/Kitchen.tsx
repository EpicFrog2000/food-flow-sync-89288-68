import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { OrderCard } from '@/components/OrderCard';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Kitchen() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();

  const activeOrders = orders.filter(o => o.status !== 'completed');

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const getStatusButtons = (orderId: string, currentStatus: OrderStatus) => {
    const buttons = [];
    
    if (currentStatus === 'new') {
      buttons.push(
        <Button
          key="preparing"
          onClick={() => handleStatusChange(orderId, 'preparing')}
          className="w-full"
        >
          Rozpocznij Przygotowanie
        </Button>
      );
    }
    
    if (currentStatus === 'preparing') {
      buttons.push(
        <Button
          key="ready"
          onClick={() => handleStatusChange(orderId, 'ready')}
          className="w-full bg-success hover:bg-success/90"
        >
          Oznacz jako Gotowe
        </Button>
      );
    }
    
    if (currentStatus === 'ready') {
      buttons.push(
        <Button
          key="completed"
          onClick={() => handleStatusChange(orderId, 'completed')}
          className="w-full"
          variant="secondary"
        >
          Zakończ Zamówienie
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Wstecz
            </Button>
            <h1 className="text-3xl font-bold">Ekran Kuchni</h1>
          </div>
          <div className="text-lg font-semibold">
            Aktywne Zamówienia: {activeOrders.length}
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-2xl text-muted-foreground">Brak aktywnych zamówień</p>
              <p className="text-muted-foreground mt-2">Oczekiwanie na nowe zamówienia od kelnerów...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order}>
                <div className="space-y-2">
                  {getStatusButtons(order.id, order.status)}
                </div>
              </OrderCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
