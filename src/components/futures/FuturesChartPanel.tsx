import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { FuturesCandle, FuturesContract, MOCK_FUTURES_CANDLES, formatFuturesPrice } from '../../data/mockFutures';
import { ChartRulerLayer, ChartRulerToggle, useChartRuler } from '../charts/ChartRulerOverlay';

const CHART_WIDTH = 280;
const CHART_HEIGHT = 180;
const CHART_PADDING_TOP = 18;
const CHART_PADDING_BOTTOM = 22;
const CHART_PADDING_X = 8;
const CHART_MIN_PRICE = 104200;
const CHART_MAX_PRICE = 105200;

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
  onRulerActiveChange?: (active: boolean) => void;
}

export const FuturesChartPanel: React.FC<FuturesChartPanelProps> = ({
  contract,
  candles = MOCK_FUTURES_CANDLES,
  onRulerActiveChange,
}) => {
  const [timeframe, setTimeframe] = useState('15m');
  const { enabled: rulerEnabled, toggle: toggleRuler } = useChartRuler();
  const [chartLayout, setChartLayout] = useState({ width: CHART_WIDTH, height: CHART_HEIGHT });

  useEffect(() => {
    onRulerActiveChange?.(rulerEnabled);
    return () => onRulerActiveChange?.(false);
  }, [rulerEnabled, onRulerActiveChange]);

  const rulerBounds = {
    width: chartLayout.width,
    height: chartLayout.height,
    paddingTop: CHART_PADDING_TOP,
    paddingBottom: CHART_PADDING_BOTTOM,
    paddingX: CHART_PADDING_X,
    minPrice: CHART_MIN_PRICE,
    maxPrice: CHART_MAX_PRICE,
  };
  const scaledBarStep = Math.max(8, Math.round(13 * (chartLayout.width / CHART_WIDTH)));

  return (
    <View className="mx-4 bg-app-card border border-app-border rounded-xl p-2 mb-3">
      <View className="flex-row items-center mb-2 px-1">
        <Text className="text-app-text text-xs font-semibold mr-2">{timeframe}</Text>
        <Text className="text-app-muted text-[11px] mr-2">Indicators</Text>
        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
          <ChartRulerToggle enabled={rulerEnabled} onToggle={toggleRuler} />
          {rulerEnabled ? (
            <Text className="text-app-muted text-[10px] ml-1">Touch chart</Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center mb-1 px-1">
        <Text className="text-app-muted text-[10px]">
          {contract.symbol} · {timeframe} · {contract.exchange}
        </Text>
        <View className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] ml-1" />
      </View>

      <View className="flex-row items-center mb-2 px-1">
        <Text className="text-app-text text-xs font-semibold mr-1">
          {formatFuturesPrice(contract.markPrice)}
        </Text>
        <Text className={`text-[10px] ${contract.isPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
          {contract.isPositive ? '+' : ''}
          {formatFuturesPrice(contract.changeValue)} ({contract.changePercent.toFixed(2)}%)
        </Text>
      </View>

      <View className="w-full h-[180px] relative">
        <Svg width="100%" height="100%" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
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
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setChartLayout({ width, height });
          }}
        >
          <ChartRulerLayer
            enabled={rulerEnabled}
            bounds={rulerBounds}
            barStepPx={scaledBarStep}
            timeframeLabel={timeframe}
            priceDecimals={0}
          />
        </View>
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
          <Text className={`text-xs font-semibold ${active === tf ? 'text-[#FF8A00]' : 'text-app-muted'}`}>
            {tf}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
