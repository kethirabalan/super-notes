import { db } from '@/lib/firebase';
import { Note, NoteFormData } from '@/types';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';

const NOTES_COLLECTION = 'notes';

export const notesService = {
  // Get all notes for a user
  async getNotes(userId: string): Promise<Note[]> {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Note[];
    } catch (error) {
      console.error('Error getting notes:', error);
      throw error;
    }
  },

  // Get favorite notes for a user
  async getFavoriteNotes(userId: string): Promise<Note[]> {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId),
        where('isFavorite', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Note[];
    } catch (error) {
      console.error('Error getting favorite notes:', error);
      throw error;
    }
  },

  // Get notes by category
  async getNotesByCategory(userId: string, category: string): Promise<Note[]> {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId),
        where('label', '==', category),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Note[];
    } catch (error) {
      console.error('Error getting notes by category:', error);
      throw error;
    }
  },

  // Get a single note by ID
  async getNote(noteId: string): Promise<Note | null> {
    try {
      const docRef = doc(db, NOTES_COLLECTION, noteId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as Note;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting note:', error);
      throw error;
    }
  },

  // Create a new note
  async createNote(userId: string, noteData: NoteFormData): Promise<string> {
    try {
      const preview = noteData.content.substring(0, 100) + (noteData.content.length > 100 ? '...' : '');
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
        ...noteData,
        preview,
        date,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  // Update a note
  async updateNote(noteId: string, noteData: Partial<NoteFormData>): Promise<void> {
    try {
      const docRef = doc(db, NOTES_COLLECTION, noteId);
      
      const updateData: any = {
        ...noteData,
        updatedAt: serverTimestamp(),
      };

      // Update preview if content changed
      if (noteData.content) {
        updateData.preview = noteData.content.substring(0, 100) + (noteData.content.length > 100 ? '...' : '');
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<void> {
    try {
      const docRef = doc(db, NOTES_COLLECTION, noteId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  // Toggle favorite status
  async toggleFavorite(noteId: string, isFavorite: boolean): Promise<void> {
    try {
      const docRef = doc(db, NOTES_COLLECTION, noteId);
      await updateDoc(docRef, {
        isFavorite,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // Search notes
  async searchNotes(userId: string, searchTerm: string): Promise<Note[]> {
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const allNotes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Note[];

      // Filter notes based on search term
      return allNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching notes:', error);
      throw error;
    }
  },
}; 