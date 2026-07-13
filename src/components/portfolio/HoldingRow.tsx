import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PortfolioHolding, formatPortfolioRs } from '../../data/mockPortfolio';
import { StockLogo } from '../ui/StockLogo';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';

interface HoldingRowProps {
  holding: PortfolioHolding;
  onPress: () => void;
  compact?: boolean;
}

export function HoldingRow({ holding, onPress, compact = false }: HoldingRowProps) {
  const isUp = holding.dayChange > 0;
  const isDown = holding.dayChange < 0;
  const changeColor = isUp ? 'text-[#0ECB81]' : isDown ? 'text-[#F6465D]' : 'text-app-muted';
  const stock = MOCK_MARKET_STOCKS.find((s) => s.symbol === holding.symbol);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center border-b border-app-border ${compact ? 'py-2.5' : 'py-3'}`}
    >
      <View className="mr-2">
        <StockLogo
          symbol={holding.symbol}
          logoUrl={stock?.logoUrl}
          logoColor={stock?.logoColor}
          website={stock?.website}
          size={compact ? 28 : 32}
        />
      </View>

      <View className="flex-[1.2]">
        <Text className={`text-app-text font-semibold ${compact ? 'text-[11px]' : 'text-sm'}`}>
          {holding.symbol}
        </Text>
        <Text className="text-app-muted text-[9px]" numberOfLines={1}>
          {holding.name}
        </Text>
      </View>

      <View className="flex-[0.8] items-end">
        <Text className={`text-app-text font-semibold ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {holding.qty.toFixed(compact ? 2 : 0)}
        </Text>
      </View>

      <View className="flex-[1.2] items-end">
        <Text className={`text-app-text font-medium ${compact ? 'text-[10px]' : 'text-xs'}`}>
          Rs {formatPortfolioRs(holding.currentValue)}
        </Text>
        <Text className="text-app-muted text-[8px]">@ Rs {formatPortfolioRs(holding.avgCost)}</Text>
      </View>

      <View className="flex-[1.1] items-end">
        <Text className={`font-medium ${changeColor} ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {isUp ? '+' : ''}Rs {formatPortfolioRs(holding.dayChange)}
        </Text>
        <Text className={`${changeColor} ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
          ({isUp ? '+' : ''}
          {holding.dayChangePct.toFixed(2)}%)
        </Text>
      </View>

      <View className="w-10 ml-2 items-center justify-center">
        <Svg width="40" height="24" viewBox="0 0 40 24">
          <Path
            d={holding.chartPath}
            stroke={isUp ? '#0ECB81' : isDown ? '#F6465D' : '#9CA3AF'}
            strokeWidth="1.2"
            fill="none"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
}

export function HoldingsEmptyState({ onBrowse }: { onBrowse: () => void }) {
  return (
    <View className="bg-app-card rounded-xl p-8 border border-app-border items-center">
      <Text className="text-app-text font-semibold text-sm mb-1">No stocks yet</Text>
      <Text className="text-app-muted text-xs text-center mb-4">
        Buy your first stock from the Trade tab. It will show up here.
      </Text>
      <TouchableOpacity onPress={onBrowse} className="bg-[#FF8A00] rounded-full px-5 py-2.5">
        <Text className="text-black font-bold text-xs">Browse Market</Text>
      </TouchableOpacity>
    </View>
  );
}
