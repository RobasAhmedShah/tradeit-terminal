import { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationsContext';
import { usePriceAlerts } from '../../context/PriceAlertsContext';
import { useMarketPrices } from '../../context/MarketPricesContext';

/**
 * Polls live mock market prices and fires in-app notifications when alert targets are hit.
 */
export function PriceAlertMonitor() {
  const { alerts, updateAlert, ready } = usePriceAlerts();
  const { pushNotification } = useNotifications();
  const { getStock, lastTickAt } = useMarketPrices();

  useEffect(() => {
    if (!ready) return;

    const active = alerts.filter((a) => a.isActive);
    if (active.length === 0) return;

    active.forEach((alert) => {
      const stock = getStock(alert.symbol);
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
  }, [alerts, ready, pushNotification, updateAlert, getStock, lastTickAt]);

  return null;
}
