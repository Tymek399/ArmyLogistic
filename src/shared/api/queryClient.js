import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          // dane ważne minutę
      refetchOnWindowFocus: false // bez odświeżania przy przełączaniu kart
    },
  },
});

