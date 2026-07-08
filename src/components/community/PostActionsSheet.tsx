import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

interface PostActionsSheetProps {
  visible: boolean;
  isOwnPost: boolean;
  isFollowing?: boolean;
  authorName?: string;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFollow?: () => void;
  onReport?: () => void;
}

export const PostActionsSheet: React.FC<PostActionsSheetProps> = ({
  visible,
  isOwnPost,
  isFollowing = false,
  authorName,
  onClose,
  onEdit,
  onDelete,
  onToggleFollow,
  onReport,
}) => {
  const insets = useSafeAreaInsets();

  const actions = isOwnPost
    ? [
        { key: 'edit', label: 'Edit post', icon: 'create-outline' as const, color: COLORS.text, onPress: onEdit },
        { key: 'delete', label: 'Delete post', icon: 'trash-outline' as const, color: COLORS.sell, onPress: onDelete },
      ]
    : [
        {
          key: 'follow',
          label: isFollowing ? `Unfollow ${authorName ?? 'author'}` : `Follow ${authorName ?? 'author'}`,
          icon: isFollowing ? ('person-remove-outline' as const) : ('person-add-outline' as const),
          color: isFollowing ? COLORS.mutedDark : COLORS.primary,
          onPress: onToggleFollow,
        },
        { key: 'report', label: 'Report post', icon: 'flag-outline' as const, color: COLORS.mutedDark, onPress: onReport },
      ];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="rounded-t-3xl border-t border-[#25272D] px-4 pt-3"
          style={{ backgroundColor: COLORS.sheet, paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="items-center mb-3">
            <View className="w-10 h-1 rounded-full bg-[#3A3D44]" />
          </View>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.key}
              onPress={() => {
                onClose();
                action.onPress?.();
              }}
              className="flex-row items-center py-3.5 border-b border-[#25272D]"
            >
              <Ionicons name={action.icon} size={20} color={action.color} />
              <Text className="text-[15px] font-medium ml-3 flex-1" style={{ color: action.color }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} className="py-3.5 items-center mt-1">
            <Text className="text-[#8A8D93] text-[15px] font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
