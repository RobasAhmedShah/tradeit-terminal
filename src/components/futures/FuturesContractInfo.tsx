import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FuturesContract, formatFuturesPrice } from '../../data/mockFutures';

interface FuturesContractInfoProps {
  contract: FuturesContract;
}

export const FuturesContractInfo: React.FC<FuturesContractInfoProps> = ({ contract }) => {
  const rows = [
    { label: 'Contract', value: contract.symbol },
    { label: 'Underlying', value: 'KSE-100 Index' },
    { label: 'Expiry', value: contract.expiry },
    { label: 'Exchange', value: contract.exchange },
    { label: 'Mark Price', value: formatFuturesPrice(contract.markPrice) },
    { label: 'Index Price', value: formatFuturesPrice(contract.indexPrice) },
    { label: 'Funding Rate', value: `${contract.fundingRate.toFixed(4)}%` },
    { label: 'Next Funding', value: contract.nextFundingIn },
    { label: 'Tick Size', value: '0.50 PKR' },
    { label: 'Lot Size', value: '1 Index Point' },
    { label: 'Max Leverage', value: '125x' },
    { label: 'Maintenance Margin', value: '0.50%' },
  ];

  return (
    <ScrollView className="mx-4 mb-3" showsVerticalScrollIndicator={false}>
      <View className="bg-app-card border border-app-border rounded-xl overflow-hidden">
        {rows.map((row, index) => (
          <View
            key={row.label}
            className={`flex-row justify-between px-3 py-3 ${index < rows.length - 1 ? 'border-b border-app-border' : ''}`}
          >
            <Text className="text-app-muted text-sm">{row.label}</Text>
            <Text className="text-app-text text-sm font-semibold">{row.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
