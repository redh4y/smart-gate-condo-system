import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockOccurrences } from '@/mock/data';
import { Occurrence, OccurrenceStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Check, Clock, MessageSquare } from 'lucide-react';

export const Ocorrencias = () => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>(mockOccurrences);
  const { toast } = useToast();

  const toggleStatus = (occurrenceId: string) => {
    setOccurrences(prev => prev.map(occurrence => {
      if (occurrence.id === occurrenceId) {
        const newStatus: OccurrenceStatus = occurrence.status === 'Pendente' ? 'Resolvido' : 'Pendente';
        return {
          ...occurrence,
          status: newStatus,
          resolvedAt: newStatus === 'Resolvido' ? new Date() : undefined
        };
      }
      return occurrence;
    }));

    const occurrence = occurrences.find(o => o.id === occurrenceId);
    const newStatus = occurrence?.status === 'Pendente' ? 'Resolvido' : 'Pendente';
    
    toast({
      title: `Ocorrência ${newStatus.toLowerCase()}`,
      description: `Status alterado para ${newStatus.toLowerCase()}.`,
    });
  };

  const pendingCount = occurrences.filter(o => o.status === 'Pendente').length;
  const resolvedCount = occurrences.filter(o => o.status === 'Resolvido').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ocorrências</h1>
        <p className="text-muted-foreground">
          Registros de problemas e manutenções do condomínio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{occurrences.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-primary" />
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
                <p className="text-sm font-medium text-muted-foreground">Resolvidas</p>
                <p className="text-2xl font-bold text-success">{resolvedCount}</p>
              </div>
              <Check className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {occurrences.map(occurrence => (
          <Card key={occurrence.id} className="hover:shadow-md transition-smooth">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  {occurrence.title}
                </CardTitle>
                <Badge variant={occurrence.status === 'Pendente' ? 'destructive' : 'default'}>
                  {occurrence.status}
                </Badge>
              </div>
              <CardDescription>
                Criado em {new Date(occurrence.createdAt).toLocaleDateString('pt-BR')}
                {occurrence.resolvedAt && (
                  <> • Resolvido em {new Date(occurrence.resolvedAt).toLocaleDateString('pt-BR')}</>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{occurrence.description}</p>
              {occurrence.comments && (
                <div className="flex items-start gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground">{occurrence.comments}</p>
                </div>
              )}
              <Button
                variant={occurrence.status === 'Pendente' ? 'default' : 'outline'}
                onClick={() => toggleStatus(occurrence.id)}
              >
                {occurrence.status === 'Pendente' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Marcar como Resolvido
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Reabrir
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};