import { Redirect } from 'expo-router';

/** @deprecated Notification settings live in the Profile sheet. */
export default function NotificationSettingsRedirect() {
  return <Redirect href="/profile" />;
}
