import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { globalErrorHandler } from '../lib/errorHandler';
import { auth, db } from '../lib/firebase';
import { performanceMonitor } from '../lib/performance';
import { User } from '../types';

export class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async registerWithEmail(email: string, password: string, name: string): Promise<User> {
    performanceMonitor.startTimer('register_with_email');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with display name
      await updateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        name,
        email,
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      const user: User = {
        id: firebaseUser.uid,
        ...userData
      };

      performanceMonitor.endTimer('register_with_email', { success: true, userId: user.id });
      return user;
    } catch (error: any) {
      const duration = performanceMonitor.endTimer('register_with_email', { success: false });
      globalErrorHandler.logError(error, 'UserService.registerWithEmail');
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      
      throw new Error('Failed to create account. Please try again.');
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    performanceMonitor.startTimer('sign_in_with_email');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found.');
      }

      const userData = userDoc.data();
      const user: User = {
        id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        createdAt: userData.createdAt?.toDate() || new Date()
      };

      performanceMonitor.endTimer('sign_in_with_email', { success: true, userId: user.id });
      return user;
    } catch (error: any) {
      const duration = performanceMonitor.endTimer('sign_in_with_email', { success: false });
      globalErrorHandler.logError(error, 'UserService.signInWithEmail');
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      
      throw new Error('Failed to sign in. Please check your credentials and try again.');
    }
  }

  async signInWithGoogle(idToken: string): Promise<User> {
    performanceMonitor.startTimer('sign_in_with_google');
    
    try {
      // Create credential from Google ID token
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Sign in with credential
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      // Check if user document exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user document for first-time Google Sign-In
        const userData: Omit<User, 'id'> = {
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
          createdAt: new Date()
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);

        const user: User = {
          id: firebaseUser.uid,
          ...userData
        };

        performanceMonitor.endTimer('sign_in_with_google', { success: true, userId: user.id, isNewUser: true });
        return user;
      } else {
        // User exists, return existing data
        const userData = userDoc.data();
        const user: User = {
          id: firebaseUser.uid,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          createdAt: userData.createdAt?.toDate() || new Date()
        };

        performanceMonitor.endTimer('sign_in_with_google', { success: true, userId: user.id, isNewUser: false });
        return user;
      }
      
    } catch (error: any) {
      const duration = performanceMonitor.endTimer('sign_in_with_google', { success: false });
      globalErrorHandler.logError(error, 'UserService.signInWithGoogle');
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid Google credentials. Please try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with this email using a different sign-in method.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw new Error('Google Sign-In failed. Please try again.');
    }
  }

  async signOut(): Promise<void> {
    performanceMonitor.startTimer('sign_out');
    
    try {
      await signOut(auth);
      performanceMonitor.endTimer('sign_out', { success: true });
    } catch (error: any) {
      const duration = performanceMonitor.endTimer('sign_out', { success: false });
      globalErrorHandler.logError(error, 'UserService.signOut');
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    performanceMonitor.startTimer('update_profile');
    
    try {
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.avatar) updateData.avatar = updates.avatar;

      await updateDoc(doc(db, 'users', userId), updateData);
      performanceMonitor.endTimer('update_profile', { success: true, userId });
    } catch (error: any) {
      const duration = performanceMonitor.endTimer('update_profile', { success: false });
      globalErrorHandler.logError(error, 'UserService.updateProfile');
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  async getUserProfile(userId: string): Promise<User | null> {
    performanceMonitor.startTimer('get_user_profile');
    
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        performanceMonitor.endTimer('get_user_profile', { success: true, found: false });
        return null;
      }

      const userData = userDoc.data();
      const user: User = {
        id: userId,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        createdAt: userData.createdAt?.toDate() || new Date()
      };

      performanceMonitor.endTimer('get_user_profile', { success: true, found: true });
      return user;
    } catch (error: any) {
      const duration = performanceMonitor.endTimer('get_user_profile', { success: false });
      globalErrorHandler.logError(error, 'UserService.getUserProfile');
      throw new Error('Failed to fetch user profile. Please try again.');
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return auth.onAuthStateChanged(callback);
  }
}

export const userService = UserService.getInstance(); 