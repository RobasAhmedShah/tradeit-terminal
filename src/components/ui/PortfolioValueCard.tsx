import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';

const SPARKLINE = [42, 39, 45, 38, 48, 44, 51, 47, 55, 50, 58, 62];

export const PortfolioValueCard = () => {
  const router = useRouter();
  const { summary } = usePortfolio();
  const [isHidden, setIsHidden] = useState(false);

  const isPositive = summary.todayPnl >= 0;
  const isEmpty = summary.totalValue === 0;

  const W = 100;
  const H = 44;
  const min = Math.min(...SPARKLINE);
  const max = Math.max(...SPARKLINE);
  const range = max - min || 1;
  const svgPoints = SPARKLINE.map((v, i) => {
    const x = (i / (SPARKLINE.length - 1)) * W;
    const y = H - ((v - min) / range) * H * 0.85 - H * 0.05;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <View className="bg-[#111214] border border-[#2A2B2F] rounded-2xl p-5 mx-4 my-2">
      <View className="flex-row justify-between items-start">
        <View style={{ flex: 1 }}>
          <View className="flex-row items-center mb-1">
            <Text className="text-[#9CA3AF] text-sm mr-2">Total Portfolio Value</Text>
            <TouchableOpacity
              onPress={() => setIsHidden((h) => !h)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons
                name={isHidden ? 'eye-off-outline' : 'eye-outline'}
                size={16}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-white text-3xl font-bold tracking-tight mb-3">
            {isHidden ? 'Rs ••••••' : `Rs ${formatPortfolioRs(summary.totalValue)}`}
          </Text>

          {isHidden ? (
            <Text className="text-[#555] text-xs">Balance hidden</Text>
          ) : isEmpty ? (
            <TouchableOpacity onPress={() => router.push('/deposit')} className="flex-row items-center">
              <Text className="text-[#FF8A00] text-sm font-semibold">Deposit to get started →</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text className="text-[#9CA3AF] text-xs mb-1">Today's P/L</Text>
              <Text
                className={`text-sm font-semibold mb-2 ${isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}
              >
                {isPositive ? '+' : ''}Rs {formatPortfolioRs(summary.todayPnl)} ({summary.todayPnlPct}%)
              </Text>
              <Text className="text-[#9CA3AF] text-xs">
                Invested: Rs {formatPortfolioRs(summary.invested)}
              </Text>
            </>
          )}
        </View>

        <View className="items-end ml-3 justify-center">
          <Svg width={W} height={H}>
            <Polyline
              points={svgPoints}
              fill="none"
              stroke={isPositive ? '#00C853' : '#FF3B30'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};
