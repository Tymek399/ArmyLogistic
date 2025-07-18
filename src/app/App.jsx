import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient }      from '../shared/api/queryClient';
import LegacyDemo           from '../pages/LegacyDemo/App';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LegacyDemo />
    </QueryClientProvider>
  );
}

