import { User, Person, House, Access, Delivery, Notice, Occurrence, Vehicle } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    cpf: '123.456.789-00',
    name: 'João Porteiro',
    type: 'Porteiro',
    password: '123456'
  },
  {
    id: '2',
    cpf: '987.654.321-00',
    name: 'Maria Admin',
    type: 'Administrador',
    password: 'admin123'
  }
];

// Mock Houses
export const mockHouses: House[] = [
  {
    id: '1',
    streetType: 'Rua',
    streetName: 'das Flores',
    number: '10',
    residents: ['1', '2'],
    authorized: ['3'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    streetType: 'Avenida',
    streetName: 'Principal',
    number: '25',
    residents: ['4'],
    authorized: ['5', '6'],
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    streetType: 'Rua',
    streetName: 'dos Ipês',
    number: '42',
    residents: ['7', '8'],
    authorized: [],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    streetType: 'Rua',
    streetName: 'das Acácias',
    number: '15',
    residents: ['9'],
    authorized: ['10'],
    createdAt: new Date('2024-02-10')
  }
];

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  { id: '1', plate: 'ABC-1234', model: 'Honda Civic', personId: '1' },
  { id: '2', plate: 'DEF-5678', model: 'Toyota Corolla', personId: '2' },
  { id: '3', plate: 'GHI-9012', model: 'Volkswagen Gol', personId: '4' },
  { id: '4', plate: 'JKL-3456', model: 'Ford Ka', personId: '5' },
  { id: '5', plate: 'MNO-7890', model: 'Chevrolet Onix', personId: '7' },
  { id: '6', plate: 'PQR-1357', model: 'Fiat Uno', personId: '3' },
  { id: '7', plate: 'STU-2468', model: 'Hyundai HB20', personId: '9' }
];

// Mock People
export const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    cpf: '111.222.333-44',
    type: 'Morador',
    subtype: null,
    houseId: '1',
    vehicles: mockVehicles.filter(v => v.personId === '1'),
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Ana Santos',
    cpf: '555.666.777-88',
    type: 'Morador',
    subtype: null,
    houseId: '1',
    vehicles: mockVehicles.filter(v => v.personId === '2'),
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'José da Limpeza',
    cpf: '999.888.777-66',
    type: 'Autorizado',
    subtype: 'Funcionário',
    houseId: '1',
    vehicles: mockVehicles.filter(v => v.personId === '3'),
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    name: 'Roberto Oliveira',
    cpf: '444.333.222-11',
    type: 'Morador',
    subtype: null,
    houseId: '2',
    vehicles: mockVehicles.filter(v => v.personId === '4'),
    createdAt: new Date('2024-01-20')
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    cpf: '777.555.333-99',
    type: 'Autorizado',
    subtype: 'Visitante',
    houseId: '2',
    vehicles: mockVehicles.filter(v => v.personId === '5'),
    createdAt: new Date('2024-01-25')
  },
  {
    id: '6',
    name: 'Pedro Jardineiro',
    cpf: '222.444.666-88',
    type: 'Autorizado',
    subtype: 'Funcionário',
    houseId: '2',
    vehicles: [],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '7',
    name: 'Lucia Costa',
    cpf: '888.999.111-22',
    type: 'Morador',
    subtype: null,
    houseId: '3',
    vehicles: mockVehicles.filter(v => v.personId === '7'),
    createdAt: new Date('2024-02-01')
  },
  {
    id: '8',
    name: 'Miguel Costa',
    cpf: '333.111.999-77',
    type: 'Morador',
    subtype: null,
    houseId: '3',
    vehicles: [],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '9',
    name: 'Patrícia Souza',
    cpf: '666.888.444-55',
    type: 'Morador',
    subtype: null,
    houseId: '4',
    vehicles: mockVehicles.filter(v => v.personId === '9'),
    createdAt: new Date('2024-02-10')
  },
  {
    id: '10',
    name: 'Bruno Visitante',
    cpf: '111.333.555-77',
    type: 'Autorizado',
    subtype: 'Visitante',
    houseId: '4',
    vehicles: [],
    createdAt: new Date('2024-02-15')
  }
];

// Mock Access History
export const mockAccesses: Access[] = [
  {
    id: '1',
    personId: '1',
    personName: 'Carlos Silva',
    vehicleId: '1',
    vehiclePlate: 'ABC-1234',
    type: 'Entrada',
    timestamp: new Date('2024-07-17T08:30:00'),
    houseId: '1',
    houseAddress: 'Rua das Flores, 10'
  },
  {
    id: '2',
    personId: '4',
    personName: 'Roberto Oliveira',
    vehicleId: '3',
    vehiclePlate: 'GHI-9012',
    type: 'Entrada',
    timestamp: new Date('2024-07-17T09:15:00'),
    houseId: '2',
    houseAddress: 'Avenida Principal, 25'
  },
  {
    id: '3',
    personId: '3',
    personName: 'José da Limpeza',
    type: 'Entrada',
    timestamp: new Date('2024-07-17T10:00:00'),
    houseId: '1',
    houseAddress: 'Rua das Flores, 10'
  },
  {
    id: '4',
    personId: '1',
    personName: 'Carlos Silva',
    vehicleId: '1',
    vehiclePlate: 'ABC-1234',
    type: 'Saída',
    timestamp: new Date('2024-07-17T12:30:00'),
    houseId: '1',
    houseAddress: 'Rua das Flores, 10'
  },
  {
    id: '5',
    personId: '7',
    personName: 'Lucia Costa',
    vehicleId: '5',
    vehiclePlate: 'MNO-7890',
    type: 'Entrada',
    timestamp: new Date('2024-07-17T14:20:00'),
    houseId: '3',
    houseAddress: 'Rua dos Ipês, 42'
  }
];

// Mock Deliveries
export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    recipientId: '1',
    recipientName: 'Carlos Silva',
    type: 'Correspondência',
    observations: 'Envelope grande',
    status: 'Pendente',
    createdAt: new Date('2024-07-17T09:00:00')
  },
  {
    id: '2',
    recipientId: '4',
    recipientName: 'Roberto Oliveira',
    type: 'Encomenda',
    observations: 'Caixa da Amazon',
    status: 'Pendente',
    createdAt: new Date('2024-07-17T10:30:00')
  },
  {
    id: '3',
    recipientId: '7',
    recipientName: 'Lucia Costa',
    type: 'Medicamento',
    status: 'Entregue',
    createdAt: new Date('2024-07-16T15:00:00'),
    deliveredAt: new Date('2024-07-16T18:30:00')
  }
];

// Mock Notices
export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Manutenção do Elevador',
    description: 'O elevador do bloco A estará em manutenção nos dias 20 e 21 de julho.',
    priority: 'Alta',
    createdAt: new Date('2024-07-15T10:00:00'),
    viewedBy: ['1']
  },
  {
    id: '2',
    title: 'Reunião de Condomínio',
    description: 'Reunião ordinária no dia 25 de julho às 19h no salão de festas.',
    priority: 'Média',
    createdAt: new Date('2024-07-14T14:30:00'),
    viewedBy: []
  },
  {
    id: '3',
    title: 'Limpeza da Piscina',
    description: 'A piscina estará fechada para limpeza no dia 18 de julho.',
    priority: 'Baixa',
    createdAt: new Date('2024-07-16T08:00:00'),
    viewedBy: ['1', '2']
  }
];

// Mock Occurrences
export const mockOccurrences: Occurrence[] = [
  {
    id: '1',
    title: 'Vazamento no Bloco B',
    description: 'Reportado vazamento no 3º andar do bloco B',
    status: 'Pendente',
    createdAt: new Date('2024-07-16T16:00:00'),
    comments: 'Síndico já foi notificado'
  },
  {
    id: '2',
    title: 'Problema na Iluminação',
    description: 'Lâmpada queimada na garagem',
    status: 'Resolvido',
    createdAt: new Date('2024-07-15T20:00:00'),
    resolvedAt: new Date('2024-07-16T10:00:00'),
    comments: 'Lâmpada trocada pelo zelador'
  }
];