import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ToastPosition = 'top' | 'bottom';

export interface ToastOptions {
  /** Bold heading text. */
  title?: string;
  /** Secondary description text. */
  body?: string;

  /** Rendered on the left of the text, e.g. an <Image /> or an SVG component. */
  icon?: ReactNode;

  /** Rendered as the accept action. Only shown when provided. */
  acceptButton?: ReactNode;
  /** Rendered as the decline action. Only shown when provided. */
  declineButton?: ReactNode;
  /** Called when the accept button is pressed. */
  onAccept?: () => void;
  /** Called when the decline button is pressed. */
  onDecline?: () => void;
  /** Hide the toast after an action button is pressed. Default: true. */
  hideOnAction?: boolean;

  /** Card background color. Default: '#1F2937'. */
  backgroundColor?: string;
  /** Color for both title and body unless overridden below. Default: '#FFFFFF'. */
  textColor?: string;
  /** Overrides textColor for the title. */
  titleColor?: string;
  /** Overrides textColor for the body. */
  bodyColor?: string;
  /** Card corner radius. Default: 12. */
  borderRadius?: number;

  /** Where the toast appears. Default: 'top'. */
  position?: ToastPosition;
  /** Distance from the top/bottom edge of the screen. */
  offset?: number;
  /**
   * How long the toast stays visible in ms. 0 keeps it until dismissed.
   * Default: 4000, or 0 when action buttons are provided.
   */
  duration?: number;
  /** Allow swiping the toast off screen. Default: true. */
  swipeToDismiss?: boolean;

  /** Called when the toast body is tapped. */
  onPress?: () => void;
  /** Called once the show animation finishes. */
  onShow?: () => void;
  /** Called once the toast is fully hidden. */
  onHide?: () => void;

  titleNumberOfLines?: number;
  bodyNumberOfLines?: number;

  /** Style overrides. */
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  bodyStyle?: StyleProp<TextStyle>;
  buttonsContainerStyle?: StyleProp<ViewStyle>;
}

export interface ToastHostRef {
  show: (options: ToastOptions) => void;
  hide: () => void;
}
