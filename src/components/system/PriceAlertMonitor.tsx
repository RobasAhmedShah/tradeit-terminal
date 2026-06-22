import { useEffect } from 'react';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';
import { useNotifications } from '../../context/NotificationsContext';
import { usePriceAlerts } from '../../context/PriceAlertsContext';

/**
 * Polls mock market prices and fires in-app notifications when alert targets are hit.
 */
export function PriceAlertMonitor() {
  const { alerts, updateAlert, ready } = usePriceAlerts();
  const { pushNotification } = useNotifications();

  useEffect(() => {
    if (!ready) return;

    const interval = setInterval(() => {
      const active = alerts.filter((a) => a.isActive);
      if (active.length === 0) return;

      active.forEach((alert) => {
        const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === alert.symbol);
        if (!stock) return;

        const hit =
          alert.condition === 'above'
            ? stock.price >= alert.targetPrice
            : stock.price <= alert.targetPrice;

        if (!hit) return;

        pushNotification({
          type: 'alert',
          title: `Price Alert — ${alert.symbol}`,
          body: `${alert.symbol} ${alert.condition === 'above' ? 'rose above' : 'fell below'} Rs ${alert.targetPrice.toFixed(2)}. Now Rs ${stock.price.toFixed(2)}.`,
          symbol: alert.symbol,
          alertId: alert.id,
        });

        updateAlert(alert.id, { isActive: false });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [alerts, ready, pushNotification, updateAlert]);

  return null;
}
