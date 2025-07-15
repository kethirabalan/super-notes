import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/contexts/NotesContext';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Divider, List, Button as PaperButton } from 'react-native-paper';

const settingsOptions = [
  { title: 'Account Settings', icon: 'user' as const, subtitle: 'Manage your account', route: 'settings/AccountSettings' },
  { title: 'Appearance', icon: 'palette' as const, subtitle: 'Theme and display', route: 'settings/Appearance' },
  { title: 'Notifications', icon: 'bell' as const, subtitle: 'Push notifications', route: 'settings/Notifications' },
  { title: 'Privacy & Security', icon: 'lock' as const, subtitle: 'Data and privacy', route: 'settings/PrivacySecurity' },
  { title: 'Storage', icon: 'database' as const, subtitle: 'Manage storage space', route: 'settings/Storage' },
  { title: 'Help & Support', icon: 'help' as const, subtitle: 'Get help', route: 'settings/HelpSupport' },
  { title: 'About', icon: 'info' as const, subtitle: 'App version 1.0.0', route: 'settings/About' },
];

function EditProfileScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const { userData, updateUserData } = useAuth();
  const [name, setName] = useState(userData?.name || '');
  const [avatar, setAvatar] = useState(userData?.avatar || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserData({ name, avatar });
      navigation.goBack();
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FB', padding: 24 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>
      <Card style={{ borderRadius: 20, padding: 24, backgroundColor: '#fff', elevation: 4 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Avatar.Image size={80} source={{ uri: avatar || 'https://randomuser.me/api/portraits/men/36.jpg' }} />
        </View>
        <Divider style={{ marginBottom: 24 }} />
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#22223B' }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          style={{
            backgroundColor: '#F8F9FB',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#E0E0E0',
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#22223B' }}>Avatar URL</Text>
        <TextInput
          value={avatar}
          onChangeText={setAvatar}
          placeholder="Paste image URL"
          style={{
            backgroundColor: '#F8F9FB',
            borderRadius: 12,
            padding: 16,
            marginBottom: 28,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#E0E0E0',
          }}
        />
        <PaperButton
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={{ borderRadius: 12, backgroundColor: '#6C63FF', marginTop: 8 }}
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ fontSize: 16, fontWeight: '600', color: '#fff' }}
        >
          Save Changes
        </PaperButton>
      </Card>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, userData, signOut } = useAuth();
  const { notes, favoriteNotes, loading } = useNotes();
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  const handleLogout = async () => {
    try {
      await signOut();
      navigation.navigate('auth' as never);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Calculate user stats
  const userStats = [
    { 
      label: 'Total Notes', 
      value: notes.length.toString(), 
      icon: 'text' as const 
    },
    { 
      label: 'Favorites', 
      value: favoriteNotes.length.toString(), 
      icon: 'heart' as const 
    },
    { 
      label: 'Categories', 
      value: [...new Set(notes.map(note => note.category))].length.toString(), 
      icon: 'folder' as const 
    },
    { 
      label: 'Days Active', 
      value: userData?.createdAt ? 
        Math.ceil((new Date().getTime() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24)).toString() : 
        '1', 
      icon: 'calendar' as const 
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (editing) {
    return <EditProfileScreen navigation={{ goBack: () => setEditing(false) }} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        {/* <TouchableOpacity>
          <Entypo name="dots-three-horizontal" color="black" style={styles.menuDots} />
        </TouchableOpacity> */}
      </View>

      {/* User Info Card */}
      <Card style={styles.userCard}>
        <View style={styles.userInfo}>
          <Avatar.Image 
            size={80} 
            source={{ uri: userData?.avatar || user?.photoURL || 'https://randomuser.me/api/portraits/men/36.jpg' }} 
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userData?.name || user?.displayName || 'User'}</Text>
            <Text style={styles.userEmail}>{userData?.email || user?.email || 'user@example.com'}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        {userStats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <View style={styles.statContent}>
              <Entypo name={stat.icon} size={24} color="#6C63FF" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </Card>
        ))}
      </View>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settingsOptions.map((option, index) => (
           <View key={index}>
            <List.Item
              title={option.title}
              description={option.subtitle}
              left={(props) => <Entypo name={option.icon} size={24} color="#6C6C80" style={{ marginRight: 8 }} />}
              right={(props) => <Entypo name="chevron-right" size={20} color="#B5B5B5" />}
              titleStyle={styles.settingTitle}
              descriptionStyle={styles.settingSubtitle}
              style={styles.settingItem}
              onPress={() => navigation.navigate(option.route as never)}
            />
            {index < settingsOptions.length - 1 && <Divider />}
          </View> 
        ))}
      </Card>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, { marginBottom: 32 }]} onPress={handleLogout}>
        <Entypo name="log-out" size={20} color="#FF6B6B" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 18,
    paddingTop: 44,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C6C80',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#22223B',
    fontFamily: 'System',
  },
  menuDots: {
    fontSize: 22,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 36,
    height: 36,
    padding: 6
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  userCard: {
    borderRadius: 18,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  userDetails: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22223B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6C6C80',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#6C63FF',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22223B',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C6C80',
    textAlign: 'center',
  },
  settingsCard: {
    borderRadius: 18,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22223B',
    padding: 20,
    paddingBottom: 12,
  },
  settingItem: {
    paddingVertical: 4,
    padding: 20,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22223B',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6C6C80',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 