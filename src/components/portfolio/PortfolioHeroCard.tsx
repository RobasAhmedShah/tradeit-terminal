import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { getRangeMetrics, PortfolioRange } from '../../utils/portfolioUi';

const RANGES: PortfolioRange[] = ['1D', '1W', '1M', '3M', 'YTD'];

const ACCOUNTS = [
  { id: 'all', label: 'All Accounts' },
  { id: 'main', label: 'Main Account' },
  { id: 'margin', label: 'Margin Account' },
];

const SPARKLINE_UP = 'M0,60 C20,50 30,55 40,40 C50,25 60,35 70,20 C80,5 90,15 110,0';
const SPARKLINE_DOWN = 'M0,5 C20,15 30,10 40,25 C50,40 60,30 70,45 C80,60 90,50 110,65';

export const PortfolioHeroCard: React.FC = () => {
  const { summary, holdings, getStockBySymbol } = usePortfolio();
  const [activeRange, setActiveRange] = useState<PortfolioRange>('1D');
  const [isHidden, setIsHidden] = useState(false);
  const [accountId, setAccountId] = useState('all');
  const [showAccounts, setShowAccounts] = useState(false);

  const account = ACCOUNTS.find((a) => a.id === accountId) ?? ACCOUNTS[0];
  const rangeStats = useMemo(
    () => getRangeMetrics(holdings, getStockBySymbol, activeRange),
    [holdings, getStockBySymbol, activeRange]
  );

  const isPositive = rangeStats.periodPnl >= 0;
  const sparkPath = isPositive ? SPARKLINE_UP : SPARKLINE_DOWN;
  const sparkFill = `${sparkPath} L110,65 L0,65 Z`;
  const sparkColor = isPositive ? '#00C853' : '#FF3B30';

  return (
    <>
      <View className="mx-4 bg-[#111214] border border-[#2A2B2F] rounded-2xl p-4 mb-4 overflow-hidden relative">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <Text className="text-[#9CA3AF] text-xs font-semibold mr-1">Total Portfolio Value</Text>
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
          <TouchableOpacity
            onPress={() => setShowAccounts(true)}
            className="flex-row items-center bg-[#18191C] px-2.5 py-1 rounded-full border border-[#2A2B2F]"
          >
            <Text className="text-[#9CA3AF] text-[10px] mr-1 font-semibold">{account.label}</Text>
            <Ionicons name="chevron-down" size={10} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text className="text-white text-[26px] font-bold mb-1 z-10 relative">
          {isHidden ? 'Rs ••••••' : `Rs ${formatPortfolioRs(summary.totalValue)}`}
        </Text>
        <Text className="text-[#FF8A00] text-xs font-semibold mb-3 z-10 relative">
          {isHidden ? 'Cash hidden' : `Buying power: Rs ${formatPortfolioRs(summary.buyingPower)}`}
        </Text>

        <View className="z-10 relative">
          {isHidden ? (
            <Text className="text-[#9CA3AF] text-xs">Balance hidden</Text>
          ) : (
            <>
              <Text className={`text-xs font-bold mb-1 ${isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
                {isPositive ? '+' : ''}Rs {formatPortfolioRs(rangeStats.periodPnl)} ({rangeStats.periodPnlPct}%){' '}
                <Text className="text-[#9CA3AF] font-normal">{rangeStats.label}</Text>
              </Text>
              <Text className={`text-xs font-bold mb-1 ${summary.totalReturn >= 0 ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
                <Text className="text-[#9CA3AF] font-normal">Total return • </Text>
                {summary.totalReturn >= 0 ? '+' : ''}Rs {formatPortfolioRs(summary.totalReturn)} ({summary.totalReturnPct}%)
              </Text>
              <Text className="text-[#9CA3AF] text-xs">
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
                className={`rounded-full px-2.5 py-1 ${isActive ? 'bg-[#FF8A00]' : 'bg-[#18191C]'}`}
              >
                <Text
                  className={`text-[11px] font-semibold ${isActive ? 'text-black' : 'text-[#9CA3AF]'}`}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Modal visible={showAccounts} transparent animationType="slide" onRequestClose={() => setShowAccounts(false)}>
        <View className="flex-1 justify-end bg-black/60">
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={() => setShowAccounts(false)} />
          <View className="bg-[#111214] rounded-t-3xl border-t border-[#2A2B2F] px-4 pt-3 pb-10">
            <View className="w-10 h-1 bg-[#2A2B2F] rounded-full self-center mb-5" />
            <Text className="text-white text-lg font-bold mb-4">Select Account</Text>
            {ACCOUNTS.map((acc) => {
              const selected = acc.id === accountId;
              return (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => {
                    setAccountId(acc.id);
                    setShowAccounts(false);
                  }}
                  className={`flex-row items-center justify-between py-4 px-4 rounded-xl mb-2 border ${
                    selected ? 'bg-[#FF8A00]/10 border-[#FF8A00]' : 'bg-[#18191C] border-[#2A2B2F]'
                  }`}
                >
                  <Text className="text-white font-semibold">{acc.label}</Text>
                  {selected && <Ionicons name="checkmark-circle" size={22} color="#FF8A00" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
};
