import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FuturesContract, formatFuturesPrice } from '../../data/mockFutures';

interface FuturesContractHeaderProps {
  contract: FuturesContract;
  onContractPress?: () => void;
  isLive?: boolean;
}

export const FuturesContractHeader: React.FC<FuturesContractHeaderProps> = ({
  contract,
  onContractPress,
  isLive = false,
}) => {
  const changeColor = contract.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]';
  const sign = contract.isPositive ? '+' : '';

  return (
    <View className="mx-4 mb-2">
      <TouchableOpacity
        onPress={onContractPress}
        className="flex-row items-center mb-2"
        activeOpacity={0.8}
      >
        <View className="w-8 h-8 rounded-full bg-[#18191C] border border-[#2A2B2F] items-center justify-center mr-2">
          <Text className="text-[#FF8A00] text-[10px] font-bold">KSE</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-white text-base font-bold">{contract.symbol}</Text>
            <Ionicons name="chevron-down" size={14} color="#FF8A00" style={{ marginLeft: 4 }} />
          </View>
          <Text className="text-[#9CA3AF] text-xs">
            {contract.name} · {contract.expiry} · {contract.exchange}
          </Text>
        </View>
        <View className="items-end">
          <View className="flex-row items-center">
            {isLive && (
              <View className="flex-row items-center mr-2 bg-[#0ECB81]/10 px-1.5 py-0.5 rounded-full">
                <View className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] mr-1" />
                <Text className="text-[#0ECB81] text-[9px] font-bold">LIVE</Text>
              </View>
            )}
            <Text className={`text-xl font-bold ${changeColor}`}>
              {formatFuturesPrice(contract.markPrice)}
            </Text>
          </View>
          <Text className={`text-xs font-semibold ${changeColor}`}>
            {sign}{formatFuturesPrice(contract.changeValue)} ({sign}{contract.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </TouchableOpacity>

      <View className="flex-row bg-[#111214] border border-[#2A2B2F] rounded-xl px-3 py-2">
        <View className="flex-1">
          <Text className="text-[#9CA3AF] text-[11px]">Index</Text>
          <Text className="text-white text-xs font-semibold">{formatFuturesPrice(contract.indexPrice)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-[#9CA3AF] text-[11px]">24h High</Text>
          <Text className="text-white text-xs font-semibold">{formatFuturesPrice(contract.high24h)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-[#9CA3AF] text-[11px]">24h Low</Text>
          <Text className="text-white text-xs font-semibold">{formatFuturesPrice(contract.low24h)}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-[#9CA3AF] text-[11px]">Vol (24h)</Text>
          <Text className="text-white text-xs font-semibold">{contract.volume24h.toLocaleString()}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-2 px-1">
        <Text className="text-[#9CA3AF] text-xs">
          Funding / Countdown{' '}
          <Text className="text-[#FF8A00] font-semibold">
            {contract.fundingRate.toFixed(4)}% / {contract.nextFundingIn}
          </Text>
        </Text>
        <TouchableOpacity>
          <Text className="text-[#FF8A00] text-xs font-semibold">Calculator</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
