import React, { useState, useEffect } from 'react';
import { Platform, View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import RoverMap from '@/components/RoverMap';

// Mock data types
interface Plant {
  id: string;
  latitude: number;
  longitude: number;
  status: 'healthy' | 'mild' | 'severe';
}

interface RoverPosition {
  latitude: number;
  longitude: number;
  heading: number;
}

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [roverPosition, setRoverPosition] = useState<RoverPosition>({
    latitude: 12.9716,
    longitude: 77.5946,
    heading: 0,
  });

  const [plants, setPlants] = useState<Plant[]>([]);
  const [roverPath, setRoverPath] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock data for demonstration
  useEffect(() => {
    const generateMockData = () => {
      // Generate random plants
      const mockPlants: Plant[] = Array.from({ length: 15 }, (_, i) => {
        const statuses: ('healthy' | 'mild' | 'severe')[] = ['healthy', 'mild', 'severe'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
          id: `plant-${i + 1}`,
          latitude: 12.9716 + (Math.random() - 0.5) * 0.005,
          longitude: 77.5946 + (Math.random() - 0.5) * 0.005,
          status: randomStatus,
        };
      });

      // Generate a mock path
      const mockPath = Array.from({ length: 10 }, (_, i) => ({
        latitude: 12.9712 + (i * 0.0005),
        longitude: 77.5942 + (i * 0.0003),
      }));

      setPlants(mockPlants);
      setRoverPath(mockPath);
      setIsLoading(false);
    };

    generateMockData();

    // Simulate rover movement
    const interval = setInterval(() => {
      setRoverPosition(prev => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0001,
        heading: (prev.heading + 5) % 360,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusCount = (status: string) => {
    return plants.filter(plant => plant.status === status).length;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.healthy} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading map data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={{ color: colors.text, marginBottom: 16, textAlign: 'center' }}>
            🗺️ Live Rover Tracking
          </Title>

          {/* Map Component */}
          {Platform.OS === 'web' ? (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 12, marginBottom: 16 }}>
              <Text style={{ color: colors.text }}>Map is not available on web.</Text>
            </View>
          ) : (
            <RoverMap 
              roverPosition={roverPosition} 
              plants={plants} 
              path={roverPath} 
            />
          )}

          {/* Rover Status */}
          <View style={styles.statusContainer}>
            <Text variant="titleMedium" style={{ color: colors.text, marginBottom: 12 }}>
              🤖 Rover Status
            </Text>
            <View style={styles.coordinates}>
              <Text style={{ color: colors.text }}>
                Lat: {roverPosition.latitude.toFixed(6)}
              </Text>
              <Text style={{ color: colors.text }}>
                Long: {roverPosition.longitude.toFixed(6)}
              </Text>
              <Text style={{ color: colors.text }}>
                Heading: {roverPosition.heading}°
              </Text>
            </View>
          </View>

          {/* Plant Statistics */}
          <View style={styles.statsContainer}>
            <Text variant="titleMedium" style={{ color: colors.text, marginBottom: 12 }}>
              🌿 Plant Statistics
            </Text>
            <View style={styles.statsRow}>
              <View style={[styles.statItem, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Text style={[styles.statNumber, { color: colors.healthy }]}>
                  {getStatusCount('healthy')}
                </Text>
                <Text style={{ color: colors.text }}>Healthy</Text>
              </View>
              <View style={[styles.statItem, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                <Text style={[styles.statNumber, { color: colors.mild }]}>
                  {getStatusCount('mild')}
                </Text>
                <Text style={{ color: colors.text }}>Mild</Text>
              </View>
              <View style={[styles.statItem, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                <Text style={[styles.statNumber, { color: colors.severe }]}>
                  {getStatusCount('severe')}
                </Text>
                <Text style={{ color: colors.text }}>Severe</Text>
              </View>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <Text variant="titleMedium" style={{ color: colors.text, marginBottom: 12 }}>
              Legend
            </Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={{ color: colors.text }}>✅ Healthy</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
              <Text style={{ color: colors.text }}>💬 Mild Infection</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <Text style={{ color: colors.text }}>🔴 Severe Infection</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
              <Text style={{ color: colors.text }}>🤖 Rover Position</Text>
            </View>
          </View>

          {/* Control Buttons */}
          <View style={styles.controls}>
            <Button mode="contained" style={styles.button} icon="play">
              Start Mission
            </Button>
            <Button mode="outlined" style={styles.button} icon="pause">
              Pause
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
  },
  statusContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  coordinates: {
    gap: 8,
  },
  statsContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  legendContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});