import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../context/OrdersContext';
import { safeBack } from '../../utils/navigation';
import { useAppAlert } from '../../context/AppAlertContext';
import { useFutures } from '../../context/FuturesContext';
import { Order, OrderStatus } from '../../data/mockOrders';
import { CompactEmptyState } from '../../components/ui/CompactEmptyState';
import { formatFuturesPrice, FuturesHistoryItem, FuturesPosition } from '../../data/mockFutures';
import { futuresPositionHref } from '../../utils/futuresRoutes';
import { useTransferSheet } from '../../context/TransferSheetContext';
import { useEditOrderSheet } from '../../context/EditOrderSheetContext';
import { useOrderDetailSheet } from '../../context/OrderDetailSheetContext';
import { useFuturesCloseSheet } from '../../context/FuturesCloseSheetContext';
import { COLORS } from '../../constants/theme';

type MarketTab = 'spot' | 'futures';
type HubTab = 'positions' | 'open' | 'history' | 'trades';
type HistoryFilter = 'All' | 'Executed' | 'Cancelled' | 'Rejected';

const BUY = COLORS.buy;
const SELL = COLORS.sell;
const ACCENT = COLORS.primary;

const SPOT_HUB_TABS: { id: HubTab; label: string }[] = [
  { id: 'open', label: 'Open Orders' },
  { id: 'history', label: 'Order History' },
  { id: 'trades', label: 'Trade History' },
];

const FUTURES_HUB_TABS: { id: HubTab; label: string }[] = [
  { id: 'positions', label: 'Positions' },
  { id: 'open', label: 'Open Orders' },
  { id: 'history', label: 'Order History' },
  { id: 'trades', label: 'Trade History' },
];

function filterSpotHistory(orders: Order[], filter: HistoryFilter): Order[] {
  return orders.filter((o) => {
    const isHistorical = ['Executed', 'Cancelled', 'Rejected'].includes(o.status);
    if (!isHistorical) return false;
    if (filter === 'All') return true;
    return o.status === filter;
  });
}

function statusMeta(status: OrderStatus): { color: string; bg: string } {
  switch (status) {
    case 'Executed':
      return { color: BUY, bg: 'rgba(14,203,129,0.12)' };
    case 'Partially Filled':
      return { color: ACCENT, bg: 'rgba(255,138,0,0.12)' };
    case 'Pending':
    case 'Queued':
      return { color: '#3B9EFF', bg: 'rgba(59,158,255,0.12)' };
    case 'Cancelled':
      return { color: '#8A8D93', bg: 'rgba(138,141,147,0.12)' };
    case 'Rejected':
      return { color: SELL, bg: 'rgba(246,70,93,0.12)' };
    default:
      return { color: '#8A8D93', bg: 'rgba(138,141,147,0.12)' };
  }
}

function SymbolAvatar({ symbol, color }: { symbol: string; color: string }) {
  return (
    <View
      className="w-9 h-9 rounded-full items-center justify-center mr-3"
      style={{ backgroundColor: `${color}1A`, borderWidth: 1, borderColor: `${color}33` }}
    >
      <Text className="text-[12px] font-bold" style={{ color }}>
        {symbol.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

function StatItem({
  label,
  value,
  align = 'left',
  valueColor = '#FFFFFF',
}: {
  label: string;
  value: string;
  align?: 'left' | 'right' | 'center';
  valueColor?: string;
}) {
  const alignClass = align === 'right' ? 'items-end' : align === 'center' ? 'items-center' : 'items-start';
  return (
    <View className={`flex-1 ${alignClass}`}>
      <Text className="text-[#8A8D93] text-[10px] mb-1">{label}</Text>
      <Text className="text-[13px] font-semibold" style={{ color: valueColor }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default function OrdersHubScreen() {
  const router = useRouter();
  const { tab, view, returnTo } = useLocalSearchParams<{ tab?: string; view?: string; returnTo?: string }>();
  const { orders, cancelOrder } = useOrders();
  const { positions, openOrders, orderHistory, marginAvailable, marginUsed, cancelOpenOrder } = useFutures();
  const { showAlert } = useAppAlert();
  const { openTransfer } = useTransferSheet();
  const { openEditOrder } = useEditOrderSheet();
  const { openOrderDetail } = useOrderDetailSheet();
  const { openCloseSheet } = useFuturesCloseSheet();
  const [hubTab, setHubTab] = useState<HubTab>('open');
  const [marketTab, setMarketTab] = useState<MarketTab>('spot');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('All');

  const hubTabs = marketTab === 'futures' ? FUTURES_HUB_TABS : SPOT_HUB_TABS;

  const handleBack = () => {
    if (returnTo === 'portfolio') {
      router.replace('/(tabs)/portfolio');
      return;
    }
    safeBack(router, '/(tabs)/home');
  };

  useEffect(() => {
    if (tab === 'futures') {
      setMarketTab('futures');
      if (!view) setHubTab('positions');
    } else if (tab === 'spot') setMarketTab('spot');
    if (tab === 'open_orders') {
      setMarketTab('futures');
      setHubTab('open');
    }
  }, [tab, view]);

  useEffect(() => {
    if (view === 'positions') setHubTab('positions');
    else if (view === 'history') setHubTab('history');
    else if (view === 'trades') setHubTab('trades');
    else if (view === 'open' || view === 'open_orders') setHubTab('open');
  }, [view]);

  const handleMarketTabChange = (next: MarketTab) => {
    setMarketTab(next);
    if (next === 'spot' && hubTab === 'positions') setHubTab('open');
  };

  const spotPending = useMemo(
    () =>
      orders.filter(
        (o) => o.status === 'Pending' || o.status === 'Partially Filled' || o.status === 'Queued'
      ),
    [orders]
  );

  const spotHistory = useMemo(() => filterSpotHistory(orders, historyFilter), [orders, historyFilter]);

  const spotTrades = useMemo(
    () => orders.filter((o) => o.status === 'Executed' || o.filledQty > 0),
    [orders]
  );

  const futuresTrades = useMemo(
    () => orderHistory.filter((h) => h.type === 'order_filled' || h.type === 'position_closed'),
    [orderHistory]
  );

  const handleSpotCancel = (id: string, symbol: string) => {
    showAlert(
      'Cancel Order',
      `Cancel open order for ${symbol}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelOrder(id) },
      ],
      { tone: 'warning' }
    );
  };

  const handleFuturesCancel = (order: (typeof openOrders)[0]) => {
    showAlert(
      'Cancel Order',
      `Cancel ${order.side} ${order.quantity} lots on ${order.symbol}?`,
      [
        { text: 'Keep', style: 'cancel' },
        { text: 'Cancel Order', style: 'destructive', onPress: () => cancelOpenOrder(order) },
      ],
      { tone: 'warning' }
    );
  };

  const handleFuturesClose = (position: FuturesPosition) => {
    openCloseSheet(position);
  };

  const handleCancelAll = () => {
    const count = marketTab === 'spot' ? spotPending.length : openOrders.length;
    if (count === 0) return;
    showAlert(
      'Cancel All Orders',
      `This will cancel all ${count} open ${marketTab} order${count > 1 ? 's' : ''}. Continue?`,
      [
        { text: 'Back', style: 'cancel' },
        {
          text: 'Cancel All',
          style: 'destructive',
          onPress: () => {
            if (marketTab === 'spot') {
              spotPending.forEach((o) => cancelOrder(o.id));
            } else {
              [...openOrders].forEach((o) => cancelOpenOrder(o));
            }
          },
        },
      ],
      { tone: 'warning' }
    );
  };

  const openCount = marketTab === 'spot' ? spotPending.length : openOrders.length;

  // ── Cards ───────────────────────────────────────────────────────────────
  const renderSpotOpenCard = (order: Order) => {
    const isBuy = order.side === 'BUY';
    const sideColor = isBuy ? BUY : SELL;
    const sm = statusMeta(order.status);
    const fillPct =
      order.quantity > 0 ? Math.min(100, Math.round((order.filledQty / order.quantity) * 100)) : 0;
    const showProgress = order.filledQty > 0 && order.status !== 'Executed';

    return (
      <View
        key={order.id}
        className="bg-[#161719] rounded-2xl mb-3 overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#25272D' }}
      >
        <View className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: sideColor }} />
        <TouchableOpacity activeOpacity={0.85} onPress={() => openOrderDetail(order.id)} className="p-4">
          <View className="flex-row items-center mb-3.5">
            <SymbolAvatar symbol={order.symbol} color={sideColor} />
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-white text-[15px] font-bold mr-2">{order.symbol}</Text>
                <View className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `${sideColor}1A` }}>
                  <Text className="text-[10px] font-bold" style={{ color: sideColor }}>
                    {order.side}
                  </Text>
                </View>
              </View>
              <Text className="text-[#8A8D93] text-[11px] mt-0.5" numberOfLines={1}>
                {order.type} · {order.companyName}
              </Text>
            </View>
            <View className="px-2 py-1 rounded-md" style={{ backgroundColor: sm.bg }}>
              <Text className="text-[10px] font-bold" style={{ color: sm.color }}>
                {order.status}
              </Text>
            </View>
          </View>

          <View className="flex-row">
            <StatItem label="Price" value={`Rs ${order.price.toFixed(2)}`} />
            <StatItem label="Quantity" value={`${order.quantity}`} align="center" />
            <StatItem
              label="Filled"
              value={`${order.filledQty}/${order.quantity}`}
              align="right"
              valueColor={order.filledQty > 0 ? ACCENT : '#FFFFFF'}
            />
          </View>

          {showProgress && (
            <View className="mt-3">
              <View className="h-[3px] rounded-full bg-[#25272D] overflow-hidden">
                <View className="h-full rounded-full" style={{ width: `${fillPct}%`, backgroundColor: ACCENT }} />
              </View>
              <Text className="text-[#8A8D93] text-[10px] mt-1">{fillPct}% filled</Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-row border-t" style={{ borderColor: '#25272D' }}>
          <TouchableOpacity
            onPress={() => openEditOrder(order.id)}
            className="flex-1 py-3 items-center flex-row justify-center"
          >
            <Ionicons name="create-outline" size={15} color="#C9CDD3" />
            <Text className="text-[#C9CDD3] text-[13px] font-semibold ml-1.5">Modify</Text>
          </TouchableOpacity>
          <View className="w-[1px] my-2" style={{ backgroundColor: '#25272D' }} />
          <TouchableOpacity
            onPress={() => handleSpotCancel(order.id, order.symbol)}
            className="flex-1 py-3 items-center flex-row justify-center"
          >
            <Ionicons name="close-circle-outline" size={15} color={SELL} />
            <Text className="text-[13px] font-semibold ml-1.5" style={{ color: SELL }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSpotHistoryCard = (order: Order) => {
    const isBuy = order.side === 'BUY';
    const sideColor = isBuy ? BUY : SELL;
    const sm = statusMeta(order.status);

    return (
      <TouchableOpacity
        key={order.id}
        activeOpacity={0.85}
        onPress={() => openOrderDetail(order.id)}
        className="bg-[#161719] rounded-2xl mb-3 p-4 overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#25272D' }}
      >
        <View className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: sideColor }} />
        <View className="flex-row items-center mb-3">
          <SymbolAvatar symbol={order.symbol} color={sideColor} />
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-white text-[15px] font-bold mr-2">{order.symbol}</Text>
              <Text className="text-[11px] font-bold" style={{ color: sideColor }}>
                {order.side}
              </Text>
            </View>
            <Text className="text-[#8A8D93] text-[11px] mt-0.5">
              {order.type} · {order.date}
            </Text>
          </View>
          <View className="px-2 py-1 rounded-md" style={{ backgroundColor: sm.bg }}>
            <Text className="text-[10px] font-bold" style={{ color: sm.color }}>
              {order.status}
            </Text>
          </View>
        </View>

        <View className="flex-row">
          <StatItem label="Price" value={`Rs ${order.price.toFixed(2)}`} />
          <StatItem
            label="Avg Price"
            value={order.avgPrice ? `Rs ${order.avgPrice.toFixed(2)}` : '—'}
            align="center"
          />
          <StatItem label="Quantity" value={`${order.quantity}`} align="right" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSpotTradeCard = (order: Order) => {
    const isBuy = order.side === 'BUY';
    const sideColor = isBuy ? BUY : SELL;
    const role = order.type === 'Market' ? 'Taker' : 'Maker';
    const fillPrice = order.avgPrice ?? order.price;
    const total = fillPrice * order.filledQty;

    return (
      <TouchableOpacity
        key={`trade-${order.id}`}
        activeOpacity={0.85}
        onPress={() => openOrderDetail(order.id)}
        className="bg-[#161719] rounded-2xl mb-3 p-4 overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#25272D' }}
      >
        <View className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: sideColor }} />
        <View className="flex-row items-center mb-3">
          <SymbolAvatar symbol={order.symbol} color={sideColor} />
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-white text-[15px] font-bold mr-2">{order.symbol}</Text>
              <Text className="text-[11px] font-bold mr-2" style={{ color: sideColor }}>
                {order.side}
              </Text>
              <View className="px-1.5 py-0.5 rounded bg-[#25272D]">
                <Text className="text-[#9CA3AF] text-[9px] font-semibold">{role}</Text>
              </View>
            </View>
            <Text className="text-[#8A8D93] text-[11px] mt-0.5">
              {order.date} · {order.createdTime}
            </Text>
          </View>
        </View>

        <View className="flex-row">
          <StatItem label="Fill Price" value={`Rs ${fillPrice.toFixed(2)}`} />
          <StatItem label="Filled" value={`${order.filledQty}`} align="center" />
          <StatItem label="Total" value={`Rs ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} align="right" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFuturesPositionCard = (position: FuturesPosition) => {
    const isLong = position.side === 'Long';
    const sideColor = isLong ? BUY : SELL;
    const pnlColor = position.unrealizedPnl >= 0 ? BUY : SELL;

    return (
      <View
        key={position.id}
        className="bg-[#161719] rounded-2xl mb-3 overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#25272D' }}
      >
        <View className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: sideColor }} />
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            const href = futuresPositionHref(position);
            if (href) router.push(href);
          }}
          className="p-4"
        >
          <View className="flex-row items-center mb-3">
            <SymbolAvatar symbol={position.symbol} color={sideColor} />
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-white text-[15px] font-bold mr-2">{position.symbol}</Text>
                <View className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `${sideColor}1A` }}>
                  <Text className="text-[10px] font-bold" style={{ color: sideColor }}>
                    {position.side}
                  </Text>
                </View>
              </View>
              <Text className="text-[#8A8D93] text-[11px] mt-0.5">
                {position.expiry} · {position.leverage}x
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleFuturesClose(position)}
              className="px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: '#25272D', borderWidth: 1, borderColor: '#2A2B2F' }}
            >
              <Text className="text-[#C9CDD3] text-[12px] font-semibold">Close</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <StatItem label="Size (Lots)" value={`${position.sizeLots}`} />
            <StatItem label="Entry" value={formatFuturesPrice(position.entryPrice)} align="center" />
            <StatItem label="Mark" value={formatFuturesPrice(position.markPrice)} align="right" />
          </View>

          <View className="flex-row mt-3 pt-3 border-t" style={{ borderColor: '#25272D' }}>
            <StatItem label="Unrealized PnL" value={`${position.unrealizedPnl >= 0 ? '+' : ''}${formatFuturesPrice(position.unrealizedPnl)}`} valueColor={pnlColor} />
            <StatItem
              label="Return"
              value={`${position.unrealizedPnlPct >= 0 ? '+' : ''}${position.unrealizedPnlPct.toFixed(2)}%`}
              align="right"
              valueColor={pnlColor}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFuturesOpenCard = (order: (typeof openOrders)[0]) => {
    const isLong = order.side === 'Long';
    const sideColor = isLong ? BUY : SELL;

    return (
      <View
        key={order.id}
        className="bg-[#161719] rounded-2xl mb-3 p-4 overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#25272D' }}
      >
        <View className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: sideColor }} />
        <View className="flex-row items-center mb-3">
          <SymbolAvatar symbol={order.symbol} color={sideColor} />
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-white text-[15px] font-bold mr-2">{order.symbol}</Text>
              <View className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `${sideColor}1A` }}>
                <Text className="text-[10px] font-bold" style={{ color: sideColor }}>
                  {order.side}
                </Text>
              </View>
            </View>
            <Text className="text-[#8A8D93] text-[11px] mt-0.5">
              {order.orderType} · {order.leverage}x {order.marginMode}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleFuturesCancel(order)}
            className="px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'rgba(246,70,93,0.10)', borderWidth: 1, borderColor: 'rgba(246,70,93,0.25)' }}
          >
            <Text className="text-[12px] font-semibold" style={{ color: SELL }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row">
          <StatItem label="Qty (Lots)" value={`${order.quantity}`} />
          <StatItem label="Price" value={formatFuturesPrice(order.price)} align="center" />
          <StatItem label="Margin" value={formatFuturesPrice(order.requiredMargin)} align="right" />
        </View>
      </View>
    );
  };

  const renderFuturesHistoryCard = (item: FuturesHistoryItem) => {
    const isLong = item.side === 'Long';
    const sideColor = isLong ? BUY : SELL;
    const typeLabel =
      item.type === 'order_filled'
        ? 'Filled'
        : item.type === 'position_closed'
          ? 'Closed'
          : 'Cancelled';
    const typeColor =
      item.type === 'order_cancelled' ? '#8A8D93' : item.type === 'position_closed' ? ACCENT : BUY;
    const hasPnl = item.realizedPnl != null;
    const pnlColor = (item.realizedPnl ?? 0) >= 0 ? BUY : SELL;

    return (
      <View
        key={item.id}
        className="bg-[#161719] rounded-2xl mb-3 p-4 overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#25272D' }}
      >
        <View className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: sideColor }} />
        <View className="flex-row items-center mb-3">
          <SymbolAvatar symbol={item.symbol} color={sideColor} />
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-white text-[15px] font-bold mr-2">{item.symbol}</Text>
              <Text className="text-[11px] font-bold" style={{ color: sideColor }}>
                {item.side}
              </Text>
            </View>
            <Text className="text-[#8A8D93] text-[11px] mt-0.5">{item.timestamp}</Text>
          </View>
          <View className="px-2 py-1 rounded-md" style={{ backgroundColor: `${typeColor}1F` }}>
            <Text className="text-[10px] font-bold" style={{ color: typeColor }}>
              {typeLabel}
            </Text>
          </View>
        </View>

        <View className="flex-row">
          <StatItem label="Qty (Lots)" value={`${item.quantity}`} />
          <StatItem label="Price" value={formatFuturesPrice(item.price)} align={hasPnl ? 'center' : 'right'} />
          {hasPnl && (
            <StatItem
              label="Realized PnL"
              value={`${(item.realizedPnl ?? 0) >= 0 ? '+' : ''}${formatFuturesPrice(item.realizedPnl ?? 0)}`}
              align="right"
              valueColor={pnlColor}
            />
          )}
        </View>
      </View>
    );
  };

  // ── Content selector ──────────────────────────────────────────────────────
  const renderContent = () => {
    if (hubTab === 'positions' && marketTab === 'futures') {
      return positions.length === 0 ? (
        <CompactEmptyState
          icon="trending-up-outline"
          title="No open futures positions"
          message={
            marginAvailable === 0
              ? 'Transfer margin from Spot to open your first futures position.'
              : 'Open a position from the Futures tab to see it here.'
          }
          actionLabel={marginAvailable === 0 ? 'Transfer from Spot →' : 'Trade futures →'}
          onAction={() => (marginAvailable === 0 ? openTransfer() : router.push('/(tabs)/futures'))}
        />
      ) : (
        positions.map(renderFuturesPositionCard)
      );
    }

    if (hubTab === 'open') {
      if (marketTab === 'spot') {
        return spotPending.length === 0 ? (
          <CompactEmptyState
            icon="document-text-outline"
            title="No open spot orders"
            message="Your pending and partially filled orders will appear here."
            actionLabel="Browse stocks →"
            onAction={() => router.push('/(tabs)/trade')}
          />
        ) : (
          spotPending.map(renderSpotOpenCard)
        );
      }
      return openOrders.length === 0 ? (
        <CompactEmptyState
          icon="document-text-outline"
          title="No open futures orders"
          message="Open a futures position to see working orders here."
          actionLabel="Trade futures →"
          onAction={() => router.push('/(tabs)/futures')}
        />
      ) : (
        openOrders.map(renderFuturesOpenCard)
      );
    }

    if (hubTab === 'history') {
      if (marketTab === 'spot') {
        return spotHistory.length === 0 ? (
          <CompactEmptyState
            icon="time-outline"
            title={`No ${historyFilter.toLowerCase()} spot orders`}
            message="Filled, cancelled and rejected orders appear here."
          />
        ) : (
          spotHistory.map(renderSpotHistoryCard)
        );
      }
      return orderHistory.length === 0 ? (
        <CompactEmptyState
          icon="time-outline"
          title="No futures history"
          message="Closed and cancelled futures orders will be listed here."
        />
      ) : (
        orderHistory.map(renderFuturesHistoryCard)
      );
    }

    // Trade History
    if (marketTab === 'spot') {
      return spotTrades.length === 0 ? (
        <CompactEmptyState
          icon="swap-horizontal-outline"
          title="No spot trades yet"
          message="Your executed fills will appear here with price and total."
        />
      ) : (
        spotTrades.map(renderSpotTradeCard)
      );
    }
    return futuresTrades.length === 0 ? (
      <CompactEmptyState
        icon="swap-horizontal-outline"
        title="No futures trades yet"
        message="Filled orders and closed positions will appear here."
      />
    ) : (
      futuresTrades.map(renderFuturesHistoryCard)
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={handleBack}
          className="w-9 h-9 rounded-full bg-[#161719] items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-[17px] font-bold">Orders</Text>
        <TouchableOpacity
          onPress={() => router.push(marketTab === 'futures' ? '/(tabs)/futures' : '/(tabs)/trade')}
          className="w-9 h-9 rounded-full bg-[#161719] items-center justify-center"
        >
          <Ionicons name="add" size={22} color={ACCENT} />
        </TouchableOpacity>
      </View>

      {/* Spot / Futures segmented control */}
      <View
        className="flex-row mx-4 mt-1 bg-[#161719] rounded-xl p-1"
        style={{ borderWidth: 1, borderColor: '#25272D' }}
      >
        {(['spot', 'futures'] as MarketTab[]).map((t) => {
          const active = marketTab === t;
          const count =
            t === 'spot'
              ? spotPending.length
              : positions.length + openOrders.length;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => handleMarketTabChange(t)}
              activeOpacity={0.8}
              className={`flex-1 py-2.5 rounded-lg flex-row items-center justify-center ${active ? 'bg-[#202227]' : ''}`}
            >
              <View className="items-center">
                <View className="flex-row items-center">
                  <Text className={`text-[13px] font-bold capitalize ${active ? 'text-white' : 'text-[#8A8D93]'}`}>
                    {t}
                  </Text>
                  {count > 0 && (
                    <View
                      className="ml-1.5 rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center"
                      style={{ backgroundColor: active ? ACCENT : '#2A2B2F' }}
                    >
                      <Text className={`text-[10px] font-bold ${active ? 'text-black' : 'text-[#9CA3AF]'}`}>{count}</Text>
                    </View>
                  )}
                </View>
                {active && (
                  <View className="h-[2px] rounded-full mt-1" style={{ backgroundColor: ACCENT, width: 18 }} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* State underline tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {hubTabs.map((t) => {
          const active = hubTab === t.id;
          return (
            <TouchableOpacity key={t.id} onPress={() => setHubTab(t.id)} className="mr-5 pb-2.5" activeOpacity={0.7}>
              <Text className={`text-[14px] ${active ? 'text-white font-bold' : 'text-[#8A8D93] font-semibold'}`}>
                {t.label}
              </Text>
              {active && (
                <View
                  className="absolute left-0 bottom-0 h-[3px] rounded-full"
                  style={{ backgroundColor: ACCENT, width: 22 }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View className="h-[1px] bg-[#1C1E22]" />

      {/* History filter chips (spot only) */}
      {hubTab === 'history' && marketTab === 'spot' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pt-3"
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {(['All', 'Executed', 'Cancelled', 'Rejected'] as HistoryFilter[]).map((f) => {
            const active = historyFilter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setHistoryFilter(f)}
                activeOpacity={0.8}
                className="mr-2 px-3.5 py-1.5 rounded-full"
                style={{
                  backgroundColor: active ? ACCENT : '#161719',
                  borderWidth: 1,
                  borderColor: active ? ACCENT : '#25272D',
                }}
              >
                <Text className={`text-[12px] font-bold ${active ? 'text-black' : 'text-[#9CA3AF]'}`}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Futures margin summary */}
      {marketTab === 'futures' && hubTab === 'positions' && (
        <View className="mx-4 mt-3 bg-[#161719] rounded-xl p-3.5 flex-row" style={{ borderWidth: 1, borderColor: '#25272D' }}>
          <View className="flex-1">
            <Text className="text-[#8A8D93] text-[10px] mb-1">Available Margin</Text>
            <Text className="text-white text-[14px] font-bold">{formatFuturesPrice(marginAvailable)}</Text>
          </View>
          <View className="w-[1px] bg-[#25272D] mx-3" />
          <View className="flex-1 items-end">
            <Text className="text-[#8A8D93] text-[10px] mb-1">Margin Used</Text>
            <Text className="text-white text-[14px] font-bold">{formatFuturesPrice(marginUsed)}</Text>
          </View>
        </View>
      )}

      {/* Open Orders action row: count + Cancel All */}
      {hubTab === 'open' && openCount > 0 && (
        <View className="px-4 pt-3 flex-row items-center justify-between">
          <Text className="text-[#8A8D93] text-[12px]">
            {openCount} active {marketTab} order{openCount > 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={handleCancelAll} activeOpacity={0.7} className="flex-row items-center">
            <Ionicons name="close-circle-outline" size={14} color={SELL} />
            <Text className="text-[12px] font-bold ml-1" style={{ color: SELL }}>
              Cancel All
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
