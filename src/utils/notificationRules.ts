import { AppNotificationType } from './notificationPrefs';
import { NotificationSettings } from './notificationSettingsPrefs';

/** Whether an in-app notification should be created for this type. */
export function isNotificationTypeEnabled(
  type: AppNotificationType,
  settings: NotificationSettings
): boolean {
  if (!settings.pushEnabled) return false;

  switch (type) {
    case 'order':
      return settings.orderUpdates;
    case 'alert':
      return settings.priceAlerts;
    case 'news':
      return settings.newsUpdates;
    case 'community':
      return settings.communityEngagement;
    case 'system':
      return true;
    default:
      return true;
  }
}
