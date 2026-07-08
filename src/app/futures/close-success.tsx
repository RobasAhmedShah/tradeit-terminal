import { Redirect } from 'expo-router';

/** @deprecated Close success is shown inside FuturesCloseSheet */
export default function FuturesCloseSuccessRedirect() {
  return <Redirect href="/(tabs)/futures" />;
}
