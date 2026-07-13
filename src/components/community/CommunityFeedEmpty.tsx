import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CommunityFeedTab } from '../../data/mockNews';
import { getCommunityEmptyState } from '../../utils/communityEmptyStates';
import { hapticLight } from '../../utils/haptics';

interface CommunityFeedEmptyProps {
  category: CommunityFeedTab;
  hasQuery?: boolean;
  onCreatePost?: () => void;
}

export function CommunityFeedEmpty({ category, hasQuery, onCreatePost }: CommunityFeedEmptyProps) {
  const { colors } = useTheme();
  const config = getCommunityEmptyState(category, { hasQuery });

  return (
    <View className="items-center justify-center px-8 py-12">
      <View className="w-16 h-16 rounded-full bg-app-card border border-app-border items-center justify-center mb-4">
        <Ionicons name={config.icon} size={28} color={colors.muted} />
      </View>
      <Text className="text-app-text font-bold text-base mb-2 text-center">{config.title}</Text>
      <Text className="text-app-muted text-sm text-center mb-5 leading-5">{config.message}</Text>
      {config.showCreateAction && onCreatePost && (
        <TouchableOpacity
          onPress={() => {
            hapticLight();
            onCreatePost();
          }}
          className="bg-[#FF8A00] px-6 py-3 rounded-xl"
        >
          <Text className="text-black font-bold text-sm">Create Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
