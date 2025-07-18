import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockDeliveries, mockPeople } from '@/mock/data';
import { Delivery, DeliveryStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Plus, 
  Search, 
  Check, 
  X,
  Clock,
  CheckCircle,
  ChevronsUpDown,
  User,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Encomendas = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | DeliveryStatus>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    recipientId: '',
    recipientName: '',
    type: '',
    observations: ''
  });

  const filteredDeliveries = deliveries.filter(delivery => {
    if (statusFilter === 'all') return true;
    return delivery.status === statusFilter;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const resetForm = () => {
    setFormData({
      recipientId: '',
      recipientName: '',
      type: '',
      observations: ''
    });
  };

  const handleSelectRecipient = (person: typeof mockPeople[0]) => {
    setFormData(prev => ({
      ...prev,
      recipientId: person.id,
      recipientName: person.name
    }));
    setSearchOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDelivery: Delivery = {
      id: Date.now().toString(),
      recipientId: formData.recipientId,
      recipientName: formData.recipientName,
      type: formData.type,
      observations: formData.observations,
      status: 'Pendente',
      createdAt: new Date()
    };

    setDeliveries(prev => [newDelivery, ...prev]);
    
    toast({
      title: "Encomenda registrada",
      description: "Nova encomenda adicionada ao sistema.",
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const toggleDeliveryStatus = (deliveryId: string) => {
    setDeliveries(prev => prev.map(delivery => {
      if (delivery.id === deliveryId) {
        const newStatus: DeliveryStatus = delivery.status === 'Pendente' ? 'Entregue' : 'Pendente';
        return {
          ...delivery,
          status: newStatus,
          deliveredAt: newStatus === 'Entregue' ? new Date() : undefined
        };
      }
      return delivery;
    }));

    const delivery = deliveries.find(d => d.id === deliveryId);
    const newStatus = delivery?.status === 'Pendente' ? 'Entregue' : 'Pendente';
    
    toast({
      title: `Encomenda ${newStatus.toLowerCase()}`,
      description: `Status da encomenda alterado para ${newStatus.toLowerCase()}.`,
    });
  };

  const deleteDelivery = (deliveryId: string) => {
    setDeliveries(prev => prev.filter(delivery => delivery.id !== deliveryId));
    toast({
      title: "Encomenda removida",
      description: "A encomenda foi removida do sistema.",
      variant: "destructive",
    });
  };

  const pendingCount = deliveries.filter(d => d.status === 'Pendente').length;
  const deliveredCount = deliveries.filter(d => d.status === 'Entregue').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Encomendas</h1>
          <p className="text-muted-foreground">
            Gerencie encomendas e correspondências do condomínio
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Nova Encomenda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Encomenda</DialogTitle>
              <DialogDescription>
                Cadastre uma nova encomenda ou correspondência recebida.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="recipient">Destinatário</Label>
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={searchOpen}
                      className="w-full justify-between"
                    >
                      {formData.recipientName || "Selecione o destinatário..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Digite o nome..." />
                      <CommandList>
                        <CommandEmpty>Nenhuma pessoa encontrada.</CommandEmpty>
                        <CommandGroup>
                          {mockPeople.map((person) => (
                            <CommandItem
                              key={person.id}
                              value={person.name}
                              onSelect={() => handleSelectRecipient(person)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.recipientId === person.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {person.name}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="type">Tipo de Encomenda</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Ex: Correspondência, Encomenda, Medicamento"
                  required
                />
              </div>

              <div>
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Informações adicionais (opcional)"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-primary" disabled={!formData.recipientId || !formData.type}>
                  Registrar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{deliveries.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entregues</p>
                <p className="text-2xl font-bold text-success">{deliveredCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          Todas ({deliveries.length})
        </Button>
        <Button
          variant={statusFilter === 'Pendente' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('Pendente')}
        >
          Pendentes ({pendingCount})
        </Button>
        <Button
          variant={statusFilter === 'Entregue' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('Entregue')}
        >
          Entregues ({deliveredCount})
        </Button>
      </div>

      {/* Deliveries List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Encomendas
          </CardTitle>
          <CardDescription>
            {filteredDeliveries.length} encomenda(s) {statusFilter === 'all' ? 'no total' : statusFilter.toLowerCase() + '(s)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDeliveries.map(delivery => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-smooth">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{delivery.recipientName}</h3>
                    <Badge variant={delivery.status === 'Pendente' ? 'destructive' : 'default'}>
                      {delivery.status}
                    </Badge>
                    <Badge variant="outline">{delivery.type}</Badge>
                  </div>
                  
                  {delivery.observations && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {delivery.observations}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Recebido: {new Date(delivery.createdAt).toLocaleString('pt-BR')}
                    </div>
                    {delivery.deliveredAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Entregue: {new Date(delivery.deliveredAt).toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={delivery.status === 'Pendente' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDeliveryStatus(delivery.id)}
                  >
                    {delivery.status === 'Pendente' ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Entregar
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-1" />
                        Reabrir
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDelivery(delivery.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredDeliveries.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {statusFilter === 'all' 
                    ? 'Nenhuma encomenda registrada' 
                    : `Nenhuma encomenda ${statusFilter.toLowerCase()}`
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};