import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { registerHost } from './Toast';
import { ToastView, ToastViewHandle } from './ToastView';
import type { ToastOptions } from './types';

export interface ToastHostProps {
  /** Defaults applied to every toast; options passed to Toast.show() win. */
  defaultOptions?: Partial<ToastOptions>;
}

const DEFAULT_OFFSET = Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 0) + 12;

const BASE_OPTIONS: ToastOptions = {
  backgroundColor: '#1F2937',
  textColor: '#FFFFFF',
  borderRadius: 12,
  position: 'top',
  offset: DEFAULT_OFFSET,
  hideOnAction: true,
  swipeToDismiss: true,
};

export function ToastHost({ defaultOptions }: ToastHostProps) {
  const [current, setCurrent] = useState<{ id: number; options: ToastOptions } | null>(null);
  const viewRef = useRef<ToastViewHandle>(null);
  const nextId = useRef(0);
  const defaultsRef = useRef(defaultOptions);
  defaultsRef.current = defaultOptions;

  const show = useCallback((options: ToastOptions) => {
    const merged: ToastOptions = { ...BASE_OPTIONS, ...defaultsRef.current, ...options };
    if (merged.duration === undefined) {
      const hasActions = merged.acceptButton != null || merged.declineButton != null;
      merged.duration = hasActions ? 0 : 4000;
    }
    nextId.current += 1;
    setCurrent({ id: nextId.current, options: merged });
  }, []);

  const hide = useCallback(() => {
    viewRef.current?.dismiss();
  }, []);

  const host = useMemo(() => ({ show, hide }), [show, hide]);
  useEffect(() => registerHost(host), [host]);

  const handleHidden = useCallback((id: number, onHide?: () => void) => {
    setCurrent((prev) => (prev?.id === id ? null : prev));
    onHide?.();
  }, []);

  if (!current) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <ToastView
        key={current.id}
        ref={viewRef}
        options={current.options}
        onHidden={() => handleHidden(current.id, current.options.onHide)}
      />
    </View>
  );
}
