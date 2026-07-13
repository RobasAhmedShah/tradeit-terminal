import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_NEWS } from '../../data/mockNews';
import { getPostAuthorKey } from '../../utils/postPrefs';
import { usePosts } from '../../context/PostsContext';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { hapticSelection } from '../../utils/haptics';

const SUGGESTED = MOCK_NEWS.filter(
  (post, index, arr) => arr.findIndex((p) => p.author.name === post.author.name) === index
).slice(0, 5);

export function FollowingEmptyState() {
  const { isFollowing, toggleFollow } = usePosts();
  const { colors } = useTheme();

  return (
    <View className="px-4 py-6">
      <View className="items-center mb-5">
        <Ionicons name="people-outline" size={40} color={colors.mutedDarker} />
        <Text className="text-app-text text-base font-bold mt-3">No posts from people you follow</Text>
        <Text className="text-app-muted text-sm text-center mt-2 px-4">
          Follow traders to see their posts here. Your own posts always appear in Following.
        </Text>
      </View>

      <Text className="text-app-muted text-[10px] font-semibold uppercase tracking-wider mb-3">
        Suggested traders
      </Text>
      {SUGGESTED.map((post) => {
        const key = getPostAuthorKey(post);
        const following = isFollowing(key);
        return (
          <View
            key={key}
            className="flex-row items-center bg-app-card border border-app-border rounded-xl px-3 py-3 mb-2"
          >
            <View
              className="w-9 h-9 rounded-full items-center justify-center mr-3 border border-app-border"
              style={{ backgroundColor: post.author.color ?? colors.primaryTint }}
            >
              <Text style={{ color: COLORS.primary }} className="text-[11px] font-bold">
                {post.author.initials}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-app-text text-sm font-semibold">{post.author.name}</Text>
              <Text className="text-app-muted text-[11px]">{post.category}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                hapticSelection();
                toggleFollow(key);
              }}
              className="px-3 py-1.5 rounded-full border"
              style={{
                borderColor: following ? colors.border : COLORS.primary,
                backgroundColor: following ? 'transparent' : `${COLORS.primary}18`,
              }}
            >
              <Text
                className="text-[12px] font-bold"
                style={{ color: following ? colors.mutedDark : COLORS.primary }}
              >
                {following ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}
