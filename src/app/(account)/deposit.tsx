import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { useTransferSheet } from '../../context/TransferSheetContext';
import { useNotifications } from '../../context/NotificationsContext';
import { DepositHelpSheet } from '../../components/funds/DepositHelpSheet';
import { NumericKeypad } from '../../components/ui/NumericKeypad';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { safeBack } from '../../utils/navigation';
import { loadLastDeposit, saveLastDeposit, LastDepositPrefs } from '../../utils/depositPrefs';

const PRIMARY = '#FF8A00';

const DEPOSIT_MOCK = {
  amount: 50000,
  processingTime: '10 - 30 Minutes',
  instantTime: 'Instant - 5 Minutes',
  fee: 'PKR 0.00',
  tradeitBank: 'Meezan Bank',
  tradeitTitle: 'TradeIt Technologies (Pvt.) Ltd.',
  tradeitAccount: '0123 4567 8901',
  tradeitIBAN: 'PK18MEZN0001234567890101',
  reference: 'Deposit - 874512',
  raastId: 't tradeit@psx',
  transactionId: 'DP874512',
};

type MethodId = 'bankTransfer' | 'easypaisa' | 'jazzcash' | 'raast';

const METHODS: {
  id: MethodId;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  sub: string;
  eta: string;
  feeLabel: string;
  instant?: boolean;
}[] = [
  {
    id: 'bankTransfer',
    icon: 'business-outline',
    color: PRIMARY,
    title: 'Bank Transfer',
    sub: 'Transfer from your linked bank account',
    eta: '10-30 min',
    feeLabel: 'Free',
  },
  {
    id: 'easypaisa',
    icon: 'phone-portrait-outline',
    color: '#22c55e',
    title: 'EasyPaisa',
    sub: 'Pay from your EasyPaisa wallet',
    eta: 'Instant',
    feeLabel: 'Free',
    instant: true,
  },
  {
    id: 'jazzcash',
    icon: 'phone-portrait-outline',
    color: '#ef4444',
    title: 'JazzCash',
    sub: 'Pay from your JazzCash wallet',
    eta: 'Instant',
    feeLabel: 'Free',
    instant: true,
  },
  {
    id: 'raast',
    icon: 'swap-horizontal-outline',
    color: '#818cf8',
    title: 'Raast',
    sub: 'Instant bank transfer via Raast ID',
    eta: 'Instant',
    feeLabel: 'Free',
    instant: true,
  },
];

const BANKS = [
  { id: 'meezan', name: 'Meezan Bank', number: '**** **** **** 1234', holder: 'Muhammad Ali', abbr: 'M', bgColor: '#0a4a2a', textColor: '#22c55e', small: false },
  { id: 'hbl', name: 'HBL', number: '**** **** **** 5678', holder: 'Muhammad Ali', abbr: 'HBL', bgColor: '#1a0a3a', textColor: '#a78bfa', small: true },
  { id: 'abl', name: 'ABL', number: '**** **** **** 9101', holder: 'Muhammad Ali', abbr: 'ABL', bgColor: '#1a2a0a', textColor: '#4ade80', small: true },
];

const PROGRESS_BANK = ['Method', 'Bank', 'Amount', 'Review'];
const PROGRESS_INSTANT = ['Method', 'Amount', 'Review'];
const MAX_AMOUNT_DIGITS = 10;

type Step = 1 | 2 | 3 | 4 | 5 | 6;

function methodMeta(id: string) {
  return METHODS.find((m) => m.id === id) ?? METHODS[0];
}

function CopyableRow({
  label,
  value,
  highlight,
  onCopy,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  onCopy: (text: string, label: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.muted, fontSize: 11 }}>{label}</Text>
        <Text
          style={{
            color: highlight ? PRIMARY : colors.text,
            fontSize: 12,
            fontWeight: '500',
            marginTop: 2,
          }}
        >
          {value}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onCopy(value, label)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: colors.cardSoft,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Ionicons name="copy-outline" size={14} color={colors.muted} />
      </TouchableOpacity>
    </View>
  );
}

function DepositSuccessHero({ credited }: { credited: boolean }) {
  const { colors } = useTheme();
  const ringScale = useSharedValue(0.5);
  const ringOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(16);

  const accent = credited ? '#22c55e' : PRIMARY;

  useEffect(() => {
    ringOpacity.value = withTiming(1, { duration: 250 });
    ringScale.value = withSequence(
      withSpring(1.12, { damping: 10, stiffness: 180 }),
      withSpring(1, { damping: 14 }),
    );
    iconScale.value = withDelay(120, withSpring(1, { damping: 12, stiffness: 200 }));
    contentOpacity.value = withDelay(280, withTiming(1, { duration: 350 }));
    contentTranslateY.value = withDelay(280, withSpring(0, { damping: 16 }));
  }, [ringScale, ringOpacity, iconScale, contentOpacity, contentTranslateY]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 20 }}>
      <Animated.View
        style={[
          {
            width: 90,
            height: 90,
            borderRadius: 45,
            borderWidth: 3,
            borderColor: accent,
            alignItems: 'center',
            justifyContent: 'center',
          },
          ringStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: credited ? 'rgba(14,203,129,0.12)' : 'rgba(255,138,0,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            },
            iconStyle,
          ]}
        >
          <Ionicons name={credited ? 'checkmark' : 'time-outline'} size={36} color={accent} />
        </Animated.View>
      </Animated.View>
      <Animated.View style={[{ alignItems: 'center', marginTop: 16 }, contentStyle]}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' }}>
          {credited ? 'Funds added to Spot!' : 'Deposit submitted'}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 24, lineHeight: 20 }}>
          {credited
            ? 'Your buying power has been updated.\nTransfer to Futures if you plan to trade derivatives.'
            : 'We are verifying your payment.\nYou will be notified when funds are credited.'}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function DepositScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ amount?: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { openTransfer } = useTransferSheet();
  const { pushNotification } = useNotifications();
  const { addCash, summary } = usePortfolio();

  const [step, setStep] = useState<Step>(1);
  const [selectedMethod, setSelectedMethod] = useState<MethodId>('bankTransfer');
  const [selectedBank, setSelectedBank] = useState('meezan');
  const [amount, setAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [cashCredited, setCashCredited] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [helpVisible, setHelpVisible] = useState(false);
  const [lastDeposit, setLastDeposit] = useState<LastDepositPrefs | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [walletPhone, setWalletPhone] = useState('03XX XXXXXXX');

  const isBankMethod = selectedMethod === 'bankTransfer';
  const method = methodMeta(selectedMethod);
  const progressLabels = isBankMethod ? PROGRESS_BANK : PROGRESS_INSTANT;

  const parsedAmount = parseFloat(amount) || 0;
  const isAmountValid = parsedAmount >= 10;
  const formatPkrAmount = (value: number) =>
    value % 1 === 0 ? value.toLocaleString() : value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const displayAmount = parsedAmount > 0
    ? `PKR ${formatPkrAmount(parsedAmount)}`
    : `PKR ${DEPOSIT_MOCK.amount.toLocaleString()}.00`;
  const afterDeposit = summary.buyingPower + (isAmountValid ? parsedAmount : 0);
  const selectedBankData = BANKS.find((b) => b.id === selectedBank) || BANKS[0];

  const balanceLabel = `PKR ${formatPortfolioRs(summary.totalValue)}`;
  const availableLabel = `PKR ${formatPortfolioRs(summary.buyingPower)}`;
  const afterDepositLabel = `PKR ${formatPortfolioRs(afterDeposit)}`;

  const appendAmountDigit = (key: string) => {
    if (key === '.') {
      if (amount.includes('.')) return;
      setAmount((prev) => (prev === '' ? '0.' : `${prev}.`));
      return;
    }

    if (amount.includes('.')) {
      const [, decimals = ''] = amount.split('.');
      if (decimals.length >= 2) return;
    } else if (amount.length >= MAX_AMOUNT_DIGITS) {
      return;
    }

    setAmount((prev) => {
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  };

  const backspaceAmount = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const formattedAmountInput = (() => {
    if (!amount) return '0';
    if (amount.endsWith('.')) {
      const intPart = parseInt(amount.slice(0, -1) || '0', 10).toLocaleString();
      return `${intPart}.`;
    }
    const [whole, fraction] = amount.split('.');
    const intPart = parseInt(whole || '0', 10).toLocaleString();
    return fraction != null ? `${intPart}.${fraction}` : intPart;
  })();

  const progressIndex = useMemo(() => {
    if (isBankMethod) {
      if (step === 1) return 0;
      if (step === 2) return 1;
      if (step === 3) return 2;
      if (step === 4) return 3;
      return 3;
    }
    if (step === 1) return 0;
    if (step === 3) return 1;
    if (step === 4) return 2;
    return 2;
  }, [step, isBankMethod]);

  useEffect(() => {
    loadLastDeposit().then(setLastDeposit);
    const prefill = params.amount ? parseInt(String(params.amount), 10) : 0;
    if (prefill > 0) setAmount(String(prefill));
  }, [params.amount]);

  useEffect(() => {
    if (step !== 5 || !isBankMethod) return;
    setTimeLeft(30 * 60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, isBankMethod]);

  const completeVerification = useCallback(() => {
    if (parsedAmount <= 0 || cashCredited) return;
    addCash(parsedAmount);
    setCashCredited(true);
    saveLastDeposit({ method: selectedMethod, bank: selectedBank, amount: parsedAmount });
    pushNotification({
      type: 'system',
      title: 'Funds Credited',
      body: `Rs ${formatPortfolioRs(parsedAmount)} has been successfully deposited to your Spot wallet.`,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [parsedAmount, cashCredited, addCash, selectedMethod, selectedBank, pushNotification]);

  useEffect(() => {
    if (step !== 6 || cashCredited) return;
    const delay = method.instant ? 1800 : 2500;
    const timer = setTimeout(completeVerification, delay);
    return () => clearTimeout(timer);
  }, [step, cashCredited, method.instant, completeVerification]);

  const copyText = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCopyToast(`${label} copied`);
    setTimeout(() => setCopyToast(null), 1800);
  };

  const copyAllBankDetails = () => {
    const block = [
      `Amount: PKR ${formatPkrAmount(parsedAmount || DEPOSIT_MOCK.amount)}`,
      `Bank: ${DEPOSIT_MOCK.tradeitBank}`,
      `Title: ${DEPOSIT_MOCK.tradeitTitle}`,
      `Account: ${DEPOSIT_MOCK.tradeitAccount}`,
      `IBAN: ${DEPOSIT_MOCK.tradeitIBAN}`,
      `Reference: ${DEPOSIT_MOCK.reference}`,
    ].join('\n');
    copyText(block, 'Payment details');
  };

  const nextStep = () => {
    if (step === 1) setStep(isBankMethod ? 2 : 3);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) setStep(5);
    else if (step === 5) setStep(6);
  };

  const prevStep = () => {
    if (step === 1) safeBack(router, '/(tabs)/home');
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(isBankMethod ? 2 : 1);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
  };

  const applyLastDeposit = () => {
    if (!lastDeposit) return;
    setSelectedMethod(lastDeposit.method as MethodId);
    setSelectedBank(lastDeposit.bank);
    setAmount(String(lastDeposit.amount));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const pickReceipt = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri);
      setStep(6);
    }
  };

  const confirmInstantPayment = () => {
    setStep(6);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const showProgress = (isBankMethod && step >= 2 && step <= 4) || (!isBankMethod && step >= 3 && step <= 4);

  const renderProgress = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
      {progressLabels.map((label, idx) => {
        const isCompleted = idx < progressIndex;
        const isCurrent = idx === progressIndex;
        return (
          <React.Fragment key={label}>
            {idx > 0 && (
              <View style={{ flex: 1, height: 1.5, backgroundColor: idx <= progressIndex ? PRIMARY : colors.border }} />
            )}
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted ? PRIMARY : 'transparent',
                  borderWidth: isCompleted ? 0 : isCurrent ? 2 : 1.5,
                  borderColor: isCompleted ? PRIMARY : isCurrent ? PRIMARY : colors.border,
                }}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <Text style={{ color: isCurrent ? PRIMARY : colors.mutedDarker, fontSize: 11, fontWeight: '700' }}>
                    {idx + 1}
                  </Text>
                )}
              </View>
              <Text style={{ fontSize: 9, marginTop: 4, color: isCurrent ? PRIMARY : colors.muted, fontWeight: isCurrent ? '600' : '400' }}>
                {label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderNavBar = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
      {step < 6 ? (
        <TouchableOpacity onPress={prevStep} style={{ width: 36 }}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Deposit</Text>
      </View>
      {step === 1 ? (
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={{ width: 36, alignItems: 'flex-end' }}>
          <Ionicons name="help-circle-outline" size={20} color={colors.muted} />
        </TouchableOpacity>
      ) : step === 6 ? (
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={{ width: 36, alignItems: 'flex-end' }}>
          <Ionicons name="home-outline" size={20} color={colors.muted} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );

  const renderFooter = () => {
    let label = 'Continue';
    let onPress: () => void = nextStep;
    let outlined = false;
    let disabled = false;

    if (step === 3) disabled = !isAmountValid;
    else if (step === 4) {
      label = 'Confirm Deposit';
      onPress = () => {
        saveLastDeposit({ method: selectedMethod, bank: selectedBank, amount: parsedAmount });
        nextStep();
      };
    } else if (step === 5) {
      if (isBankMethod) {
        label = receiptUri ? 'Continue' : 'Upload Receipt';
        outlined = !receiptUri;
        onPress = receiptUri ? () => setStep(6) : pickReceipt;
      } else if (method.instant) {
        label = 'Confirm Payment';
        onPress = confirmInstantPayment;
      }
    }

    return (
      <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: Math.max(insets.bottom, 12), borderTopWidth: 0.5, borderTopColor: colors.border }}>
        {copyToast ? (
          <Text style={{ color: PRIMARY, fontSize: 11, textAlign: 'center', marginBottom: 8, fontWeight: '600' }}>{copyToast}</Text>
        ) : null}
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.85}
          style={{
            backgroundColor: outlined ? 'transparent' : PRIMARY,
            borderWidth: outlined ? 1.5 : 0,
            borderColor: PRIMARY,
            borderRadius: 100,
            paddingVertical: 15,
            opacity: disabled ? 0.4 : 1,
          }}
        >
          <Text style={{ color: outlined ? PRIMARY : '#000', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>{label}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep1 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: 14 }}>
        <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '500', marginBottom: 4 }}>Spot buying power</Text>
        <Text style={{ color: colors.text, fontSize: 26, fontWeight: '700', letterSpacing: -0.5 }}>{availableLabel}</Text>
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>Total portfolio · {balanceLabel}</Text>
      </View>

      {lastDeposit ? (
        <TouchableOpacity
          onPress={applyLastDeposit}
          style={{
            marginHorizontal: 14,
            marginBottom: 14,
            backgroundColor: 'rgba(255,138,0,0.1)',
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: 'rgba(255,138,0,0.35)',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="refresh" size={18} color={PRIMARY} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>Repeat last deposit</Text>
            <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
              PKR {lastDeposit.amount.toLocaleString()} · {methodMeta(lastDeposit.method).title}
            </Text>
          </View>
          <Text style={{ color: PRIMARY, fontSize: 11, fontWeight: '700' }}>Use</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginHorizontal: 14, marginBottom: 10 }}>Choose deposit method</Text>
      {METHODS.map((m) => {
        const isSelected = selectedMethod === m.id;
        return (
          <TouchableOpacity
            key={m.id}
            onPress={() => setSelectedMethod(m.id)}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              marginHorizontal: 14,
              marginBottom: 8,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: isSelected ? PRIMARY : colors.border,
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.cardSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={m.icon} size={20} color={m.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>{m.title}</Text>
                <View style={{ backgroundColor: colors.cardSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                  <Text style={{ color: colors.muted, fontSize: 9, fontWeight: '600' }}>{m.eta}</Text>
                </View>
                <View style={{ backgroundColor: 'rgba(14,203,129,0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                  <Text style={{ color: '#0ECB81', fontSize: 9, fontWeight: '600' }}>{m.feeLabel}</Text>
                </View>
              </View>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{m.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedDarker} />
          </TouchableOpacity>
        );
      })}

      <View style={{ marginHorizontal: 14, marginTop: 6, backgroundColor: colors.cardSoft, borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8 }}>
        <Ionicons name="information-circle-outline" size={14} color={colors.muted} style={{ marginTop: 1 }} />
        <Text style={{ color: colors.muted, fontSize: 11, lineHeight: 17, flex: 1 }}>
          Deposits credit your Spot wallet. Transfer to Futures after clearing to trade derivatives.
        </Text>
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {showProgress && renderProgress()}
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 14 }}>Select bank account</Text>
      {BANKS.map((bank) => {
        const isSelected = selectedBank === bank.id;
        return (
          <TouchableOpacity
            key={bank.id}
            onPress={() => setSelectedBank(bank.id)}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: isSelected ? PRIMARY : colors.border,
            }}
          >
            <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: isSelected ? 2 : 1.5, borderColor: isSelected ? PRIMARY : colors.border }}>
              {isSelected && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: PRIMARY }} />}
            </View>
            <View style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: bank.bgColor, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
              <Text style={{ color: bank.textColor, fontSize: bank.small ? 10 : 14, fontWeight: '700' }}>{bank.abbr}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>{bank.name}</Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{bank.number}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderStep3 = () => (
    <View style={{ flex: 1, paddingHorizontal: 14 }}>
      {showProgress && renderProgress()}
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 16 }}>Enter amount</Text>

      <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>Amount (PKR)</Text>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          paddingVertical: 20,
          paddingHorizontal: 14,
          borderWidth: 1.5,
          borderColor: amount ? PRIMARY : colors.border,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: '700', color: amount ? colors.text : colors.mutedDarker }}>
          {formattedAmountInput}
        </Text>
      </View>

      {isAmountValid ? (
        <View style={{ marginTop: 10, backgroundColor: 'rgba(255,138,0,0.08)', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(255,138,0,0.2)' }}>
          <Text style={{ color: colors.muted, fontSize: 11 }}>After deposit</Text>
          <Text style={{ color: PRIMARY, fontSize: 14, fontWeight: '700', marginTop: 2 }}>
            {availableLabel} → {afterDepositLabel}
          </Text>
        </View>
      ) : (
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 8 }}>Current buying power: {availableLabel}</Text>
      )}

      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 8 }}>
        <NumericKeypad onDigit={appendAmountDigit} onBackspace={backspaceAmount} />
        <View style={{ marginTop: 12, backgroundColor: colors.cardSoft, borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8 }}>
          <Ionicons name="information-circle-outline" size={14} color={colors.muted} style={{ marginTop: 1 }} />
          <Text style={{ color: colors.muted, fontSize: 11, flex: 1 }}>Minimum PKR 10 · Use keypad to enter amount</Text>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {showProgress && renderProgress()}
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 14 }}>Review deposit</Text>

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14 }}>
        <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '600', letterSpacing: 0.6, marginBottom: 8 }}>DESTINATION</Text>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>Spot Wallet</Text>

        <View style={{ height: 0.5, backgroundColor: colors.border, marginVertical: 12 }} />

        <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '600', letterSpacing: 0.6, marginBottom: 8 }}>METHOD</Text>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500' }}>{method.title}</Text>

        {isBankMethod && (
          <>
            <View style={{ height: 0.5, backgroundColor: colors.border, marginVertical: 12 }} />
            <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '600', letterSpacing: 0.6, marginBottom: 8 }}>BANK</Text>
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500' }}>{selectedBankData.name}</Text>
          </>
        )}

        {([
          { label: 'Amount', value: displayAmount, accent: false },
          { label: 'Processing', value: method.instant ? DEPOSIT_MOCK.instantTime : DEPOSIT_MOCK.processingTime, accent: false },
          { label: 'Fee', value: DEPOSIT_MOCK.fee, accent: false },
          { label: 'Total', value: displayAmount, accent: true },
        ] as const).map((row, idx, arr) => (
          <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: idx < arr.length - 1 ? 0.5 : 0, borderBottomColor: colors.border, marginTop: idx === 0 ? 12 : 0 }}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>{row.label}</Text>
            <Text style={{ color: row.accent ? PRIMARY : colors.text, fontSize: 12, fontWeight: row.accent ? '700' : '500' }}>{row.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderStep5Bank = () => {
    const timerColor = timeLeft < 60 ? '#ef4444' : '#22c55e';
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginTop: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,138,0,0.12)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="document-text-outline" size={22} color={PRIMARY} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Request created</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3 }}>Transfer then upload your receipt.</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', flex: 1 }}>Payment instructions</Text>
          <Text style={{ color: timerColor, fontSize: 14, fontWeight: '700' }}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>
            Transfer exactly <Text style={{ color: colors.text, fontWeight: '700' }}>PKR {formatPkrAmount(parsedAmount || DEPOSIT_MOCK.amount)}</Text> to:
          </Text>

          <CopyableRow label="Bank Name" value={DEPOSIT_MOCK.tradeitBank} onCopy={copyText} />
          <CopyableRow label="Account Title" value={DEPOSIT_MOCK.tradeitTitle} onCopy={copyText} />
          <CopyableRow label="Account Number" value={DEPOSIT_MOCK.tradeitAccount} onCopy={copyText} />
          <CopyableRow label="IBAN" value={DEPOSIT_MOCK.tradeitIBAN} onCopy={copyText} />
          <CopyableRow label="Reference / Note" value={DEPOSIT_MOCK.reference} highlight onCopy={copyText} />

          <TouchableOpacity
            onPress={copyAllBankDetails}
            style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,138,0,0.12)' }}
          >
            <Ionicons name="copy" size={16} color={PRIMARY} />
            <Text style={{ color: PRIMARY, fontSize: 12, fontWeight: '700' }}>Copy all details</Text>
          </TouchableOpacity>
        </View>

        {receiptUri ? (
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={{ uri: receiptUri }} style={{ width: 56, height: 56, borderRadius: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>Receipt attached</Text>
              <TouchableOpacity onPress={pickReceipt}>
                <Text style={{ color: PRIMARY, fontSize: 11, marginTop: 4 }}>Replace image</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    );
  };

  const renderStep5Instant = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginTop: 14 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Pay with {method.title}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 16 }}>
          Amount: <Text style={{ color: colors.text, fontWeight: '700' }}>{displayAmount}</Text>
        </Text>

        {selectedMethod === 'raast' ? (
          <>
            <CopyableRow label="Raast ID" value={DEPOSIT_MOCK.raastId} highlight onCopy={copyText} />
            <Text style={{ color: colors.muted, fontSize: 11, marginTop: 12, lineHeight: 17 }}>
              Send the exact amount from your bank app using the Raast ID above. Use reference: {DEPOSIT_MOCK.reference}
            </Text>
          </>
        ) : (
          <>
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>Mobile number</Text>
            <TextInput
              value={walletPhone}
              onChangeText={setWalletPhone}
              keyboardType="phone-pad"
              placeholder="03XX XXXXXXX"
              placeholderTextColor={colors.mutedDarker}
              style={{
                backgroundColor: colors.cardSoft,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: colors.text,
                fontSize: 15,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
            <Text style={{ color: colors.muted, fontSize: 11, marginTop: 12, lineHeight: 17 }}>
              You will receive a payment prompt in your {method.title} app. Confirm to complete the deposit.
            </Text>
          </>
        )}
      </View>
    </ScrollView>
  );

  const renderStep6 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      <DepositSuccessHero credited={cashCredited} />

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14 }}>
        {([
          { label: 'Amount', value: displayAmount },
          { label: 'Method', value: method.title },
          ...(isBankMethod ? [{ label: 'Bank', value: selectedBankData.name }] : []),
          { label: 'Transaction ID', value: DEPOSIT_MOCK.transactionId, accent: true },
          { label: 'Status', status: cashCredited ? 'Credited' : 'Processing' },
        ] as const).map((row, idx, arr) => (
          <View key={'label' in row ? row.label : idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: idx < arr.length - 1 ? 0.5 : 0, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>{'label' in row ? row.label : ''}</Text>
            {'status' in row ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cashCredited ? '#0ECB81' : PRIMARY }} />
                <Text style={{ color: cashCredited ? '#0ECB81' : PRIMARY, fontSize: 12, fontWeight: '600' }}>{row.status}</Text>
              </View>
            ) : (
              <Text style={{ color: 'accent' in row && row.accent ? PRIMARY : colors.text, fontSize: 12, fontWeight: '500' }}>{row.value}</Text>
            )}
          </View>
        ))}
      </View>

      {receiptUri ? (
        <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.cardSoft, borderRadius: 10, padding: 10 }}>
          <Image source={{ uri: receiptUri }} style={{ width: 40, height: 40, borderRadius: 6 }} />
          <Text style={{ color: colors.muted, fontSize: 11, flex: 1 }}>Receipt uploaded — verification in progress</Text>
        </View>
      ) : null}

      <View style={{ marginTop: 20 }}>
        {cashCredited && (
          <TouchableOpacity onPress={() => openTransfer()} style={{ backgroundColor: PRIMARY, borderRadius: 100, paddingVertical: 15, marginBottom: 10 }}>
            <Text style={{ color: '#000', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>Transfer to Futures</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/portfolio')}
          style={{
            backgroundColor: cashCredited ? 'transparent' : PRIMARY,
            borderWidth: cashCredited ? 1.5 : 0,
            borderColor: PRIMARY,
            borderRadius: 100,
            paddingVertical: 15,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: cashCredited ? PRIMARY : '#000', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>View Portfolio</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={{ paddingVertical: 14 }}>
          <Text style={{ color: colors.muted, fontSize: 14, fontWeight: '500', textAlign: 'center' }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {renderNavBar()}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1 }}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && (isBankMethod ? renderStep5Bank() : renderStep5Instant())}
          {step === 6 && renderStep6()}
        </View>
        {step < 6 && renderFooter()}
      </KeyboardAvoidingView>
      <DepositHelpSheet visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </SafeAreaView>
  );
}
