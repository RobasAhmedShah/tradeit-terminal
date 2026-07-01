import { Redirect } from 'expo-router';

/** @deprecated Use /orders?tab=spot&view=open */
export default function OpenOrdersScreen() {
  return <Redirect href="/orders?tab=spot&view=open" />;
}
