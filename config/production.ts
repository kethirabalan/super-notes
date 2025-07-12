// Production Configuration
// This file contains production-specific configuration settings

export const productionConfig = {
  // App Configuration
  app: {
    name: 'SuperNotes',
    version: '1.0.0',
    environment: 'production',
    debug: false,
    logLevel: 'error' as const,
  },

  // Firebase Configuration
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCZJPrn7yttm-Jl_hzJJ8o4Ohvbj_1zP4I',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'supernotes-4e70a.firebaseapp.com',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'supernotes-4e70a',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'supernotes-4e70a.firebasestorage.app',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1017757914937',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:1017757914937:web:49529e7113fd1722b1bae8',
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-W921JS8RF0',
  },

  // Google Sign-In Configuration
  googleSignIn: {
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '1017757914937-sbmbjt255qp5k3qoa5i7u22fm015qqbl.apps.googleusercontent.com',
    redirectUri: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI || 'https://supernotes-4e70a.web.app/auth/callback',
    scopes: ['openid', 'profile', 'email'],
  },

  // App URLs
  urls: {
    baseUrl: process.env.EXPO_PUBLIC_APP_BASE_URL || 'https://supernotes-4e70a.web.app',
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://supernotes-4e70a.web.app/api',
  },

  // Analytics Configuration
  analytics: {
    enabled: process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === 'true',
    crashReporting: process.env.EXPO_PUBLIC_CRASH_REPORTING_ENABLED === 'true',
    performanceMonitoring: process.env.EXPO_PUBLIC_PERFORMANCE_MONITORING_ENABLED === 'true',
  },

  // Feature Flags
  features: {
    googleSignIn: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_ENABLED === 'true',
    offlineSupport: process.env.EXPO_PUBLIC_OFFLINE_SUPPORT_ENABLED === 'true',
    pushNotifications: process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_ENABLED === 'true',
  },

  // Security Configuration
  security: {
    debugMode: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
    logLevel: process.env.EXPO_PUBLIC_LOG_LEVEL || 'error',
    maxRetryAttempts: parseInt(process.env.EXPO_PUBLIC_MAX_RETRY_ATTEMPTS || '3'),
    requestTimeout: parseInt(process.env.EXPO_PUBLIC_REQUEST_TIMEOUT || '30000'),
  },

  // Performance Configuration
  performance: {
    cacheDuration: parseInt(process.env.EXPO_PUBLIC_CACHE_DURATION || '3600'),
    maxRetryAttempts: parseInt(process.env.EXPO_PUBLIC_MAX_RETRY_ATTEMPTS || '3'),
    requestTimeout: parseInt(process.env.EXPO_PUBLIC_REQUEST_TIMEOUT || '30000'),
  },

  // Error Handling Configuration
  errorHandling: {
    enableCrashReporting: true,
    enableErrorLogging: true,
    enablePerformanceMonitoring: true,
    maxErrorLogSize: 100,
  },

  // Data Validation
  validation: {
    maxNoteTitleLength: 200,
    maxNoteContentLength: 10000,
    maxCategoryNameLength: 50,
    maxTagNameLength: 30,
    maxUserNameLength: 100,
    maxUserEmailLength: 100,
  },
};

export default productionConfig; 