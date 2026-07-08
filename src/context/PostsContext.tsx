import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MOCK_NEWS, CommunityFeedTab, NewsCategory, NewsPost, Sentiment } from '../data/mockNews';
import { useAuth } from './AuthContext';
import { filterNews } from '../utils/marketsHub';
import { CommentsSheet } from '../components/community/CommentsSheet';
import { PostActionsSheet } from '../components/community/PostActionsSheet';
import { useAppAlert } from './AppAlertContext';
import { useNotifications } from './NotificationsContext';
import { useRouter } from 'expo-router';
import {
  createCommentId,
  createPostId,
  formatViewCount,
  initialsFromName,
  getPostAuthorKey,
  loadPostsStorage,
  mergeViewCount,
  PostComment,
  savePostsStorage,
  storedPostToNewsPost,
  StoredUserPost,
} from '../utils/postPrefs';
import { hapticLight, hapticMedium, hapticSelection, hapticSuccess } from '../utils/haptics';

export type FeedCategory = CommunityFeedTab;

interface CreatePostInput {
  content: string;
  category: NewsCategory;
  sentiment?: Sentiment;
  imageUri?: string;
  repostOfId?: string;
  repostOfAuthor?: string;
}

interface UpdatePostInput {
  content: string;
  category: NewsCategory;
  sentiment?: Sentiment;
  imageUri?: string | null;
}

interface PostsContextType {
  ready: boolean;
  likedIds: Set<string>;
  getFeed: (opts?: {
    category?: FeedCategory;
    query?: string;
    excludeIds?: Set<string>;
    featuredOnly?: boolean;
  }) => NewsPost[];
  getPostById: (id: string) => NewsPost | undefined;
  addPost: (input: CreatePostInput) => NewsPost;
  updatePost: (postId: string, input: UpdatePostInput) => boolean;
  deletePost: (postId: string) => boolean;
  isOwnPost: (post: NewsPost) => boolean;
  refreshPosts: () => Promise<void>;
  repostPost: (postId: string) => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  getLikeCount: (post: NewsPost) => number;
  getComments: (postId: string) => PostComment[];
  addComment: (postId: string, content: string) => void;
  recordView: (postId: string) => void;
  openComments: (postId: string) => void;
  openPostActions: (postId: string) => void;
  followedAuthorKeys: Set<string>;
  isFollowing: (authorKey: string) => boolean;
  toggleFollow: (authorKey: string) => void;
  getAuthorKey: (post: NewsPost) => string;
}

const PostsContext = createContext<PostsContextType>({
  ready: false,
  likedIds: new Set(),
  getFeed: () => [],
  getPostById: () => undefined,
  addPost: () => MOCK_NEWS[0],
  updatePost: () => false,
  deletePost: () => false,
  isOwnPost: () => false,
  refreshPosts: async () => {},
  repostPost: () => {},
  toggleLike: () => {},
  isLiked: () => false,
  getLikeCount: (p) => p.engagement.likes,
  getComments: () => [],
  addComment: () => {},
  recordView: () => {},
  openComments: () => {},
  openPostActions: () => {},
  followedAuthorKeys: new Set(),
  isFollowing: () => false,
  toggleFollow: () => {},
  getAuthorKey: () => '',
});

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const { showAlert } = useAppAlert();
  const { pushNotification } = useNotifications();
  const router = useRouter();
  const [storedPosts, setStoredPosts] = useState<StoredUserPost[]>([]);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [extraViewCounts, setExtraViewCounts] = useState<Record<string, number>>({});
  const [followedAuthorKeys, setFollowedAuthorKeys] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [actionsPostId, setActionsPostId] = useState<string | null>(null);

  useEffect(() => {
    loadPostsStorage().then((data) => {
      setStoredPosts(data.posts);
      setComments(data.comments);
      setLikedIds(new Set(data.likedIds));
      setExtraViewCounts(data.extraViewCounts);
      setFollowedAuthorKeys(new Set(data.followedAuthorKeys ?? []));
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    savePostsStorage({
      posts: storedPosts,
      likedIds: [...likedIds],
      comments,
      extraViewCounts,
      followedAuthorKeys: [...followedAuthorKeys],
    });
  }, [storedPosts, likedIds, comments, extraViewCounts, followedAuthorKeys, ready]);

  const getCommentCount = useCallback(
    (postId: string) => comments.filter((c) => c.postId === postId).length,
    [comments]
  );

  const getRepostCount = useCallback(
    (postId: string) => storedPosts.filter((p) => p.repostOfId === postId).length,
    [storedPosts]
  );

  const enrichPost = useCallback(
    (post: NewsPost): NewsPost => {
      const commentCount = getCommentCount(post.id);
      const repostCount = getRepostCount(post.id);
      const extraViews = extraViewCounts[post.id] ?? 0;
      const baseLikes = post.engagement.likes;

      return {
        ...post,
        engagement: {
          ...post.engagement,
          comments: commentCount > 0 ? commentCount : post.engagement.comments,
          reposts: repostCount > 0 ? repostCount : post.engagement.reposts,
          likes: baseLikes,
          views: mergeViewCount(post.engagement.views, extraViews),
        },
      };
    },
    [getCommentCount, getRepostCount, extraViewCounts]
  );

  const userNewsPosts = useMemo(
    () =>
      [...storedPosts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((p) => storedPostToNewsPost(p)),
    [storedPosts]
  );

  const allPosts = useMemo(() => {
    const mockFeatured = MOCK_NEWS.filter((p) => p.featured && !p.isUserPost);
    const mockRest = MOCK_NEWS.filter((p) => !p.featured);
    return [...userNewsPosts, ...mockFeatured, ...mockRest].map(enrichPost);
  }, [userNewsPosts, enrichPost]);

  const getPostById = useCallback(
    (id: string) => allPosts.find((p) => p.id === id),
    [allPosts]
  );

  const currentUserId = session?.userId ?? 'guest';

  const getFeed = useCallback(
    (opts?: {
      category?: FeedCategory;
      query?: string;
      excludeIds?: Set<string>;
      featuredOnly?: boolean;
    }) => {
      let posts = allPosts.filter((p) => !opts?.excludeIds?.has(p.id));

      if (opts?.featuredOnly) {
        return posts.filter((p) => p.featured);
      }

      if (opts?.category === 'Following') {
        posts = posts.filter(
          (p) =>
            followedAuthorKeys.has(getPostAuthorKey(p)) ||
            (p.isUserPost && p.userId === currentUserId)
        );
      } else if (opts?.category && opts.category !== 'Discover') {
        posts = posts.filter((p) => p.category === opts.category);
      }

      if (opts?.query) {
        posts = filterNews(posts, opts.query);
      }

      return posts;
    },
    [allPosts, followedAuthorKeys, currentUserId]
  );

  const isOwnPost = useCallback(
    (post: NewsPost) => post.isUserPost === true && post.userId === currentUserId,
    [currentUserId]
  );

  const getAuthorKey = useCallback((post: NewsPost) => getPostAuthorKey(post), []);

  const isFollowing = useCallback(
    (authorKey: string) => followedAuthorKeys.has(authorKey),
    [followedAuthorKeys]
  );

  const toggleFollow = useCallback((authorKey: string) => {
    hapticLight();
    setFollowedAuthorKeys((prev) => {
      const next = new Set(prev);
      if (next.has(authorKey)) next.delete(authorKey);
      else next.add(authorKey);
      return next;
    });
  }, []);

  const refreshPosts = useCallback(async () => {
    const data = await loadPostsStorage();
    setStoredPosts(data.posts);
    setComments(data.comments);
    setLikedIds(new Set(data.likedIds));
    setExtraViewCounts(data.extraViewCounts);
    setFollowedAuthorKeys(new Set(data.followedAuthorKeys ?? []));
  }, []);

  const addPost = useCallback(
    (input: CreatePostInput) => {
      const trimmed = input.content.trim();
      const name = session?.displayName ?? 'Guest Trader';
      const stored: StoredUserPost = {
        id: createPostId(),
        userId: currentUserId,
        authorName: name,
        authorInitials: initialsFromName(name),
        content: trimmed,
        category: input.category,
        sentiment: input.sentiment,
        createdAt: new Date().toISOString(),
        viewCount: 1,
        imageUri: input.imageUri,
        repostOfId: input.repostOfId,
        repostOfAuthor: input.repostOfAuthor,
      };
      setStoredPosts((prev) => [stored, ...prev]);

      // Demo engagement pings so Community inbox has sample activity
      if (!input.repostOfId) {
        const postId = stored.id;
        const snippet = trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed;
        setTimeout(() => {
          pushNotification({
            type: 'community',
            title: 'New like on your post',
            body: `PSX Trader liked “${snippet}”`,
            newsId: postId,
          });
        }, 4500);
        setTimeout(() => {
          pushNotification({
            type: 'community',
            title: 'New comment on your post',
            body: `Market Watch PK: “Solid take on this trade 👀”`,
            newsId: postId,
          });
        }, 9000);
      }

      return enrichPost(storedPostToNewsPost(stored));
    },
    [session, enrichPost, currentUserId, pushNotification]
  );

  const updatePost = useCallback(
    (postId: string, input: UpdatePostInput) => {
      const trimmed = input.content.trim();
      if (trimmed.length < 10) return false;
      const target = storedPosts.find((p) => p.id === postId);
      if (!target || target.userId !== currentUserId) return false;

      setStoredPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                content: trimmed,
                category: input.category,
                sentiment: input.sentiment,
                imageUri:
                  input.imageUri === null
                    ? undefined
                    : input.imageUri !== undefined
                      ? input.imageUri
                      : p.imageUri,
              }
            : p
        )
      );
      return true;
    },
    [storedPosts, currentUserId]
  );

  const deletePost = useCallback(
    (postId: string) => {
      const target = storedPosts.find((p) => p.id === postId);
      if (!target || target.userId !== currentUserId) return false;

      setStoredPosts((prev) => prev.filter((p) => p.id !== postId));
      setComments((prev) => prev.filter((c) => c.postId !== postId));
      setLikedIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      setExtraViewCounts((prev) => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      return true;
    },
    [storedPosts, currentUserId]
  );

  const repostPost = useCallback(
    (postId: string) => {
      const original = allPosts.find((p) => p.id === postId);
      if (!original) return;

      hapticLight();
      addPost({
        content: original.content,
        category: original.category,
        sentiment: original.sentiment,
        repostOfId: original.id,
        repostOfAuthor: original.author.name,
      });
      showAlert('Reposted', 'Post shared to your Community feed.', undefined, { tone: 'success' });
      hapticSuccess();
    },
    [allPosts, addPost, showAlert]
  );

  const toggleLike = useCallback((id: string) => {
    hapticSelection();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => likedIds.has(id), [likedIds]);

  const getLikeCount = useCallback(
    (post: NewsPost) => post.engagement.likes + (likedIds.has(post.id) ? 1 : 0),
    [likedIds]
  );

  const getComments = useCallback(
    (postId: string) =>
      [...comments.filter((c) => c.postId === postId)].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [comments]
  );

  const addComment = useCallback(
    (postId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      const name = session?.displayName ?? 'Guest Trader';
      const comment: PostComment = {
        id: createCommentId(),
        postId,
        userId: session?.userId ?? 'guest',
        authorName: name,
        authorInitials: initialsFromName(name),
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, comment]);
      hapticLight();
    },
    [session]
  );

  const recordView = useCallback((postId: string) => {
    const userPost = storedPosts.find((p) => p.id === postId);
    if (userPost) {
      setStoredPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, viewCount: (p.viewCount ?? 1) + 1 } : p))
      );
      return;
    }
    setExtraViewCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + 1,
    }));
  }, [storedPosts]);

  const openComments = useCallback((postId: string) => {
    setCommentsPostId(postId);
  }, []);

  const openPostActions = useCallback((postId: string) => {
    setActionsPostId(postId);
  }, []);

  const actionsPost = actionsPostId ? allPosts.find((p) => p.id === actionsPostId) : undefined;
  const actionsIsOwn = actionsPost ? isOwnPost(actionsPost) : false;

  const handleEditPost = useCallback(() => {
    if (!actionsPostId) return;
    router.push({ pathname: '/community/compose', params: { editId: actionsPostId } });
  }, [actionsPostId, router]);

  const handleDeletePost = useCallback(() => {
    if (!actionsPostId) return;
    showAlert(
      'Delete post?',
      'This will permanently remove your post and its comments.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const ok = deletePost(actionsPostId);
            if (ok) {
              hapticMedium();
              showAlert('Deleted', 'Your post was removed.', undefined, { tone: 'success' });
            }
          },
        },
      ],
      { tone: 'warning' }
    );
  }, [actionsPostId, deletePost, showAlert]);

  const handleReportPost = useCallback(() => {
    hapticLight();
    showAlert('Reported', 'Thanks — we will review this post.', undefined, { tone: 'info' });
  }, [showAlert]);

  const handleToggleFollowPost = useCallback(() => {
    if (!actionsPost || actionsIsOwn) return;
    const key = getPostAuthorKey(actionsPost);
    const wasFollowing = followedAuthorKeys.has(key);
    toggleFollow(key);
    showAlert(
      wasFollowing ? 'Unfollowed' : 'Following',
      wasFollowing
        ? `You will no longer see posts from ${actionsPost.author.name} in Following.`
        : `Posts from ${actionsPost.author.name} will appear in your Following feed.`,
      undefined,
      { tone: 'success' }
    );
  }, [actionsPost, actionsIsOwn, followedAuthorKeys, toggleFollow, showAlert]);

  const actionsAuthorKey = actionsPost ? getPostAuthorKey(actionsPost) : '';
  const actionsIsFollowing = actionsAuthorKey ? followedAuthorKeys.has(actionsAuthorKey) : false;

  return (
    <PostsContext.Provider
      value={{
        ready,
        likedIds,
        getFeed,
        getPostById,
        addPost,
        updatePost,
        deletePost,
        isOwnPost,
        refreshPosts,
        repostPost,
        toggleLike,
        isLiked,
        getLikeCount,
        getComments,
        addComment,
        recordView,
        openComments,
        openPostActions,
        followedAuthorKeys,
        isFollowing,
        toggleFollow,
        getAuthorKey,
      }}
    >
      {children}
      <CommentsSheet
        postId={commentsPostId}
        visible={!!commentsPostId}
        onClose={() => setCommentsPostId(null)}
      />
      <PostActionsSheet
        visible={!!actionsPostId}
        isOwnPost={actionsIsOwn}
        isFollowing={actionsIsFollowing}
        authorName={actionsPost?.author.name}
        onClose={() => setActionsPostId(null)}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        onToggleFollow={handleToggleFollowPost}
        onReport={handleReportPost}
      />
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
