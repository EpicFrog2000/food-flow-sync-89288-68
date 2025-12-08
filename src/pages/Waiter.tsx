import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { Order, OrderItem, OrderStatus, MenuItem } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderCard } from '@/components/OrderCard';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Waiter() {
  const navigate = useNavigate();
  const { orders, addOrder, updateOrderStatus } = useOrders();
  const [tableNumber, setTableNumber] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [currentItems, setCurrentItems] = useState<OrderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const savedMenu = localStorage.getItem('menuItems');
    if (savedMenu) {
      try {
        const parsed = JSON.parse(savedMenu);
        // Migrate old string array to new MenuItem format
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          const migrated = parsed.map((name: string) => ({ name, price: 0 }));
          setMenuItems(migrated);
        } else {
          setMenuItems(parsed);
        }
      } catch (e) {
        setMenuItems([]);
      }
    }
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'completed');

  const addItemToOrder = () => {
    if (!selectedItem) return;
    
    const finalPrice = customPrice ? parseFloat(customPrice) : selectedItem.price;
    
    if (isNaN(finalPrice) || finalPrice < 0) {
      toast.error('Nieprawidłowa cena');
      return;
    }

    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedItem.name,
      quantity,
      price: finalPrice,
      notes: notes || undefined,
    };

    setCurrentItems([...currentItems, newItem]);
    setSelectedItem(null);
    setQuantity(1);
    setCustomPrice('');
    setNotes('');
  };

  const removeItem = (id: string) => {
    setCurrentItems(currentItems.filter(item => item.id !== id));
  };

  const submitOrder = () => {
    if (!tableNumber || !waiterName || currentItems.length === 0) {
      toast.error('Proszę wypełnić wszystkie wymagane pola');
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      tableNumber: parseInt(tableNumber),
      items: currentItems,
      status: 'new',
      createdAt: new Date(),
      waiterName,
      customerName: customerName || undefined,
    };

    addOrder(newOrder);
    toast.success(`Zamówienie dla stolika ${tableNumber} wysłane do kuchni!`);
    
    setTableNumber('');
    setCustomerName('');
    setCurrentItems([]);
  };

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
          variant="outline"
        >
          Oznacz jako w przygotowaniu
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
          Oznacz jako gotowe
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
          Zakończ zamówienie
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
            <h1 className="text-3xl font-bold">Stanowisko Kelnera</h1>
          </div>
          <Button onClick={() => navigate('/kitchen')} variant="secondary">
            Zobacz Kuchnię
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Nowe Zamówienie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="waiter">Imię Kelnera</Label>
                <Input
                  id="waiter"
                  value={waiterName}
                  onChange={(e) => setWaiterName(e.target.value)}
                  placeholder="Wprowadź swoje imię"
                />
              </div>
              
              <div>
                <Label htmlFor="table">Numer Stolika</Label>
                <Input
                  id="table"
                  type="number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Wprowadź numer stolika"
                />
              </div>

              <div>
                <Label htmlFor="customer">Imię Klienta</Label>
                <Input
                  id="customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Wprowadź imię klienta (opcjonalnie)"
                />
              </div>

              <div className="border-t pt-4">
                <Label>Wybierz Produkt</Label>

                <div className="grid grid-cols-2 gap-2 mb-3 mt-2">
                  {menuItems.map((item) => (
                    <Button
                      key={item.name}
                      variant={selectedItem?.name === item.name ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedItem(item);
                        setCustomPrice(item.price.toString());
                      }}
                      className="w-full h-auto py-3 flex flex-col items-start"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm opacity-80">{item.price.toFixed(2)} zł</span>
                    </Button>
                  ))}
                </div>

                {menuItems.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Brak produktów w menu. Dodaj produkty w panelu zarządzania.
                  </p>
                )}

                {selectedItem && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="quantity">Ilość</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="customPrice">Cena (zł)</Label>
                        <Input
                          id="customPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(e.target.value)}
                          placeholder={selectedItem.price.toFixed(2)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Uwagi Specjalne</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="np. Bez cebuli, dodatkowy sos, ekstra ser +2zł"
                      />
                    </div>

                    <Button 
                      onClick={addItemToOrder} 
                      className="w-full"
                      variant="secondary"
                      disabled={!selectedItem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj Pozycję
                    </Button>
                  </div>
                )}
              </div>

              {currentItems.length > 0 && (
                <div className="border-t pt-4">
                  <Label>Pozycje Bieżącego Zamówienia</Label>
                  <div className="space-y-2 mt-2">
                    {currentItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start bg-muted p-3 rounded">
                        <div className="flex-1">
                          <div className="font-medium">
                            {item.quantity}x {item.name}
                          </div>
                          <div className="text-sm text-primary font-semibold">
                            {(item.price * item.quantity).toFixed(2)} zł
                            <span className="text-muted-foreground font-normal ml-1">
                              ({item.price.toFixed(2)} zł/szt.)
                            </span>
                          </div>
                          {item.notes && (
                            <div className="text-sm text-muted-foreground mt-1">{item.notes}</div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Suma:</span>
                        <span className="text-primary">
                          {currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} zł
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={submitOrder} 
                    className="w-full mt-4 bg-accent hover:bg-accent/90"
                  >
                    Wyślij do Kuchni
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Aktywne Zamówienia ({activeOrders.length})</h2>
            <div className="space-y-4">
              {activeOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Brak aktywnych zamówień
                  </CardContent>
                </Card>
              ) : (
                activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order}>
                    <div className="space-y-2">
                      {getStatusButtons(order.id, order.status)}
                    </div>
                  </OrderCard>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
