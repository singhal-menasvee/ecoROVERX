// /app/register.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Title } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { register, isLoading } = useAuth();
  const router = useRouter();
  
  const { control, handleSubmit, formState: { errors }, watch, setError } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.name, data.email, data.password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setError('root', { message: error.message || 'Registration failed' });
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
            <Title style={[styles.title, { color: colors.text }]}>Create Account</Title>
            <Text style={[styles.subtitle, { color: colors.text }]}>Join ecoROVERX</Text>

            <Controller
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Full Name"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.name}
                  style={styles.input}
                />
              )}
              name="name"
            />
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

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

            <Controller
              control={control}
              rules={{
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Confirm Password"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.confirmPassword}
                  secureTextEntry
                  style={styles.input}
                />
              )}
              name="confirmPassword"
            />
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

            {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Create Account
            </Button>

            <View style={styles.loginContainer}>
              <Text style={{ color: colors.text }}>Already have an account? </Text>
              <Link href="./login" asChild>
                <TouchableOpacity>
                  <Text style={[styles.loginLink, { color: colors.healthy }]}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </Link>
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
    fontSize: 24,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    fontWeight: 'bold',
  },
});