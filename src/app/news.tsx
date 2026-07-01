import { Redirect } from 'expo-router';

/** @deprecated Use /markets?tab=news */
export default function NewsRedirect() {
  return <Redirect href="/markets?tab=news" />;
}
