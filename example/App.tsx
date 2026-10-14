import React from 'react';
import { Button, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Toast, ToastHost } from '../src';

const Pill = ({ label, color, textColor }: { label: string; color: string; textColor: string }) => (
  <View style={[styles.pill, { backgroundColor: color }]}>
    <Text style={[styles.pillText, { color: textColor }]}>{label}</Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Simple toast"
        onPress={() =>
          Toast.show({
            title: 'Saved',
            body: 'Your changes have been saved.',
            backgroundColor: '#065F46',
            textColor: '#ECFDF5',
          })
        }
      />

      <Button
        title="Alert with actions"
        onPress={() =>
          Toast.show({
            title: 'Incoming call',
            body: 'Ada Lovelace is calling you.',
            icon: <Image source={{ uri: 'https://i.pravatar.cc/80' }} style={styles.avatar} />,
            backgroundColor: '#FFFFFF',
            titleColor: '#111827',
            bodyColor: '#4B5563',
            declineButton: <Pill label="Decline" color="#FEE2E2" textColor="#B91C1C" />,
            acceptButton: <Pill label="Accept" color="#16A34A" textColor="#FFFFFF" />,
            onDecline: () => console.log('declined'),
            onAccept: () => console.log('accepted'),
          })
        }
      />

      <Button
        title="Bottom toast"
        onPress={() =>
          Toast.show({
            title: 'Connection lost',
            body: 'Retrying in 5 seconds…',
            position: 'bottom',
            offset: 40,
            backgroundColor: '#7F1D1D',
            duration: 2500,
          })
        }
      />

      {/* Render once, after the rest of your app. */}
      <ToastHost />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  pillText: { fontWeight: '600' },
});
