import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Home,
  ClipboardList,
  History,
  Package,
  Bell,
  AlertTriangle,
  LogIn
} from 'lucide-react';

const menuItems = {
  Administrador: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/pessoas', label: 'Pessoas', icon: Users },
    { path: '/admin/casas', label: 'Casas', icon: Home },
    { path: '/acessos/registrar', label: 'Registrar Acesso', icon: LogIn },
    { path: '/acessos/historico', label: 'Histórico', icon: History },
    { path: '/encomendas', label: 'Encomendas', icon: Package },
    { path: '/avisos', label: 'Avisos', icon: Bell },
    { path: '/ocorrencias', label: 'Ocorrências', icon: AlertTriangle },
  ],
  Porteiro: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/acessos/registrar', label: 'Registrar Acesso', icon: LogIn },
    { path: '/acessos/historico', label: 'Histórico', icon: History },
    { path: '/encomendas', label: 'Encomendas', icon: Package },
    { path: '/avisos', label: 'Avisos', icon: Bell },
  ]
};

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const items = menuItems[user.type] || [];

  return (
    <aside className="w-64 bg-card border-r border-border shadow-sm">
      <div className="p-4">
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};