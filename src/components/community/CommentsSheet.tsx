import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePosts } from '../../context/PostsContext';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { formatPostTime, PostComment } from '../../utils/postPrefs';
import { hapticLight, hapticSuccess } from '../../utils/haptics';

interface CommentsSheetProps {
  postId: string | null;
  visible: boolean;
  onClose: () => void;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({ postId, visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { getPostById, getComments, addComment } = usePosts();
  const { colors } = useTheme();
  const [draft, setDraft] = useState('');

  const post = postId ? getPostById(postId) : undefined;
  const comments = postId ? getComments(postId) : [];

  const sheetHeight = Math.round(windowHeight * 0.82);

  const handleSend = () => {
    if (!postId || !draft.trim()) return;
    hapticLight();
    addComment(postId, draft);
    setDraft('');
    hapticSuccess();
  };

  const renderComment = ({ item }: { item: PostComment }) => (
    <View className="flex-row mb-4">
      <View
        className="w-8 h-8 rounded-full items-center justify-center mr-3 border border-app-border"
        style={{ backgroundColor: colors.primaryTint }}
      >
        <Text style={{ color: COLORS.primary }} className="text-[10px] font-bold">
          {item.authorInitials}
        </Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center flex-wrap gap-2">
          <Text className="text-app-text text-[13px] font-semibold">{item.authorName}</Text>
          <Text className="text-app-muted text-[10px]">{formatPostTime(item.createdAt)}</Text>
        </View>
        <Text className="text-app-text text-[13px] leading-5 mt-1">{item.content}</Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="flex-1" onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <View
            style={{
              height: sheetHeight,
              backgroundColor: colors.sheet,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderTopWidth: 1,
              borderColor: colors.sheetBorder,
            }}
          >
            <View className="items-center pt-2.5 pb-1">
              <View className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
            </View>

            <View className="flex-row items-center justify-between px-5 py-2.5 border-b border-app-border">
              <Text className="text-app-text text-[16px] font-bold">
                Comments {comments.length > 0 ? `(${comments.length})` : ''}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {post && (
              <View className="px-5 py-2 border-b border-app-border">
                <Text className="text-app-muted text-[11px]" numberOfLines={1}>
                  Re: <Text className="text-app-text font-medium">{post.author.name}</Text>
                  {' · '}
                  {post.content.length > 60 ? `${post.content.slice(0, 60)}…` : post.content}
                </Text>
              </View>
            )}

            <View style={{ flex: 1, minHeight: 0 }}>
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={renderComment}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                  flexGrow: comments.length === 0 ? 1 : undefined,
                }}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center py-12">
                    <Ionicons name="chatbubble-outline" size={36} color="#3A3D44" />
                    <Text className="text-app-muted text-sm mt-3">No comments yet</Text>
                    <Text className="text-app-muted text-xs mt-1">Be the first to reply</Text>
                  </View>
                }
              />
            </View>

            <View
              className="flex-row items-end px-4 pt-2 border-t border-app-border gap-2"
              style={{ paddingBottom: Math.max(insets.bottom, 12) }}
            >
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Add a comment..."
                placeholderTextColor={colors.mutedDarker}
                multiline
                className="flex-1 bg-app-input border border-app-border rounded-xl px-3 py-2.5 text-app-text text-[14px] max-h-24"
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!draft.trim()}
                className="w-10 h-10 rounded-full items-center justify-center mb-0.5"
                style={{ backgroundColor: draft.trim() ? COLORS.primary : colors.input }}
              >
                <Ionicons name="send" size={18} color={draft.trim() ? COLORS.black : colors.mutedDarker} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
