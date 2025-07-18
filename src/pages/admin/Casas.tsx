import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockHouses, mockPeople } from '@/mock/data';
import { House, StreetType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  MapPin,
  Building
} from 'lucide-react';

export const Casas = () => {
  const [houses, setHouses] = useState<House[]>(mockHouses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    streetType: 'Rua' as StreetType,
    streetName: '',
    number: ''
  });

  const groupedHouses = houses.reduce((acc, house) => {
    const key = `${house.streetType} ${house.streetName}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(house);
    return acc;
  }, {} as Record<string, House[]>);

  const getPersonName = (personId: string) => {
    const person = mockPeople.find(p => p.id === personId);
    return person?.name || 'N/A';
  };

  const getResidentsAndAuthorized = (house: House) => {
    const residents = house.residents.map(id => mockPeople.find(p => p.id === id)).filter(Boolean);
    const authorized = house.authorized.map(id => mockPeople.find(p => p.id === id)).filter(Boolean);
    return { residents, authorized };
  };

  const resetForm = () => {
    setFormData({
      streetType: 'Rua',
      streetName: '',
      number: ''
    });
    setEditingHouse(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHouse) {
      // Update existing house
      setHouses(prev => prev.map(house => 
        house.id === editingHouse.id 
          ? { ...house, ...formData }
          : house
      ));
      toast({
        title: "Casa atualizada",
        description: "Os dados foram atualizados com sucesso.",
      });
    } else {
      // Add new house
      const newHouse: House = {
        id: Date.now().toString(),
        ...formData,
        residents: [],
        authorized: [],
        createdAt: new Date()
      };
      setHouses(prev => [...prev, newHouse]);
      toast({
        title: "Casa cadastrada",
        description: "Nova casa adicionada ao sistema.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (house: House) => {
    setEditingHouse(house);
    setFormData({
      streetType: house.streetType,
      streetName: house.streetName,
      number: house.number
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (houseId: string) => {
    const hasResidents = houses.find(h => h.id === houseId && (h.residents.length > 0 || h.authorized.length > 0));
    
    if (hasResidents) {
      toast({
        title: "Não é possível excluir",
        description: "Esta casa possui moradores ou autorizados vinculados.",
        variant: "destructive",
      });
      return;
    }

    setHouses(prev => prev.filter(house => house.id !== houseId));
    toast({
      title: "Casa removida",
      description: "A casa foi removida do sistema.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Casas</h1>
          <p className="text-muted-foreground">
            Gerencie as casas e seus moradores do condomínio
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Nova Casa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingHouse ? 'Editar Casa' : 'Cadastrar Nova Casa'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da casa que será {editingHouse ? 'atualizada' : 'cadastrada'} no sistema.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="streetType">Tipo de Logradouro</Label>
                <Select
                  value={formData.streetType}
                  onValueChange={(value: StreetType) => 
                    setFormData(prev => ({ ...prev, streetType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rua">Rua</SelectItem>
                    <SelectItem value="Avenida">Avenida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="streetName">Nome do Logradouro</Label>
                <Input
                  id="streetName"
                  value={formData.streetName}
                  onChange={(e) => setFormData(prev => ({ ...prev, streetName: e.target.value }))}
                  placeholder="Ex: das Flores, Principal, dos Ipês"
                  required
                />
              </div>

              <div>
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="Ex: 10, 25A, 42"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-primary">
                  {editingHouse ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedHouses).map(([streetName, streetHouses]) => (
          <Card key={streetName}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {streetName}
              </CardTitle>
              <CardDescription>
                {streetHouses.length} casa(s) neste logradouro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {streetHouses.map(house => {
                  const { residents, authorized } = getResidentsAndAuthorized(house);
                  
                  return (
                    <div key={house.id} className="p-4 border rounded-lg hover:shadow-md transition-smooth">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          <span className="font-semibold">Nº {house.number}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(house)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(house.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {house.streetType} {house.streetName}, {house.number}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {residents.length} morador(es), {authorized.length} autorizado(s)
                          </span>
                        </div>

                        {residents.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Moradores:</p>
                            <div className="flex flex-wrap gap-1">
                              {residents.map(resident => (
                                <Badge key={resident.id} variant="default" className="text-xs">
                                  {resident.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {authorized.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Autorizados:</p>
                            <div className="flex flex-wrap gap-1">
                              {authorized.map(auth => (
                                <Badge key={auth.id} variant="secondary" className="text-xs">
                                  {auth.name}
                                  {auth.subtype && ` (${auth.subtype})`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {residents.length === 0 && authorized.length === 0 && (
                          <p className="text-xs text-muted-foreground italic">
                            Nenhuma pessoa vinculada
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {Object.keys(groupedHouses).length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma casa cadastrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};