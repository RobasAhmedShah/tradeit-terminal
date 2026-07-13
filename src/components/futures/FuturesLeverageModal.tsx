import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

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
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-app-card rounded-t-2xl p-5 border-t border-app-border">
          <Text className="text-app-text text-base font-semibold mb-1">Adjust Leverage</Text>
          <Text className="text-app-muted text-xs mb-4">{contractName}</Text>

          <Text className="text-[#FF8A00] text-[32px] font-bold text-center mb-4">{leverage}x</Text>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {LEVERAGE_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset}
                onPress={() => onChange(preset)}
                className={`px-3 py-2 rounded-lg border ${
                  leverage === preset ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-app-border bg-app-card-soft'
                }`}
              >
                <Text className={`text-xs font-semibold ${leverage === preset ? 'text-[#FF8A00]' : 'text-app-muted'}`}>
                  {preset}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            className="border border-[#FF8A00]/20 rounded-lg p-2.5 mb-4"
            style={{ backgroundColor: colors.primaryTint }}
          >
            <Text className="text-[#FF8A00] text-xs">
              Higher leverage increases risk of liquidation.
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} className="bg-[#FF8A00] rounded-lg py-3">
            <Text className="text-black text-sm font-bold text-center">Confirm {leverage}x</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="mt-2.5 mb-2">
            <Text className="text-app-muted text-xs text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
