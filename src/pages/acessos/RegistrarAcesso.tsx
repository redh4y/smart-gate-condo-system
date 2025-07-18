import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockPeople, mockHouses, mockAccesses } from '@/mock/data';
import { Access, Person } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  LogIn, 
  LogOut, 
  Search, 
  Car, 
  User, 
  Home,
  Clock,
  Check,
  ChevronsUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const RegistrarAcesso = () => {
  const [accesses, setAccesses] = useState<Access[]>(mockAccesses);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { toast } = useToast();

  const searchOptions = useMemo(() => {
    const options: { 
      id: string; 
      label: string; 
      person: Person; 
      type: 'person' | 'vehicle'; 
      vehicleId?: string 
    }[] = [];

    mockPeople.forEach(person => {
      // Add person option
      options.push({
        id: `person-${person.id}`,
        label: person.name,
        person,
        type: 'person'
      });

      // Add vehicle options
      person.vehicles.forEach(vehicle => {
        options.push({
          id: `vehicle-${vehicle.id}`,
          label: `${vehicle.plate} - ${person.name}`,
          person,
          type: 'vehicle',
          vehicleId: vehicle.id
        });
      });
    });

    return options;
  }, []);

  const getHouseAddress = (houseId: string) => {
    const house = mockHouses.find(h => h.id === houseId);
    return house ? `${house.streetType} ${house.streetName}, ${house.number}` : 'N/A';
  };

  const todayAccesses = accesses.filter(access => {
    const today = new Date();
    const accessDate = new Date(access.timestamp);
    return accessDate.toDateString() === today.toDateString();
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleSelectOption = (option: typeof searchOptions[0]) => {
    setSelectedPerson(option.person);
    if (option.type === 'vehicle') {
      setSelectedVehicle(option.vehicleId || '');
    } else {
      setSelectedVehicle('');
    }
    setSearchOpen(false);
  };

  const registerAccess = (type: 'Entrada' | 'Saída') => {
    if (!selectedPerson) {
      toast({
        title: "Erro",
        description: "Selecione uma pessoa primeiro.",
        variant: "destructive",
      });
      return;
    }

    const vehicle = selectedVehicle 
      ? selectedPerson.vehicles.find(v => v.id === selectedVehicle)
      : undefined;

    const newAccess: Access = {
      id: Date.now().toString(),
      personId: selectedPerson.id,
      personName: selectedPerson.name,
      vehicleId: vehicle?.id,
      vehiclePlate: vehicle?.plate,
      type,
      timestamp: new Date(),
      houseId: selectedPerson.houseId,
      houseAddress: getHouseAddress(selectedPerson.houseId)
    };

    setAccesses(prev => [newAccess, ...prev]);
    
    toast({
      title: `${type} registrada`,
      description: `${type} de ${selectedPerson.name} registrada com sucesso.`,
    });

    // Reset selection
    setSelectedPerson(null);
    setSelectedVehicle('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Registrar Acesso</h1>
        <p className="text-muted-foreground">
          Registre entradas e saídas de moradores e visitantes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Novo Acesso
            </CardTitle>
            <CardDescription>
              Busque por nome ou placa do veículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Buscar Pessoa ou Veículo
              </label>
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={searchOpen}
                    className="w-full justify-between"
                  >
                    {selectedPerson 
                      ? (selectedVehicle 
                          ? `${selectedPerson.vehicles.find(v => v.id === selectedVehicle)?.plate} - ${selectedPerson.name}`
                          : selectedPerson.name
                        )
                      : "Selecione uma pessoa ou veículo..."
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Digite o nome ou placa..." />
                    <CommandList>
                      <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                      <CommandGroup>
                        {searchOptions.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={option.label}
                            onSelect={() => handleSelectOption(option)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPerson?.id === option.person.id && 
                                (option.type === 'vehicle' ? selectedVehicle === option.vehicleId : !selectedVehicle)
                                  ? "opacity-100" 
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              {option.type === 'vehicle' ? (
                                <Car className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <User className="h-4 w-4 text-muted-foreground" />
                              )}
                              {option.label}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedPerson && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedPerson.name}</span>
                  <Badge variant={selectedPerson.type === 'Morador' ? 'default' : 'secondary'}>
                    {selectedPerson.type}
                    {selectedPerson.subtype && ` - ${selectedPerson.subtype}`}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="h-4 w-4" />
                  {getHouseAddress(selectedPerson.houseId)}
                </div>

                {selectedVehicle && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="h-4 w-4" />
                    {selectedPerson.vehicles.find(v => v.id === selectedVehicle)?.plate} - {selectedPerson.vehicles.find(v => v.id === selectedVehicle)?.model}
                  </div>
                )}

                {selectedPerson.vehicles.length > 0 && !selectedVehicle && (
                  <div>
                    <p className="text-sm font-medium mb-2">Veículos disponíveis:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPerson.vehicles.map(vehicle => (
                        <Button
                          key={vehicle.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVehicle(vehicle.id)}
                        >
                          <Car className="h-3 w-3 mr-1" />
                          {vehicle.plate}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => registerAccess('Entrada')}
                disabled={!selectedPerson}
                className="flex-1 bg-gradient-accent"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Entrada
              </Button>
              <Button
                onClick={() => registerAccess('Saída')}
                disabled={!selectedPerson}
                variant="outline"
                className="flex-1"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Saída
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade de Hoje
            </CardTitle>
            <CardDescription>
              {todayAccesses.length} acesso(s) registrado(s) hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todayAccesses.map(access => (
                <div key={access.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{access.personName}</span>
                      <Badge variant={access.type === 'Entrada' ? 'default' : 'secondary'} className="text-xs">
                        {access.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {access.houseAddress}
                      </div>
                      {access.vehiclePlate && (
                        <div className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {access.vehiclePlate}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {new Date(access.timestamp).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {todayAccesses.length === 0 && (
                <div className="text-center py-8">
                  <LogIn className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">
                    Nenhum acesso registrado hoje
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};