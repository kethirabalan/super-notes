import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function Storage() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('profile' as never)}>
      <MaterialIcons name="arrow-back" size={24} color="#007AFF" /> 
      </TouchableOpacity>
      <Text style={styles.title}>Storage</Text>
      <Text>Manage storage space.</Text>
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