import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, ClipboardList, Settings, History } from 'lucide-react';
import dumplingLogo from '@/assets/dumpling-logo-new.png';
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-6">
      <div className=" w-full"> 
        <div className="text-center mb-12">
          <div className="flex flex-col items-center mb-6">
            <img src={dumplingLogo} alt="DumplingChat Logo" className="w-48 h-48 mb-4 animate-fade-in" />
            <h2 className="text-4xl font-bold text-primary mb-2">DumplingChat</h2>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-[var(--gradient-primary)] bg-clip-text text-primary">
            System Zamówień Restauracyjnych
          </h1>
          <p className="text-xl text-muted-foreground">
            Usprawnij komunikację między salą a kuchnią
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/waiter')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-10 w-10 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Stanowisko Kelnera</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Przyjmuj zamówienia i wysyłaj je bezpośrednio do kuchni
              </p>
              <Button className="w-full" size="lg">
                Wejdź do Trybu Kelnera
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/kitchen')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Ekran Kuchni</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Przeglądaj przychodzące zamówienia i aktualizuj ich status
              </p>
              <Button className="w-full" size="lg" variant="secondary">
                Wejdź do Trybu Kuchni
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/menu')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-10 w-10 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">Zarządzanie Menu</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Dodawaj i usuwaj produkty z menu restauracji
              </p>
              <Button className="w-full" size="lg" variant="outline">
                Zarządzaj Menu
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/history')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="h-10 w-10 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">Historia Zamówień</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Przeglądaj zakończone zamówienia
              </p>
              <Button className="w-full" size="lg" variant="outline">
                Zobacz Historię
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Index;