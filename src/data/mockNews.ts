export type NewsCategory = 'Markets' | 'PSX' | 'Trading' | 'Economy' | 'Crypto';
export type Sentiment   = 'Bullish' | 'Bearish' | 'Neutral';

export interface NewsPost {
  id: string;
  author: {
    name:      string;
    initials:  string;
    verified?: boolean;
    color?:    string;
  };
  time:      string;
  sentiment?: Sentiment;
  tickers:   string[];      // e.g. ['$FANM', '$LEUL']
  content:   string;
  category:  NewsCategory;
  engagement: {
    comments: number;
    reposts:  number;
    likes:    number;
    views:    string;       // pre-formatted e.g. '218.1K'
  };
  featured?: boolean;
  /** User-generated community post */
  isUserPost?: boolean;
  userId?: string;
  createdAt?: string;
  repostOf?: { id: string; authorName: string };
}

export const MOCK_NEWS: NewsPost[] = [
  {
    id: '1',
    author: { name: 'PSX Analyst',  initials: 'PA', verified: true,  color: '#1A0E00' },
    time: '31m ago',
    sentiment: 'Bullish',
    tickers: ['$FANM'],
    content:
      "KSE-100 showing STRONG bullish momentum after SBP rate cut 🚀 $FANM is breaking every resistance level right now. Volume is absolutely massive — both retail and institutional are loading up. Targeting 18-22% upside this week. Don't sleep on this one!",
    category: 'PSX',
    engagement: { comments: 21, reposts: 5, likes: 128, views: '218.1K' },
    featured: true,
  },
  {
    id: '2',
    author: { name: 'Market Watch PK', initials: 'MW', verified: true, color: '#0A0A2E' },
    time: '1h ago',
    sentiment: 'Bearish',
    tickers: ['$IDSM'],
    content:
      "$IDSM down 10% today and I see more pain ahead. Management hasn't addressed the Q2 earnings miss and foreign funds are exiting. I'm staying flat until we see a proper base form around the 200 EMA.",
    category: 'Markets',
    engagement: { comments: 44, reposts: 12, likes: 73, views: '98.3K' },
  },
  {
    id: '3',
    author: { name: 'Trading Guru PK', initials: 'TG', verified: false, color: '#160A2E' },
    time: '2h ago',
    sentiment: 'Bullish',
    tickers: ['$LEUL', '$FFLM'],
    content:
      "Two setups I'm watching closely today 👀 $LEUL bouncing perfectly off the demand zone with high volume confirmation. $FFLM forming a bullish flag — entry on breakout above Rs 85. Risk-reward on both is excellent. Do your own DD!",
    category: 'Trading',
    engagement: { comments: 67, reposts: 31, likes: 204, views: '312.7K' },
  },
  {
    id: '4',
    author: { name: 'Crypto Bull 🐂', initials: 'CB', verified: false, color: '#1A1500' },
    time: '3h ago',
    sentiment: 'Bullish',
    tickers: ['$BTC'],
    content:
      "Bitcoin crosses $72,000 as ETF inflows hit a record $1.2B in a single day 🔥 Altcoin season incoming? On-chain data shows long-term holders are NOT selling. This is accumulation, not distribution. Next target: $80K.",
    category: 'Crypto',
    engagement: { comments: 112, reposts: 58, likes: 441, views: '1.2M' },
  },
  {
    id: '5',
    author: { name: 'KSE Pro', initials: 'KP', verified: true, color: '#001A0A' },
    time: '3h ago',
    sentiment: 'Neutral',
    tickers: ['$SAZEW'],
    content:
      "$SAZEW new oil discovery announcement — huge catalyst potential but I want to wait for volume confirmation before entering. The last three 'discovery' announcements led to pump-and-dump action. Watching carefully at current levels.",
    category: 'PSX',
    engagement: { comments: 33, reposts: 8, likes: 91, views: '74.5K' },
  },
  {
    id: '6',
    author: { name: 'Economy Watch', initials: 'EW', verified: true, color: '#001A1A' },
    time: '4h ago',
    sentiment: 'Bullish',
    tickers: ['$AABS'],
    content:
      "SBP cuts policy rate by 100bps to 19.5% — 4th consecutive cut! 🎉 This is MASSIVE for the economy. Lower borrowing costs = better corporate earnings = higher valuations. $AABS and banking sector set to benefit big. Pakistan on path to recovery.",
    category: 'Economy',
    engagement: { comments: 89, reposts: 47, likes: 356, views: '502.8K' },
  },
  {
    id: '7',
    author: { name: 'Futures Trader',  initials: 'FT', verified: false, color: '#111214' },
    time: '5h ago',
    sentiment: 'Bearish',
    tickers: ['$PQGTL'],
    content:
      "Short on $PQGTL — technicals are screaming reversal. RSI divergence on daily, MACD cross on 4H, and declining volumes on up-moves. Stop above Rs 42. Target Rs 31. This is a high-probability setup, not financial advice.",
    category: 'Trading',
    engagement: { comments: 29, reposts: 14, likes: 62, views: '48.9K' },
  },
  {
    id: '8',
    author: { name: 'PSX Insights', initials: 'PI', verified: true, color: '#1A0B00' },
    time: '6h ago',
    sentiment: 'Bullish',
    tickers: ['$FATM', '$SNGP'],
    content:
      "Pakistan's infrastructure bill of PKR 200bn just passed! 🏗️ Direct beneficiaries: $FATM (cement) and $SNGP (gas distribution). Both have strong fundamentals and are trading at attractive valuations. Medium-term play — think 3-6 months.",
    category: 'Markets',
    engagement: { comments: 55, reposts: 22, likes: 178, views: '234.1K' },
  },
  {
    id: '9',
    author: { name: 'Ak Hub 8585 🇵🇰', initials: 'AH', verified: false, color: '#1A0000' },
    time: '8h ago',
    sentiment: 'Bullish',
    tickers: ['$ZUMA'],
    content:
      "THIS IS BIG 🚨 $ZUMA has been quietly accumulating over the last 2 weeks. Smart money is definitely involved. Chart pattern looks like a classic cup-and-handle. Once it breaks Rs 55 resistance with volume, sky is the limit. Got a sizeable position.",
    category: 'PSX',
    engagement: { comments: 70, reposts: 5, likes: 128, views: '218.1K' },
  },
];

export const NEWS_CATEGORIES: NewsCategory[] = ['Markets', 'PSX', 'Trading', 'Economy', 'Crypto'];

export const COMMUNITY_FEED_TABS = ['Discover', 'Following', ...NEWS_CATEGORIES] as const;
export type CommunityFeedTab = (typeof COMMUNITY_FEED_TABS)[number];
