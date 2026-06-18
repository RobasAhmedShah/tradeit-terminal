import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const LEVERAGE_PRESETS = [1, 5, 10, 20, 50, 75, 100, 125];

interface FuturesLeverageModalProps {
  visible: boolean;
  leverage: number;
  contractName: string;
  onChange: (value: number) => void;
  onClose: () => void;
}

export const FuturesLeverageModal: React.FC<FuturesLeverageModalProps> = ({
  visible,
  leverage,
  contractName,
  onChange,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View className="flex-1 bg-black/70 justify-end">
      <View className="bg-[#111214] rounded-t-2xl p-5 border-t border-[#2A2B2F]">
        <Text className="text-white text-base font-semibold mb-1">Adjust Leverage</Text>
        <Text className="text-[#9CA3AF] text-xs mb-4">{contractName}</Text>

        <Text className="text-[#FF8A00] text-[32px] font-bold text-center mb-4">{leverage}x</Text>

        <View className="flex-row flex-wrap gap-2 mb-4">
          {LEVERAGE_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset}
              onPress={() => onChange(preset)}
              className={`px-3 py-2 rounded-lg border ${
                leverage === preset ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-[#2A2B2F] bg-[#18191C]'
              }`}
            >
              <Text className={`text-xs font-semibold ${leverage === preset ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
                {preset}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="bg-[#1A0E00] border border-[#FF8A00]/20 rounded-lg p-2.5 mb-4">
          <Text className="text-[#FF8A00] text-xs">
            Higher leverage increases risk of liquidation.
          </Text>
        </View>

        <TouchableOpacity onPress={onClose} className="bg-[#FF8A00] rounded-lg py-3">
          <Text className="text-black text-sm font-bold text-center">Confirm {leverage}x</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} className="mt-2.5 mb-2">
          <Text className="text-[#9CA3AF] text-xs text-center">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
