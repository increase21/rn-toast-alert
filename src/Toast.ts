import type { ToastHostRef, ToastOptions } from './types';

// Mounted hosts, most recent last. The latest host receives calls, so a
// <ToastHost /> rendered inside a Modal takes over while that Modal is open.
const hosts: ToastHostRef[] = [];

export function registerHost(host: ToastHostRef): () => void {
  hosts.push(host);
  return () => {
    const index = hosts.indexOf(host);
    if (index !== -1) hosts.splice(index, 1);
  };
}

function activeHost(): ToastHostRef | undefined {
  const host = hosts[hosts.length - 1];
  if (!host && __DEV__) {
    console.warn('[@increase21/rn-toast-alert] No <ToastHost /> is mounted. Render it once at the root of your app.');
  }
  return host;
}

export const Toast = {
  /** Show a toast. Replaces any toast currently on screen. */
  show(options: ToastOptions): void {
    activeHost()?.show(options);
  },
  /** Hide the toast currently on screen. */
  hide(): void {
    activeHost()?.hide();
  },
};
