// /components/StatusCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Text } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function StatusCard({ battery, connected }: { battery: number; connected: boolean }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Card style={[styles.card, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.statusRow}>
          <View>
            <Title style={{ color: colors.text }}>Rover Status</Title>
            <Paragraph style={{ color: colors.text }}>
              {connected ? '🟢 Connected' : '🔴 Disconnected'}
            </Paragraph>
          </View>
          <View style={styles.batteryContainer}>
            <Text style={{ color: colors.text }}>Battery: {battery}%</Text>
            <ProgressBar 
              progress={battery / 100} 
              color={battery > 20 ? colors.healthy : colors.severe}
              style={styles.batteryBar}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batteryContainer: {
    alignItems: 'flex-end',
  },
  batteryBar: {
    width: 100,
    height: 8,
    marginTop: 5,
  },
});