import { Ionicons } from '@expo/vector-icons';
import { CommunityFeedTab } from '../data/mockNews';

type IconName = keyof typeof Ionicons.glyphMap;

export interface CommunityEmptyConfig {
  icon: IconName;
  title: string;
  message: string;
  showCreateAction?: boolean;
}

const CATEGORY_EMPTY: Record<CommunityFeedTab, CommunityEmptyConfig> = {
  Discover: {
    icon: 'compass-outline',
    title: 'Community is quiet',
    message: 'Share a trade idea, chart take, or market view. Use $SYMBOL for tickers.',
    showCreateAction: true,
  },
  Following: {
    icon: 'people-outline',
    title: 'Nothing from people you follow',
    message: 'Follow traders from Discover or tap Follow on any post to build your feed.',
    showCreateAction: false,
  },
  Markets: {
    icon: 'bar-chart-outline',
    title: 'No Markets posts',
    message: 'Post index moves, sector rotation, or broad market commentary here.',
    showCreateAction: true,
  },
  PSX: {
    icon: 'trending-up-outline',
    title: 'No PSX posts yet',
    message: 'Share KSE-100 setups, dividend plays, or stock picks — tag symbols like $FANM.',
    showCreateAction: true,
  },
  Trading: {
    icon: 'flash-outline',
    title: 'No Trading posts',
    message: 'Post entries, stop-loss levels, and technical setups for the community.',
    showCreateAction: true,
  },
  Economy: {
    icon: 'globe-outline',
    title: 'No Economy posts',
    message: 'Share SBP rate views, inflation takes, and macro news that moves PSX.',
    showCreateAction: true,
  },
  Crypto: {
    icon: 'logo-bitcoin',
    title: 'No Crypto posts',
    message: 'Bitcoin, altcoins, and on-chain takes — crypto discussion lives here.',
    showCreateAction: true,
  },
};

export function getCommunityEmptyState(
  category: CommunityFeedTab,
  opts?: { hasQuery?: boolean }
): CommunityEmptyConfig {
  if (opts?.hasQuery) {
    return {
      icon: 'search-outline',
      title: 'No matching posts',
      message: 'Try another keyword or switch to Discover to see more posts.',
      showCreateAction: false,
    };
  }
  return CATEGORY_EMPTY[category];
}
