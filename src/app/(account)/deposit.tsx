import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFutures } from '../../context/FuturesContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatPortfolioRs } from '../../data/mockPortfolio';
import { formatFuturesPrice } from '../../data/mockFutures';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const DEPOSIT_MOCK = {
  balance: 'PKR 15,896,666.00',
  available: 'PKR 15,785,334.40',
  amount: 50000,
  bank: 'Meezan Bank',
  accountNumber: '**** **** **** 1234',
  accountHolder: 'Muhammad Ali',
  method: 'Bank Transfer',
  processingTime: '10 - 30 Minutes',
  fee: 'PKR 0.00',
  tradeitBank: 'Meezan Bank',
  tradeitTitle: 'TradeIt Technologies (Pvt.) Ltd.',
  tradeitAccount: '0123 4567 8901',
  tradeitIBAN: 'PK18MEZN0001234567890101',
  reference: 'Deposit - 874512',
  transactionId: 'DP874512',
  dateTime: '08 May 2024, 11:42 AM',
};

const METHODS = [
  { id: 'bankTransfer', icon: 'business-outline',         color: '#f97316', title: 'Bank Transfer', sub: 'Transfer funds from your bank account to TradeIt' },
  { id: 'easypaisa',   icon: 'phone-portrait-outline',    color: '#22c55e', title: 'EasyPaisa',     sub: 'Deposit instantly using EasyPaisa account' },
  { id: 'jazzcash',    icon: 'phone-portrait-outline',    color: '#ef4444', title: 'JazzCash',      sub: 'Deposit instantly using JazzCash account' },
  { id: 'raast',       icon: 'swap-horizontal-outline',   color: '#818cf8', title: 'Raast',         sub: 'Instant bank to bank transfer via Raast' },
];

const BANKS = [
  { id: 'meezan', name: 'Meezan Bank', number: '**** **** **** 1234', holder: 'Muhammad Ali', abbr: 'M',   bgColor: '#0a4a2a', textColor: '#22c55e', small: false },
  { id: 'hbl',    name: 'HBL',         number: '**** **** **** 5678', holder: 'Muhammad Ali', abbr: 'HBL', bgColor: '#1a0a3a', textColor: '#a78bfa', small: true  },
  { id: 'abl',    name: 'ABL',         number: '**** **** **** 9101', holder: 'Muhammad Ali', abbr: 'ABL', bgColor: '#1a2a0a', textColor: '#4ade80', small: true  },
];

const QUICK_AMOUNTS = [10000, 20000, 50000, 100000, 200000];
const PROGRESS_LABELS = ['Method', 'Bank', 'Amount', 'Review'];

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function DepositScreen() {
  const router = useRouter();
  const { addFuturesMargin, marginAvailable } = useFutures();
  const { addCash, summary } = usePortfolio();

  const balanceLabel = `PKR ${formatPortfolioRs(summary.totalValue)}`;
  const availableLabel = `PKR ${formatPortfolioRs(summary.buyingPower)}`;

  const [step, setStep]                           = useState<Step>(1);
  const [selectedMethod, setSelectedMethod]       = useState('bankTransfer');
  const [selectedBank, setSelectedBank]           = useState('meezan');
  const [amount, setAmount]                       = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null);
  const [creditToFutures, setCreditToFutures]     = useState(false);
  const [timeLeft, setTimeLeft]                   = useState(30 * 60);
  const [marginCredited, setMarginCredited]       = useState(false);
  const [cashCredited, setCashCredited]           = useState(false);

  const parsedAmount    = parseInt(amount, 10) || 0;
  const isAmountValid   = parsedAmount >= 1000;
  const displayAmount   = parsedAmount > 0
    ? `PKR ${parsedAmount.toLocaleString()}.00`
    : `PKR ${DEPOSIT_MOCK.amount.toLocaleString()}.00`;
  const selectedBankData = BANKS.find((b) => b.id === selectedBank) || BANKS[0];

  // ── Timer for step 5 ────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 5) return;
    setTimeLeft(30 * 60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step !== 6 || parsedAmount <= 0) return;

    // Always add to buying power (main wallet)
    if (!cashCredited) {
      addCash(parsedAmount);
      setCashCredited(true);
    }

    // Optionally also credit futures margin
    if (creditToFutures && !marginCredited) {
      addFuturesMargin(parsedAmount);
      setMarginCredited(true);
    }
  }, [step, creditToFutures, parsedAmount, marginCredited, cashCredited, addFuturesMargin, addCash]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const goBack = () => { if (step === 1) router.back(); else setStep((step - 1) as Step); };

  // ── Shared: Nav Bar ─────────────────────────────────────────────────────────
  const renderNavBar = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e' }}>
      {step < 6 ? (
        <TouchableOpacity onPress={goBack} style={{ width: 36 }}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Deposit</Text>
      </View>
      {step === 1 ? (
        <TouchableOpacity style={{ width: 36, alignItems: 'flex-end' }}>
          <Ionicons name="help-circle-outline" size={20} color="#555" />
        </TouchableOpacity>
      ) : step === 6 ? (
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={{ width: 36, alignItems: 'flex-end' }}>
          <Ionicons name="home-outline" size={20} color="#555" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );

  // ── Shared: Progress Indicator (steps 2, 3, 4) ─────────────────────────────
  const renderProgress = () => {
    const progressIndex = step - 1; // 0-based current step index
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, marginHorizontal: 14 }}>
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

  // ── Shared: Continue Button ─────────────────────────────────────────────────
  const renderContinueBtn = (onPress: () => void, label = 'Continue', disabled = false) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ marginTop: 20, marginBottom: 30, backgroundColor: '#f97316', borderRadius: 100, paddingVertical: 15, opacity: disabled ? 0.4 : 1 }}
    >
      <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>{label}</Text>
    </TouchableOpacity>
  );

  // ── Step 1: Select Method ───────────────────────────────────────────────────
  const renderStep1 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Balance Block */}
      <View style={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: '#1e1e1e', marginBottom: 14 }}>
        <Text style={{ color: '#555', fontSize: 11, fontWeight: '500', marginBottom: 4 }}>Total Balance</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700', letterSpacing: -0.5 }}>{balanceLabel}</Text>
          <Ionicons name="eye-outline" size={16} color="#555" />
        </View>
        <Text style={{ color: '#555', fontSize: 11, marginTop: 4 }}>Available for Deposit</Text>
        <Text style={{ color: '#f97316', fontSize: 13, fontWeight: '600', marginTop: 2 }}>{availableLabel}</Text>
      </View>

      {/* Method Selection */}
      <Text style={{ color: '#e0e0e0', fontSize: 13, fontWeight: '600', marginHorizontal: 14, marginBottom: 10 }}>Choose Deposit Method</Text>
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
          Every deposit adds PKR to your spot wallet (buying power). On the review step you can optionally credit the same amount to futures margin too.
        </Text>
      </View>

      <View style={{ paddingHorizontal: 14 }}>
        {renderContinueBtn(() => setStep(2))}
      </View>
    </ScrollView>
  );

  // ── Step 2: Select Bank Account ─────────────────────────────────────────────
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
              <Text style={{ color: bank.textColor, fontSize: bank.small ? 10 : 14, fontWeight: '700' }}>{bank.abbr}</Text>
            </View>
            {/* Info */}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{bank.name}</Text>
              <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{bank.number}</Text>
              <Text style={{ color: '#555', fontSize: 11, marginTop: 1 }}>{bank.holder}</Text>
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

      {renderContinueBtn(() => setStep(3))}
    </ScrollView>
  );

  // ── Step 3: Enter Amount ────────────────────────────────────────────────────
  const renderStep3 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {renderProgress()}
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 16 }}>Enter Deposit Amount</Text>

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
      <Text style={{ color: '#555', fontSize: 11, marginTop: 8 }}>Available Balance: {availableLabel}</Text>

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
                flexBasis: '30%', paddingVertical: 10, borderRadius: 8, alignItems: 'center',
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
        <TouchableOpacity style={{ flexBasis: '30%', paddingVertical: 10, borderRadius: 8, alignItems: 'center', backgroundColor: '#161616', borderWidth: 1, borderColor: '#1e1e1e' }}>
          <Text style={{ color: '#888', fontSize: 12, fontWeight: '500' }}>Other</Text>
        </TouchableOpacity>
      </View>

      {/* Fee Notice */}
      <View style={{ marginTop: 14, backgroundColor: '#111111', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Ionicons name="information-circle-outline" size={14} color="#555" style={{ marginTop: 1 }} />
        <Text style={{ color: '#555', fontSize: 11, flex: 1 }}>
          No fees on deposits via bank transfer.{'\n'}Minimum deposit: PKR 1,000
        </Text>
      </View>

      {renderContinueBtn(() => setStep(4), 'Continue', !isAmountValid)}
    </ScrollView>
  );

  // ── Step 4: Review Details ──────────────────────────────────────────────────
  const renderStep4 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {renderProgress()}
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 14 }}>Review Deposit Details</Text>

      <View style={{ backgroundColor: '#161616', borderRadius: 12, padding: 14 }}>
        {/* Method */}
        <Text style={{ color: '#555', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Deposit Method</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="business-outline" size={18} color="#f97316" />
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '500' }}>Bank Transfer</Text>
        </View>

        <View style={{ height: 0.5, backgroundColor: '#1e1e1e', marginVertical: 12 }} />

        {/* Bank */}
        <Text style={{ color: '#555', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Bank Account</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: selectedBankData.bgColor, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: selectedBankData.textColor, fontSize: selectedBankData.small ? 10 : 14, fontWeight: '700' }}>{selectedBankData.abbr}</Text>
          </View>
          <View>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{selectedBankData.name}</Text>
            <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{selectedBankData.number}</Text>
            <Text style={{ color: '#555', fontSize: 11, marginTop: 1 }}>{selectedBankData.holder}</Text>
          </View>
        </View>

        <View style={{ height: 0.5, backgroundColor: '#1e1e1e', marginVertical: 12 }} />

        {/* Detail Rows */}
        {([
          { label: 'Amount',          value: displayAmount,                  style: {} },
          { label: 'Processing Time', value: DEPOSIT_MOCK.processingTime,    style: {} },
          { label: 'Transaction Fee', value: DEPOSIT_MOCK.fee,               style: { color: '#22c55e' } },
          { label: 'Total Amount',    value: displayAmount,                  style: { color: '#f97316', fontSize: 14, fontWeight: '700' } },
        ] as const).map((row, idx, arr) => (
          <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: idx < arr.length - 1 ? 0.5 : 0, borderBottomColor: '#111111' }}>
            <Text style={{ color: '#555', fontSize: 12 }}>{row.label}</Text>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500', ...(row.style as object) }}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* Futures margin allocation */}
      <TouchableOpacity
        onPress={() => setCreditToFutures((v) => !v)}
        style={{
          marginTop: 12,
          backgroundColor: creditToFutures ? '#1A0E00' : '#161616',
          borderRadius: 12,
          padding: 14,
          borderWidth: 1.5,
          borderColor: creditToFutures ? '#FF8A00' : '#1e1e1e',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: creditToFutures ? '#FF8A0020' : '#111',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="pulse" size={20} color={creditToFutures ? '#FF8A00' : '#555'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
            Also credit to Futures Margin
          </Text>
          <Text style={{ color: '#888', fontSize: 11, marginTop: 3 }}>
            Buying power always increases. Turn this on to also add futures margin.
          </Text>
        </View>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: creditToFutures ? '#FF8A00' : '#333',
            backgroundColor: creditToFutures ? '#FF8A00' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {creditToFutures && <Ionicons name="checkmark" size={14} color="#000" />}
        </View>
      </TouchableOpacity>

      {creditToFutures && parsedAmount > 0 && (
        <View style={{ marginTop: 8, backgroundColor: '#111214', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#2A2B2F' }}>
          <Text style={{ color: '#9CA3AF', fontSize: 11 }}>
            PKR {parsedAmount.toLocaleString()} will also go to futures margin (avail.{' '}
            {formatFuturesPrice(marginAvailable)}).
          </Text>
        </View>
      )}

      {/* Warning */}
      <View style={{ marginTop: 12, backgroundColor: '#111111', borderRadius: 8, padding: 10, flexDirection: 'row', gap: 8 }}>
        <Ionicons name="information-circle-outline" size={14} color="#555" style={{ marginTop: 1 }} />
        <Text style={{ color: '#555', fontSize: 11, flex: 1 }}>
          Make sure the details above are correct. You won't be able to change them later.
        </Text>
      </View>

      {renderContinueBtn(() => setStep(5), 'Confirm Deposit')}
    </ScrollView>
  );

  // ── Step 5: Payment Instructions ────────────────────────────────────────────
  const renderStep5 = () => {
    const timerColor = timeLeft < 60 ? '#ef4444' : '#22c55e';
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
        {/* Request Created */}
        <View style={{ backgroundColor: '#161616', borderRadius: 12, padding: 16, marginTop: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#0d2010', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark" size={22} color="#22c55e" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Deposit Request Created</Text>
            <Text style={{ color: '#555', fontSize: 12, marginTop: 3 }}>Complete the payment to process your deposit.</Text>
          </View>
        </View>

        {/* Timer */}
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Payment Instructions</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#555', fontSize: 12, flex: 1 }}>Complete payment within</Text>
          <Text style={{ color: timerColor, fontSize: 14, fontWeight: '700' }}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Instructions Card */}
        <View style={{ backgroundColor: '#161616', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          {/* Instruction 1 */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>1</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: '#555', fontSize: 12 }}>Transfer the exact amount of</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                PKR {(parsedAmount || DEPOSIT_MOCK.amount).toLocaleString()}.00
              </Text>
              <Text style={{ color: '#555', fontSize: 12 }}>to the account below.</Text>
            </View>
          </View>

          <View style={{ height: 0.5, backgroundColor: '#1e1e1e', marginVertical: 10 }} />

          {/* TradeIt Bank Details */}
          {([
            { label: 'Bank Name',        value: DEPOSIT_MOCK.tradeitBank,    highlight: false },
            { label: 'Account Title',    value: DEPOSIT_MOCK.tradeitTitle,   highlight: false },
            { label: 'Account Number',   value: DEPOSIT_MOCK.tradeitAccount, highlight: false },
            { label: 'IBAN',             value: DEPOSIT_MOCK.tradeitIBAN,    highlight: false },
            { label: 'Reference / Note', value: DEPOSIT_MOCK.reference,      highlight: true  },
          ] as const).map((detail) => (
            <View key={detail.label} style={{ paddingVertical: 5 }}>
              <Text style={{ color: '#555', fontSize: 11 }}>{detail.label}</Text>
              <Text style={{ color: detail.highlight ? '#f97316' : '#e0e0e0', fontSize: 12, fontWeight: '500', marginTop: 2 }}>
                {detail.value}
              </Text>
            </View>
          ))}

          <View style={{ height: 0.5, backgroundColor: '#1e1e1e', marginVertical: 10 }} />

          {/* Instruction 2 */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>2</Text>
            </View>
            <Text style={{ color: '#555', fontSize: 12, flex: 1, marginLeft: 10, marginTop: 2 }}>Use your registered bank account.</Text>
          </View>

          <View style={{ height: 0.5, backgroundColor: '#1e1e1e', marginVertical: 10 }} />

          {/* Instruction 3 */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>3</Text>
            </View>
            <Text style={{ color: '#555', fontSize: 12, flex: 1, marginLeft: 10, marginTop: 2 }}>
              After payment, click the button below to upload the receipt.
            </Text>
          </View>
        </View>

        {/* Upload Receipt */}
        <TouchableOpacity
          onPress={() => setStep(6)}
          style={{ marginTop: 14, marginBottom: 30, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#f97316', borderRadius: 100, paddingVertical: 15 }}
        >
          <Text style={{ color: '#f97316', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>Upload Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // ── Step 6: Success ─────────────────────────────────────────────────────────
  const renderStep6 = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20 }}>
      {/* Success Icon */}
      <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 20 }}>
        <View style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#0d2010', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark" size={36} color="#22c55e" />
          </View>
        </View>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 16 }}>Deposit Successful!</Text>
        <Text style={{ color: '#555', fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 24, lineHeight: 20 }}>
          Your deposit has been received{'\n'}and is being processed.
        </Text>
      </View>

      {/* Receipt Card */}
      <View style={{ backgroundColor: '#161616', borderRadius: 12, padding: 14 }}>
        {([
          { label: 'Amount',         value: displayAmount,                              style: {},                                        isStatus: false },
          { label: 'Method',         value: DEPOSIT_MOCK.method,                        style: {},                                        isStatus: false },
          { label: 'Bank',           value: `${selectedBankData.name} ${selectedBankData.number.slice(-4)}`, style: {},                  isStatus: false },
          { label: 'Transaction ID', value: DEPOSIT_MOCK.transactionId,                 style: { color: '#f97316', fontWeight: '600' },   isStatus: false },
          { label: 'Date & Time',    value: DEPOSIT_MOCK.dateTime,                      style: {},                                        isStatus: false },
          { label: 'Status',         value: 'Processing',                               style: {},                                        isStatus: true  },
        ] as const).map((row, idx, arr) => (
          <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: idx < arr.length - 1 ? 0.5 : 0, borderBottomColor: '#111111' }}>
            <Text style={{ color: '#555', fontSize: 12 }}>{row.label}</Text>
            {row.isStatus ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#f97316' }} />
                <Text style={{ color: '#f97316', fontSize: 12, fontWeight: '500' }}>Processing</Text>
              </View>
            ) : (
              <Text style={{ color: '#e0e0e0', fontSize: 12, fontWeight: '500', ...(row.style as object) }}>{row.value}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Info Notice */}
      <View style={{ backgroundColor: '#111111', borderRadius: 10, padding: 12, marginTop: 12, flexDirection: 'row', gap: 8 }}>
        <Ionicons name="information-circle-outline" size={14} color="#555" style={{ marginTop: 1 }} />
        <Text style={{ color: '#555', fontSize: 11, flex: 1 }}>
          {cashCredited
            ? `PKR ${parsedAmount.toLocaleString()} added to your buying power.${
                creditToFutures && marginCredited
                  ? ' Futures margin was also credited.'
                  : ''
              }`
            : 'Your funds will be added to your wallet once the payment is verified.'}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={{ marginTop: 20 }}>
        {creditToFutures && marginCredited && (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/futures')}
            style={{ backgroundColor: '#FF8A00', borderRadius: 100, paddingVertical: 15, marginBottom: 10 }}
          >
            <Text style={{ color: '#000', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>
              Trade Futures
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/portfolio')}
          style={{ backgroundColor: creditToFutures && marginCredited ? 'transparent' : '#f97316', borderWidth: creditToFutures && marginCredited ? 1.5 : 0, borderColor: '#f97316', borderRadius: 100, paddingVertical: 15, marginBottom: 10 }}
        >
          <Text style={{ color: creditToFutures && marginCredited ? '#f97316' : '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>View Portfolio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/home')}
          style={{ paddingVertical: 14, marginBottom: 30 }}
        >
          <Text style={{ color: '#888', fontSize: 14, fontWeight: '500', textAlign: 'center' }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ── Main Render ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0d0d0d' }} edges={['top']}>
      {renderNavBar()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step === 6 && renderStep6()}
    </SafeAreaView>
  );
}
