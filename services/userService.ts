import { auth, db } from '@/lib/firebase';
import { User } from '@/types';
import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export const userService = {
  // Sign up with email and password
  async signUp(email: string, password: string, name: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      await setDoc(doc(db, USERS_COLLECTION, user.uid), {
        id: user.uid,
        name,
        email,
        createdAt: new Date(),
      });

      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  },

  // Get user data from Firestore
  async getUserData(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        } as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
}; 