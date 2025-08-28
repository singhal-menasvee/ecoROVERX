// /components/RoverMap.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';


// Define types for our data
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

interface RoverMapProps {
  roverPosition: RoverPosition;
  plants: Plant[];
  path: Array<{ latitude: number; longitude: number }>;
}

export default function RoverMap({ roverPosition, plants, path }: RoverMapProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Default location (you can set this to your college/farm location)
  const defaultRegion = {
    latitude: 12.9716, // Example: Bangalore coordinates
    longitude: 77.5946,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const getPlantIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'mild': return '💬';
      case 'severe': return '🔴';
      default: return '🌿';
    }
  };

  const getPlantColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#4CAF50';
      case 'mild': return '#FFC107';
      case 'severe': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={defaultRegion}
        region={{
          ...defaultRegion,
          latitude: roverPosition.latitude || defaultRegion.latitude,
          longitude: roverPosition.longitude || defaultRegion.longitude,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Rover Marker */}
        {roverPosition && (
          <Marker
            coordinate={{
              latitude: roverPosition.latitude,
              longitude: roverPosition.longitude,
            }}
            title="Rover"
            description="Current rover position"
          >
            <View style={styles.roverMarker}>
              <Text style={styles.roverText}>🤖</Text>
            </View>
          </Marker>
        )}

        {/* Plant Markers */}
        {plants.map((plant) => (
          <Marker
            key={plant.id}
            coordinate={{
              latitude: plant.latitude,
              longitude: plant.longitude,
            }}
            title={`Plant ${plant.id}`}
            description={`Status: ${plant.status}`}
          >
            <View style={[styles.plantMarker, { backgroundColor: getPlantColor(plant.status) }]}>
              <Text style={styles.plantText}>{getPlantIcon(plant.status)}</Text>
            </View>
          </Marker>
        ))}

        {/* Rover Path */}
        {path.length > 1 && (
          <Polyline
            coordinates={path}
            strokeColor="#2196F3"
            strokeWidth={3}
            lineDashPattern={[0]}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    marginVertical: 16,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  roverMarker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  roverText: {
    fontSize: 16,
  },
  plantMarker: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  plantText: {
    fontSize: 14,
  },
});