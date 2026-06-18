import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FuturesContract, formatFuturesPrice } from '../../data/mockFutures';

interface FuturesContractSelectorModalProps {
  visible: boolean;
  contracts: FuturesContract[];
  selectedSymbol: string;
  onSelect: (contract: FuturesContract) => void;
  onClose: () => void;
}

export const FuturesContractSelectorModal: React.FC<FuturesContractSelectorModalProps> = ({
  visible,
  contracts,
  selectedSymbol,
  onSelect,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View className="flex-1 bg-black/75 justify-end">
      <View className="bg-[#111214] rounded-t-2xl border-t border-[#2A2B2F] max-h-[78%]">
        <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-[#2A2B2F]">
          <View>
            <Text className="text-white text-base font-bold">Select Contract</Text>
            <Text className="text-[#9CA3AF] text-xs mt-0.5">PSX perpetual & quarterly futures</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-[#18191C] items-center justify-center">
            <Ionicons name="close" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ScrollView className="px-4 py-3" showsVerticalScrollIndicator={false}>
          {contracts.map((item) => {
            const isSelected = item.symbol === selectedSymbol;
            const changeColor = item.isPositive ? 'text-[#00C853]' : 'text-[#FF3B30]';
            const sign = item.isPositive ? '+' : '';

            return (
              <TouchableOpacity
                key={item.symbol}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                activeOpacity={0.85}
                className={`flex-row items-center p-3.5 mb-2 rounded-xl border ${
                  isSelected
                    ? 'bg-[#FF8A00]/10 border-[#FF8A00]'
                    : 'bg-[#18191C] border-[#2A2B2F]'
                }`}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    isSelected ? 'bg-[#FF8A00]/20' : 'bg-[#050505]'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${isSelected ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
                    {item.exchange}
                  </Text>
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-white text-sm font-bold">{item.symbol}</Text>
                    {isSelected && (
                      <View className="ml-2 bg-[#FF8A00] px-1.5 py-0.5 rounded">
                        <Text className="text-black text-[9px] font-bold">ACTIVE</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-[#9CA3AF] text-[11px] mt-0.5">
                    {item.name} · {item.expiry}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-white text-sm font-semibold">{formatFuturesPrice(item.markPrice)}</Text>
                  <Text className={`text-[11px] font-semibold ${changeColor}`}>
                    {sign}
                    {item.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View className="h-6" />
        </ScrollView>
      </View>
    </View>
  </Modal>
);
