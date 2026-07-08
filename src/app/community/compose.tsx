import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NEWS_CATEGORIES, NewsCategory, Sentiment } from '../../data/mockNews';
import { usePosts } from '../../context/PostsContext';
import { useAuth } from '../../context/AuthContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { COLORS } from '../../constants/theme';
import { extractTickers, initialsFromName } from '../../utils/postPrefs';
import { hapticLight, hapticSuccess, hapticSelection } from '../../utils/haptics';

const MAX_CHARS = 500;
const SENTIMENTS: Sentiment[] = ['Bullish', 'Bearish', 'Neutral'];

export default function ComposePostScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { session } = useAuth();
  const { addPost, updatePost, getPostById, isOwnPost, ready } = usePosts();
  const { showAlert } = useAppAlert();

  const isEdit = !!editId;
  const existing = editId && ready ? getPostById(editId) : undefined;
  const canEdit = existing && isOwnPost(existing);

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('PSX');
  const [sentiment, setSentiment] = useState<Sentiment | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isEdit || !ready) return;
    if (!existing || !canEdit) {
      showAlert('Cannot edit', 'This post cannot be edited.', [{ text: 'OK', onPress: () => router.back() }], {
        tone: 'warning',
      });
      return;
    }
    if (!hydrated) {
      setContent(existing.content);
      setCategory(existing.category);
      setSentiment(existing.sentiment);
      setHydrated(true);
    }
  }, [isEdit, ready, existing, canEdit, hydrated, showAlert, router]);

  const displayName = session?.displayName ?? 'Guest Trader';
  const initials = initialsFromName(displayName);
  const tickers = extractTickers(content);
  const isValid = content.trim().length >= 10;

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (trimmed.length < 10) {
      showAlert('Too short', 'Write at least 10 characters for your post.', undefined, { tone: 'warning' });
      return;
    }
    hapticLight();

    if (isEdit && editId) {
      const ok = updatePost(editId, { content: trimmed, category, sentiment });
      if (!ok) {
        showAlert('Update failed', 'Could not save your changes.', undefined, { tone: 'error' });
        return;
      }
      hapticSuccess();
      router.back();
      return;
    }

    const post = addPost({ content: trimmed, category, sentiment });
    hapticSuccess();
    router.replace({ pathname: '/news/[id]', params: { id: post.id } });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050505]" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#2A2B2F]">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="close" size={24} color="#8A8D93" />
          </TouchableOpacity>
          <Text className="text-white text-[17px] font-bold">{isEdit ? 'Edit Post' : 'New Post'}</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={!isValid} className="min-w-[52px] items-end">
            <Text
              className="text-[15px] font-bold"
              style={{ color: isValid ? COLORS.primary : COLORS.mutedDarker }}
            >
              {isEdit ? 'Save' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View className="flex-row items-start pt-5 pb-4">
            <View
              className="w-11 h-11 rounded-full items-center justify-center mr-3 border border-[#2A2B2F]"
              style={{ backgroundColor: COLORS.primaryTint }}
            >
              <Text style={{ color: COLORS.primary }} className="text-sm font-bold">
                {initials}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-[15px]">{displayName}</Text>
              <Text className="text-[#5C6068] text-[12px] mt-0.5">
                {isEdit ? 'Editing' : 'Posting to Community'} · {category}
              </Text>
            </View>
          </View>

          <TextInput
            value={content}
            onChangeText={(t) => setContent(t.slice(0, MAX_CHARS))}
            placeholder="What's on your mind? Use $SYMBOL for tickers e.g. $FANM"
            placeholderTextColor={COLORS.mutedDarker}
            multiline
            textAlignVertical="top"
            autoFocus={!isEdit}
            className="text-white text-[16px] leading-7 min-h-[160px] py-0"
          />

          <Text className="text-[#5C6068] text-[12px] text-right mt-2 mb-4">
            {content.length}/{MAX_CHARS}
          </Text>

          {tickers.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-5">
              {tickers.map((t) => (
                <View key={t} className="bg-[#FF8A00]/10 border border-[#FF8A00]/30 rounded-lg px-2.5 py-1">
                  <Text className="text-[#FF8A00] text-[11px] font-bold">{t}</Text>
                </View>
              ))}
            </View>
          )}

          <Text className="text-[#5C6068] text-[10px] font-semibold uppercase tracking-wider mb-2">
            Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
            {NEWS_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    hapticSelection();
                    setCategory(cat);
                  }}
                  className={`mr-2 px-3.5 py-2 rounded-full border ${
                    active ? 'border-[#FF8A00] bg-[#FF8A00]/10' : 'border-[#2A2B2F] bg-[#111214]'
                  }`}
                >
                  <Text className={`text-[12px] font-semibold ${active ? 'text-[#FF8A00]' : 'text-[#8A8D93]'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text className="text-[#5C6068] text-[10px] font-semibold uppercase tracking-wider mb-2">
            Sentiment (optional)
          </Text>
          <View className="flex-row gap-2 mb-4">
            {SENTIMENTS.map((s) => {
              const active = sentiment === s;
              const color = s === 'Bullish' ? COLORS.buy : s === 'Bearish' ? COLORS.sell : COLORS.muted;
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => {
                    hapticSelection();
                    setSentiment(active ? undefined : s);
                  }}
                  className="flex-1 py-3 rounded-xl border items-center"
                  style={{
                    borderColor: active ? color : COLORS.border,
                    backgroundColor: active ? `${color}18` : COLORS.card,
                  }}
                >
                  <Text className="text-[12px] font-semibold" style={{ color: active ? color : COLORS.mutedDark }}>
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="bg-[#111214] border border-[#2A2B2F] rounded-xl p-3">
            <Text className="text-[#5C6068] text-[11px] leading-5">
              Posts are public on Community. This is not financial advice — trade at your own risk.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
