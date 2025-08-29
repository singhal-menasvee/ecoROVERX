// /components/StatusCard.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Text, Button, Modal, Portal } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function StatusCard({ battery, connected }: { battery: number; connected: boolean }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [roverStatus, setRoverStatus] = useState<'idle' | 'moving' | 'spraying'>('idle');

  const handleControlRover = (action: string) => {
    // This would connect to your rover's API/MQTT in real implementation
    console.log('Rover action:', action);
    
    switch (action) {
      case 'start':
        setRoverStatus('moving');
        break;
      case 'stop':
        setRoverStatus('idle');
        break;
      case 'spray':
        setRoverStatus('spraying');
        // Simulate spray completion after 3 seconds
        setTimeout(() => setRoverStatus('idle'), 3000);
        break;
      case 'home':
        setRoverStatus('moving');
        // Simulate return to home completion
        setTimeout(() => setRoverStatus('idle'), 5000);
        break;
    }
  };

  const getStatusIcon = () => {
    switch (roverStatus) {
      case 'moving': return '🚗';
      case 'spraying': return '💧';
      default: return connected ? '🟢' : '🔴';
    }
  };

  const getStatusText = () => {
    switch (roverStatus) {
      case 'moving': return 'Moving';
      case 'spraying': return 'Spraying';
      default: return connected ? 'Connected' : 'Disconnected';
    }
  };

  return (
    <>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.statusRow}>
            <View>
              <Title style={{ color: colors.text }}>Rover Status</Title>
              <Paragraph style={{ color: colors.text }}>
                {getStatusIcon()} {getStatusText()}
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

          {/* Control Button */}
          <Button 
            mode="contained" 
            onPress={() => setControlModalVisible(true)}
            style={styles.controlButton}
            icon="remote"
            disabled={!connected}
          >
            Control Rover
          </Button>
        </Card.Content>
      </Card>

      {/* Rover Control Modal */}
      <Portal>
        <Modal
          visible={controlModalVisible}
          onDismiss={() => setControlModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.background }]}
        >
          <View style={styles.modalContent}>
            <Text variant="titleLarge" style={{ color: colors.text, marginBottom: 20, textAlign: 'center' }}>
              🤖 Rover Remote Control
            </Text>

            {/* Status Indicator */}
            <View style={styles.statusIndicator}>
              <Text style={[styles.statusText, { color: colors.text }]}>
                Status: {getStatusText()} {getStatusIcon()}
              </Text>
            </View>

            {/* Control Buttons Grid */}
            <View style={styles.controlsGrid}>
              {/* Movement Controls */}
              <View style={styles.controlRow}>
                <TouchableOpacity 
                  style={[styles.controlButton, styles.directionButton]}
                  onPress={() => handleControlRover('forward')}
                >
                  <Ionicons name="arrow-up" size={24} color="white" />
                  <Text style={styles.buttonText}>Forward</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.controlRow}>
                <TouchableOpacity 
                  style={[styles.controlButton, styles.directionButton]}
                  onPress={() => handleControlRover('left')}
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                  <Text style={styles.buttonText}>Left</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.controlButton, styles.stopButton]}
                  onPress={() => handleControlRover('stop')}
                >
                  <Ionicons name="stop" size={24} color="white" />
                  <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.controlButton, styles.directionButton]}
                  onPress={() => handleControlRover('right')}
                >
                  <Ionicons name="arrow-forward" size={24} color="white" />
                  <Text style={styles.buttonText}>Right</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.controlRow}>
                <TouchableOpacity 
                  style={[styles.controlButton, styles.directionButton]}
                  onPress={() => handleControlRover('backward')}
                >
                  <Ionicons name="arrow-down" size={24} color="white" />
                  <Text style={styles.buttonText}>Backward</Text>
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.controlButton, styles.actionButton, { backgroundColor: '#2196F3' }]}
                  onPress={() => handleControlRover('spray')}
                >
                  <Ionicons name="water" size={20} color="white" />
                  <Text style={styles.buttonText}>Spray</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.controlButton, styles.actionButton, { backgroundColor: '#FF9800' }]}
                  onPress={() => handleControlRover('home')}
                >
                  <Ionicons name="home" size={20} color="white" />
                  <Text style={styles.buttonText}>Return Home</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Emergency Stop */}
            <TouchableOpacity 
              style={[styles.controlButton, styles.emergencyButton]}
              onPress={() => handleControlRover('emergency')}
            >
              <Ionicons name="alert-circle" size={20} color="white" />
              <Text style={styles.emergencyText}>EMERGENCY STOP</Text>
            </TouchableOpacity>

            <Button 
              mode="outlined" 
              onPress={() => setControlModalVisible(false)}
              style={styles.closeButton}
            >
              Close Controls
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  batteryContainer: {
    alignItems: 'flex-end',
  },
  batteryBar: {
    width: 100,
    height: 8,
    marginTop: 5,
    borderRadius: 4,
  },
  controlButton: {
    marginTop: 10,
    borderRadius: 8,
  },
  modal: {
    margin: 20,
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  statusIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  controlsGrid: {
    marginBottom: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    gap: 10,
  },
  directionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 80,
  },
  stopButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 80,
    marginHorizontal: 10,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },
  emergencyButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
    fontSize: 12,
  },
  emergencyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 10,
  },
});