import { useRouter } from 'expo-router';

/** Navigate to the full-screen compose post flow. */
export function useComposePost() {
  const router = useRouter();
  return {
    openCompose: () => router.push('/community/compose'),
  };
}
