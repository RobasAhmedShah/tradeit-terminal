import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface SparklinePlaceholderProps {
  isPositive: boolean;
  width?: number;
  height?: number;
  data?: number[];
}

const POSITIVE_POINTS = [0.55, 0.45, 0.60, 0.40, 0.65, 0.55, 0.70, 0.60, 0.80, 0.72, 0.90];
const NEGATIVE_POINTS = [0.80, 0.72, 0.78, 0.60, 0.65, 0.50, 0.55, 0.38, 0.42, 0.30, 0.22];

export const SparklinePlaceholder: React.FC<SparklinePlaceholderProps> = ({
  isPositive,
  width = 60,
  height = 30,
  data,
}) => {
  const rawPoints = data ?? (isPositive ? POSITIVE_POINTS : NEGATIVE_POINTS);
  const color = isPositive ? '#0ECB81' : '#F6465D';

  const min = Math.min(...rawPoints);
  const max = Math.max(...rawPoints);
  const range = max - min || 1;
  const padding = height * 0.1;

  const points = rawPoints
    .map((v, i) => {
      const x = (i / (rawPoints.length - 1)) * width;
      const y = height - padding - ((v - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};
