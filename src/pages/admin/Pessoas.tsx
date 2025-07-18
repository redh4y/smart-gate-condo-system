import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPeople, mockHouses } from '@/mock/data';
import { Person, PersonType, PersonSubtype } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Car,
  Home,
  UserCheck,
  UserX
} from 'lucide-react';

export const Pessoas = () => {
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    type: 'Morador' as PersonType,
    subtype: null as PersonSubtype,
    houseId: '',
    vehicles: [] as { plate: string; model: string }[]
  });

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.cpf.includes(searchTerm)
  );

  const getHouseAddress = (houseId: string) => {
    const house = mockHouses.find(h => h.id === houseId);
    return house ? `${house.streetType} ${house.streetName}, ${house.number}` : 'N/A';
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cpf: '',
      type: 'Morador',
      subtype: null,
      houseId: '',
      vehicles: []
    });
    setEditingPerson(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPerson) {
      // Update existing person
      setPeople(prev => prev.map(person => 
        person.id === editingPerson.id 
          ? {
              ...person,
              ...formData,
              vehicles: formData.vehicles.map((v, index) => ({
                id: `${person.id}-vehicle-${index}`,
                ...v,
                personId: person.id
              }))
            }
          : person
      ));
      toast({
        title: "Pessoa atualizada",
        description: "Os dados foram atualizados com sucesso.",
      });
    } else {
      // Add new person
      const newPerson: Person = {
        id: Date.now().toString(),
        ...formData,
        vehicles: formData.vehicles.map((v, index) => ({
          id: `${Date.now()}-vehicle-${index}`,
          ...v,
          personId: Date.now().toString()
        })),
        createdAt: new Date()
      };
      setPeople(prev => [...prev, newPerson]);
      toast({
        title: "Pessoa cadastrada",
        description: "Nova pessoa adicionada ao sistema.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      cpf: person.cpf,
      type: person.type,
      subtype: person.subtype,
      houseId: person.houseId,
      vehicles: person.vehicles.map(v => ({ plate: v.plate, model: v.model }))
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (personId: string) => {
    setPeople(prev => prev.filter(person => person.id !== personId));
    toast({
      title: "Pessoa removida",
      description: "A pessoa foi removida do sistema.",
      variant: "destructive",
    });
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, { plate: '', model: '' }]
    }));
  };

  const removeVehicle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index)
    }));
  };

  const updateVehicle = (index: number, field: 'plate' | 'model', value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map((v, i) => 
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Pessoas</h1>
          <p className="text-muted-foreground">
            Gerencie moradores e pessoas autorizadas do condomínio
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Nova Pessoa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPerson ? 'Editar Pessoa' : 'Cadastrar Nova Pessoa'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da pessoa que será {editingPerson ? 'atualizada' : 'cadastrada'} no sistema.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: PersonType) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        type: value,
                        subtype: value === 'Morador' ? null : prev.subtype
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morador">Morador</SelectItem>
                      <SelectItem value="Autorizado">Autorizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.type === 'Autorizado' && (
                  <div>
                    <Label htmlFor="subtype">Subtipo</Label>
                    <Select
                      value={formData.subtype || ''}
                      onValueChange={(value: PersonSubtype) => 
                        setFormData(prev => ({ ...prev, subtype: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Funcionário">Funcionário</SelectItem>
                        <SelectItem value="Visitante">Visitante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="house">Casa</Label>
                <Select
                  value={formData.houseId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, houseId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma casa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockHouses.map(house => (
                      <SelectItem key={house.id} value={house.id}>
                        {house.streetType} {house.streetName}, {house.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Veículos</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVehicle}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Veículo
                  </Button>
                </div>
                
                <div className="space-y-2 mt-2">
                  {formData.vehicles.map((vehicle, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Placa"
                        value={vehicle.plate}
                        onChange={(e) => updateVehicle(index, 'plate', e.target.value)}
                      />
                      <Input
                        placeholder="Modelo"
                        value={vehicle.model}
                        onChange={(e) => updateVehicle(index, 'model', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVehicle(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-primary">
                  {editingPerson ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Pessoas
          </CardTitle>
          <CardDescription>
            {people.length} pessoas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPeople.map(person => (
              <div key={person.id} className="p-4 border rounded-lg hover:shadow-md transition-smooth">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{person.name}</h3>
                      <Badge variant={person.type === 'Morador' ? 'default' : 'secondary'}>
                        {person.type}
                        {person.subtype && ` - ${person.subtype}`}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <UserCheck className="h-4 w-4" />
                        {person.cpf}
                      </div>
                      <div className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        {getHouseAddress(person.houseId)}
                      </div>
                      {person.vehicles.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          {person.vehicles.length} veículo(s)
                        </div>
                      )}
                    </div>

                    {person.vehicles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Veículos:</p>
                        <div className="flex flex-wrap gap-1">
                          {person.vehicles.map(vehicle => (
                            <Badge key={vehicle.id} variant="outline" className="text-xs">
                              {vehicle.plate} - {vehicle.model}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(person)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(person.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPeople.length === 0 && (
              <div className="text-center py-8">
                <UserX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhuma pessoa encontrada' : 'Nenhuma pessoa cadastrada'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};