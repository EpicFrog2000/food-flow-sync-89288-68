import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { MenuItem } from '@/types/order';

export default function Menu() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuItemName, setNewMenuItemName] = useState('');
  const [newMenuItemPrice, setNewMenuItemPrice] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    const savedMenu = localStorage.getItem('menuItems');
    if (savedMenu) {
      try {
        const parsed = JSON.parse(savedMenu);
        // Migrate old string array to new MenuItem format
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          const migrated = parsed.map((name: string) => ({ name, price: 0 }));
          setMenuItems(migrated);
          localStorage.setItem('menuItems', JSON.stringify(migrated));
        } else {
          setMenuItems(parsed);
        }
      } catch (e) {
        setMenuItems([]);
      }
    }
  }, []);

  const addMenuItem = () => {
    if (!newMenuItemName.trim()) {
      toast.error('Proszę wprowadzić nazwę produktu');
      return;
    }
    
    const price = parseFloat(newMenuItemPrice) || 0;
    if (price < 0) {
      toast.error('Cena nie może być ujemna');
      return;
    }

    const newItem: MenuItem = {
      name: newMenuItemName.trim(),
      price: price
    };
    
    const updatedMenu = [...menuItems, newItem];
    setMenuItems(updatedMenu);
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu));
    toast.success(`"${newMenuItemName}" dodano do menu`);
    setNewMenuItemName('');
    setNewMenuItemPrice('');
  };

  const removeMenuItem = (itemName: string) => {
    const updatedMenu = menuItems.filter(i => i.name !== itemName);
    setMenuItems(updatedMenu);
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu));
    toast.success(`"${itemName}" usunięto z menu`);
  };

  const startEditPrice = (item: MenuItem) => {
    setEditingItem(item.name);
    setEditPrice(item.price.toString());
  };

  const savePrice = (itemName: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Nieprawidłowa cena');
      return;
    }

    const updatedMenu = menuItems.map(item => 
      item.name === itemName ? { ...item, price } : item
    );
    setMenuItems(updatedMenu);
    localStorage.setItem('menuItems', JSON.stringify(updatedMenu));
    toast.success('Cena zaktualizowana');
    setEditingItem(null);
    setEditPrice('');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Wstecz
            </Button>
            <h1 className="text-3xl font-bold">Zarządzanie Menu</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dodaj Nowy Produkt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newItemName">Nazwa Produktu</Label>
                <Input
                  id="newItemName"
                  value={newMenuItemName}
                  onChange={(e) => setNewMenuItemName(e.target.value)}
                  placeholder="np. Tiramisu, Lasagne"
                  onKeyDown={(e) => e.key === 'Enter' && addMenuItem()}
                />
              </div>
              <div>
                <Label htmlFor="newItemPrice">Cena (zł)</Label>
                <Input
                  id="newItemPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newMenuItemPrice}
                  onChange={(e) => setNewMenuItemPrice(e.target.value)}
                  placeholder="0.00"
                  onKeyDown={(e) => e.key === 'Enter' && addMenuItem()}
                />
              </div>
            </div>
            <Button onClick={addMenuItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj Produkt
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Aktualne Menu ({menuItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-lg">{item.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMenuItem(item.name)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingItem === item.name ? (
                        <>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') savePrice(item.name);
                              if (e.key === 'Escape') setEditingItem(null);
                            }}
                          />
                          <span className="text-sm text-muted-foreground">zł</span>
                          <Button 
                            size="sm" 
                            onClick={() => savePrice(item.name)}
                          >
                            Zapisz
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setEditingItem(null)}
                          >
                            Anuluj
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-xl font-semibold text-primary">
                            {item.price.toFixed(2)} zł
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditPrice(item)}
                            className="ml-auto"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {menuItems.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Brak produktów w menu
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
