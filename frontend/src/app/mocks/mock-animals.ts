import { Animal, AnimalGender, AnimalSize, AnimalStatus } from '../models/animal.model';
import { DashboardStatistics } from '../services/animals.service';

export const MOCK_ANIMALS: Animal[] = [
  {
    id: 101,
    name: 'Rex',
    breed: 'Vira-lata',
    age_months: 24,
    gender: AnimalGender.MALE,
    size: AnimalSize.MEDIUM,
    color: 'Marrom',
    description: 'Cachorro muito dócil e brincalhão. Gosta de correr no parque e brincar com bolinha.',
    status: AnimalStatus.AVAILABLE,
    vaccinated: true,
    neutered: true,
    medical_notes: null,
    photo_url: 'https://picsum.photos/seed/rex/800/600',
    weight: 15.5,
    entry_date: '2024-01-15',
    created_at: '2025-01-10T12:45:00.000000Z',
    updated_at: '2025-01-10T12:45:00.000000Z'
  },
  {
    id: 102,
    name: 'Luna',
    breed: 'Golden Retriever',
    age_months: 18,
    gender: AnimalGender.FEMALE,
    size: AnimalSize.LARGE,
    color: 'Dourado',
    description: 'Cadela carinhosa e obediente. Boa com crianças. Precisa de espaço para correr.',
    status: AnimalStatus.AVAILABLE,
    vaccinated: true,
    neutered: false,
    medical_notes: 'Precisa tomar vacina antirrábica em 2025-10-01',
    photo_url: 'https://picsum.photos/seed/luna/800/600',
    weight: 25.0,
    entry_date: '2025-01-10',
    created_at: '2025-01-10T14:30:00.000000Z',
    updated_at: '2025-01-10T14:30:00.000000Z'
  },
  {
    id: 103,
    name: 'Bidu',
    breed: 'Shih Tzu',
    age_months: 36,
    gender: AnimalGender.MALE,
    size: AnimalSize.SMALL,
    color: 'Branco e Marrom',
    description: 'Pequeno e sociável. Ideal para apartamento.',
    status: AnimalStatus.ADOPTED,
    vaccinated: true,
    neutered: true,
    medical_notes: null,
    photo_url: 'https://picsum.photos/seed/bidu/800/600',
    weight: 6.2,
    entry_date: '2023-09-01',
    created_at: '2023-09-01T09:00:00.000000Z',
    updated_at: '2024-12-12T09:00:00.000000Z'
  },
  {
    id: 104,
    name: 'Maya',
    breed: 'SRD',
    age_months: 6,
    gender: AnimalGender.FEMALE,
    size: AnimalSize.SMALL,
    color: 'Preto',
    description: 'Filhote cheia de energia, precisa de socialização e treinamento.',
    status: AnimalStatus.UNDER_TREATMENT,
    vaccinated: false,
    neutered: false,
    medical_notes: 'Tratamento contra vermes em andamento',
    photo_url: 'https://picsum.photos/seed/maya/800/600',
    weight: 4.0,
    entry_date: '2025-08-20',
    created_at: '2025-08-20T11:00:00.000000Z',
    updated_at: '2025-09-01T11:00:00.000000Z'
  }
];

export const MOCK_STATS: DashboardStatistics = {
  total_animals: MOCK_ANIMALS.length,
  available: MOCK_ANIMALS.filter(a => a.status === AnimalStatus.AVAILABLE).length,
  adopted: MOCK_ANIMALS.filter(a => a.status === AnimalStatus.ADOPTED).length,
  under_treatment: MOCK_ANIMALS.filter(a => a.status === AnimalStatus.UNDER_TREATMENT).length,
  unavailable: MOCK_ANIMALS.filter(a => a.status === AnimalStatus.UNAVAILABLE).length
};
