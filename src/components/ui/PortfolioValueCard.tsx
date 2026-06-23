import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';

const ACCOUNTS = [
  { id: 'main', label: 'Main Account', type: 'Cash' },
  { id: 'margin', label: 'Margin Account', type: 'Margin' },
  { id: 'demo', label: 'Demo Account', type: 'Demo' },
];

const SPARKLINE = [42, 39, 45, 38, 48, 44, 51, 47, 55, 50, 58, 62];

export const PortfolioValueCard = () => {
  const router = useRouter();
  const { summary } = usePortfolio();
  const [isHidden, setIsHidden] = useState(false);
  const [selectedId, setSelectedId] = useState('main');
  const [showAccounts, setShowAccounts] = useState(false);

  const account = ACCOUNTS.find((a) => a.id === selectedId)!;
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
    <>
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

          <View className="items-end ml-3">
            <TouchableOpacity
              onPress={() => setShowAccounts(true)}
              className="flex-row items-center bg-[#18191C] rounded-full px-3 py-1.5 mb-4 border border-[#2A2B2F]"
            >
              <Text className="text-white text-xs mr-1">{account.label.split(' ')[0]}</Text>
              <Ionicons name="chevron-down" size={13} color="#9CA3AF" />
            </TouchableOpacity>

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

      <Modal
        visible={showAccounts}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAccounts(false)}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowAccounts(false)} />
          <View className="bg-[#111214] rounded-t-3xl border-t border-[#2A2B2F] px-4 pt-3 pb-10">
            <View className="w-10 h-1 bg-[#2A2B2F] rounded-full self-center mb-5" />
            <Text className="text-white text-lg font-bold mb-4">Select Account</Text>

            {ACCOUNTS.map((acc) => {
              const selected = acc.id === selectedId;
              const balance =
                acc.id === 'main'
                  ? summary.totalValue
                  : acc.id === 'margin'
                    ? summary.buyingPower
                    : 0;
              return (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => {
                    setSelectedId(acc.id);
                    setShowAccounts(false);
                  }}
                  className={`flex-row items-center justify-between py-4 px-4 rounded-xl mb-2 border ${
                    selected ? 'bg-[#1A0E00] border-[#FF8A00]/50' : 'bg-[#18191C] border-[#1e1e1e]'
                  }`}
                >
                  <View>
                    <Text className="text-white font-semibold">{acc.label}</Text>
                    <Text className="text-[#555] text-xs mt-0.5">
                      {acc.type} · {isHidden ? 'Rs ••••••' : `Rs ${formatPortfolioRs(balance)}`}
                    </Text>
                  </View>
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
