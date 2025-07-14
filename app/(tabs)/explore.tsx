import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/contexts/NotesContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';

const categoryColors = {
  'Personal': '#6C63FF',
  'Work': '#FF6B6B',
  'Study': '#4ECDC4',
  'Ideas': '#FFE66D',
  'Travel': '#95E1D3',
  'Health': '#F38181',
  'Kajian Rutin': '#FF9F43',
  'Meeting': '#54A0FF',
  'Project': '#5F27CD',
  'Default': '#6C6C80',
};

const categoryIcons = {
  'Personal': 'person',
  'Work': 'work',
  'Study': 'book',
  'Ideas': 'lightbulb-outline',
  'Travel': 'flight-takeoff',
  'Health': 'heart-health',
  'Kajian Rutin': 'book',
  'Meeting': 'groups',
  'Project': 'folder',
  'Default': 'description',
};

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { notes, loading, error, searchNotes, getNotesByCategory } = useNotes();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [categoryNotes, setCategoryNotes] = React.useState(notes);
  const [searchLoading, setSearchLoading] = React.useState(false);

  // Generate categories from user's notes
  const generateCategories = () => {
    const categoryCounts: { [key: string]: number } = {};
    
    notes.forEach(note => {
      categoryCounts[note.category] = (categoryCounts[note.category] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([name, count]) => ({
      id: name,
      name,
      icon: categoryIcons[name as keyof typeof categoryIcons] || 'description',
      color: categoryColors[name as keyof typeof categoryColors] || '#6C6C80',
      count,
    }));
  };

  const categories = generateCategories();

  // Get recent notes (last 5)
  const recentNotes = notes.slice(0, 5);

  const handleNotePress = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  const handleCategoryPress = async (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      setCategoryNotes(notes);
    } else {
      setSelectedCategory(categoryName);
      setSearchLoading(true);
      try {
        const categoryNotesData = await getNotesByCategory(categoryName);
        setCategoryNotes(categoryNotesData);
      } catch (error) {
        console.error('Error fetching category notes:', error);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchLoading(true);
      try {
        const results = await searchNotes(query);
        setCategoryNotes(results);
      } catch (error) {
        console.error('Error searching notes:', error);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setCategoryNotes(notes);
    }
  };

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={[
        styles.categoryCard,
        selectedCategory === item.name && { backgroundColor: item.color + '20' }
      ]}
      onPress={() => handleCategoryPress(item.name)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <MaterialIcons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.count} notes</Text>
    </TouchableOpacity>
  );

  const renderNote = ({ item }: { item: any }) => (
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
              <Text style={styles.noteCategory}>{item.category}</Text>
              <Text style={styles.noteDate}>{item.createdAt.toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading explore...</Text>
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
        <Text style={styles.title}>Explore</Text>
        {/* <TouchableOpacity>
          <Entypo name="dots-three-horizontal" color="black" style={styles.menuDots} />
        </TouchableOpacity> */}
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search notes, categories..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchBar}
        inputStyle={{ fontSize: 16 }}
      />

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `${selectedCategory} Notes` : 'Categories'}
        </Text>
        {categories.length > 0 ? (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="folder" size={48} color="#6C6C80" />
            <Text style={styles.emptyText}>No categories yet</Text>
            <Text style={styles.emptySubtext}>Create notes to see categories</Text>
          </View>
        )}
      </View>

      {/* Notes List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `${selectedCategory} Notes` : 'Recent Notes'}
        </Text>
        {searchLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6C63FF" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={categoryNotes}
            renderItem={renderNote}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="description" size={64} color="#6C6C80" />
                <Text style={styles.emptyTitle}>
                  {selectedCategory ? `No ${selectedCategory} notes` : 'No notes yet'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {selectedCategory ? 'Create notes in this category' : 'Create your first note to get started'}
                </Text>
              </View>
            }
          />
        )}
      </View>
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
    justifyContent: 'space-between',
    marginBottom: 18,
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
  searchBar: {
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22223B',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingRight: 18,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22223B',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6C6C80',
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
  noteCategory: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
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
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22223B',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6C6C80',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});
