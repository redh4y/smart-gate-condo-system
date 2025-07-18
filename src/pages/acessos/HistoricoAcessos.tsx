import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockAccesses } from '@/mock/data';
import { Access } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Car,
  Home,
  Calendar as CalendarIcon,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const HistoricoAcessos = () => {
  const [accesses] = useState<Access[]>(mockAccesses);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAccesses = accesses.filter(access => {
    const matchesSearch = access.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (access.vehiclePlate && access.vehiclePlate.includes(searchTerm.toUpperCase())) ||
                         access.houseAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || access.type === typeFilter;
    
    const matchesDate = !dateFilter || 
                       new Date(access.timestamp).toDateString() === dateFilter.toDateString();
    
    return matchesSearch && matchesType && matchesDate;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const exportToCSV = () => {
    const headers = ['Data/Hora', 'Nome', 'Tipo', 'Casa', 'Veículo'];
    const rows = filteredAccesses.map(access => [
      new Date(access.timestamp).toLocaleString('pt-BR'),
      access.personName,
      access.type,
      access.houseAddress,
      access.vehiclePlate || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historico_acessos_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Acessos</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .entrada { color: #22c55e; font-weight: bold; }
            .saida { color: #ef4444; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Relatório de Acessos - ${format(new Date(), 'dd/MM/yyyy')}</h1>
          <p>Total de registros: ${filteredAccesses.length}</p>
          <table>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Casa</th>
                <th>Veículo</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAccesses.map(access => `
                <tr>
                  <td>${new Date(access.timestamp).toLocaleString('pt-BR')}</td>
                  <td>${access.personName}</td>
                  <td class="${access.type.toLowerCase()}">${access.type}</td>
                  <td>${access.houseAddress}</td>
                  <td>${access.vehiclePlate || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setDateFilter(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico de Acessos</h1>
          <p className="text-muted-foreground">
            Consulte e exporte o histórico completo de acessos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={printReport}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Filtros de Busca
              </CardTitle>
              <CardDescription>
                Use os filtros para encontrar acessos específicos
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent className="border-t">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome, placa ou endereço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tipo de Acesso
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Saída">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Data
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter ? format(dateFilter, "P", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Registros de Acesso
          </CardTitle>
          <CardDescription>
            {filteredAccesses.length} registro(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAccesses.map(access => (
              <div key={access.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-smooth">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {access.type === 'Entrada' ? (
                        <LogIn className="h-4 w-4 text-success" />
                      ) : (
                        <LogOut className="h-4 w-4 text-destructive" />
                      )}
                      <span className="font-semibold">{access.personName}</span>
                    </div>
                    <Badge variant={access.type === 'Entrada' ? 'default' : 'secondary'}>
                      {access.type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {access.houseAddress}
                    </div>
                    
                    {access.vehiclePlate && (
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        {access.vehiclePlate}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {new Date(access.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {new Date(access.timestamp).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(access.timestamp).toLocaleDateString('pt-BR', {
                      weekday: 'short'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {filteredAccesses.length === 0 && (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== 'all' || dateFilter 
                    ? 'Nenhum acesso encontrado com os filtros aplicados' 
                    : 'Nenhum acesso registrado'
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