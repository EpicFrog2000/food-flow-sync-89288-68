# 🥟 DumplingChat - System Zarządzania Zamówieniami

System zarządzania zamówieniami dla restauracji, zbudowany w React + TypeScript.

## 🚀 Szybki Start

```bash
npm install
npm run dev
```

Aplikacja uruchomi się na `http://localhost:5173`

## 📋 Funkcjonalności

| Moduł | Opis |
|-------|------|
| **Strona Główna** (`/`) | Panel nawigacyjny z kafelkami do poszczególnych modułów |
| **Kelner** (`/waiter`) | Tworzenie zamówień, wybór produktów, zarządzanie statusami |
| **Kuchnia** (`/kitchen`) | Podgląd aktywnych zamówień, zmiana statusów przygotowania |
| **Menu** (`/menu`) | Zarządzanie produktami – dodawanie, edycja cen, usuwanie |
| **Historia** (`/history`) | Podgląd zakończonych zamówień |

## 🏗️ Architektura

```
src/
├── components/          # Komponenty współdzielone
│   ├── ui/              # Shadcn/UI komponenty bazowe
│   ├── OrderCard.tsx    # Karta zamówienia
│   └── OrderStatusBadge.tsx  # Badge statusu
├── contexts/
│   └── OrderContext.tsx  # Globalny stan zamówień (React Context)
├── pages/               # Strony/widoki
│   ├── Index.tsx         # Strona główna
│   ├── Waiter.tsx        # Panel kelnera
│   ├── Kitchen.tsx       # Ekran kuchni
│   ├── Menu.tsx          # Zarządzanie menu
│   └── History.tsx       # Historia zamówień
└── types/
    └── order.ts          # Typy TypeScript
```

## 📊 Przepływ Zamówienia

```
Nowe → W Przygotowaniu → Gotowe → Zakończone
```

1. **Kelner** tworzy zamówienie (stolik, produkty, uwagi)
2. **Kuchnia** widzi zamówienie i oznacza jako „W przygotowaniu"
3. Po przygotowaniu kuchnia oznacza jako „Gotowe"
4. Kelner/kuchnia kończy zamówienie → trafia do **Historii**

## 🔧 Technologie

- **React 18** + **TypeScript**
- **Vite** – bundler
- **Tailwind CSS** – stylowanie
- **Shadcn/UI** – komponenty UI
- **React Router** – routing
- **Sonner** – powiadomienia toast
- **Lucide React** – ikony

## 💾 Przechowywanie Danych

- **Zamówienia** – stan w pamięci (React Context), resetowane po odświeżeniu
- **Menu** – `localStorage` (persystentne między sesjami)

## 👥 Kelnerzy

Predefiniowana lista: Barbara, Joanna, Aleksandra, Wiktor

## 🍽️ Stoliki

Numery od 1 do 10.
