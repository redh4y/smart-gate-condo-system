import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { mockPeople, mockHouses, mockAccesses, mockDeliveries, mockNotices } from '@/mock/data';
import { 
  Users, 
  Home, 
  LogIn, 
  Package, 
  Bell, 
  Plus,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAccesses = mockAccesses.filter(access => {
    const accessDate = new Date(access.timestamp);
    accessDate.setHours(0, 0, 0, 0);
    return accessDate.getTime() === today.getTime();
  });

  const pendingDeliveries = mockDeliveries.filter(d => d.status === 'Pendente');
  const unreadNotices = mockNotices.filter(n => !n.viewedBy.includes(user?.id || ''));

  const stats = [
    {
      title: 'Moradores',
      value: mockPeople.filter(p => p.type === 'Morador').length,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Casas',
      value: mockHouses.length,
      icon: Home,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Acessos Hoje',
      value: todayAccesses.length,
      icon: LogIn,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Encomendas',
      value: pendingDeliveries.length,
      icon: Package,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const quickActions = user?.type === 'Administrador' ? [
    { label: 'Cadastrar Morador', path: '/admin/pessoas', icon: Users },
    { label: 'Cadastrar Casa', path: '/admin/casas', icon: Home },
    { label: 'Registrar Acesso', path: '/acessos/registrar', icon: LogIn },
    { label: 'Nova Encomenda', path: '/encomendas', icon: Package },
  ] : [
    { label: 'Registrar Acesso', path: '/acessos/registrar', icon: LogIn },
    { label: 'Ver Encomendas', path: '/encomendas', icon: Package },
    { label: 'Ver Avisos', path: '/avisos', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}! Aqui está um resumo das atividades.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimos acessos registrados hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAccesses.slice(0, 5).map((access) => (
                <div key={access.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{access.personName}</p>
                    <p className="text-xs text-muted-foreground">
                      {access.houseAddress}
                      {access.vehiclePlate && ` • ${access.vehiclePlate}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={access.type === 'Entrada' ? 'default' : 'secondary'}>
                      {access.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(access.timestamp).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {todayAccesses.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum acesso registrado hoje
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alertas e Pendências
            </CardTitle>
            <CardDescription>
              Itens que precisam de atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDeliveries.length > 0 && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-2 text-warning">
                    <Package className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {pendingDeliveries.length} encomenda(s) pendente(s)
                    </span>
                  </div>
                </div>
              )}
              
              {unreadNotices.length > 0 && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 text-primary">
                    <Bell className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {unreadNotices.length} aviso(s) não lido(s)
                    </span>
                  </div>
                </div>
              )}

              {pendingDeliveries.length === 0 && unreadNotices.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma pendência no momento
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate(action.path)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};