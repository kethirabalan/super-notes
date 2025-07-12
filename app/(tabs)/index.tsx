
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, FAB, Searchbar } from 'react-native-paper';

const notes = [
  {
    id: '1',
    title: 'Wishlist Buku Yang Harus Dibaca Untuk...',
    preview: 'Mencapai perkembangan diri adalah perjalanan...',
    label: 'Personal',
    date: 'November 7, 2024',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  },
  {
    id: '2',
    title: 'Tadzkirotussami’ Wal Mutakallim F...',
    preview: 'Pertemuan pertama yang merupakan sesi muqaddimah dari kajian...',
    label: 'Kajian Rutin',
    date: 'November 6, 2024',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  },
  // Add more notes as needed
];

export default function HomeScreen() {
  //   

  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar.Image size={44} source={{ uri: 'https://randomuser.me/api/portraits/men/36.jpg' }} />
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity>
        <Entypo name="dots-three-horizontal" color="black" style={styles.menuDots} />
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search Note..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        inputStyle={{ fontSize: 16 }}
      />
      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Card style={styles.noteCard}>
            <TouchableOpacity>
              <View style={styles.cardContent}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.notePreview} numberOfLines={2}>{item.preview}</Text>
                  <View style={styles.noteFooter}>
                    <Text style={styles.noteLabel}>{item.label}</Text>
                    <Text style={styles.noteDate}>{item.date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        )}
        style={{ marginTop: 10 }}
      />
      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() => { }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 18,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    color: '#22223B',
    marginLeft: 16,
    fontFamily: 'System',
  },
  

  menuDots: {
    fontSize: 22,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius:50,
    width: 36,
    height: 36,
    padding: 6
  },
  searchBar: {
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  noteCard: {
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    padding: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  cardImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: '#EEE',
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#22223B',
    marginBottom: 2,
  },
  notePreview: {
    fontSize: 14,
    color: '#6C6C80',
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  noteLabel: {
    fontSize: 12,
    color: '#6C63FF',
    backgroundColor: '#F3F0FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    fontWeight: '600',
  },
  noteDate: {
    fontSize: 12,
    color: '#B5B5B5',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#6C63FF',
    borderRadius: 32,
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
}); 
