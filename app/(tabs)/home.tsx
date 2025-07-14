
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/contexts/NotesContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, FAB, Searchbar } from 'react-native-paper';

export default function HomeScreen() {
  const router = useRouter();
  const { userData } = useAuth();
  const { notes, loading, error, searchNotes } = useNotes();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredNotes, setFilteredNotes] = React.useState(notes);

  const handleNotePress = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  const handleCreateNote = () => {
    router.push('/create-note');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await searchNotes(query);
      setFilteredNotes(results);
    } else {
      setFilteredNotes(notes);
    }
  };

  // Update filtered notes when notes change
  React.useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading notes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar.Image 
          size={44} 
          source={{ uri: userData?.avatar || userData?.image || 'https://randomuser.me/api/portraits/men/36.jpg' }} 
        />
        <Text style={styles.title}>My Notes</Text>
        {/* <TouchableOpacity>
        <MaterialIcons name="dots-three-horizontal" color="black" style={styles.menuDots} />
        </TouchableOpacity> */}
      </View>
      
      {/* Search Bar */}
      <Searchbar
        placeholder="Search Note..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchBar}
        inputStyle={{ fontSize: 16 }}
      />
      
      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Card style={styles.noteCard}>
            <TouchableOpacity onPress={() => handleNotePress(item.id)}>
              <View style={styles.cardContent}>
                <Image 
                  source={{ uri: item.image || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2' }} 
                  style={styles.cardImage} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.notePreview} numberOfLines={2}>{item.preview}</Text>
                  <View style={styles.noteFooter}>
                    <Text style={styles.noteLabel}>{item.category}</Text>
                    <Text style={styles.noteDate}>{item.createdAt.toLocaleDateString()}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        )}
        style={{ marginTop: 10 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="description" size={64} color="#6C6C80" />
            <Text style={styles.emptyTitle}>No notes yet</Text>
            <Text style={styles.emptySubtitle}>Create your first note to get started</Text>
          </View>
        }
      />
      
      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={handleCreateNote}
      />
    </View>
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
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#22223B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6C6C80',
    textAlign: 'center',
  },
}); 
