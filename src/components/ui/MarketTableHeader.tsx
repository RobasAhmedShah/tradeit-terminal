import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SortField } from '../../utils/tradeMarket';

interface MarketTableHeaderProps {
  sortField: SortField | null;
  sortDirection: 'asc' | 'desc';
  onSortPress: (field: 'Price' | 'Change %') => void;
}

function SortIcon({
  field,
  activeField,
  direction,
}: {
  field: SortField;
  activeField: SortField | null;
  direction: 'asc' | 'desc';
}) {
  const isActive = activeField === field;

  return (
    <Ionicons
      name={isActive ? (direction === 'asc' ? 'chevron-up' : 'chevron-down') : 'swap-vertical'}
      size={10}
      color={isActive ? '#FF8A00' : '#9CA3AF'}
    />
  );
}

export const MarketTableHeader: React.FC<MarketTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSortPress,
}) => {
  const priceActive = sortField === 'Price';
  const changeActive = sortField === 'Change %';

  return (
    <View className="flex-row items-center justify-between px-4 py-2 border-b border-app-border">
      <View className="flex-[1.5]">
        <Text className="text-app-muted text-xs">Stock / Company</Text>
      </View>
      <View className="flex-1 items-center justify-center" />
      <TouchableOpacity
        onPress={() => onSortPress('Price')}
        className="flex-[0.8] items-end justify-center pr-2 py-1"
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        <View className="flex-row items-center">
          <Text className={`text-[10px] mr-1 ${priceActive ? 'text-[#FF8A00] font-semibold' : 'text-app-muted'}`}>
            Price
          </Text>
          <SortIcon field="Price" activeField={sortField} direction={sortDirection} />
        </View>
      </TouchableOpacity>
      <View className="flex-[0.8] items-end justify-center pr-2">
        <Text className="text-app-muted text-[10px]">Buy / Sell</Text>
      </View>
      <TouchableOpacity
        onPress={() => onSortPress('Change %')}
        className="flex-[0.8] items-end justify-center pr-2 py-1"
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      >
        <View className="flex-row items-center">
          <Text className={`text-[10px] mr-1 ${changeActive ? 'text-[#FF8A00] font-semibold' : 'text-app-muted'}`}>
            Change %
          </Text>
          <SortIcon field="Change %" activeField={sortField} direction={sortDirection} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
