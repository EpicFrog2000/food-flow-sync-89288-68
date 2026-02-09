# 🔧 Dokumentacja Techniczna – DumplingChat

## Typy danych

### `OrderStatus`
```typescript
type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';
```

### `MenuItem`
```typescript
interface MenuItem {
  name: string;   // Nazwa produktu
  price: number;  // Cena w PLN
}
```

### `OrderItem`
```typescript
interface OrderItem {
  id: string;       // Unikalny identyfikator
  name: string;     // Nazwa produktu
  quantity: number;  // Ilość
  price: number;    // Cena jednostkowa
  notes?: string;   // Uwagi specjalne
}
```

### `Order`
```typescript
interface Order {
  id: string;             // Unikalny identyfikator
  tableNumber: number;    // Numer stolika (1-10)
  items: OrderItem[];     // Lista pozycji
  status: OrderStatus;    // Aktualny status
  createdAt: Date;        // Data utworzenia
  waiterName: string;     // Imię kelnera
  customerName?: string;  // Imię klienta (opcjonalne)
}
```

## Context API

### `OrderContext`
Globalny stan zamówień dostępny przez hook `useOrders()`.

```typescript
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}
```

**Użycie:**
```tsx
const { orders, addOrder, updateOrderStatus } = useOrders();
```

## Routing

| Ścieżka | Komponent | Opis |
|----------|-----------|------|
| `/` | `Index` | Strona główna |
| `/waiter` | `Waiter` | Panel kelnera |
| `/kitchen` | `Kitchen` | Ekran kuchni |
| `/menu` | `Menu` | Zarządzanie menu |
| `/history` | `History` | Historia zamówień |

## Przechowywanie danych

### localStorage
- Klucz: `menuItems`
- Format: `MenuItem[]` (JSON)
- Migracja: obsługuje stary format `string[]` → `MenuItem[]`

### React Context (w pamięci)
- Zamówienia przechowywane w `useState<Order[]>`
- Resetowane po odświeżeniu przeglądarki

## Komponenty współdzielone

### `OrderCard`
Karta wyświetlająca zamówienie z pozycjami, sumą i slotami na przyciski akcji.

### `OrderStatusBadge`
Badge z kolorem i etykietą odpowiadającą statusowi zamówienia.
