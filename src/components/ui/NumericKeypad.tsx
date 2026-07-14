import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'back'],
] as const;

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({ onDigit, onBackspace }) => {
  const { colors } = useTheme();

  const press = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    action();
  };

  return (
    <View style={styles.grid}>
      {ROWS.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((key) => {
            if (key === '') {
              return <View key="spacer" style={styles.keySlot} />;
            }

            if (key === 'back') {
              return (
                <TouchableOpacity
                  key="back"
                  activeOpacity={0.7}
                  onPress={() => press(onBackspace)}
                  style={[
                    styles.keySlot,
                    styles.key,
                    { backgroundColor: colors.cardSoft, borderColor: colors.border },
                  ]}
                >
                  <Ionicons name="backspace-outline" size={22} color={colors.text} />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.7}
                onPress={() => press(() => onDigit(key))}
                style={[
                  styles.keySlot,
                  styles.key,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.keyText, { color: colors.text }]}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: 10,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  keySlot: {
    flex: 1,
    aspectRatio: 1.6,
    maxHeight: 56,
  },
  key: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
  },
});
