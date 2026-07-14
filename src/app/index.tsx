import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { ready, isAuthenticated } = useAuth();

  // Native splash stays visible until SplashGate hides it.
  if (!ready) return null;

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
