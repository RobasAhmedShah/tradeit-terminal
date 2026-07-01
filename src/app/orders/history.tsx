import { Redirect } from 'expo-router';

/** @deprecated Use /orders?tab=spot&view=history */
export default function OrderHistoryScreen() {
  return <Redirect href="/orders?tab=spot&view=history" />;
}
