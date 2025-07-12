import { notesService } from '@/services/notesService';
import { Note, NoteFormData } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface NotesContextType {
  notes: Note[];
  favoriteNotes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  fetchFavoriteNotes: () => Promise<void>;
  createNote: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<string>;
  updateNote: (noteId: string, noteData: Partial<NoteFormData>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  toggleFavorite: (noteId: string, isFavorite: boolean) => Promise<void>;
  searchNotes: (searchTerm: string) => Promise<Note[]>;
  getNotesByCategory: (category: string) => Promise<Note[]>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedNotes = await notesService.getNotes(user.uid);
      setNotes(fetchedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedFavorites = await notesService.getFavoriteNotes(user.uid);
      setFavoriteNotes(fetchedFavorites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorite notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> => {
    if (!user) throw new Error('No user logged in');
    
    setError(null);
    
    try {
      const noteId = await notesService.createNote(user.uid, noteData);
      await fetchNotes(); // Refresh notes list
      return noteId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    }
  };

  const updateNote = async (noteId: string, noteData: Partial<NoteFormData>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    setError(null);
    
    try {
      await notesService.updateNote(noteId, noteData);
      await fetchNotes(); // Refresh notes list
      await fetchFavoriteNotes(); // Refresh favorites if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    }
  };

  const deleteNote = async (noteId: string): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    setError(null);
    
    try {
      await notesService.deleteNote(noteId);
      await fetchNotes(); // Refresh notes list
      await fetchFavoriteNotes(); // Refresh favorites if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    }
  };

  const toggleFavorite = async (noteId: string, isFavorite: boolean): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    setError(null);
    
    try {
      await notesService.toggleFavorite(noteId, isFavorite);
      await fetchNotes(); // Refresh notes list
      await fetchFavoriteNotes(); // Refresh favorites if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite');
      throw err;
    }
  };

  const searchNotes = async (searchTerm: string): Promise<Note[]> => {
    if (!user) return [];
    
    setError(null);
    
    try {
      return await notesService.searchNotes(user.uid, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search notes');
      return [];
    }
  };

  const getNotesByCategory = async (category: string): Promise<Note[]> => {
    if (!user) return [];
    
    setError(null);
    
    try {
      return await notesService.getNotesByCategory(user.uid, category);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get notes by category');
      return [];
    }
  };

  // Fetch notes when user changes
  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchFavoriteNotes();
    } else {
      setNotes([]);
      setFavoriteNotes([]);
    }
  }, [user]);

  const value = {
    notes,
    favoriteNotes,
    loading,
    error,
    fetchNotes,
    fetchFavoriteNotes,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    searchNotes,
    getNotesByCategory,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}; 