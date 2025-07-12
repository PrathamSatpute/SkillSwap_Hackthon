import { ValidationError } from './validation';

// Error types for different scenarios
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  field?: string;
  timestamp: Date;
  userFriendly: boolean;
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Create error from validation errors
  createValidationError(errors: ValidationError[]): AppError {
    const firstError = errors[0];
    return {
      type: ErrorType.VALIDATION,
      message: firstError.message,
      code: firstError.code,
      field: firstError.field,
      timestamp: new Date(),
      userFriendly: true
    };
  }

  // Create network error
  createNetworkError(message: string = 'Network connection failed'): AppError {
    return {
      type: ErrorType.NETWORK,
      message,
      timestamp: new Date(),
      userFriendly: true
    };
  }

  // Create authentication error
  createAuthError(message: string = 'Authentication failed'): AppError {
    return {
      type: ErrorType.AUTHENTICATION,
      message,
      timestamp: new Date(),
      userFriendly: true
    };
  }

  // Create authorization error
  createAuthzError(message: string = 'You are not authorized to perform this action'): AppError {
    return {
      type: ErrorType.AUTHORIZATION,
      message,
      timestamp: new Date(),
      userFriendly: true
    };
  }

  // Create server error
  createServerError(message: string = 'Server error occurred'): AppError {
    return {
      type: ErrorType.SERVER,
      message,
      timestamp: new Date(),
      userFriendly: false
    };
  }

  // Create not found error
  createNotFoundError(resource: string = 'Resource'): AppError {
    return {
      type: ErrorType.NOT_FOUND,
      message: `${resource} not found`,
      timestamp: new Date(),
      userFriendly: true
    };
  }

  // Create rate limit error
  createRateLimitError(message: string = 'Too many requests. Please try again later'): AppError {
    return {
      type: ErrorType.RATE_LIMIT,
      message,
      timestamp: new Date(),
      userFriendly: true
    };
  }

  // Create unknown error
  createUnknownError(message: string = 'An unexpected error occurred'): AppError {
    return {
      type: ErrorType.UNKNOWN,
      message,
      timestamp: new Date(),
      userFriendly: false
    };
  }

  // Handle async operations with error catching
  async handleAsync<T>(
    operation: () => Promise<T>,
    fallbackValue?: T,
    errorMessage?: string
  ): Promise<{ data: T | undefined; error: AppError | null }> {
    try {
      const data = await operation();
      return { data, error: null };
    } catch (error) {
      const appError = this.handleError(error, errorMessage);
      return { data: fallbackValue, error: appError };
    }
  }

  // Handle synchronous operations with error catching
  handleSync<T>(
    operation: () => T,
    fallbackValue?: T,
    errorMessage?: string
  ): { data: T | undefined; error: AppError | null } {
    try {
      const data = operation();
      return { data, error: null };
    } catch (error) {
      const appError = this.handleError(error, errorMessage);
      return { data: fallbackValue, error: appError };
    }
  }

  // Convert any error to AppError
  handleError(error: any, customMessage?: string): AppError {
    // Log the error for debugging
    console.error('Error occurred:', error);

    // Add to error log
    const appError = this.convertToAppError(error, customMessage);
    this.errorLog.push(appError);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logToExternalService(appError);
    }

    return appError;
  }

  // Convert various error types to AppError
  private convertToAppError(error: any, customMessage?: string): AppError {
    if (error instanceof Error) {
      const message = customMessage || error.message;
      
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        return this.createNetworkError(message);
      }
      
      if (error.name === 'AuthError' || error.message.includes('auth')) {
        return this.createAuthError(message);
      }
      
      if (error.name === 'ValidationError') {
        return this.createValidationError([{
          field: 'unknown',
          message,
          code: 'VALIDATION_ERROR'
        }]);
      }
      
      return this.createUnknownError(message);
    }
    
    if (typeof error === 'string') {
      return this.createUnknownError(customMessage || error);
    }
    
    return this.createUnknownError(customMessage || 'An unknown error occurred');
  }

  // Log error to external service (e.g., Sentry, LogRocket)
  private logToExternalService(error: AppError): void {
    // Implementation for external logging service
    // Example: Sentry.captureException(error);
    console.log('Logging to external service:', error);
  }

  // Get error log for debugging
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error: AppError): string {
    if (error.userFriendly) {
      return error.message;
    }
    
    // Return generic message for non-user-friendly errors
    switch (error.type) {
      case ErrorType.SERVER:
        return 'Something went wrong on our end. Please try again later.';
      case ErrorType.UNKNOWN:
        return 'An unexpected error occurred. Please try again.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  // Check if error is retryable
  isRetryable(error: AppError): boolean {
    return error.type === ErrorType.NETWORK || error.type === ErrorType.RATE_LIMIT;
  }

  // Get retry delay for retryable errors
  getRetryDelay(error: AppError): number {
    switch (error.type) {
      case ErrorType.RATE_LIMIT:
        return 60000; // 1 minute
      case ErrorType.NETWORK:
        return 5000; // 5 seconds
      default:
        return 0;
    }
  }
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance();

// Note: React components have been moved to src/components/common/ErrorBoundary.tsx 