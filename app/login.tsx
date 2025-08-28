// /app/login.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Title } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login, isLoading } = useAuth();
  const router = useRouter();
  
  const { control, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>({
    defaultValues: {
      email: 'demo@farmer.com',
      password: 'password'
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setError('root', { message: error.message || 'Login failed' });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={[styles.title, { color: colors.text }]}>🌱 ecoROVERX</Title>
            <Text style={[styles.subtitle, { color: colors.text }]}>Sign in to your dashboard</Text>

            <Controller
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.email}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
              name="email"
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Controller
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Password"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.password}
                  secureTextEntry
                  style={styles.input}
                />
              )}
              name="password"
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Sign In
            </Button>

            <View style={styles.registerContainer}>
              <Text style={{ color: colors.text }}>Don't have an account? </Text>
              <Link href="./register" asChild>
                <TouchableOpacity>
                  <Text style={[styles.registerLink, { color: colors.healthy }]}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={[styles.demoText, { color: colors.text }]}>
                Demo credentials:{'\n'}
                Email: demo@farmer.com{'\n'}
                Password: password
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  input: {
    marginBottom: 8,
  },
  error: {
    color: '#F44336',
    marginBottom: 12,
    fontSize: 12,
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerLink: {
    fontWeight: 'bold',
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  demoText: {
    textAlign: 'center',
    fontSize: 12,
  },
});