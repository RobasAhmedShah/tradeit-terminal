import { Redirect } from 'expo-router';

export default function OrderHistoryScreen() {
  return <Redirect href="/orders?view=history" />;
}
