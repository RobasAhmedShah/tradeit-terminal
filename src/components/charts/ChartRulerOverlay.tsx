import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import {
  ChartRulerBounds,
  ChartRulerPoint,
  priceFromChartY,
  rulerDateLabel,
  formatRulerPrice,
} from '../../utils/chartRuler';

interface ChartRulerOverlayProps {
  bounds: ChartRulerBounds;
  barStepPx?: number;
  timeframeLabel?: string;
  priceDecimals?: number;
}

const CROSSHAIR = '#2962FF';
const BADGE_BG = '#1E222D';
const BADGE_TEXT = '#FFFFFF';
const PRICE_BADGE_W = 66;
const PRICE_BADGE_H = 20;
const DATE_BADGE_H = 22;

export const ChartRulerToggle: React.FC<{
  enabled: boolean;
  onToggle: () => void;
}> = ({ enabled, onToggle }) => (
  <TouchableOpacity
    onPress={onToggle}
    accessibilityRole="button"
    accessibilityLabel="Chart crosshair"
    className={`p-1.5 rounded-md ${enabled ? 'bg-[#2962FF]/20' : ''}`}
  >
    <Ionicons name="add-outline" size={18} color={enabled ? CROSSHAIR : '#9CA3AF'} />
  </TouchableOpacity>
);

export const ChartRulerLayer: React.FC<ChartRulerOverlayProps & { enabled: boolean }> = ({
  enabled,
  bounds,
  barStepPx = 12,
  timeframeLabel = '1D',
  priceDecimals = 2,
}) => {
  const [point, setPoint] = useState<ChartRulerPoint | null>(null);

  const price = useMemo(
    () => (point ? priceFromChartY(point.y, bounds) : null),
    [point, bounds],
  );
  const dateLabel = useMemo(
    () => (point ? rulerDateLabel(point.x, bounds, barStepPx, timeframeLabel) : ''),
    [point, bounds, barStepPx, timeframeLabel],
  );

  if (!enabled) return null;

  const clamp = (x: number, y: number): ChartRulerPoint => ({
    x: Math.min(Math.max(x, bounds.paddingX), bounds.width - bounds.paddingX),
    y: Math.min(Math.max(y, bounds.paddingTop), bounds.height - bounds.paddingBottom),
  });

  const track = (x: number, y: number) => setPoint(clamp(x, y));

  const dateLabelW = Math.max(96, dateLabel.length * 7 + 20);
  const dateLeft = point
    ? Math.min(Math.max(point.x - dateLabelW / 2, 2), bounds.width - dateLabelW - 2)
    : 0;

  return (
    <>
      <View
        style={[StyleSheet.absoluteFill, { zIndex: 20 }]}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(e) => track(e.nativeEvent.locationX, e.nativeEvent.locationY)}
        onResponderMove={(e) => track(e.nativeEvent.locationX, e.nativeEvent.locationY)}
      />

      {point && (
        <>
          <Svg
            width={bounds.width}
            height={bounds.height}
            style={[StyleSheet.absoluteFill, { zIndex: 15 }]}
            pointerEvents="none"
          >
            {/* Vertical crosshair line (full plot height) */}
            <Line
              x1={point.x}
              y1={bounds.paddingTop}
              x2={point.x}
              y2={bounds.height - bounds.paddingBottom}
              stroke={CROSSHAIR}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {/* Horizontal crosshair line (full plot width) */}
            <Line
              x1={bounds.paddingX}
              y1={point.y}
              x2={bounds.width - bounds.paddingX}
              y2={point.y}
              stroke={CROSSHAIR}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {/* Intersection dot */}
            <Circle cx={point.x} cy={point.y} r={4} fill={CROSSHAIR} stroke="#FFFFFF" strokeWidth={1.5} />
          </Svg>

          {/* Price badge pinned to the right axis edge */}
          {price != null && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                right: 0,
                top: Math.min(
                  Math.max(point.y - PRICE_BADGE_H / 2, 0),
                  bounds.height - PRICE_BADGE_H,
                ),
                zIndex: 26,
                width: PRICE_BADGE_W,
                height: PRICE_BADGE_H,
                backgroundColor: BADGE_BG,
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: BADGE_TEXT, fontSize: 10, fontWeight: '700' }}>
                {formatRulerPrice(price, priceDecimals)}
              </Text>
            </View>
          )}

          {/* Date badge pinned to the bottom time axis */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: dateLeft,
              bottom: 0,
              zIndex: 26,
              width: dateLabelW,
              height: DATE_BADGE_H,
              backgroundColor: BADGE_BG,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: BADGE_TEXT, fontSize: 10, fontWeight: '700' }}>
              {dateLabel}
            </Text>
          </View>
        </>
      )}
    </>
  );
};

export function useChartRuler() {
  const [enabled, setEnabled] = useState(false);
  const toggle = () => setEnabled((v) => !v);
  return { enabled, toggle, setEnabled };
}
