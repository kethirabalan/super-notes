import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Divider, List } from 'react-native-paper';

const userStats = [
  { label: 'Total Notes', value: '24', icon: 'text' as const },
  { label: 'Favorites', value: '8', icon: 'heart' as const },
  { label: 'Categories', value: '5', icon: 'folder' as const },
  { label: 'Days Active', value: '12', icon: 'calendar' as const },
];

const settingsOptions = [
  { title: 'Account Settings', icon: 'user' as const, subtitle: 'Manage your account' },
  { title: 'Appearance', icon: 'palette' as const, subtitle: 'Theme and display' },
  { title: 'Notifications', icon: 'bell' as const, subtitle: 'Push notifications' },
  { title: 'Privacy & Security', icon: 'lock' as const, subtitle: 'Data and privacy' },
  { title: 'Storage', icon: 'database' as const, subtitle: 'Manage storage space' },
  { title: 'Help & Support', icon: 'help' as const, subtitle: 'Get help' },
  { title: 'About', icon: 'info' as const, subtitle: 'App version 1.0.0' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" color="black" style={styles.menuDots} />
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <Card style={styles.userCard}>
        <View style={styles.userInfo}>
          <Avatar.Image 
            size={80} 
            source={{ uri: 'https://randomuser.me/api/portraits/men/36.jpg' }} 
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
            <TouchableOpacity style={styles.editButton}>
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
          <React.Fragment key={index}>
            <List.Item
              title={option.title}
              description={option.subtitle}
              left={(props) => <Entypo name={option.icon} size={24} color="#6C6C80" style={{ marginRight: 8 }} />}
              right={(props) => <Entypo name="chevron-right" size={20} color="#B5B5B5" />}
              titleStyle={styles.settingTitle}
              descriptionStyle={styles.settingSubtitle}
              style={styles.settingItem}
            />
            {index < settingsOptions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
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