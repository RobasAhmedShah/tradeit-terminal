import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useComposePost } from '../../hooks/useComposePost';
import { COLORS } from '../../constants/theme';
import { hapticLight } from '../../utils/haptics';

/** Floating compose button — Markets Community tab only */
export function ComposePostFab() {
  const insets = useSafeAreaInsets();
  const { openCompose } = useComposePost();

  return (
    <TouchableOpacity
      onPress={() => {
        hapticLight();
        openCompose();
      }}
      activeOpacity={0.9}
      className="absolute right-5 w-14 h-14 rounded-full items-center justify-center shadow-lg"
      style={{
        bottom: Math.max(insets.bottom, 16) + 8,
        backgroundColor: COLORS.primary,
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Ionicons name="add" size={30} color={COLORS.black} />
    </TouchableOpacity>
  );
}
