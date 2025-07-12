import { environment } from '../environments/environment';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  userId?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  logError(error: Error | string, context?: string, userId?: string): void {
    const appError: AppError = {
      code: this.getErrorCode(error),
      message: typeof error === 'string' ? error : error.message,
      details: {
        context,
        stack: error instanceof Error ? error.stack : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'React Native',
        timestamp: new Date().toISOString()
      },
      timestamp: Date.now(),
      userId
    };

    this.errorLog.push(appError);

    // Log to console in development
    if (!environment.production) {
      console.error('App Error:', appError);
    }

    // In production, you would send this to a crash reporting service
    if (environment.production) {
      this.sendToCrashReporting(appError);
    }
  }

  private getErrorCode(error: Error | string): string {
    if (error instanceof Error) {
      // Map common error types to codes
      if (error.name === 'FirebaseError') return 'FIREBASE_ERROR';
      if (error.name === 'NetworkError') return 'NETWORK_ERROR';
      if (error.name === 'AuthError') return 'AUTH_ERROR';
      return 'UNKNOWN_ERROR';
    }
    return 'CUSTOM_ERROR';
  }

  private sendToCrashReporting(error: AppError): void {
    // In production, implement crash reporting service integration
    // Examples: Sentry, Crashlytics, Bugsnag, etc.
    try {
      // Example: Sentry.captureException(error);
      console.warn('Crash reporting not implemented. Error:', error);
    } catch (reportingError) {
      console.error('Failed to send error to crash reporting:', reportingError);
    }
  }

  getUserFriendlyMessage(error: AppError): string {
    const errorMessages: Record<string, string> = {
      'FIREBASE_ERROR': 'Unable to connect to our servers. Please check your internet connection.',
      'NETWORK_ERROR': 'Network connection is required. Please check your internet connection.',
      'AUTH_ERROR': 'Authentication failed. Please try signing in again.',
      'GOOGLE_SIGN_IN_ERROR': 'Google sign-in failed. Please try again.',
      'PERMISSION_DENIED': 'You don\'t have permission to perform this action.',
      'NOT_FOUND': 'The requested resource was not found.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'UNKNOWN_ERROR': 'Something went wrong. Please try again later.'
    };

    return errorMessages[error.code] || errorMessages['UNKNOWN_ERROR'];
  }

  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Global error handler
export const globalErrorHandler = ErrorHandler.getInstance();

// React Native global error handler
if (typeof global !== 'undefined' && (global as any).ErrorUtils) {
  (global as any).ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    globalErrorHandler.logError(error, 'Global Error Handler', isFatal ? 'FATAL' : 'NON_FATAL');
  });
}

// Promise rejection handler
if (typeof global !== 'undefined' && (global as any).addEventListener) {
  (global as any).addEventListener('unhandledrejection', (event: any) => {
    globalErrorHandler.logError(
      new Error(event.reason || 'Unhandled Promise Rejection'),
      'Promise Rejection'
    );
  });
} 