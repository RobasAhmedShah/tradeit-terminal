import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import {
  getStockLogoColor,
  getStockLogoInitials,
  getStockLogoUris,
} from '../../utils/stockLogos';

interface StockLogoProps {
  symbol: string;
  name?: string;
  size?: number;
  logoUrl?: string;
  logoColor?: string;
  website?: string;
}

export const StockLogo: React.FC<StockLogoProps> = ({
  symbol,
  size = 36,
  logoUrl,
  logoColor,
  website,
}) => {
  const uris = useMemo(
    () => getStockLogoUris(symbol, website, logoUrl),
    [symbol, website, logoUrl],
  );
  const [uriIndex, setUriIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setUriIndex(0);
    setImgFailed(false);
  }, [symbol, website, logoUrl]);

  const bg = getStockLogoColor(symbol, logoColor);
  const initials = getStockLogoInitials(symbol);
  const uri = uris[uriIndex];
  const isSvg = !!uri && uri.toLowerCase().includes('.svg');
  const showImage = !!uri && !imgFailed;
  const fontSize = size <= 28 ? 10 : size <= 36 ? 12 : 14;
  const radius = size / 2;

  const handleImageError = () => {
    if (uriIndex < uris.length - 1) {
      setUriIndex((prev) => prev + 1);
      return;
    }
    setImgFailed(true);
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: showImage ? '#FFFFFF' : bg,
        },
      ]}
    >
      {showImage ? (
        isSvg ? (
          <SvgUri
            key={`${symbol}-${uri}`}
            uri={uri}
            width={size * 0.72}
            height={size * 0.72}
            onError={handleImageError}
          />
        ) : (
          <Image
            key={`${symbol}-${uri}`}
            source={{ uri }}
            style={{ width: size * 0.72, height: size * 0.72 }}
            resizeMode="contain"
            onError={handleImageError}
          />
        )
      ) : (
        <Text style={{ color: '#FFFFFF', fontSize, fontWeight: '800', letterSpacing: 0.3 }}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
});
