import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { FuturesCandle, FuturesContract, MOCK_FUTURES_CANDLES, formatFuturesPrice } from '../../data/mockFutures';

const TIMEFRAMES = ['1m', '5m', '15m', '1H', '4H', '1D'];

const Y_AXIS_LABELS = [
  { y: 18, text: '105,200' },
  { y: 38, text: '105,000' },
  { y: 68, text: '104,800' },
  { y: 98, text: '104,600' },
  { y: 128, text: '104,400' },
  { y: 158, text: '104,200' },
];

interface FuturesChartPanelProps {
  contract: FuturesContract;
  candles?: FuturesCandle[];
}

export const FuturesChartPanel: React.FC<FuturesChartPanelProps> = ({
  contract,
  candles = MOCK_FUTURES_CANDLES,
}) => {
  const [timeframe, setTimeframe] = useState('15m');

  return (
    <View className="mx-4 bg-[#111214] border border-[#2A2B2F] rounded-xl p-2 mb-3">
      <View className="flex-row items-center mb-2 px-1">
        <Text className="text-white text-xs font-semibold mr-2">{timeframe}</Text>
        <Ionicons name="bar-chart-outline" size={12} color="#9CA3AF" style={{ marginRight: 6 }} />
        <Text className="text-[#9CA3AF] text-[11px] mr-2">Indicators</Text>
        <Ionicons name="expand-outline" size={12} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
      </View>

      <View className="flex-row items-center mb-1 px-1">
        <Text className="text-[#9CA3AF] text-[10px]">
          {contract.symbol} · {timeframe} · {contract.exchange}
        </Text>
        <View className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] ml-1" />
      </View>

      <View className="flex-row items-center mb-2 px-1">
        <Text className="text-white text-xs font-semibold mr-1">
          {formatFuturesPrice(contract.markPrice)}
        </Text>
        <Text className={`text-[10px] ${contract.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
          {contract.isPositive ? '+' : ''}
          {formatFuturesPrice(contract.changeValue)} ({contract.changePercent.toFixed(2)}%)
        </Text>
      </View>

      <View className="w-full h-[180px]">
        <Svg width="100%" height="100%" viewBox="0 0 280 180" preserveAspectRatio="none">
          {Y_AXIS_LABELS.map((label) => (
            <React.Fragment key={label.y}>
              <Line
                x1="0"
                y1={label.y}
                x2="232"
                y2={label.y}
                stroke="#2A2B2F"
                strokeWidth="0.5"
              />
              <SvgText x="238" y={label.y + 3} fill="#9CA3AF" fontSize="8">
                {label.text}
              </SvgText>
            </React.Fragment>
          ))}

          <Line x1="0" y1="50" x2="232" y2="50" stroke="#FF8A00" strokeWidth="0.5" strokeDasharray="2,2" />
          <Line x1="232" y1="0" x2="232" y2="168" stroke="#2A2B2F" strokeWidth="0.5" />
          <Rect x="232" y="44" width="46" height="13" fill="#FF8A00" rx="2" />
          <SvgText x="235" y="53" fill="white" fontSize="8" fontWeight="bold">
            {formatFuturesPrice(contract.markPrice)}
          </SvgText>

          <SvgText x="8" y="176" fill="#9CA3AF" fontSize="8">18:00</SvgText>
          <SvgText x="72" y="176" fill="#9CA3AF" fontSize="8">06:00</SvgText>
          <SvgText x="136" y="176" fill="#9CA3AF" fontSize="8">12:00</SvgText>
          <SvgText x="200" y="176" fill="#9CA3AF" fontSize="8">18:00</SvgText>

          {candles.map((candle, index) => (
            <React.Fragment key={index}>
              <Line
                x1={candle.x + 4}
                y1={candle.high}
                x2={candle.x + 4}
                y2={candle.low}
                stroke={candle.isUp ? '#0ECB81' : '#F6465D'}
                strokeWidth="1"
              />
              <Rect
                x={candle.x}
                y={Math.min(candle.open, candle.close)}
                width="8"
                height={Math.max(Math.abs(candle.open - candle.close), 1)}
                fill={candle.isUp ? '#0ECB81' : '#F6465D'}
              />
              <Rect
                x={candle.x + 1}
                y={150 - candle.volume * 0.4}
                width="6"
                height={candle.volume * 0.4}
                fill={candle.isUp ? '#0ECB81' : '#F6465D'}
                opacity="0.45"
              />
            </React.Fragment>
          ))}
        </Svg>
      </View>

      <ScrollableTimeframes active={timeframe} onChange={setTimeframe} />
    </View>
  );
};

function ScrollableTimeframes({
  active,
  onChange,
}: {
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="flex-row items-center mt-2 px-1">
      {TIMEFRAMES.map((tf) => (
        <TouchableOpacity key={tf} onPress={() => onChange(tf)} className="mr-3">
          <Text className={`text-xs font-semibold ${active === tf ? 'text-[#FF8A00]' : 'text-[#9CA3AF]'}`}>
            {tf}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
