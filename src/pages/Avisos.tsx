import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockNotices } from '@/mock/data';
import { Notice, Priority } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Bell, Eye, AlertCircle, Info, Clock } from 'lucide-react';

export const Avisos = () => {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const { user } = useAuth();

  const markAsViewed = (noticeId: string) => {
    if (!user) return;
    
    setNotices(prev => prev.map(notice => 
      notice.id === noticeId && !notice.viewedBy.includes(user.id)
        ? { ...notice, viewedBy: [...notice.viewedBy, user.id] }
        : notice
    ));
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'Alta': return <AlertCircle className="h-4 w-4" />;
      case 'Média': return <Info className="h-4 w-4" />;
      case 'Baixa': return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityVariant = (priority: Priority) => {
    switch (priority) {
      case 'Alta': return 'destructive';
      case 'Média': return 'default';
      case 'Baixa': return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Avisos</h1>
        <p className="text-muted-foreground">
          Comunicados e avisos importantes do condomínio
        </p>
      </div>

      <div className="space-y-4">
        {notices.map(notice => {
          const isViewed = user ? notice.viewedBy.includes(user.id) : false;
          
          return (
            <Card key={notice.id} className={`hover:shadow-md transition-smooth ${!isViewed ? 'border-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isViewed ? 'bg-muted' : 'bg-primary/10'}`}>
                      <Bell className={`h-4 w-4 ${isViewed ? 'text-muted-foreground' : 'text-primary'}`} />
                    </div>
                    {notice.title}
                    {!isViewed && <Badge variant="default" className="text-xs">Novo</Badge>}
                  </CardTitle>
                  <Badge variant={getPriorityVariant(notice.priority)} className="flex items-center gap-1">
                    {getPriorityIcon(notice.priority)}
                    {notice.priority}
                  </Badge>
                </div>
                <CardDescription>
                  {new Date(notice.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{notice.description}</p>
                {!isViewed && (
                  <Button variant="outline" size="sm" onClick={() => markAsViewed(notice.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Marcar como lido
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};