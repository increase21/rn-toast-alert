import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ToastOptions } from './types';

export interface ToastViewHandle {
  dismiss: () => void;
}

interface ToastViewProps {
  options: ToastOptions;
  onHidden: () => void;
}

const HIDDEN_DISTANCE = 220;
const SWIPE_THRESHOLD = 40;

export const ToastView = forwardRef<ToastViewHandle, ToastViewProps>(({ options, onHidden }, ref) => {
  const {
    title,
    body,
    icon,
    acceptButton,
    declineButton,
    onAccept,
    onDecline,
    hideOnAction,
    backgroundColor,
    textColor,
    titleColor,
    bodyColor,
    borderRadius,
    position = 'top',
    offset,
    duration = 0,
    swipeToDismiss,
    onPress,
    onShow,
    titleNumberOfLines,
    bodyNumberOfLines,
    containerStyle,
    titleStyle,
    bodyStyle,
    buttonsContainerStyle,
  } = options;

  const isTop = position === 'top';
  // 1 = hidden off screen, 0 = in place.
  const progress = useRef(new Animated.Value(1)).current;
  const drag = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissing = useRef(false);
  const mounted = useRef(true);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const dismiss = useCallback(() => {
    if (dismissing.current) return;
    dismissing.current = true;
    clearTimer();
    Animated.timing(progress, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
      if (mounted.current) onHidden();
    });
  }, [progress, onHidden]);

  const startTimer = useCallback(() => {
    clearTimer();
    if (duration > 0) timer.current = setTimeout(dismiss, duration);
  }, [duration, dismiss]);

  useImperativeHandle(ref, () => ({ dismiss }), [dismiss]);

  useEffect(() => {
    Animated.spring(progress, { toValue: 0, useNativeDriver: true, bounciness: 4, speed: 14 }).start(() => onShow?.());
    startTimer();
    return () => {
      mounted.current = false;
      clearTimer();
    };
    // Run once per toast; the host remounts this view for every Toast.show().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swiping toward the nearest screen edge dismisses; swiping the other way is resisted.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) => !!swipeToDismiss && Math.abs(g.dy) > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: clearTimer,
      onPanResponderMove: (_, g) => {
        const towardEdge = isTop ? g.dy < 0 : g.dy > 0;
        drag.setValue(towardEdge ? g.dy : g.dy * 0.2);
      },
      onPanResponderRelease: (_, g) => {
        const distance = isTop ? -g.dy : g.dy;
        if (distance > SWIPE_THRESHOLD) {
          dismiss();
        } else {
          Animated.spring(drag, { toValue: 0, useNativeDriver: true }).start();
          startTimer();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(drag, { toValue: 0, useNativeDriver: true }).start();
        startTimer();
      },
    }),
  ).current;

  const translateY = Animated.add(
    progress.interpolate({ inputRange: [0, 1], outputRange: [0, isTop ? -HIDDEN_DISTANCE : HIDDEN_DISTANCE] }),
    drag,
  );
  const opacity = progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0.4, 0] });

  const handleAction = (callback?: () => void) => () => {
    callback?.();
    if (hideOnAction) dismiss();
  };

  const hasButtons = acceptButton != null || declineButton != null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.wrapper,
        isTop ? { top: offset } : { bottom: offset },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={[styles.card, { backgroundColor, borderRadius }, containerStyle]}
      >
        <View style={styles.row}>
          {icon != null && <View style={styles.icon}>{icon}</View>}
          <View style={styles.text}>
            {!!title && (
              <Text numberOfLines={titleNumberOfLines} style={[styles.title, { color: titleColor ?? textColor }, titleStyle]}>
                {title}
              </Text>
            )}
            {!!body && (
              <Text
                numberOfLines={bodyNumberOfLines}
                style={[styles.body, { color: bodyColor ?? textColor }, !!title && styles.bodySpacing, bodyStyle]}
              >
                {body}
              </Text>
            )}
          </View>
        </View>
        {hasButtons && (
          <View style={[styles.buttons, buttonsContainerStyle]}>
            {declineButton != null && (
              <Pressable accessibilityRole="button" onPress={handleAction(onDecline)} hitSlop={6}>
                {declineButton}
              </Pressable>
            )}
            {acceptButton != null && (
              <Pressable
                accessibilityRole="button"
                onPress={handleAction(onAccept)}
                hitSlop={6}
                style={declineButton != null ? styles.buttonSpacing : undefined}
              >
                {acceptButton}
              </Pressable>
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
});

ToastView.displayName = 'ToastView';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 560,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.9,
  },
  bodySpacing: {
    marginTop: 2,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSpacing: {
    marginLeft: 10,
  },
});
