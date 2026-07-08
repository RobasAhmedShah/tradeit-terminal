import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsCategory, NewsPost, Sentiment } from '../data/mockNews';

export interface StoredUserPost {
  id: string;
  userId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  category: NewsCategory;
  sentiment?: Sentiment;
  createdAt: string;
  viewCount?: number;
  imageUri?: string;
  repostOfId?: string;
  repostOfAuthor?: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
}

export interface PostsStorage {
  posts: StoredUserPost[];
  likedIds: string[];
  comments: PostComment[];
  extraViewCounts: Record<string, number>;
  followedAuthorKeys?: string[];
}

const STORAGE_KEY = '@tradeit/community_posts_v2';

const EMPTY: PostsStorage = { posts: [], likedIds: [], comments: [], extraViewCounts: {}, followedAuthorKeys: [] };

/** Default follows so Following tab has content on first launch. */
export const DEFAULT_FOLLOWED_AUTHOR_KEYS = [
  'author:psx-analyst',
  'author:trading-guru-pk',
  'author:futures-trader',
];

export function slugifyAuthorName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function getPostAuthorKey(post: NewsPost): string {
  if (post.userId) return `user:${post.userId}`;
  return `author:${slugifyAuthorName(post.author.name)}`;
}

export async function loadPostsStorage(): Promise<PostsStorage> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = await AsyncStorage.getItem('@tradeit/community_posts_v1');
      if (legacy) {
        const parsed = JSON.parse(legacy) as { posts?: StoredUserPost[]; likedIds?: string[] };
        return {
          posts: Array.isArray(parsed.posts) ? parsed.posts : [],
          likedIds: Array.isArray(parsed.likedIds) ? parsed.likedIds : [],
          comments: [],
          extraViewCounts: {},
          followedAuthorKeys: DEFAULT_FOLLOWED_AUTHOR_KEYS,
        };
      }
      return EMPTY;
    }
    const parsed = JSON.parse(raw) as PostsStorage;
    return {
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      likedIds: Array.isArray(parsed.likedIds) ? parsed.likedIds : [],
      comments: Array.isArray(parsed.comments) ? parsed.comments : [],
      extraViewCounts: parsed.extraViewCounts ?? {},
      followedAuthorKeys: Array.isArray(parsed.followedAuthorKeys)
        ? parsed.followedAuthorKeys
        : DEFAULT_FOLLOWED_AUTHOR_KEYS,
    };
  } catch {
    return EMPTY;
  }
}

export async function savePostsStorage(data: PostsStorage): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Non-blocking
  }
}

export function createPostId(): string {
  return `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createCommentId(): string {
  return `cm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'GT';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatPostTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
}

export function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function parseViewString(views: string): number {
  const v = views.trim().toUpperCase();
  if (v.endsWith('M')) return Math.round(parseFloat(v) * 1_000_000) || 0;
  if (v.endsWith('K')) return Math.round(parseFloat(v) * 1_000) || 0;
  return parseInt(v.replace(/,/g, ''), 10) || 0;
}

export function mergeViewCount(baseViews: string, extra: number): string {
  if (extra <= 0) return baseViews;
  return formatViewCount(parseViewString(baseViews) + extra);
}

const TICKER_RE = /\$([A-Z]{2,10})\b/g;

export function extractTickers(content: string): string[] {
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  const re = new RegExp(TICKER_RE.source, 'g');
  while ((match = re.exec(content.toUpperCase())) !== null) {
    found.add(`$${match[1]}`);
  }
  return [...found];
}

export function storedPostToNewsPost(stored: StoredUserPost): NewsPost {
  const views = formatViewCount(stored.viewCount ?? 1);
  return {
    id: stored.id,
    author: {
      name: stored.authorName,
      initials: stored.authorInitials,
      verified: false,
      color: '#1A0E00',
    },
    time: formatPostTime(stored.createdAt),
    sentiment: stored.sentiment,
    tickers: extractTickers(stored.content),
    content: stored.content,
    category: stored.category,
    imageUri: stored.imageUri,
    engagement: {
      comments: 0,
      reposts: 0,
      likes: 0,
      views,
    },
    isUserPost: true,
    userId: stored.userId,
    createdAt: stored.createdAt,
    repostOf:
      stored.repostOfId && stored.repostOfAuthor
        ? { id: stored.repostOfId, authorName: stored.repostOfAuthor }
        : undefined,
  };
}
