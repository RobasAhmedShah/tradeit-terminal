import { Redirect, useLocalSearchParams } from 'expo-router';

/** @deprecated Use /orders?tab=futures&view=positions instead */
export default function FuturesPositionsScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  const view =
    tab === 'open_orders' ? 'open' : tab === 'history' ? 'history' : 'positions';

  return <Redirect href={`/orders?tab=futures&view=${view}`} />;
}
