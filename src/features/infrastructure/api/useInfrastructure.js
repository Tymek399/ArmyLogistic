import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/axios';

/**
 * Pobiera listę obiektów infrastruktury z backendu.
 * Zwraca { data, isLoading, error } identycznie jak każdy hook React Query.
 */
export function useInfrastructure() {
  return useQuery({
    queryKey: ['infrastructure'],
    queryFn: async () => {
      const { data } = await api.get('/api/infrastructure');
      return data;        // spodziewany [{ id, lat, lng, name, ... }]
    },
    staleTime: 60_000,
  });
}

