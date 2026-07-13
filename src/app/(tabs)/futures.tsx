import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/ui/AppHeader';
import { FuturesContractHeader } from '../../components/futures/FuturesContractHeader';
import { FuturesTabBar } from '../../components/futures/FuturesTabBar';
import { FuturesChartPanel } from '../../components/futures/FuturesChartPanel';
import { FuturesOrderBook } from '../../components/futures/FuturesOrderBook';
import { FuturesOrderPanel } from '../../components/futures/FuturesOrderPanel';
import { FuturesTradesPanel } from '../../components/futures/FuturesTradesPanel';
import { FuturesContractInfo } from '../../components/futures/FuturesContractInfo';
import { FuturesPortfolioSection } from '../../components/futures/FuturesPortfolioSection';
import { FuturesLeverageModal } from '../../components/futures/FuturesLeverageModal';
import { FuturesContractSelectorModal } from '../../components/futures/FuturesContractSelectorModal';
import { useFutures } from '../../context/FuturesContext';
import { useFuturesCloseSheet } from '../../context/FuturesCloseSheetContext';
import { useAppAlert } from '../../context/AppAlertContext';
import {
  DEFAULT_FUTURES_CONTRACT,
  FuturesContract,
  FuturesMarginMode,
  FuturesTab,
  MOCK_FUTURES_ASKS,
  MOCK_FUTURES_BIDS,
  MOCK_FUTURES_TRADES,
  getScaledOrderBook,
} from '../../data/mockFutures';
import {
  loadFuturesTradingPrefs,
  saveFuturesTradingPrefs,
} from '../../utils/futuresTradingPrefs';

export default function FuturesScreen() {
  const { contract: contractParam } = useLocalSearchParams<{ contract?: string }>();
  const { openCloseSheet } = useFuturesCloseSheet();
  const {
    contracts,
    marginAvailable,
    marginUsed,
    isMarketLive,
    positions,
    openOrders,
    orderHistory,
    getContractBySymbol,
    cancelOpenOrder,
  } = useFutures();
  const { showAlert } = useAppAlert();

  const [activeTab, setActiveTab] = useState<FuturesTab>('chart');
  const [selectedSymbol, setSelectedSymbol] = useState(DEFAULT_FUTURES_CONTRACT.symbol);
  const [leverage, setLeverage] = useState(10);
  const [marginMode, setMarginMode] = useState<FuturesMarginMode>('Cross');
  const [leverageModalVisible, setLeverageModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [bookPriceFill, setBookPriceFill] = useState<number | null>(null);
  const [selectedBookPrice, setSelectedBookPrice] = useState<number | null>(null);
  const [prefsReady, setPrefsReady] = useState(false);

  const contract: FuturesContract =
    getContractBySymbol(selectedSymbol) ?? contracts[0] ?? DEFAULT_FUTURES_CONTRACT;

  useEffect(() => {
    loadFuturesTradingPrefs().then((prefs) => {
      setSelectedSymbol(prefs.contractSymbol);
      setLeverage(prefs.leverage);
      setMarginMode(prefs.marginMode);
      setPrefsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!contractParam) return;
    setSelectedSymbol(contractParam);
    setActiveTab('chart');
  }, [contractParam]);

  useEffect(() => {
    if (!prefsReady) return;
    saveFuturesTradingPrefs({
      leverage,
      marginMode,
      contractSymbol: selectedSymbol,
    });
  }, [leverage, marginMode, selectedSymbol, prefsReady]);

  const { asks, bids } = useMemo(
    () =>
      getScaledOrderBook(
        MOCK_FUTURES_ASKS,
        MOCK_FUTURES_BIDS,
        DEFAULT_FUTURES_CONTRACT.markPrice,
        contract.markPrice
      ),
    [contract.markPrice]
  );

  const handleBookPricePress = useCallback((price: number) => {
    setSelectedBookPrice(price);
    setBookPriceFill(price);
    setActiveTab('chart');
  }, []);

  const handleBookPriceFillConsumed = useCallback(() => {
    setBookPriceFill(null);
  }, []);

  const handleContractSelect = useCallback((next: FuturesContract) => {
    setSelectedSymbol(next.symbol);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chart':
        return (
          <>
            <FuturesChartPanel contract={contract} />
            <View className="flex-row mx-4 gap-2 mb-3 items-stretch">
              <View className="flex-1">
                <FuturesOrderBook
                  contract={contract}
                  asks={asks}
                  bids={bids}
                  compact
                  maxRows={8}
                  selectedPrice={selectedBookPrice}
                  onPricePress={handleBookPricePress}
                />
              </View>
              <FuturesOrderPanel
                contract={contract}
                leverage={leverage}
                marginMode={marginMode}
                availableMargin={marginAvailable}
                usedMargin={marginUsed}
                onMarginModeChange={setMarginMode}
                onLeveragePress={() => setLeverageModalVisible(true)}
                bookPriceFill={bookPriceFill}
                onBookPriceFillConsumed={handleBookPriceFillConsumed}
              />
            </View>
          </>
        );
      case 'orderbook':
        return (
          <FuturesOrderBook
            contract={contract}
            asks={asks}
            bids={bids}
            selectedPrice={selectedBookPrice}
            onPricePress={handleBookPricePress}
          />
        );
      case 'trades':
        return <FuturesTradesPanel contract={contract} trades={MOCK_FUTURES_TRADES} />;
      case 'info':
        return <FuturesContractInfo contract={contract} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-app-bg" edges={['top']}>
      <AppHeader title="Futures" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 88 }}
      >
        <FuturesContractHeader
          contract={contract}
          isLive={isMarketLive}
          onContractPress={() => setContractModalVisible(true)}
        />

        <FuturesTabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {renderTabContent()}

        <FuturesPortfolioSection
          positions={positions}
          openOrders={openOrders}
          orderHistory={orderHistory}
          marginAvailable={marginAvailable}
          onClosePosition={(position) => openCloseSheet(position)}
          onCancelOrder={(order) =>
            showAlert(
              'Cancel Order',
              `Cancel ${order.side} ${order.quantity} lots on ${order.symbol}?`,
              [
                { text: 'Keep', style: 'cancel' },
                { text: 'Cancel Order', style: 'destructive', onPress: () => cancelOpenOrder(order) },
              ],
              { tone: 'warning' }
            )
          }
        />
      </ScrollView>

      <FuturesLeverageModal
        visible={leverageModalVisible}
        leverage={leverage}
        contractName={contract.name}
        onChange={setLeverage}
        onClose={() => setLeverageModalVisible(false)}
      />

      <FuturesContractSelectorModal
        visible={contractModalVisible}
        contracts={contracts}
        selectedSymbol={selectedSymbol}
        onSelect={handleContractSelect}
        onClose={() => setContractModalVisible(false)}
      />
    </SafeAreaView>
  );
}
