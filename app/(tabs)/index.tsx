// /app/(tabs)/index.tsx
import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions, View } from 'react-native';
import { Card, Title, ProgressBar, Text, Divider } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import StatusCard from '@/components/StatusCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from 'react-native-paper';
import VoiceAssistant from '@/components/VoiceAssistant';

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [roverData] = useState({
    battery: 85,
    connected: true,
    plantsScanned: 42,
    healthy: 32,
    mildInfection: 7,
    severeInfection: 3,
    pesticideUsed: 120,
    temperature: 28,
    humidity: 65,
  });
  const { user, logout } = useAuth();

  const infectionData = [
    { name: 'Healthy', population: roverData.healthy, color: colors.healthy || '#4CAF50' },
    { name: 'Mild', population: roverData.mildInfection, color: colors.mild || '#FFC107' },
    { name: 'Severe', population: roverData.severeInfection, color: colors.severe || '#F44336' }
  ];

  const healthyPercentage = Math.round((roverData.healthy / roverData.plantsScanned) * 100);
  const mildPercentage = Math.round((roverData.mildInfection / roverData.plantsScanned) * 100);
  const severePercentage = Math.round((roverData.severeInfection / roverData.plantsScanned) * 100);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* User Welcome Card */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <View style={styles.userContainer}>
              <Text variant="titleMedium" style={{ color: colors.text }}>
                👋 Welcome, {user?.name}
              </Text>
              <Button
                mode="outlined"
                onPress={logout}
                icon="logout"
                compact
              >
                Logout
              </Button>
            </View>
          </Card.Content>
        </Card>

        <StatusCard battery={roverData.battery} connected={roverData.connected} />

        {/* Plant Health Overview */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={{ color: colors.text, marginBottom: 16 }}>🌱 Plant Health Overview</Title>

            {/* Summary Stats */}
            <View style={styles.summaryRow}>
              <View style={[styles.statBox, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Text variant="titleMedium" style={styles.statNumber}>{roverData.plantsScanned}</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Total Scanned</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Text variant="titleMedium" style={styles.statNumber}>{healthyPercentage}%</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Healthy</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                <Text variant="titleMedium" style={styles.statNumber}>{mildPercentage}%</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Mild</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                <Text variant="titleMedium" style={styles.statNumber}>{severePercentage}%</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Severe</Text>
              </View>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            {/* Infection Chart */}
            <Title style={{ color: colors.text, marginBottom: 16, textAlign: 'center' }}>Infection Distribution</Title>
            <PieChart
              data={infectionData}
              width={Dimensions.get('window').width - 40}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={{ alignSelf: 'center' }} />
          </Card.Content>
        </Card>

        {/* Environmental Data */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={{ color: colors.text, marginBottom: 16 }}>🌡️ Environmental Data</Title>

            <View style={styles.envRow}>
              <View style={styles.envItem}>
                <Text variant="titleLarge" style={{ color: colors.text }}>{roverData.temperature}°C</Text>
                <Text variant="bodyMedium" style={{ color: colors.text }}>Temperature</Text>
              </View>
              <View style={styles.envItem}>
                <Text variant="titleLarge" style={{ color: colors.text }}>{roverData.humidity}%</Text>
                <Text variant="bodyMedium" style={{ color: colors.text }}>Humidity</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Spray Usage */}
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={{ color: colors.text, marginBottom: 16 }}>💧 Spray Usage</Title>
            <Text variant="titleMedium" style={{ marginBottom: 8, color: colors.text }}>
              Total Used: {roverData.pesticideUsed} ml
            </Text>
            <ProgressBar
              progress={roverData.pesticideUsed / 200}
              color={colors.healthy || '#4CAF50'}
              style={{ height: 12, borderRadius: 6 }} />
            <Text variant="bodySmall" style={{ marginTop: 8, textAlign: 'right', color: colors.text }}>
              200 ml capacity
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Voice Assistant */}
      <VoiceAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    flex: 1,
    margin: 4,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
  },
  envRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  envItem: {
    alignItems: 'center',
    padding: 16,
  },
});