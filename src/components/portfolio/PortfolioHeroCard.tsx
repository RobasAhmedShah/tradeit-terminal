import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { getRangeMetrics, PortfolioRange } from '../../utils/portfolioUi';
import { COLORS } from '../../constants/theme';

const RANGES: PortfolioRange[] = ['1D', '1W', '1M', '3M', 'YTD'];

const SPARKLINE_UP = 'M0,60 C20,50 30,55 40,40 C50,25 60,35 70,20 C80,5 90,15 110,0';
const SPARKLINE_DOWN = 'M0,5 C20,15 30,10 40,25 C50,40 60,30 70,45 C80,60 90,50 110,65';

export const PortfolioHeroCard: React.FC = () => {
  const router = useRouter();
  const { summary, holdings, getStockBySymbol } = usePortfolio();
  const [activeRange, setActiveRange] = useState<PortfolioRange>('1D');
  const [isHidden, setIsHidden] = useState(false);

  const rangeStats = useMemo(
    () => getRangeMetrics(holdings, getStockBySymbol, activeRange),
    [holdings, getStockBySymbol, activeRange]
  );

  const isPositive = rangeStats.periodPnl >= 0;
  const isEmpty = summary.totalValue === 0 && holdings.length === 0;
  const sparkPath = isPositive ? SPARKLINE_UP : SPARKLINE_DOWN;
  const sparkFill = `${sparkPath} L110,65 L0,65 Z`;
  const sparkColor = isPositive ? COLORS.buy : COLORS.sell;

  return (
    <View className="mx-4 bg-app-card border border-app-border rounded-2xl p-4 mb-4 overflow-hidden relative">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Text className="text-app-muted text-xs font-semibold mr-1">Total Portfolio Value</Text>
          <TouchableOpacity
            onPress={() => setIsHidden((h) => !h)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name={isHidden ? 'eye-off-outline' : 'eye-outline'}
              size={14}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-app-text text-[26px] font-bold mb-1 z-10 relative">
        {isHidden ? 'Rs ••••••' : `Rs ${formatPortfolioRs(summary.totalValue)}`}
      </Text>
      <Text className="text-[#FF8A00] text-xs font-semibold mb-3 z-10 relative">
        {isHidden ? 'Cash hidden' : `Buying power: Rs ${formatPortfolioRs(summary.buyingPower)}`}
      </Text>

      {!isHidden && isEmpty && (
        <TouchableOpacity
          onPress={() => router.push('/deposit')}
          className="mb-3 z-10 relative flex-row items-center bg-[#FF8A00]/10 border border-[#FF8A00]/30 rounded-xl px-3 py-2.5"
        >
          <Ionicons name="arrow-down-circle-outline" size={18} color="#FF8A00" />
          <Text className="text-[#FF8A00] text-xs font-semibold ml-2 flex-1">
            Deposit funds to start trading
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#FF8A00" />
        </TouchableOpacity>
      )}

      <View className="z-10 relative">
        {isHidden ? (
          <Text className="text-app-muted text-xs">Balance hidden</Text>
        ) : (
          <>
            <Text className={`text-xs font-bold mb-1 ${isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
              {isPositive ? '+' : ''}Rs {formatPortfolioRs(rangeStats.periodPnl)} ({rangeStats.periodPnlPct}%){' '}
              <Text className="text-app-muted font-normal">{rangeStats.label}</Text>
            </Text>
            <Text className={`text-xs font-bold mb-1 ${summary.totalReturn >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
              <Text className="text-app-muted font-normal">Total return • </Text>
              {summary.totalReturn >= 0 ? '+' : ''}Rs {formatPortfolioRs(summary.totalReturn)} ({summary.totalReturnPct}%)
            </Text>
            <Text className="text-app-muted text-xs">
              Invested: Rs {formatPortfolioRs(summary.invested)}
            </Text>
          </>
        )}
      </View>

      <View className="absolute right-0 top-12 opacity-80 z-0">
        <Svg width="110" height="65" viewBox="0 0 110 65">
          <Defs>
            <LinearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={sparkColor} stopOpacity="0.15" />
              <Stop offset="100%" stopColor={sparkColor} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d={sparkFill} fill="url(#portfolioGrad)" />
          <Path d={sparkPath} stroke={sparkColor} strokeWidth="1.5" fill="none" />
        </Svg>
      </View>

      <View className="flex-row gap-2 mt-4 z-10 relative">
        {RANGES.map((range) => {
          const isActive = activeRange === range;
          return (
            <TouchableOpacity
              key={range}
              onPress={() => setActiveRange(range)}
              className={`rounded-full px-2.5 py-1 ${isActive ? 'bg-[#FF8A00]' : 'bg-app-card-soft'}`}
            >
              <Text
                className={`text-[11px] font-semibold ${isActive ? 'text-black' : 'text-app-muted'}`}
              >
                {range}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
