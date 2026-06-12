import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function PortfolioScreen() {
  const router = useRouter();
  const [activeRange, setActiveRange] = useState('1D');

  const ranges = ['1D', '1W', '1M', '3M', 'YTD'];

  const sparklinePath = "M0,60 C20,50 30,55 40,40 C50,25 60,35 70,20 C80,5 90,15 110,0";
  const sparklineFill = `${sparklinePath} L110,65 L0,65 Z`;

  const holdings = [
    {
      symbol: 'PIAHCLB',
      name: 'PIA Holding Co.',
      qty: '5.000000',
      val: '88,030.00',
      avg: '17,606.00',
      change: '+Rs 530.00',
      pct: '(+0.61%)',
      isUp: true,
      chartPath: "M0,20 L10,10 L20,15 L30,5 L40,0",
    },
    {
      symbol: 'SAZEW',
      name: 'Sazgar Engg.',
      qty: '8.000000',
      val: '16,943.92',
      avg: '2,118.50',
      change: '+Rs 25.92',
      pct: '(+0.15%)',
      isUp: true,
      chartPath: "M0,10 L10,20 L20,5 L30,15 L40,0",
    },
    {
      symbol: 'AGL-JUN',
      name: 'AGL Energy Ltd.',
      qty: '2.000000',
      val: '0.00',
      avg: '0.00',
      change: 'Rs 0.00',
      pct: '(0.00%)',
      isUp: null, // Flat
      chartPath: "M0,12 L40,12",
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#0d0d0d]" edges={['top']}>
      {/* NAV BAR */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity className="w-10">
          <Ionicons name="menu" size={26} color="#888" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-white text-xl font-bold">Trade<Text className="text-[#f97316]">It</Text></Text>
        </View>
        <View className="flex-row items-center w-10 justify-end">
          <View className="relative mr-3">
            <Ionicons name="notifications-outline" size={24} color="#888" />
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#f97316] rounded-full items-center justify-center border-2 border-[#0d0d0d]">
              <Text className="text-white text-[8px] font-bold">2</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/profile')}
            className="w-7 h-7 rounded-full border border-[#f97316] items-center justify-center"
          >
            <Text className="text-white font-bold text-[10px]">GT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1 - PORTFOLIO HERO CARD */}
        <View className="mx-[14px] bg-[#161616] rounded-[12px] p-[14px] mb-4 overflow-hidden relative">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Text className="text-[#555] text-xs font-semibold mr-1">Total Portfolio Value</Text>
              <Ionicons name="eye-outline" size={14} color="#555" />
            </View>
            <View className="flex-row items-center bg-[#222] px-2 py-1 rounded-full">
              <Text className="text-[#888] text-[10px] mr-1 font-semibold">All Accounts</Text>
              <Ionicons name="chevron-down" size={10} color="#888" />
            </View>
          </View>

          <Text className="text-white text-[26px] font-bold mb-3 z-10 relative">Rs 104,973.92</Text>
          
          <View className="z-10 relative">
            <Text className="text-[#22c55e] text-xs font-bold mb-1">+Rs 6,357.68 (5.71%) <Text className="text-[#888] font-normal">Today's P/L</Text></Text>
            <Text className="text-[#22c55e] text-xs font-bold mb-1"><Text className="text-[#888] font-normal">Total return  • </Text> +Rs 6,357.68 (5.71%)</Text>
            <Text className="text-[#555] text-xs">Invested: Rs 1,11,331.60</Text>
          </View>

          {/* Sparkline Chart */}
          <View className="absolute right-0 top-12 opacity-80 z-0">
            <Svg width="110" height="65" viewBox="0 0 110 65">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
                  <Stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path d={sparklineFill} fill="url(#grad)" />
              <Path d={sparklinePath} stroke="#22c55e" strokeWidth="1.5" fill="none" />
            </Svg>
          </View>

          {/* Time Periods */}
          <View className="flex-row gap-2 mt-4 z-10 relative">
            {ranges.map(range => {
              const isActive = activeRange === range;
              return (
                <TouchableOpacity 
                  key={range}
                  onPress={() => setActiveRange(range)}
                  className={`rounded-[20px] px-[10px] py-[4px] ${isActive ? 'bg-[#f97316]' : 'bg-[#222]'}`}
                >
                  <Text className={`text-[11px] font-semibold ${isActive ? 'text-white' : 'text-[#555]'}`}>
                    {range}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* SECTION 2 - QUICK ACTIONS */}
        <View className="flex-row px-[14px] mb-4 gap-2">
          <TouchableOpacity className="flex-1 bg-[#161616] rounded-[12px] p-3 flex-row items-center border border-[#1e1e1e]">
            <View className="w-8 h-8 rounded-lg items-center justify-center mr-3 bg-[#1e1e1e]">
              <Ionicons name="arrow-down-outline" size={18} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-[13px] mb-0.5">Deposit</Text>
              <Text className="text-[#555] text-[9px]">Add funds to your account</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-[#161616] rounded-[12px] p-3 flex-row items-center border border-[#1e1e1e]">
            <View className="w-8 h-8 rounded-lg items-center justify-center mr-3 bg-[#1e1e1e]">
              <Ionicons name="arrow-up-outline" size={18} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-[13px] mb-0.5">Withdraw</Text>
              <Text className="text-[#555] text-[9px]">Withdraw to your bank</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION 3 - INFO CARDS */}
        <View className="flex-row px-[14px] mb-4 gap-2">
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/wallet')}
            className="flex-1 bg-[#161616] rounded-[12px] p-3 border border-[#1e1e1e]"
          >
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-[#555] text-[10px] font-semibold">Buying Power</Text>
              <Ionicons name="chevron-forward" size={12} color="#444" />
            </View>
            <Text className="text-white font-bold text-[13px] mb-0.5">Rs 1,589,666.00</Text>
            <Text className="text-[#444] text-[9px]">Available to trade</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-[#161616] rounded-[12px] p-3 border border-[#1e1e1e]">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-[#555] text-[10px] font-semibold">Today's P/L</Text>
              <Ionicons name="chevron-forward" size={12} color="#444" />
            </View>
            <Text className="text-[#22c55e] font-bold text-[12px] mb-0.5">+Rs 6,357.68 (5.71%)</Text>
            <Text className="text-[#444] text-[9px]">Day change</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 4 - UPCOMING ACTIVITY */}
        <View className="px-[14px] mb-4">
          <View className="flex-row justify-between items-end mb-3">
            <Text className="text-white text-[14px] font-semibold">Upcoming Activity</Text>
            <TouchableOpacity onPress={() => router.push('/orders/open')}>
              <Text className="text-[#f97316] text-[12px] font-semibold">View all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-[#161616] rounded-[12px] p-3 border border-[#1e1e1e]">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-full border border-[#f97316] items-center justify-center mr-2">
                  <Ionicons name="layers-outline" size={14} color="#888" />
                </View>
                <Text className="text-[#f97316] text-[10px] font-bold">Pending Order</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={10} color="#888" style={{ marginRight: 2 }} />
                <Text className="text-[#888] text-[9px] mr-1">Apr 8, 1:29 AM</Text>
                <Ionicons name="chevron-forward" size={10} color="#888" />
              </View>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Text className="text-white text-[11px] font-semibold mr-2">Buy 10 shares of SAZEW</Text>
              <View className="bg-[#f97316]/20 px-1.5 py-0.5 rounded border border-[#f97316]/30">
                <Text className="text-[#f97316] text-[8px] font-bold uppercase">Limit</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-[#555] text-[8px] mb-1 uppercase font-semibold">Limit Price</Text>
                <Text className="text-white text-[10px] font-medium">Rs 1,500.00</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#555] text-[8px] mb-1 uppercase font-semibold">Est. Cost</Text>
                <Text className="text-white text-[10px] font-medium">Rs 15,000.00</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#555] text-[8px] mb-1 uppercase font-semibold">Expires</Text>
                <Text className="text-white text-[10px] font-medium">Day</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION 5 - HOLDINGS */}
        <View className="px-[14px] mb-4">
          <View className="flex-row justify-between items-end mb-3">
            <Text className="text-white text-[14px] font-semibold">Holdings</Text>
            <TouchableOpacity onPress={() => router.push('/orders/history')}>
              <Text className="text-[#f97316] text-[12px] font-semibold">View all</Text>
            </TouchableOpacity>
          </View>

          {/* Column Header */}
          <View className="flex-row items-center mb-2 px-1">
            <View className="flex-[1.2] ml-10">
              <Text className="text-[#444] text-[9px] font-semibold">Stock ↕</Text>
            </View>
            <View className="flex-[0.8] items-end">
              <Text className="text-[#444] text-[9px] font-semibold">Qty</Text>
            </View>
            <View className="flex-[1.2] items-end">
              <Text className="text-[#444] text-[9px] font-semibold">Current Value ↕</Text>
            </View>
            <View className="flex-[1.1] items-end">
              <Text className="text-[#444] text-[9px] font-semibold">Day Change ↕</Text>
            </View>
            <View className="w-10 items-center ml-2">
              <Text className="text-[#444] text-[9px] font-semibold">Chart</Text>
            </View>
          </View>

          {/* Holdings Rows */}
          {holdings.map((h, i) => (
            <TouchableOpacity 
              key={h.symbol}
              onPress={() => router.push(`/orders/PSX-2026-001246`)} // Mock order ID 
              className="flex-row items-center py-[10px] border-b border-[#1e1e1e]"
            >
              <View className="w-7 h-7 rounded-full bg-[#0d2010] items-center justify-center mr-2">
                <Text className="text-[#22c55e] font-bold text-[10px]">{h.symbol.charAt(0)}</Text>
              </View>
              
              <View className="flex-[1.2]">
                <Text className="text-white font-semibold text-[10px]">{h.symbol}</Text>
                <Text className="text-[#444] text-[8px]" numberOfLines={1}>{h.name}</Text>
              </View>

              <View className="flex-[0.8] items-end">
                <Text className="text-white text-[9px] font-semibold">{h.qty}</Text>
              </View>

              <View className="flex-[1.2] items-end">
                <Text className="text-white text-[9px] font-medium">Rs {h.val}</Text>
                <Text className="text-[#444] text-[8px]">@ Rs {h.avg}</Text>
              </View>

              <View className="flex-[1.1] items-end">
                <Text className={`${h.isUp ? 'text-[#22c55e]' : h.isUp === false ? 'text-[#ef4444]' : 'text-[#888]'} text-[9px] font-medium`}>{h.change}</Text>
                <Text className={`${h.isUp ? 'text-[#22c55e]' : h.isUp === false ? 'text-[#ef4444]' : 'text-[#888]'} text-[8px]`}>{h.pct}</Text>
              </View>

              <View className="w-10 ml-2 items-center justify-center">
                <Svg width="40" height="24" viewBox="0 0 40 24">
                  <Path 
                    d={h.chartPath} 
                    stroke={h.isUp ? "#22c55e" : h.isUp === false ? "#ef4444" : "#555"} 
                    strokeWidth="1.2" 
                    fill="none" 
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECTION 6 - LISTS / WATCHLISTS */}
        <View className="px-[14px] mb-4">
          <View className="flex-row justify-between items-end mb-3">
            <Text className="text-white text-[14px] font-semibold">Lists / Watchlists</Text>
            <TouchableOpacity>
              <Text className="text-[#f97316] text-[12px] font-semibold">View all</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-[#161616] rounded-[12px] p-3 flex-row items-center border border-[#1e1e1e] mb-2">
            <View className="w-7 h-7 rounded bg-[#2d1f5e] items-center justify-center mr-3">
              <Ionicons name="add" size={16} color="#8b5cf6" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-[11px] mb-0.5">Create watchlist or screener</Text>
              <Text className="text-[#555] text-[9px]">Track stocks your way</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#161616] rounded-[12px] p-3 flex-row items-center border border-[#1e1e1e]">
            <View className="w-7 h-7 rounded bg-[#0d2010] items-center justify-center mr-3">
              <Ionicons name="trending-up" size={16} color="#22c55e" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-[11px] mb-0.5">Custom (2)</Text>
              <Text className="text-[#555] text-[9px]">3 stocks</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#555" />
          </TouchableOpacity>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
