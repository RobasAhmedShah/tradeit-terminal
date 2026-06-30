import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAppAlert } from '../../context/AppAlertContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const WITHDRAW_MOCK = {
  withdrawAmount:  25000,
  bank:            'Meezan Bank',
  accountNumber:   '**** **** **** 1234',
  accountHolder:   'Muhammad Ali',
  method:          'Bank Transfer',
  processingFee:   'PKR 0.00',
  youReceive:      'PKR 25,000.00',
  requestId:       'WD87451236',
  dateTime:        '08 May 2024, 11:42 AM',
  maskedPhone:     '03XX-XXXXXXX',
};

const METHODS = [
  { id: 'bankTransfer', icon: 'business-outline',      color: '#f97316', title: 'Bank Transfer', sub: 'Withdraw funds to your registered bank account' },
  { id: 'easypaisa',   icon: 'phone-portrait-outline', color: '#22c55e', title: 'EasyPaisa',     sub: 'Withdraw to your EasyPaisa account' },
  { id: 'jazzcash',    icon: 'phone-portrait-outline', color: '#ef4444', title: 'JazzCash',      sub: 'Withdraw to your JazzCash account' },
];

const BANKS = [
  { id: 'meezan', name: 'Meezan Bank', number: '**** **** **** 1234', holder: 'Muhammad Ali', abbr: 'M',   bgColor: '#0a4a2a', textColor: '#22c55e', small: false },
  { id: 'hbl',    name: 'HBL',         number: '**** **** **** 5678', holder: 'Muhammad Ali', abbr: 'HBL', bgColor: '#1a0a3a', textColor: '#818cf8', small: true  },
  { id: 'abl',    name: 'ABL',         number: '**** **** **** 9101', holder: 'Muhammad Ali', abbr: 'ABL', bgColor: '#1a2a0a', textColor: '#22c55e', small: true  },
];

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000, 200000];
const PROGRESS_LABELS = ['Method', 'Bank', 'Amount', 'Review'];

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function WithdrawScreen() {
  const router = useRouter();
  const { withdrawCash, summary } = usePortfolio();
  const { showAlert } = useAppAlert();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const balanceLabel = `PKR ${formatPortfolioRs(summary.totalValue)}`;
  const availableLabel = `PKR ${formatPortfolioRs(summary.buyingPower)}`;

  const [step, setStep]                               = useState<Step>(1);
  const [selectedMethod, setSelectedMethod]           = useState('bankTransfer');
  const [selectedBank, setSelectedBank]               = useState('meezan');
  const [amount, setAmount]                           = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
  const [otpValues, setOtpValues]                     = useState<string[]>(['4', '7', '2', '9', '1', '']);
  const [resendTimer, setResendTimer]                 = useState(45);
  const [canResend, setCanResend]                     = useState(false);
  const [cashDebited, setCashDebited]                 = useState(false);

  // ── Resend countdown for step 5 ───────────────────────────────────────────
  useEffect(() => {
    if (step !== 5) return;
    if (resendTimer <= 0) { setCanResend(true); return; }
    const t = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  const handleResend = () => {
    setResendTimer(45);
    setCanResend(false);
    setOtpValues(['', '', '', '', '', '']);
  };

  const formatResendTime = () => {
    const m = Math.floor(resendTimer / 60).toString().padStart(2, '0');
    const s = (resendTimer % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── OTP handlers ──────────────────────────────────────────────────────────
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otpValues];
    newOtp[index] = text;
    setOtpValues(newOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const parsedAmount     = parseInt(amount, 10) || 0;
  const isAmountValid    = parsedAmount >= 1000;
  const exceedsBalance   = parsedAmount > summary.buyingPower;

  useEffect(() => {
    if (step !== 6 || parsedAmount <= 0 || cashDebited) return;
    withdrawCash(parsedAmount);
    setCashDebited(true);
  }, [step, parsedAmount, cashDebited, withdrawCash]);

  const displayAmount    = parsedAmount > 0
    ? `PKR ${parsedAmount.toLocaleString()}.00`
    : `PKR ${WITHDRAW_MOCK.withdrawAmount.toLocaleString()}.00`;
  const selectedBankData = BANKS.find((b) => b.id === selectedBank) || BANKS[0];
  const activeOtpIndex   = otpValues.findIndex((v) => v === '');

  const goBack = () => { if (step === 1) router.back(); else setStep((step - 1) as Step); };

  // ── Shared: NavBar ────────────────────────────────────────────────────────
  const renderNavBar = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e' }}>
      <TouchableOpacity onPress={goBack} style={{ width: 36 }}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Withdraw</Text>
      </View>
      {step === 6 ? (
        <TouchableOpacity onPress={() => router.back()} style={{ width: 36, alignItems: 'flex-end' }}>
          <Ionicons name="close" size={20} color="#555" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{ width: 36, alignItems: 'flex-end' }}>
          <Ionicons name="help-circle-outline" size={20} color="#555" />
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Shared: Progress Indicator (steps 2–4) ────────────────────────────────
  const renderProgress = () => {
    const progressIndex = step - 1;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginHorizontal: 14 }}>
        {PROGRESS_LABELS.map((label, idx) => {
          const isCompleted = idx < progressIndex;
          const isCurrent   = idx === progressIndex;
          return (
            <React.Fragment key={label}>
              {idx > 0 && (
                <View style={{ flex: 1, height: 1.5, backgroundColor: idx <= progressIndex ? '#f97316' : '#1e1e1e' }} />
              )}
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 28, height: 28, borderRadius: 14,
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isCompleted ? '#f97316' : 'transparent',
                  borderWidth: isCompleted ? 0 : isCurrent ? 2 : 1.5,
                  borderColor: isCompleted ? '#f97316' : isCurrent ? '#f97316' : '#333',
                }}>
                  {isCompleted
                    ? <Ionicons name="checkmark" size={14} color="#fff" />
                    : <Text style={{ color: isCurrent ? '#f97316' : '#333', fontSize: 11, fontWeight: '700' }}>{idx + 1}</Text>
                  }
                </View>
                <Text style={{ fontSize: 9, marginTop: 4, color: isCurrent ? '#f97316' : '#444', fontWeight: isCurrent ? '600' : '400' }}>
                  {label}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  // ── Shared: Sticky Footer CTA (steps 1–5) ─────────────────────────────────
  const renderFooter = () => {
    let label = 'Continue';
    let onPress: () => void = () => setStep(2);
    let disabled = false;

    if (step === 1) { onPress = () => setStep(2); }
    else if (step === 2) { onPress = () => setStep(3); }
    else if (step === 3) {
      disabled = !isAmountValid || exceedsBalance;
      onPress = () => {
        if (exceedsBalance) {
          showAlert(
            'Insufficient balance',
            `You can withdraw up to ${availableLabel} from your spot buying power.`,
            undefined,
            { tone: 'warning' }
          );
          return;
        }
        setStep(4);
      };
    } else if (step === 4) { label = 'Confirm Withdrawal'; onPress = () => setStep(5); }
    else if (step === 5) { label = 'Verify & Continue'; onPress = () => setStep(6); }

    return (
      <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderTopWidth: 0.5, borderTopColor: '#1e1e1e', backgroundColor: '#050505' }}>
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.85}
          style={{ backgroundColor: '#f97316', borderRadius: 100, paddingVertical: 15, opacity: disabled ? 0.4 : 1 }}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>{label}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ── Step 1: Select Withdrawal Method ─────────────────────────────────────
  const renderStep1 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Balance Block */}
      <View style={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e', marginBottom: 14 }}>
        <Text style={{ color: '#555', fontSize: 11, fontWeight: '500', marginBottom: 4 }}>Total Balance</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700', letterSpacing: -0.5 }}>{balanceLabel}</Text>
          <Ionicons name="eye-outline" size={16} color="#555" style={{ marginLeft: 8 }} />
        </View>
        <Text style={{ color: '#555', fontSize: 11, marginTop: 6 }}>Spot wallet · available to withdraw</Text>
        <Text style={{ color: '#f97316', fontSize: 13, fontWeight: '600', marginTop: 2 }}>{availableLabel}</Text>
      </View>

      {/* Method Selection */}
      <Text style={{ color: '#e0e0e0', fontSize: 13, fontWeight: '600', marginHorizontal: 14, marginBottom: 10 }}>Choose Withdrawal Method</Text>
      {METHODS.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            onPress={() => setSelectedMethod(method.id)}
            style={{
              backgroundColor: '#161616', borderRadius: 12, marginHorizontal: 14, marginBottom: 8, padding: 14,
              flexDirection: 'row', alignItems: 'center',
              borderWidth: 1.5, borderColor: isSelected ? '#f97316' : '#1e1e1e',
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#1e1e1e', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={method.icon as any} size={20} color={method.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{method.title}</Text>
              <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{method.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#333" />
          </TouchableOpacity>
        );
      })}

      {/* Info Notice */}
      <View style={{ marginHorizontal: 14, marginTop: 6, backgroundColor: '#111111', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Ionicons name="information-circle-outline" size={14} color="#555" style={{ marginTop: 1 }} />
        <Text style={{ color: '#555', fontSize: 11, lineHeight: 17, flex: 1 }}>
          Withdrawals are sent from your Spot wallet only. Transfer funds from Futures to Spot first if needed. Usually processed within 24 hours on working days.
        </Text>
      </View>
    </ScrollView>
  );

  // ── Step 2: Select Bank Account ───────────────────────────────────────────
  const renderStep2 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {renderProgress()}
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 14 }}>Select Bank Account</Text>

      {BANKS.map((bank) => {
        const isSelected = selectedBank === bank.id;
        return (
          <TouchableOpacity
            key={bank.id}
            onPress={() => setSelectedBank(bank.id)}
            style={{
              backgroundColor: '#161616', borderRadius: 12, padding: 14, marginBottom: 8,
              flexDirection: 'row', alignItems: 'center',
              borderWidth: 1.5, borderColor: isSelected ? '#f97316' : '#1e1e1e',
            }}
          >
            {/* Radio */}
            <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: isSelected ? 2 : 1.5, borderColor: isSelected ? '#f97316' : '#333' }}>
              {isSelected && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#f97316' }} />}
            </View>
            {/* Logo */}
            <View style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: bank.bgColor, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
              <Text style={{ color: bank.textColor, fontSize: bank.small ? 9 : 14, fontWeight: '700' }}>{bank.abbr}</Text>
            </View>
            {/* Info */}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{bank.name}</Text>
              <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{bank.number}</Text>
              <Text style={{ color: '#555', fontSize: 11, marginTop: 1 }}>{bank.holder}</Text>
            </View>
            {/* Verified badge */}
            <View style={{ backgroundColor: '#0d2010', borderRadius: 4, paddingVertical: 2, paddingHorizontal: 7 }}>
              <Text style={{ color: '#22c55e', fontSize: 9, fontWeight: '600' }}>Verified</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Add New Bank */}
      <TouchableOpacity style={{
        backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#333', borderStyle: 'dashed',
        borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <Ionicons name="add" size={16} color="#555" />
        <Text style={{ color: '#555', fontSize: 13, fontWeight: '500' }}>Add New Bank Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ── Step 3: Enter Amount ──────────────────────────────────────────────────
  const renderStep3 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {renderProgress()}
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 16 }}>Enter Withdrawal Amount</Text>

      {/* Balance Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ color: '#555', fontSize: 12 }}>Available Balance</Text>
        <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '600' }}>{availableLabel}</Text>
      </View>

      {/* Amount Input */}
      <Text style={{ color: '#555', fontSize: 12, marginBottom: 6 }}>Amount (PKR)</Text>
      <View style={{ backgroundColor: '#161616', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 14, borderWidth: 1.5, borderColor: amount ? '#f97316' : '#1e1e1e' }}>
        <TextInput
          value={amount}
          onChangeText={(text) => {
            const numeric = text.replace(/[^0-9]/g, '');
            setAmount(numeric);
            setSelectedQuickAmount(null);
          }}
          placeholder="0"
          placeholderTextColor="#333"
          keyboardType="numeric"
          style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}
        />
      </View>
      <Text style={{ color: '#555', fontSize: 11, marginTop: 8 }}>Minimum Withdrawal: PKR 1,000</Text>
      {exceedsBalance && parsedAmount > 0 && (
        <Text style={{ color: '#ef4444', fontSize: 11, marginTop: 6 }}>
          Amount exceeds available balance ({availableLabel}).
        </Text>
      )}
      <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>Daily Limit: PKR 500,000.00</Text>

      {/* Quick Amounts */}
      <Text style={{ color: '#e0e0e0', fontSize: 12, fontWeight: '600', marginTop: 16, marginBottom: 8 }}>Quick Amounts</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {QUICK_AMOUNTS.map((qa) => {
          const isSelected = selectedQuickAmount === qa;
          return (
            <TouchableOpacity
              key={qa}
              onPress={() => { setSelectedQuickAmount(qa); setAmount(qa.toString()); }}
              style={{
                flexBasis: '31%', paddingVertical: 10, borderRadius: 8, alignItems: 'center',
                backgroundColor: isSelected ? '#f97316' : '#161616',
                borderWidth: 1, borderColor: isSelected ? '#f97316' : '#1e1e1e',
              }}
            >
              <Text style={{ color: isSelected ? '#fff' : '#888', fontSize: 12, fontWeight: '500' }}>
                +{qa.toLocaleString()}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          onPress={() => { setAmount('12456789'); setSelectedQuickAmount(null); }}
          style={{ flexBasis: '31%', paddingVertical: 10, borderRadius: 8, alignItems: 'center', backgroundColor: '#161616', borderWidth: 1, borderColor: '#1e1e1e' }}
        >
          <Text style={{ color: '#888', fontSize: 12, fontWeight: '500' }}>Max</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ── Step 4: Review Details ────────────────────────────────────────────────
  const renderStep4 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {renderProgress()}
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 14 }}>Review Withdrawal Details</Text>

      <View style={{ backgroundColor: '#161616', borderRadius: 12, padding: 14 }}>
        {/* Source wallet */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e' }}>
          <Text style={{ color: '#555', fontSize: 12, flex: 1 }}>From</Text>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Spot Wallet</Text>
        </View>

        {/* Withdrawal Method */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e' }}>
          <Text style={{ color: '#555', fontSize: 12, flex: 1 }}>Withdrawal Method</Text>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Bank Transfer</Text>
        </View>

        {/* Bank Account */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e' }}>
          <Text style={{ color: '#555', fontSize: 12, flex: 1 }}>Bank Account</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{selectedBankData.name}</Text>
            <Text style={{ color: '#555', fontSize: 11, marginTop: 1 }}>{selectedBankData.number}</Text>
          </View>
        </View>

        {/* Account Holder */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e' }}>
          <Text style={{ color: '#555', fontSize: 12, flex: 1 }}>Account Holder</Text>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{selectedBankData.holder}</Text>
        </View>

        {/* Amount */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e' }}>
          <Text style={{ color: '#555', fontSize: 12, flex: 1 }}>Amount</Text>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{displayAmount}</Text>
        </View>

        {/* Processing Fee */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e' }}>
          <Text style={{ color: '#555', fontSize: 12, flex: 1 }}>Processing Fee</Text>
          <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '600' }}>{WITHDRAW_MOCK.processingFee}</Text>
        </View>

        {/* You Will Receive — no bottom border */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
          <Text style={{ color: '#e0e0e0', fontSize: 13, fontWeight: '600', flex: 1 }}>You Will Receive</Text>
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: '700' }}>{displayAmount}</Text>
        </View>
      </View>

      {/* Warning */}
      <View style={{ marginTop: 12, backgroundColor: '#111111', borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8 }}>
        <Ionicons name="information-circle-outline" size={14} color="#555" style={{ marginTop: 1 }} />
        <Text style={{ color: '#555', fontSize: 11, flex: 1, lineHeight: 17 }}>
          Withdrawals are processed within 24 hours on working days. Make sure bank details are correct.
        </Text>
      </View>
    </ScrollView>
  );

  // ── Step 5: Confirm with 2FA ──────────────────────────────────────────────
  const renderStep5 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 24 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>Confirm Withdrawal</Text>
        <Text style={{ color: '#555', fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
          Enter the 6-digit code sent to your{'\n'}registered mobile number {WITHDRAW_MOCK.maskedPhone}
        </Text>
      </View>

      {/* OTP Boxes */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 6, marginBottom: 8 }}>
        {otpValues.map((val, idx) => {
          const isActive = activeOtpIndex === idx || (activeOtpIndex === -1 && idx === 5);
          return (
            <View
              key={idx}
              style={{
                width: 44, height: 52, backgroundColor: '#161616', borderRadius: 10,
                borderWidth: 1.5, borderColor: isActive ? '#f97316' : '#1e1e1e',
                justifyContent: 'center', alignItems: 'center',
              }}
            >
              <TextInput
                ref={(ref) => { inputRefs.current[idx] = ref; }}
                value={val}
                onChangeText={(text) => handleOtpChange(text.slice(-1), idx)}
                onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, idx)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                style={{ textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#fff', width: '100%', height: '100%' }}
              />
            </View>
          );
        })}
      </View>

      {/* Resend Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 16 }}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={{ color: '#f97316', fontSize: 13, fontWeight: '600' }}>Resend Code</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={{ color: '#555', fontSize: 13 }}>Resend Code in</Text>
            <Text style={{ color: '#f97316', fontSize: 13, fontWeight: '600' }}>{formatResendTime()}</Text>
          </>
        )}
      </View>

      {/* Security Notice */}
      <View style={{ marginTop: 20, backgroundColor: '#111111', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#22c55e" style={{ marginTop: 1 }} />
        <Text style={{ color: '#555', fontSize: 12, flex: 1, lineHeight: 17 }}>
          For your security, please do not share your verification code with anyone.
        </Text>
      </View>
    </ScrollView>
  );

  // ── Step 6: Success ───────────────────────────────────────────────────────
  const renderStep6 = () => {
    type ReceiptRow = { label: string; value: string; valueStyle?: Record<string, string | number>; isStatus?: boolean };
    const receiptRows: ReceiptRow[] = [
      { label: 'Amount',      value: displayAmount },
      { label: 'Method',      value: WITHDRAW_MOCK.method },
      { label: 'Bank',        value: `${selectedBankData.name} ****${selectedBankData.number.slice(-4)}` },
      { label: 'Request ID',  value: WITHDRAW_MOCK.requestId, valueStyle: { color: '#f97316', fontWeight: '600' } },
      { label: 'Date & Time', value: WITHDRAW_MOCK.dateTime },
      { label: 'Status',      value: 'Pending', isStatus: true },
    ];

    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
        {/* Success Icon */}
        <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 20 }}>
          <View style={{ position: 'relative', width: 106, height: 106, alignItems: 'center', justifyContent: 'center' }}>
            {/* Spark dots */}
            <View style={{ position: 'absolute', top: 0, left: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: '#f97316' }} />
            <View style={{ position: 'absolute', top: 0, right: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' }} />
            <View style={{ position: 'absolute', bottom: 0, left: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' }} />
            <View style={{ position: 'absolute', bottom: 0, right: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: '#f97316' }} />
            {/* Ring + inner */}
            <View style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#0d2010', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="checkmark" size={36} color="#22c55e" />
              </View>
            </View>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 16 }}>Withdrawal Request Submitted!</Text>
          <Text style={{ color: '#555', fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 24, lineHeight: 20 }}>
            Your withdrawal request has been submitted{'\n'}successfully.
          </Text>
        </View>

        {/* Receipt Card */}
        <View style={{ backgroundColor: '#161616', borderRadius: 12, padding: 14 }}>
          {receiptRows.map((row, idx) => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: idx < receiptRows.length - 1 ? 0.5 : 0, borderBottomColor: '#111111' }}>
              <Text style={{ color: '#555', fontSize: 12 }}>{row.label}</Text>
              {row.isStatus ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#f97316' }} />
                  <View style={{ backgroundColor: '#1a0e00', borderRadius: 5, paddingVertical: 3, paddingHorizontal: 8 }}>
                    <Text style={{ color: '#f97316', fontSize: 11, fontWeight: '600' }}>Pending</Text>
                  </View>
                </View>
              ) : (
                <Text style={{ color: '#e0e0e0', fontSize: 12, fontWeight: '500', ...(row.valueStyle ?? {}) }}>{row.value}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Info Notice */}
        <View style={{ backgroundColor: '#111111', borderRadius: 10, padding: 12, marginTop: 12, flexDirection: 'row', gap: 8 }}>
          <Ionicons name="information-circle-outline" size={14} color="#555" style={{ marginTop: 1 }} />
          <Text style={{ color: '#555', fontSize: 11, flex: 1, lineHeight: 17 }}>
            You will receive a notification once your withdrawal has been processed.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => router.push('/orders/history')}
            style={{ backgroundColor: '#f97316', borderRadius: 100, paddingVertical: 15, marginBottom: 10 }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>View Withdrawal History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/portfolio')}
            style={{ paddingVertical: 14, marginBottom: 30 }}
          >
            <Text style={{ color: '#888', fontSize: 14, fontWeight: '500', textAlign: 'center' }}>Back to Portfolio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050505' }} edges={['top']}>
      {renderNavBar()}
      <View style={{ flex: 1 }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}
      </View>
      {step < 6 && renderFooter()}
    </SafeAreaView>
  );
}
