import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';

export default function AuthScreen() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, name.trim());
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // For now, we'll show a placeholder implementation
      // In a production app, you would integrate with Google Sign-In SDK
      Alert.alert(
        'Google Sign-In',
        'Google Sign-In is configured but requires additional setup. Please use email/password for now.',
        [{ text: 'OK' }]
      );
      
      // Placeholder for actual Google Sign-In implementation
      // const idToken = await getGoogleIdToken();
      // await signInWithGoogle(idToken);
    } catch (error: any) {
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
      console.error('Google Sign-In error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SuperNotes</Text>
        <Text style={styles.subtitle}>Your personal note-taking app</Text>
      </View>

      <Card style={styles.authCard}>
        <Card.Content>
          <Text style={styles.authTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Button
            mode="contained"
            onPress={handleAuth}
            disabled={loading}
            style={styles.authButton}
            contentStyle={styles.authButtonContent}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </Button>

          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <Divider style={styles.divider} />
          </View>

          <Button
            mode="outlined"
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
            style={styles.googleButton}
            contentStyle={styles.googleButtonContent}
            icon="google"
          >
            {googleLoading ? (
              <ActivityIndicator color="#6C63FF" />
            ) : (
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            )}
          </Button>
          
          <TouchableOpacity
            onPress={() => setIsLogin(!isLogin)}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"
              }
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6C63FF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C6C80',
  },
  authCard: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#22223B',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  authButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    marginTop: 8,
  },
  authButtonContent: {
    paddingVertical: 8,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6C6C80',
    fontWeight: '500',
  },
  googleButton: {
    borderColor: '#6C63FF',
    borderWidth: 1,
    borderRadius: 12,
  },
  googleButtonContent: {
    paddingVertical: 8,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#6C63FF',
    textDecorationLine: 'underline',
  },
}); 