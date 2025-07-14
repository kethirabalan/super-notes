import { useAuth } from '@/contexts/AuthContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function AccountSettings() {
  const { deleteAccount, signOut } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteAccount();
              await signOut();
              navigation.navigate('auth' as never);
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Failed to delete account.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('profile' as never)}>
      <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Account Settings</Text>
      <Text>Manage your account here.</Text>
      <Button
        mode="contained"
        onPress={handleDelete}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 40, backgroundColor: '#FF6B6B', borderRadius: 8 }}
        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
      >
        Delete Account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
}); 