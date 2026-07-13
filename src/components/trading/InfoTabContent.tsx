import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Stock } from '../../types';
import { useWatchlist } from '../../context/WatchlistContext';
import { useAlertSheet } from '../../context/AlertSheetContext';
import { useTheme } from '../../context/ThemeContext';
import { hapticLight } from '../../utils/haptics';

interface InfoTabContentProps {
  stock: Stock;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="text-app-muted text-[10px] font-semibold uppercase tracking-wider mb-2.5">
      {children}
    </Text>
  );
}

function InfoRow({
  label,
  value,
  valueColor = 'text-app-text',
  last = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  last?: boolean;
}) {
  return (
    <View className={`flex-row justify-between items-center py-3 ${last ? '' : 'border-b border-app-border'}`}>
      <Text className="text-app-muted text-[12px]">{label}</Text>
      <Text className={`text-[12px] font-medium text-right flex-1 ml-4 ${valueColor}`} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function StatCell({ label, value, valueColor = 'text-app-text' }: { label: string; value: string; valueColor?: string }) {
  return (
    <View className="flex-1 p-3.5 bg-app-card">
      <Text className="text-app-muted text-[10px] mb-1">{label}</Text>
      <Text className={`text-[13px] font-semibold ${valueColor}`}>{value}</Text>
    </View>
  );
}

function formatVolume(vol?: number): string {
  if (!vol) return '—';
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return vol.toLocaleString();
}

function ActionRow({
  icon,
  label,
  onPress,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.65}
      className={`flex-row items-center py-3.5 ${last ? '' : 'border-b border-app-border'}`}
    >
      <Ionicons name={icon} size={16} color={colors.muted} />
      <Text className="text-app-text text-[13px] ml-3 flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={14} color={colors.mutedDarker} />
    </TouchableOpacity>
  );
}

export const InfoTabContent: React.FC<InfoTabContentProps> = ({ stock }) => {
  const router = useRouter();
  const { openAlert } = useAlertSheet();
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const watchlisted = isWatchlisted(stock.symbol);

  const prevClose = (stock.price - (stock.changeValue ?? 0)).toFixed(2);
  const sectorLine = [stock.sector, stock.industry].filter(Boolean).join(' · ') || 'PSX Listed';
  const about =
    stock.about ??
    `${stock.name} is a publicly listed company on the Pakistan Stock Exchange.`;

  return (
    <View className="px-4 pt-3 pb-8">
      {/* Company */}
      <View className="mb-6">
        <View className="flex-row items-center mb-1">
          <Text className="text-app-text text-[15px] font-bold">{stock.symbol}</Text>
          <Text className="text-app-muted text-[13px] mx-2">·</Text>
          <Text className="text-app-muted text-[12px]">PSX</Text>
        </View>
        <Text className="text-app-muted text-[13px] mb-2.5" numberOfLines={2}>
          {stock.name}
        </Text>
        <View className="flex-row items-center flex-wrap gap-2 mb-3">
          {stock.isShariahCompliant && (
            <View className="bg-[#0ECB81]/10 px-2 py-0.5 rounded">
              <Text className="text-[#0ECB81] text-[10px] font-medium">Shariah Compliant</Text>
            </View>
          )}
          <Text className="text-app-muted text-[11px]">{sectorLine}</Text>
        </View>
        <Text className="text-app-muted text-[12px] leading-[18px]" numberOfLines={3}>
          {about}
        </Text>
      </View>

      {/* Market data */}
      <View className="mb-6">
        <SectionTitle>Market Data</SectionTitle>
        <View className="border border-app-border rounded-xl overflow-hidden">
          <View className="flex-row border-b border-app-border">
            <StatCell label="Open" value={stock.open?.toFixed(2) ?? '—'} />
            <View className="w-px bg-app-border" />
            <StatCell label="Prev Close" value={prevClose} />
          </View>
          <View className="flex-row border-b border-app-border">
            <StatCell label="Day High" value={stock.high?.toFixed(2) ?? '—'} valueColor="text-[#0ECB81]" />
            <View className="w-px bg-app-border" />
            <StatCell label="Day Low" value={stock.low?.toFixed(2) ?? '—'} valueColor="text-[#F6465D]" />
          </View>
          <View className="flex-row">
            <StatCell label="Volume" value={formatVolume(stock.volume)} />
            <View className="w-px bg-app-border" />
            <StatCell label="Avg Vol (20D)" value={String(stock.avgVolume ?? '—')} />
          </View>
        </View>
      </View>

      {/* Valuation */}
      <View className="mb-6">
        <SectionTitle>Valuation</SectionTitle>
        <View className="flex-row border border-app-border rounded-xl overflow-hidden">
          <StatCell label="P/E" value={String(stock.peRatio ?? '—')} />
          <View className="w-px bg-app-border" />
          <StatCell label="EPS (TTM)" value={String(stock.eps ?? '—')} />
          <View className="w-px bg-app-border" />
          <StatCell
            label="Div. Yield"
            value={stock.dividendYield != null ? `${stock.dividendYield}%` : '—'}
          />
        </View>
        {stock.marketCap != null && (
          <View className="flex-row justify-between items-center mt-3 px-1">
            <Text className="text-app-muted text-[11px]">Market Cap</Text>
            <Text className="text-app-text text-[12px] font-medium">{String(stock.marketCap)}</Text>
          </View>
        )}
      </View>

      {/* Trading rules */}
      <View className="mb-6">
        <SectionTitle>Trading</SectionTitle>
        <View className="border border-app-border rounded-xl px-4 bg-app-card">
          <InfoRow label="Exchange" value="PSX" />
          <InfoRow label="Board" value="KSE 100" />
          <InfoRow label="Tick Size" value="Rs 0.25" />
          <InfoRow label="Min. Order" value="1 share" />
          <InfoRow label="Order Types" value="Limit · Market · Stop" />
          <InfoRow label="Settlement" value="T+2" last />
        </View>
      </View>

      {/* Actions */}
      <View className="mb-5">
        <SectionTitle>Actions</SectionTitle>
        <View className="border border-app-border rounded-xl px-4 bg-app-card">
          <ActionRow
            icon={watchlisted ? 'star' : 'star-outline'}
            label={watchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            onPress={() => {
              hapticLight();
              toggleWatchlist(stock);
            }}
          />
          <ActionRow
            icon="analytics-outline"
            label="Full Stock Detail"
            onPress={() => router.push(`/stock/${stock.symbol}`)}
          />
          <ActionRow
            icon="notifications-outline"
            label="Set Price Alert"
            onPress={() => openAlert(stock.symbol)}
          />
          <ActionRow
            icon="list-outline"
            label="Manage Alerts"
            onPress={() => router.push('/alerts')}
            last
          />
        </View>
      </View>

      <Text className="text-app-muted text-[10px] leading-[15px] text-center px-2">
        Prices may differ from the exchange during volatile periods. Confirm order details before submitting.
      </Text>
    </View>
  );
};
