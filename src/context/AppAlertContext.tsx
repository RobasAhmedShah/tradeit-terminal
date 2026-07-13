import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type AppAlertButtonStyle = 'default' | 'cancel' | 'destructive';

export interface AppAlertButton {
  text: string;
  style?: AppAlertButtonStyle;
  onPress?: () => void;
}

export type AppAlertTone = 'info' | 'success' | 'warning' | 'error';

interface AppAlertOptions {
  tone?: AppAlertTone;
}

interface AppAlertState {
  title: string;
  message?: string;
  buttons: AppAlertButton[];
  tone: AppAlertTone;
}

interface AppAlertContextType {
  showAlert: (
    title: string,
    message?: string,
    buttons?: AppAlertButton[],
    options?: AppAlertOptions
  ) => void;
}

const AppAlertContext = createContext<AppAlertContextType>({
  showAlert: () => {},
});

const TONE_META: Record<AppAlertTone, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  info: { icon: 'information-circle', color: '#FF8A00', bg: '#FF8A0015' },
  success: { icon: 'checkmark-circle', color: '#0ECB81', bg: '#0ECB8115' },
  warning: { icon: 'warning', color: '#FBBF24', bg: '#FBBF2415' },
  error: { icon: 'alert-circle', color: '#F6465D', bg: '#F6465D15' },
};

export const AppAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<AppAlertState | null>(null);
  const closingRef = useRef(false);

  const showAlert = useCallback(
    (title: string, message?: string, buttons?: AppAlertButton[], options?: AppAlertOptions) => {
      closingRef.current = false;
      setState({
        title,
        message,
        buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK', style: 'default' }],
        tone: options?.tone ?? 'info',
      });
      setVisible(true);
    },
    []
  );

  const dismiss = useCallback((onPress?: () => void) => {
    if (closingRef.current) return;
    closingRef.current = true;
    setVisible(false);
    setTimeout(() => {
      onPress?.();
    }, 120);
  }, []);

  const tone = state ? TONE_META[state.tone] : TONE_META.info;
  const buttons = state?.buttons ?? [];
  const isRow = buttons.length === 2;

  return (
    <AppAlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => dismiss()}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-10">
          <View className="w-full bg-app-sheet rounded-2xl border border-app-border overflow-hidden">
            <View className="items-center pt-6 px-5">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: tone.bg }}
              >
                <Ionicons name={tone.icon} size={26} color={tone.color} />
              </View>
              <Text className="text-app-text text-[16px] font-bold text-center">{state?.title}</Text>
              {state?.message ? (
                <Text className="text-app-muted text-[13px] text-center mt-2 leading-5">
                  {state.message}
                </Text>
              ) : null}
            </View>

            <View className={`mt-5 ${isRow ? 'flex-row' : ''} border-t border-app-border`}>
              {buttons.map((btn, idx) => {
                const color =
                  btn.style === 'destructive'
                    ? '#F6465D'
                    : btn.style === 'cancel'
                      ? '#9CA3AF'
                      : '#FF8A00';
                return (
                  <TouchableOpacity
                    key={`${btn.text}-${idx}`}
                    onPress={() => dismiss(btn.onPress)}
                    activeOpacity={0.7}
                    className={`py-4 items-center justify-center ${isRow ? 'flex-1' : ''} ${
                      isRow && idx === 1 ? 'border-l border-app-border' : ''
                    } ${!isRow && idx > 0 ? 'border-t border-app-border' : ''}`}
                  >
                    <Text
                      className="text-[15px]"
                      style={{ color, fontWeight: btn.style === 'cancel' ? '500' : '700' }}
                    >
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AppAlertContext.Provider>
  );
};

export const useAppAlert = () => useContext(AppAlertContext);
