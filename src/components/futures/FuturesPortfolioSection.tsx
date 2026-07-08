import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTransferSheet } from '../../context/TransferSheetContext';
import { Ionicons } from '@expo/vector-icons';
import {
  FuturesHistoryItem,
  FuturesOpenOrder,
  FuturesPortfolioTab,
  FuturesPosition,
  formatFuturesPrice,
} from '../../data/mockFutures';
import { FuturesPositionCard } from './FuturesPositionCard';
import { FuturesOpenOrderRow } from './FuturesOpenOrderRow';

const PORTFOLIO_TABS: { id: FuturesPortfolioTab; label: string }[] = [
  { id: 'positions', label: 'Positions' },
  { id: 'open_orders', label: 'Open Orders' },
  { id: 'history', label: 'History' },
];

interface FuturesPortfolioSectionProps {
  positions: FuturesPosition[];
  openOrders: FuturesOpenOrder[];
  orderHistory: FuturesHistoryItem[];
  marginAvailable?: number;
  onClosePosition: (position: FuturesPosition) => void;
  onCancelOrder: (order: FuturesOpenOrder) => void;
}

function historyLabel(item: FuturesHistoryItem): string {
  switch (item.type) {
    case 'position_closed':
      return 'Position Closed';
    case 'order_filled':
      return 'Order Filled';
    case 'order_cancelled':
      return 'Order Cancelled';
    default:
      return 'Activity';
  }
}

function HistoryRow({ item }: { item: FuturesHistoryItem }) {
  const isLong = item.side === 'Long';
  const pnl = item.realizedPnl;

  return (
    <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3 mb-2">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View
            className={`px-1.5 py-0.5 rounded border mr-2 ${
              isLong ? 'bg-[#0ECB81]/10 border-[#0ECB81]/30' : 'bg-[#F6465D]/10 border-[#F6465D]/30'
            }`}
          >
            <Text className={`text-[11px] font-bold ${isLong ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
              {item.side}
            </Text>
          </View>
          <Text className="text-white text-sm font-semibold">{item.symbol}</Text>
        </View>
        <Text className="text-[#9CA3AF] text-[10px]">{item.timestamp}</Text>
      </View>
      <View className="flex-row justify-between">
        <Text className="text-[#9CA3AF] text-xs">{historyLabel(item)}</Text>
        <Text className="text-[#9CA3AF] text-xs">
          {item.quantity} lots @ {formatFuturesPrice(item.price)}
        </Text>
      </View>
      {pnl !== undefined && (
        <Text
          className={`text-xs font-semibold mt-1.5 ${pnl >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}
        >
          Realized PnL: {pnl >= 0 ? '+' : ''}
          {formatFuturesPrice(pnl)}
        </Text>
      )}
    </View>
  );
}

export const FuturesPortfolioSection: React.FC<FuturesPortfolioSectionProps> = ({
  positions,
  openOrders,
  orderHistory,
  marginAvailable = 0,
  onClosePosition,
  onCancelOrder,
}) => {
  const router = useRouter();
  const { openTransfer } = useTransferSheet();
  const [activeTab, setActiveTab] = useState<FuturesPortfolioTab>('positions');

  const counts: Record<FuturesPortfolioTab, number> = {
    positions: positions.length,
    open_orders: openOrders.length,
    history: orderHistory.length,
  };

  const viewAllRoute =
    activeTab === 'positions'
      ? '/orders?tab=futures&view=positions'
      : activeTab === 'open_orders'
        ? '/orders?tab=futures&view=open'
        : '/orders?tab=futures&view=history';

  const previewLimit = 2;

  return (
    <View className="mx-4 mt-1 mb-2">
      <View className="flex-row border-b border-[#2A2B2F] mb-3">
        {PORTFOLIO_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 ${isActive ? 'border-b-2 border-[#FF8A00]' : ''}`}
            >
              <Text
                className={`text-center text-xs font-semibold ${isActive ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}
              >
                {tab.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-base font-bold">
          {activeTab === 'positions' && 'Open Positions'}
          {activeTab === 'open_orders' && 'Pending Orders'}
          {activeTab === 'history' && 'Recent Activity'}
        </Text>
        <TouchableOpacity onPress={() => router.push(viewAllRoute)} className="flex-row items-center">
          <Text className="text-[#FF8A00] text-xs font-semibold mr-1">View All</Text>
          <Ionicons name="chevron-forward" size={12} color="#FF8A00" />
        </TouchableOpacity>
      </View>

      {activeTab === 'positions' &&
        (positions.length === 0 ? (
          <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-6 items-center">
            <Text className="text-[#9CA3AF] text-sm">No open positions</Text>
            {marginAvailable === 0 && openOrders.length === 0 && (
              <TouchableOpacity onPress={() => openTransfer()} className="mt-3">
                <Text className="text-[#FF8A00] text-sm font-semibold">Transfer from Spot →</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          positions.slice(0, previewLimit).map((position) => (
            <FuturesPositionCard
              key={position.id}
              position={position}
              onClose={onClosePosition}
              compact
            />
          ))
        ))}

      {activeTab === 'open_orders' &&
        (openOrders.length === 0 ? (
          <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-6 items-center">
            <Text className="text-[#9CA3AF] text-sm">No open orders</Text>
          </View>
        ) : (
          openOrders.slice(0, previewLimit).map((order) => (
            <FuturesOpenOrderRow key={order.id} order={order} onCancel={onCancelOrder} />
          ))
        ))}

      {activeTab === 'history' &&
        (orderHistory.length === 0 ? (
          <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-6 items-center">
            <Text className="text-[#9CA3AF] text-sm">No history yet</Text>
          </View>
        ) : (
          orderHistory.slice(0, previewLimit).map((item) => <HistoryRow key={item.id} item={item} />)
        ))}
    </View>
  );
};
