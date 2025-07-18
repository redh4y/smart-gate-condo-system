export type UserType = 'Porteiro' | 'Administrador';

export type PersonType = 'Morador' | 'Autorizado';

export type PersonSubtype = 'Funcionário' | 'Visitante' | null;

export type AccessType = 'Entrada' | 'Saída';

export type DeliveryStatus = 'Pendente' | 'Entregue';

export type Priority = 'Baixa' | 'Média' | 'Alta';

export type OccurrenceStatus = 'Pendente' | 'Resolvido';

export type StreetType = 'Rua' | 'Avenida';

export interface User {
  id: string;
  cpf: string;
  name: string;
  type: UserType;
  password: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  personId: string;
}

export interface Person {
  id: string;
  name: string;
  cpf: string;
  type: PersonType;
  subtype: PersonSubtype;
  houseId: string;
  vehicles: Vehicle[];
  createdAt: Date;
}

export interface House {
  id: string;
  streetType: StreetType;
  streetName: string;
  number: string;
  residents: string[]; // Person IDs
  authorized: string[]; // Person IDs
  createdAt: Date;
}

export interface Access {
  id: string;
  personId: string;
  personName: string;
  vehicleId?: string;
  vehiclePlate?: string;
  type: AccessType;
  timestamp: Date;
  houseId: string;
  houseAddress: string;
}

export interface Delivery {
  id: string;
  recipientId: string;
  recipientName: string;
  type: string;
  observations?: string;
  status: DeliveryStatus;
  createdAt: Date;
  deliveredAt?: Date;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  createdAt: Date;
  viewedBy: string[]; // User IDs who viewed
}

export interface Occurrence {
  id: string;
  title: string;
  description: string;
  status: OccurrenceStatus;
  createdAt: Date;
  resolvedAt?: Date;
  comments: string;
}