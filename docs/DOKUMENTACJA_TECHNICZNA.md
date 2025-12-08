# Dokumentacja Techniczna DumplingChat

## Spis Treści

1. [Przegląd Systemu](#przegląd-systemu)
2. [Architektura](#architektura)
3. [Struktura Projektu](#struktura-projektu)
4. [Typy Danych](#typy-danych)
5. [Zarządzanie Stanem](#zarządzanie-stanem)
6. [Komponenty](#komponenty)
7. [Strony](#strony)
8. [Routing](#routing)
9. [Stylowanie](#stylowanie)
10. [Konfiguracja](#konfiguracja)
11. [Rozszerzanie Aplikacji](#rozszerzanie-aplikacji)

---

## Przegląd Systemu

DumplingChat to aplikacja webowa do zarządzania zamówieniami w restauracji. Została zbudowana jako Single Page Application (SPA) przy użyciu React i TypeScript.

### Główne Funkcje
- Przyjmowanie zamówień przez kelnerów
- Wyświetlanie zamówień w kuchni
- Zarządzanie menu produktów
- Przeglądanie historii zamówień
- Śledzenie statusu zamówień w czasie rzeczywistym

### Ograniczenia
- Brak backendu - dane zamówień są w pamięci
- Menu przechowywane w localStorage
- Brak autentykacji użytkowników
- Brak synchronizacji między urządzeniami

---

## Architektura

### Diagram Komponentów

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│                    (BrowserRouter)                           │
├─────────────────────────────────────────────────────────────┤
│                    OrderProvider                             │
│              (Context API - Global State)                    │
├───────────┬───────────┬───────────┬───────────┬─────────────┤
│   Index   │  Waiter   │  Kitchen  │   Menu    │   History   │
│   Page    │   Page    │   Page    │   Page    │    Page     │
├───────────┴───────────┴───────────┴───────────┴─────────────┤
│                    Shared Components                         │
│              (OrderCard, OrderStatusBadge)                   │
├─────────────────────────────────────────────────────────────┤
│                    UI Components                             │
│                     (shadcn/ui)                              │
└─────────────────────────────────────────────────────────────┘
```

### Przepływ Danych

```
┌──────────┐     addOrder()     ┌──────────────┐
│  Waiter  │ ─────────────────► │ OrderContext │
└──────────┘                    └──────────────┘
                                       │
                    useOrders()        │
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                        ▼
        ┌──────────┐            ┌──────────┐            ┌──────────┐
        │  Waiter  │            │  Kitchen │            │  History │
        │ (active) │            │ (active) │            │(completed)│
        └──────────┘            └──────────┘            └──────────┘
              │                        │
              │   updateOrderStatus()  │
              └────────────────────────┘
```

---

## Struktura Projektu

```
src/
├── assets/                 # Zasoby statyczne
│   ├── dumpling-logo.png
│   └── dumpling-logo-new.png
│
├── components/
│   ├── ui/                # Komponenty shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   ├── OrderCard.tsx      # Karta zamówienia
│   └── OrderStatusBadge.tsx  # Badge statusu
│
├── contexts/
│   └── OrderContext.tsx   # Globalny stan zamówień
│
├── hooks/
│   ├── use-mobile.tsx     # Wykrywanie urządzeń mobilnych
│   └── use-toast.ts       # Hook do powiadomień
│
├── lib/
│   └── utils.ts           # Funkcje pomocnicze (cn)
│
├── pages/
│   ├── Index.tsx          # Strona główna
│   ├── Waiter.tsx         # Stanowisko kelnera
│   ├── Kitchen.tsx        # Ekran kuchni
│   ├── Menu.tsx           # Zarządzanie menu
│   ├── History.tsx        # Historia zamówień
│   └── NotFound.tsx       # Strona 404
│
├── types/
│   └── order.ts           # Definicje typów
│
├── App.tsx                # Główny komponent
├── App.css                # Style aplikacji
├── index.css              # Style globalne + Tailwind
├── main.tsx               # Punkt wejściowy
└── vite-env.d.ts          # Typy Vite
```

---

## Typy Danych

### Lokalizacja: `src/types/order.ts`

```typescript
// Status zamówienia
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';

// Pozycja w menu
export interface MenuItem {
  name: string;    // Nazwa produktu
  price: number;   // Cena bazowa w PLN
}

// Pozycja w zamówieniu
export interface OrderItem {
  id: string;           // UUID pozycji
  name: string;         // Nazwa produktu
  quantity: number;     // Ilość
  price: number;        // Cena jednostkowa (może różnić się od bazowej)
  notes?: string;       // Uwagi specjalne
}

// Zamówienie
export interface Order {
  id: string;              // UUID zamówienia
  tableNumber: number;     // Numer stolika (1-10)
  items: OrderItem[];      // Lista pozycji
  status: OrderStatus;     // Aktualny status
  createdAt: Date;         // Data utworzenia
  waiterName: string;      // Imię kelnera
  customerName?: string;   // Imię klienta (opcjonalne)
}
```

---

## Zarządzanie Stanem

### OrderContext

**Lokalizacja:** `src/contexts/OrderContext.tsx`

```typescript
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}
```

#### Metody

##### `addOrder(order: Order)`
Dodaje nowe zamówienie na początek listy.

```typescript
const addOrder = (order: Order) => {
  setOrders(prev => [order, ...prev]);
};
```

##### `updateOrderStatus(orderId: string, status: OrderStatus)`
Aktualizuje status istniejącego zamówienia.

```typescript
const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  setOrders(prev =>
    prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    )
  );
};
```

#### Użycie w komponentach

```typescript
import { useOrders } from '@/contexts/OrderContext';

function MyComponent() {
  const { orders, addOrder, updateOrderStatus } = useOrders();
  
  // Pobierz aktywne zamówienia
  const activeOrders = orders.filter(o => o.status !== 'completed');
  
  // Pobierz zakończone zamówienia
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  // Dodaj zamówienie
  addOrder({
    id: crypto.randomUUID(),
    tableNumber: 1,
    items: [...],
    status: 'new',
    createdAt: new Date(),
    waiterName: 'Barbara'
  });
  
  // Zmień status
  updateOrderStatus('order-id', 'preparing');
}
```

### localStorage (Menu)

Menu jest przechowywane w localStorage pod kluczem `menuItems`.

```typescript
// Odczyt
const savedMenu = localStorage.getItem('menuItems');
const menuItems: MenuItem[] = savedMenu ? JSON.parse(savedMenu) : [];

// Zapis
localStorage.setItem('menuItems', JSON.stringify(menuItems));
```

---

## Komponenty

### OrderCard

**Lokalizacja:** `src/components/OrderCard.tsx`

Wyświetla szczegóły zamówienia w formie karty.

```typescript
interface OrderCardProps {
  order: Order;
  children?: React.ReactNode;  // Przyciski akcji
}
```

**Przykład użycia:**
```tsx
<OrderCard order={order}>
  <Button onClick={() => handleStatusChange(order.id, 'preparing')}>
    Rozpocznij Przygotowanie
  </Button>
</OrderCard>
```

### OrderStatusBadge

**Lokalizacja:** `src/components/OrderStatusBadge.tsx`

Wyświetla kolorowy badge ze statusem.

```typescript
interface OrderStatusBadgeProps {
  status: OrderStatus;
}
```

**Mapowanie kolorów:**
```typescript
const statusConfig = {
  new: { label: 'Nowe', color: 'bg-yellow-500' },
  preparing: { label: 'W przygotowaniu', color: 'bg-blue-500' },
  ready: { label: 'Gotowe', color: 'bg-green-500' },
  completed: { label: 'Zakończone', color: 'bg-gray-500' }
};
```

---

## Strony

### Index (`/`)
Dashboard z kafelkami nawigacji do pozostałych sekcji.

### Waiter (`/waiter`)
- Formularz tworzenia zamówień
- Lista aktywnych zamówień
- Stałe: `WAITERS`, `TABLE_NUMBERS`

### Kitchen (`/kitchen`)
- Siatka aktywnych zamówień
- Przyciski zmiany statusu

### Menu (`/menu`)
- Formularz dodawania produktów
- Lista produktów z edycją ceny
- Integracja z localStorage

### History (`/history`)
- Lista zakończonych zamówień
- Sortowanie od najnowszych

---

## Routing

**Lokalizacja:** `src/App.tsx`

```typescript
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/waiter" element={<Waiter />} />
  <Route path="/kitchen" element={<Kitchen />} />
  <Route path="/menu" element={<Menu />} />
  <Route path="/history" element={<History />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## Stylowanie

### Tailwind CSS

Konfiguracja: `tailwind.config.ts`

### Tokeny Kolorów

Definiowane w `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --success: 142 76% 36%;
  /* ... */
}
```

### Komponenty UI

Projekt używa shadcn/ui z komponentami w `src/components/ui/`.

---

## Konfiguracja

### Zmiana Listy Kelnerów

**Plik:** `src/pages/Waiter.tsx`

```typescript
const WAITERS = ['Barbara', 'Joanna', 'Aleksandra', 'Wiktor'];
```

### Zmiana Liczby Stolików

**Plik:** `src/pages/Waiter.tsx`

```typescript
const TABLE_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);
// Dla 15 stolików:
const TABLE_NUMBERS = Array.from({ length: 15 }, (_, i) => i + 1);
```

---

## Rozszerzanie Aplikacji

### Dodanie Nowego Statusu

1. Zaktualizuj typ w `src/types/order.ts`:
```typescript
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served' | 'completed';
```

2. Dodaj konfigurację w `OrderStatusBadge.tsx`

3. Dodaj przycisk w `getStatusButtons()` w Kitchen.tsx i Waiter.tsx

### Dodanie Persystencji

Aby zachować zamówienia między sesjami:

1. Zmodyfikuj `OrderContext.tsx`:
```typescript
const [orders, setOrders] = useState<Order[]>(() => {
  const saved = localStorage.getItem('orders');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('orders', JSON.stringify(orders));
}, [orders]);
```

### Integracja z Backendem

Aby połączyć z API:

1. Utwórz funkcje API w `src/lib/api.ts`
2. Użyj React Query do zarządzania stanem serwera
3. Zamień localStorage na wywołania API

---

## Zależności

| Pakiet | Wersja | Opis |
|--------|--------|------|
| react | ^18.3.1 | Biblioteka UI |
| react-router-dom | ^6.30.1 | Routing |
| typescript | - | Typowanie |
| tailwindcss | - | Stylowanie |
| @radix-ui/* | - | Prymitywy UI |
| lucide-react | ^0.462.0 | Ikony |
| date-fns | ^3.6.0 | Formatowanie dat |
| sonner | ^1.7.4 | Powiadomienia |
| zod | ^3.25.76 | Walidacja schematów |

---

## Skrypty

```bash
# Uruchomienie deweloperskie
npm run dev

# Budowanie produkcyjne
npm run build

# Podgląd buildu
npm run preview

# Linting
npm run lint
```
