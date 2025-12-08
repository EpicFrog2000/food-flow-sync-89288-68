import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { OrderCard } from '@/components/OrderCard';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  
  const completedOrders = orders.filter(order => order.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <History className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Historia Zamówień</h1>
              <p className="text-muted-foreground">
                Zakończone zamówienia: {completedOrders.length}
              </p>
            </div>
          </div>
        </div>

        {completedOrders.length === 0 ? (
          <div className="text-center py-16">
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Brak zakończonych zamówień</h2>
            <p className="text-muted-foreground">
              Zakończone zamówienia pojawią się tutaj
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
