import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { NewsPost, Sentiment } from '../../data/mockNews';
import { MOCK_MARKET_STOCKS } from '../../data/mockStocks';

/* ─── helpers ─────────────────────────────────────────────── */
const SENTIMENT: Record<Sentiment, { color: string; bg: string; icon: any; label: string }> = {
  Bullish: { color: '#0ECB81', bg: '#001f0e', icon: 'trending-up',   label: 'Bullish' },
  Bearish: { color: '#F6465D', bg: '#200006', icon: 'trending-down', label: 'Bearish' },
  Neutral: { color: '#9CA3AF', bg: '#1a1a1a', icon: 'remove',        label: 'Neutral' },
};

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` :
  n >= 1_000     ? `${(n / 1_000).toFixed(1)}K`     : String(n);

const TRUNCATE = 160;

/* ─── component ───────────────────────────────────────────── */
interface Props {
  post:        NewsPost;
  featured?:   boolean;
  saved?:      boolean;
  liked?:      boolean;
  likeCount?:  number;
  isOwnPost?:  boolean;
  onDismiss?:  () => void;
  onMore?:     () => void;
  onSave?:     () => void;
  onLike?:     () => void;
  onComment?:  () => void;
  onRepost?:   () => void;
  onOpen?:     () => void;
}

export const NewsCard: React.FC<Props> = ({
  post,
  featured,
  saved,
  liked: likedProp,
  likeCount,
  isOwnPost,
  onDismiss,
  onMore,
  onSave,
  onLike,
  onComment,
  onRepost,
  onOpen,
}) => {
  const router  = useRouter();
  const [likedLocal, setLikedLocal]    = useState(false);
  const [expanded, setExpanded] = useState(false);

  const liked = likedProp ?? likedLocal;
  const displayLikes = likeCount ?? post.engagement.likes + (liked && !likedProp ? 1 : 0);

  const cfg        = post.sentiment ? SENTIMENT[post.sentiment] : null;
  const isLong     = post.content.length > TRUNCATE;
  const displayTxt = isLong && !expanded
    ? post.content.slice(0, TRUNCATE).trimEnd() + '…'
    : post.content;

  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onOpen} disabled={!onOpen}>
    <View style={{ backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#141414' }}>

      {/* orange top stripe for featured */}
      {featured && <View style={{ height: 3, backgroundColor: '#FF8A00' }} />}

      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}>

        {/* ── author row ───────────────────────────────────── */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          {/* avatar */}
          <View style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: post.author.color ?? '#1A0E00',
            borderWidth: 1, borderColor: '#2A2B2F',
            alignItems: 'center', justifyContent: 'center',
            marginRight: 10,
          }}>
            <Text style={{ color: '#FF8A00', fontSize: 13, fontWeight: 'bold' }}>
              {post.author.initials}
            </Text>
          </View>

          {/* name + time */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13, marginRight: 4 }}>
                {post.author.name}
              </Text>
              {post.author.verified && (
                <Ionicons name="checkmark-circle" size={13} color="#FF8A00" />
              )}
              {isOwnPost && (
                <View style={{
                  marginLeft: 6,
                  backgroundColor: 'rgba(255,138,0,0.12)',
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  borderRadius: 4,
                }}>
                  <Text style={{ color: '#FF8A00', fontSize: 9, fontWeight: '700' }}>YOU</Text>
                </View>
              )}
            </View>
            <Text style={{ color: '#555', fontSize: 11, marginTop: 1 }}>{post.time}</Text>
          </View>

          {/* sentiment badge */}
          {cfg && (
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: cfg.bg,
              paddingHorizontal: 8, paddingVertical: 4,
              borderRadius: 6, marginLeft: 8,
            }}>
              <Ionicons name={cfg.icon} size={11} color={cfg.color} />
              <Text style={{ color: cfg.color, fontSize: 11, fontWeight: '600', marginLeft: 3 }}>
                {cfg.label}
              </Text>
            </View>
          )}

          {/* more menu (own posts) or dismiss */}
          {onMore ? (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                onMore();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginLeft: 10, padding: 2 }}
            >
              <Ionicons name="ellipsis-horizontal" size={18} color="#8A8D93" />
            </TouchableOpacity>
          ) : onDismiss ? (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                onDismiss();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ marginLeft: 10, padding: 2 }}
            >
              <Ionicons name="close" size={18} color="#444" />
            </TouchableOpacity>
          ) : null}
        </View>

        {post.repostOf && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="repeat" size={12} color="#8A8D93" />
            <Text style={{ color: '#8A8D93', fontSize: 11, marginLeft: 4 }}>
              Reposted from {post.repostOf.authorName}
            </Text>
          </View>
        )}

        {/* ── ticker tags ──────────────────────────────────── */}
        {post.tickers.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
            {post.tickers.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => router.push(`/stock/${t.replace('$', '')}`)}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: '#FF8A00', fontWeight: '700', fontSize: 13 }}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── post content ─────────────────────────────────── */}
        <Text style={{ color: '#D0D0D0', fontSize: 13, lineHeight: 20, marginBottom: 10 }}>
          {displayTxt}
          {isLong && !expanded && (
            <Text onPress={() => setExpanded(true)} style={{ color: '#FF8A00', fontWeight: '600' }}>
              {' '}Show more
            </Text>
          )}
        </Text>

        {/* ── stock price chips ────────────────────────────── */}
        {post.tickers.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
            {post.tickers.map(t => {
              const sym   = t.replace('$', '');
              const stock = MOCK_MARKET_STOCKS.find(s => s.symbol === sym);
              if (!stock) return null;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => router.push(`/stock/${sym}`)}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#111214',
                    borderWidth: 1, borderColor: '#2A2B2F',
                    borderRadius: 8,
                    paddingHorizontal: 10, paddingVertical: 5,
                    marginRight: 8, marginBottom: 4,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12, marginRight: 5 }}>
                    {sym}
                  </Text>
                  <Ionicons
                    name={stock.isPositive ? 'caret-up' : 'caret-down'}
                    size={10}
                    color={stock.isPositive ? '#0ECB81' : '#F6465D'}
                  />
                  <Text style={{
                    color: stock.isPositive ? '#0ECB81' : '#F6465D',
                    fontSize: 11, fontWeight: '600', marginLeft: 2,
                  }}>
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* ── engagement row ───────────────────────────────────── */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 10,
        borderTopWidth: 1, borderTopColor: '#111',
      }}>
        {/* comments */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onComment?.();
          }}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 22 }}
        >
          <Ionicons name="chatbubble-outline" size={15} color="#555" />
          <Text style={{ color: '#555', fontSize: 12, marginLeft: 5 }}>{fmt(post.engagement.comments)}</Text>
        </TouchableOpacity>

        {/* reposts */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onRepost?.();
          }}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 22 }}
        >
          <Ionicons name="repeat-outline" size={15} color="#555" />
          <Text style={{ color: '#555', fontSize: 12, marginLeft: 5 }}>{fmt(post.engagement.reposts)}</Text>
        </TouchableOpacity>

        {/* likes — toggleable */}
        <TouchableOpacity
          onPress={() => (onLike ? onLike() : setLikedLocal((l) => !l))}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 22 }}
        >
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={15} color={liked ? '#F6465D' : '#555'} />
          <Text style={{ color: liked ? '#F6465D' : '#555', fontSize: 12, marginLeft: 5 }}>
            {fmt(displayLikes)}
          </Text>
        </TouchableOpacity>

        {/* views */}
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons name="eye-outline" size={15} color="#555" />
          <Text style={{ color: '#555', fontSize: 12, marginLeft: 5 }}>{post.engagement.views}</Text>
        </View>

        {/* share + save */}
        {onSave && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              onSave();
            }}
            style={{ marginRight: 14 }}
          >
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={15} color={saved ? '#FF8A00' : '#555'} />
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={15} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );
};
