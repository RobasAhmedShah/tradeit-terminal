import { Redirect } from 'expo-router';

/** @deprecated Use /markets?tab=watchlist */
export default function WatchlistRedirect() {
  return <Redirect href="/markets?tab=watchlist" />;
}
