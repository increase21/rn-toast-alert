# @increase21/rn-toast-alert

A lightweight toast / alert for React Native with a title, body, custom left icon, and optional accept / decline buttons that you supply as your own components.

- Pure JS: no native code and no dependencies beyond `react` and `react-native`
- Shown imperatively with `Toast.show({...})` from anywhere in your app
- Icon and buttons are any React element (SVG, `<Image />`, custom views)
- Buttons render only when you pass them
- Top or bottom placement, auto-hide, swipe to dismiss
- Written in TypeScript

## Install

```sh
npm install @increase21/rn-toast-alert
# or
yarn add @increase21/rn-toast-alert
```

## Setup

Render `<ToastHost />` once, as the last child of your root component:

```tsx
import { ToastHost } from '@increase21/rn-toast-alert';

export default function App() {
  return (
    <>
      <Navigation />
      <ToastHost />
    </>
  );
}
```

## Usage

```tsx
import { Toast } from '@increase21/rn-toast-alert';

Toast.show({
  title: 'Saved',
  body: 'Your changes have been saved.',
});
```

### With an icon and action buttons

```tsx
import BellIcon from './assets/bell.svg'; // via react-native-svg-transformer

Toast.show({
  title: 'Friend request',
  body: 'Ada wants to connect with you.',
  icon: <BellIcon width={28} height={28} />,
  // or: icon: <Image source={require('./avatar.png')} style={{ width: 36, height: 36 }} />,

  backgroundColor: '#FFFFFF',
  titleColor: '#111827',
  bodyColor: '#4B5563',

  declineButton: <MyButton label="Decline" variant="secondary" />,
  acceptButton: <MyButton label="Accept" />,
  onDecline: () => rejectRequest(),
  onAccept: () => acceptRequest(),
});
```

Each button you pass is wrapped in a `Pressable` that calls `onAccept` / `onDecline` and then hides the toast. Pass `hideOnAction: false` to keep it open. Your button component does **not** need its own `onPress`. If it has one, the inner handler takes precedence.

When you pass buttons, the toast stays on screen until the user acts on it or swipes it away. Set `duration` to change this.

### Hiding programmatically

```ts
Toast.hide();
```

## API

### `Toast.show(options)`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | | Heading text |
| `body` | `string` | | Description text |
| `icon` | `ReactNode` | | Element shown on the left (SVG, Image, …) |
| `acceptButton` | `ReactNode` | | Accept button element. Shown only when provided |
| `declineButton` | `ReactNode` | | Decline button element. Shown only when provided |
| `onAccept` | `() => void` | | Called when the accept button is pressed |
| `onDecline` | `() => void` | | Called when the decline button is pressed |
| `hideOnAction` | `boolean` | `true` | Hide after a button is pressed |
| `backgroundColor` | `string` | `#1F2937` | Card background |
| `textColor` | `string` | `#FFFFFF` | Title and body color |
| `titleColor` | `string` | `textColor` | Title color override |
| `bodyColor` | `string` | `textColor` | Body color override |
| `borderRadius` | `number` | `12` | Card corner radius |
| `position` | `'top' \| 'bottom'` | `'top'` | Screen edge |
| `offset` | `number` | status bar aware | Distance from the edge |
| `duration` | `number` | `4000` (`0` with buttons) | Auto-hide delay in ms. `0` = stay until dismissed |
| `swipeToDismiss` | `boolean` | `true` | Swipe toward the edge to dismiss |
| `onPress` | `() => void` | | Tap on the card |
| `onShow` | `() => void` | | After the show animation |
| `onHide` | `() => void` | | After the toast is fully hidden |
| `titleNumberOfLines` | `number` | | Truncate the title |
| `bodyNumberOfLines` | `number` | | Truncate the body |
| `containerStyle` | `ViewStyle` | | Card style override |
| `titleStyle` | `TextStyle` | | Title style override |
| `bodyStyle` | `TextStyle` | | Body style override |
| `buttonsContainerStyle` | `ViewStyle` | | Button row style override |

Calling `show` while a toast is visible replaces it.

### `Toast.hide()`

Hides the toast that is currently visible.

### `<ToastHost defaultOptions={...} />`

`defaultOptions` lets you set app-wide defaults, such as your brand colors. Options passed to `Toast.show()` override them.

```tsx
<ToastHost defaultOptions={{ backgroundColor: '#0F172A', borderRadius: 16 }} />
```

### Modals

React Native `Modal`s render above your app's root view. To show toasts over a modal, render another `<ToastHost />` inside it. The most recently mounted host receives `Toast.show()` calls.

## License

MIT
