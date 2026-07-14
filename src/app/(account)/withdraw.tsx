import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
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
import { useAppAlert } from '../../context/AppAlertContext';
import { useNotifications } from '../../context/NotificationsContext';
import { WithdrawHelpSheet } from '../../components/funds/WithdrawHelpSheet';
import { NumericKeypad } from '../../components/ui/NumericKeypad';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { safeBack } from '../../utils/navigation';
import { loadLastWithdraw, saveLastWithdraw, LastWithdrawPrefs } from '../../utils/withdrawPrefs';

const PRIMARY = '#FF8A00';

const WITHDRAW_MOCK = {
  amount: 25000,
  processingTime: 'Within 24 hours',
  instantTime: 'Instant - 15 Minutes',
  fee: 'PKR 0.00',
  requestId: 'WD87451236',
  dateTime: '08 May 2024, 11:42 AM',
};

type MethodId = 'bankTransfer' | 'easypaisa' | 'jazzcash';

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
    sub: 'Withdraw to your registered bank account',
    eta: '24 hrs',
    feeLabel: 'Free',
  },
  {
    id: 'easypaisa',
    icon: 'phone-portrait-outline',
    color: '#22c55e',
    title: 'EasyPaisa',
    sub: 'Withdraw to your EasyPaisa wallet',
    eta: 'Instant',
    feeLabel: 'Free',
    instant: true,
  },
  {
    id: 'jazzcash',
    icon: 'phone-portrait-outline',
    color: '#ef4444',
    title: 'JazzCash',
    sub: 'Withdraw to your JazzCash wallet',
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

function WithdrawSuccessHero({ processed }: { processed: boolean }) {
  const { colors } = useTheme();
  const ringScale = useSharedValue(0.5);
  const ringOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(16);
  const accent = processed ? '#22c55e' : PRIMARY;

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
              backgroundColor: processed ? 'rgba(14,203,129,0.12)' : 'rgba(255,138,0,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            },
            iconStyle,
          ]}
        >
          <Ionicons name={processed ? 'checkmark' : 'time-outline'} size={36} color={accent} />
        </Animated.View>
      </Animated.View>
      <Animated.View style={[{ alignItems: 'center', marginTop: 16 }, contentStyle]}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' }}>
          {processed ? 'Withdrawal processed!' : 'Withdrawal submitted'}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 24, lineHeight: 20 }}>
          {processed
            ? 'Funds have been sent to your selected destination.'
            : 'Your request is being processed.\nYou will be notified when it completes.'}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function WithdrawScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { withdrawCash, summary } = usePortfolio();
  const { showAlert } = useAppAlert();
  const { pushNotification } = useNotifications();

  const [step, setStep] = useState<Step>(1);
  const [selectedMethod, setSelectedMethod] = useState<MethodId>('bankTransfer');
  const [selectedBank, setSelectedBank] = useState('meezan');
  const [amount, setAmount] = useState('');
  const [cashDebited, setCashDebited] = useState(false);
  const [withdrawProcessed, setWithdrawProcessed] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [lastWithdraw, setLastWithdraw] = useState<LastWithdrawPrefs | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [walletPhone, setWalletPhone] = useState('03XX XXXXXXX');
  const [otpCode, setOtpCode] = useState('');

  const isBankMethod = selectedMethod === 'bankTransfer';
  const method = methodMeta(selectedMethod);
  const progressLabels = isBankMethod ? PROGRESS_BANK : PROGRESS_INSTANT;

  const parsedAmount = parseFloat(amount) || 0;
  const isAmountValid = parsedAmount >= 10;
  const exceedsBalance = parsedAmount > summary.buyingPower;
  const formatPkrAmount = (value: number) =>
    value % 1 === 0
      ? value.toLocaleString()
      : value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const displayAmount = parsedAmount > 0
    ? `PKR ${formatPkrAmount(parsedAmount)}`
    : `PKR ${WITHDRAW_MOCK.amount.toLocaleString()}.00`;
  const afterWithdraw = Math.max(0, summary.buyingPower - (isAmountValid && !exceedsBalance ? parsedAmount : 0));
  const afterWithdrawLabel = `PKR ${formatPortfolioRs(afterWithdraw)}`;
  const balanceLabel = `PKR ${formatPortfolioRs(summary.totalValue)}`;
  const availableLabel = `PKR ${formatPortfolioRs(summary.buyingPower)}`;
  const selectedBankData = BANKS.find((b) => b.id === selectedBank) || BANKS[0];

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

  const backspaceAmount = () => setAmount((prev) => prev.slice(0, -1));

  const setMaxAmount = () => {
    const max = summary.buyingPower;
    if (max <= 0) {
      setAmount('');
      return;
    }
    setAmount(String(Math.floor(max * 100) / 100));
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
    loadLastWithdraw().then(setLastWithdraw);
  }, []);

  const completeWithdrawal = useCallback(() => {
    if (parsedAmount <= 0 || cashDebited) return;
    withdrawCash(parsedAmount);
    setCashDebited(true);
    saveLastWithdraw({ method: selectedMethod, bank: selectedBank, amount: parsedAmount });
    pushNotification({
      type: 'system',
      title: 'Withdrawal Submitted',
      body: `Rs ${formatPortfolioRs(parsedAmount)} withdrawal to ${method.title} is being processed.`,
    });
  }, [parsedAmount, cashDebited, withdrawCash, selectedMethod, selectedBank, pushNotification, method.title]);

  useEffect(() => {
    if (step !== 6 || !cashDebited || withdrawProcessed) return;
    const delay = isBankMethod ? 2500 : 1800;
    const t = setTimeout(() => {
      setWithdrawProcessed(true);
      pushNotification({
        type: 'system',
        title: 'Withdrawal Processed',
        body: `Rs ${formatPortfolioRs(parsedAmount)} has been sent to your ${method.title} destination.`,
      });
    }, delay);
    return () => clearTimeout(t);
  }, [step, cashDebited, withdrawProcessed, isBankMethod, parsedAmount, pushNotification, method.title]);

  const copyText = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCopyToast(`${label} copied`);
    setTimeout(() => setCopyToast(null), 1800);
  };

  const copyAllBankDetails = () => {
    const block = [
      `Bank: ${selectedBankData.name}`,
      `Account holder: ${selectedBankData.holder}`,
      `Account: ${selectedBankData.number}`,
      `Amount: PKR ${formatPkrAmount(parsedAmount || WITHDRAW_MOCK.amount)}`,
      `Request ID: ${WITHDRAW_MOCK.requestId}`,
    ].join('\n');
    copyText(block, 'Payout details');
  };

  const nextStep = () => {
    if (step === 1) setStep(isBankMethod ? 2 : 3);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) setStep(5);
    else if (step === 5) setStep(6);
  };

  const prevStep = () => {
    if (step === 1) safeBack(router, '/(tabs)/portfolio');
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(isBankMethod ? 2 : 1);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
  };

  const applyLastWithdraw = () => {
    if (!lastWithdraw) return;
    setSelectedMethod(lastWithdraw.method as MethodId);
    setSelectedBank(lastWithdraw.bank);
    setAmount(String(lastWithdraw.amount));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const submitStep5 = () => {
    completeWithdrawal();
    setStep(6);
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
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Withdraw</Text>
      </View>
      {step === 1 ? (
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={{ width: 36, alignItems: 'flex-end' }}>
          <Ionicons name="help-circle-outline" size={20} color={colors.muted} />
        </TouchableOpacity>
      ) : step === 6 ? (
        <TouchableOpacity onPress={() => router.replace('/(tabs)/portfolio')} style={{ width: 36, alignItems: 'flex-end' }}>
          <Ionicons name="close" size={20} color={colors.muted} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );

  const renderFooter = () => {
    let label = 'Continue';
    let onPress: () => void = nextStep;
    let disabled = false;

    if (step === 3) {
      disabled = !isAmountValid || exceedsBalance;
      onPress = () => {
        if (exceedsBalance) {
          showAlert(
            'Insufficient balance',
            `You can withdraw up to ${availableLabel} from your spot buying power.`,
            undefined,
            { tone: 'warning' },
          );
          return;
        }
        nextStep();
      };
    } else if (step === 4) {
      label = 'Confirm Withdrawal';
      onPress = () => {
        saveLastWithdraw({ method: selectedMethod, bank: selectedBank, amount: parsedAmount });
        nextStep();
      };
    } else if (step === 5) {
      if (isBankMethod) {
        label = 'Verify & Submit';
        disabled = otpCode.replace(/\D/g, '').length < 6;
        onPress = submitStep5;
      } else {
        label = 'Confirm Payout';
        disabled = walletPhone.replace(/\D/g, '').length < 10;
        onPress = submitStep5;
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
            backgroundColor: PRIMARY,
            borderRadius: 100,
            paddingVertical: 15,
            opacity: disabled ? 0.4 : 1,
          }}
        >
          <Text style={{ color: '#000', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>{label}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep1 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: 14 }}>
        <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '500', marginBottom: 4 }}>Total Balance</Text>
        <Text style={{ color: colors.text, fontSize: 26, fontWeight: '700', letterSpacing: -0.5 }}>{balanceLabel}</Text>
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>Spot wallet · available to withdraw</Text>
        <Text style={{ color: PRIMARY, fontSize: 13, fontWeight: '600', marginTop: 2 }}>{availableLabel}</Text>
      </View>

      {lastWithdraw ? (
        <TouchableOpacity
          onPress={applyLastWithdraw}
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
            <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>Repeat last withdrawal</Text>
            <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
              PKR {lastWithdraw.amount.toLocaleString()} · {methodMeta(lastWithdraw.method).title}
            </Text>
          </View>
          <Text style={{ color: PRIMARY, fontSize: 11, fontWeight: '700' }}>Use</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginHorizontal: 14, marginBottom: 10 }}>Choose withdrawal method</Text>
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
          Withdrawals are sent from your Spot wallet only. Transfer from Futures to Spot first if needed.
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
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 1 }}>{bank.holder}</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(14,203,129,0.12)', borderRadius: 4, paddingVertical: 2, paddingHorizontal: 7 }}>
              <Text style={{ color: '#22c55e', fontSize: 9, fontWeight: '600' }}>Verified</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={{
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.border,
          borderStyle: 'dashed',
          borderRadius: 12,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Ionicons name="add" size={16} color={colors.muted} />
        <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '500' }}>Add New Bank Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStep3 = () => (
    <View style={{ flex: 1, paddingHorizontal: 14 }}>
      {showProgress && renderProgress()}
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 16 }}>Enter amount</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ color: colors.muted, fontSize: 12 }}>Available Balance</Text>
        <TouchableOpacity onPress={setMaxAmount} hitSlop={8}>
          <Text style={{ color: PRIMARY, fontSize: 12, fontWeight: '700' }}>Max · {availableLabel}</Text>
        </TouchableOpacity>
      </View>

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

      {exceedsBalance && parsedAmount > 0 ? (
        <Text style={{ color: '#ef4444', fontSize: 11, marginTop: 10 }}>
          Amount exceeds available balance ({availableLabel}).
        </Text>
      ) : isAmountValid ? (
        <View style={{ marginTop: 10, backgroundColor: 'rgba(255,138,0,0.08)', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(255,138,0,0.2)' }}>
          <Text style={{ color: colors.muted, fontSize: 11 }}>After withdrawal</Text>
          <Text style={{ color: PRIMARY, fontSize: 14, fontWeight: '700', marginTop: 2 }}>
            {availableLabel} → {afterWithdrawLabel}
          </Text>
        </View>
      ) : (
        <Text style={{ color: colors.muted, fontSize: 11, marginTop: 8 }}>Minimum PKR 10 · Daily limit PKR 500,000</Text>
      )}

      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 8 }}>
        <NumericKeypad onDigit={appendAmountDigit} onBackspace={backspaceAmount} />
        <View style={{ marginTop: 12, backgroundColor: colors.cardSoft, borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8 }}>
          <Ionicons name="information-circle-outline" size={14} color={colors.muted} style={{ marginTop: 1 }} />
          <Text style={{ color: colors.muted, fontSize: 11, flex: 1 }}>Use keypad to enter amount · Tap Max for full available balance</Text>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {showProgress && renderProgress()}
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 14 }}>Review withdrawal</Text>

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14 }}>
        <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '600', letterSpacing: 0.6, marginBottom: 8 }}>FROM</Text>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>Spot Wallet</Text>

        <View style={{ height: 0.5, backgroundColor: colors.border, marginVertical: 12 }} />

        <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '600', letterSpacing: 0.6, marginBottom: 8 }}>METHOD</Text>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500' }}>{method.title}</Text>

        {isBankMethod && (
          <>
            <View style={{ height: 0.5, backgroundColor: colors.border, marginVertical: 12 }} />
            <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '600', letterSpacing: 0.6, marginBottom: 8 }}>BANK</Text>
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '500' }}>{selectedBankData.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>{selectedBankData.number}</Text>
          </>
        )}

        {([
          { label: 'Amount', value: displayAmount, accent: false },
          { label: 'Processing', value: method.instant ? WITHDRAW_MOCK.instantTime : WITHDRAW_MOCK.processingTime, accent: false },
          { label: 'Fee', value: WITHDRAW_MOCK.fee, accent: false },
          { label: 'You receive', value: displayAmount, accent: true },
        ] as const).map((row, idx, arr) => (
          <View
            key={row.label}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 8,
              borderBottomWidth: idx < arr.length - 1 ? 0.5 : 0,
              borderBottomColor: colors.border,
              marginTop: idx === 0 ? 12 : 0,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12 }}>{row.label}</Text>
            <Text style={{ color: row.accent ? PRIMARY : colors.text, fontSize: 12, fontWeight: row.accent ? '700' : '500' }}>{row.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderStep5Bank = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginTop: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,138,0,0.12)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="shield-checkmark-outline" size={22} color={PRIMARY} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Confirm payout details</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3 }}>Verify destination, then enter OTP.</Text>
        </View>
      </View>

      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Payout destination</Text>

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>
          We will send <Text style={{ color: colors.text, fontWeight: '700' }}>PKR {formatPkrAmount(parsedAmount || WITHDRAW_MOCK.amount)}</Text> to:
        </Text>
        <CopyableRow label="Bank Name" value={selectedBankData.name} onCopy={copyText} />
        <CopyableRow label="Account Holder" value={selectedBankData.holder} onCopy={copyText} />
        <CopyableRow label="Account Number" value={selectedBankData.number} onCopy={copyText} />
        <CopyableRow label="Request ID" value={WITHDRAW_MOCK.requestId} highlight onCopy={copyText} />

        <TouchableOpacity
          onPress={copyAllBankDetails}
          style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,138,0,0.12)' }}
        >
          <Ionicons name="copy" size={16} color={PRIMARY} />
          <Text style={{ color: PRIMARY, fontSize: 12, fontWeight: '700' }}>Copy all details</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>Verification code</Text>
      <TextInput
        value={otpCode}
        onChangeText={(t) => setOtpCode(t.replace(/[^0-9]/g, '').slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="Enter 6-digit OTP"
        placeholderTextColor={colors.mutedDarker}
        style={{
          backgroundColor: colors.card,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 14,
          color: colors.text,
          fontSize: 18,
          fontWeight: '700',
          letterSpacing: 4,
          borderWidth: 1.5,
          borderColor: otpCode.length === 6 ? PRIMARY : colors.border,
          textAlign: 'center',
        }}
      />
      <Text style={{ color: colors.muted, fontSize: 11, marginTop: 10, lineHeight: 17 }}>
        Code sent to your registered mobile. Demo: enter any 6 digits to continue.
      </Text>
    </ScrollView>
  );

  const renderStep5Instant = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginTop: 14 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Receive with {method.title}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 16 }}>
          Amount: <Text style={{ color: colors.text, fontWeight: '700' }}>{displayAmount}</Text>
        </Text>

        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>{method.title} mobile number</Text>
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
          Funds will be transferred to this {method.title} account. Make sure the number is registered in your name.
        </Text>
      </View>
    </ScrollView>
  );

  const renderStep6 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      <WithdrawSuccessHero processed={withdrawProcessed} />

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14 }}>
        {([
          { label: 'Amount', value: displayAmount },
          { label: 'Method', value: method.title },
          ...(isBankMethod ? [{ label: 'Bank', value: selectedBankData.name }] : [{ label: 'Wallet', value: walletPhone }]),
          { label: 'Request ID', value: WITHDRAW_MOCK.requestId, accent: true },
          { label: 'Date & Time', value: WITHDRAW_MOCK.dateTime },
          { label: 'Status', status: withdrawProcessed ? 'Processed' : 'Pending' },
        ] as const).map((row, idx, arr) => (
          <View
            key={'label' in row ? row.label : idx}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 9,
              borderBottomWidth: idx < arr.length - 1 ? 0.5 : 0,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12 }}>{'label' in row ? row.label : ''}</Text>
            {'status' in row ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: withdrawProcessed ? '#0ECB81' : PRIMARY }} />
                <Text style={{ color: withdrawProcessed ? '#0ECB81' : PRIMARY, fontSize: 12, fontWeight: '600' }}>{row.status}</Text>
              </View>
            ) : (
              <Text style={{ color: 'accent' in row && row.accent ? PRIMARY : colors.text, fontSize: 12, fontWeight: '500' }}>{row.value}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => router.replace({ pathname: '/orders', params: { tab: 'spot', view: 'history' } })}
          style={{ backgroundColor: PRIMARY, borderRadius: 100, paddingVertical: 15, marginBottom: 10 }}
        >
          <Text style={{ color: '#000', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>View Withdrawal History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/portfolio')} style={{ paddingVertical: 14 }}>
          <Text style={{ color: colors.muted, fontSize: 14, fontWeight: '500', textAlign: 'center' }}>Back to Portfolio</Text>
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
      <WithdrawHelpSheet visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </SafeAreaView>
  );
}
