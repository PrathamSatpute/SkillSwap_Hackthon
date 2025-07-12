// Validation utility for comprehensive input validation
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation rules
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// Name validation regex
const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/;

// Validation functions
export const validateEmail = (email: string): ValidationError | null => {
  if (!email) {
    return { field: 'email', message: 'Email is required', code: 'REQUIRED' };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address', code: 'INVALID_FORMAT' };
  }
  
  if (email.length > 254) {
    return { field: 'email', message: 'Email is too long', code: 'TOO_LONG' };
  }
  
  return null;
};

export const validatePassword = (password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required', code: 'REQUIRED' });
    return errors;
  }
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push({ 
      field: 'password', 
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`, 
      code: 'TOO_SHORT' 
    });
  }
  
  if (!PASSWORD_REGEX.test(password)) {
    errors.push({ 
      field: 'password', 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character', 
      code: 'INVALID_FORMAT' 
    });
  }
  
  return errors;
};

export const validateName = (name: string): ValidationError | null => {
  if (!name) {
    return { field: 'name', message: 'Name is required', code: 'REQUIRED' };
  }
  
  if (!NAME_REGEX.test(name)) {
    return { field: 'name', message: 'Name must be 2-50 characters long and contain only letters and spaces', code: 'INVALID_FORMAT' };
  }
  
  return null;
};

export const validateLocation = (location: string): ValidationError | null => {
  if (location && location.length > 100) {
    return { field: 'location', message: 'Location is too long', code: 'TOO_LONG' };
  }
  
  return null;
};

export const validateSkill = (skill: { name: string; description: string; category: string }): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!skill.name || skill.name.trim().length < 2) {
    errors.push({ field: 'skillName', message: 'Skill name must be at least 2 characters long', code: 'TOO_SHORT' });
  }
  
  if (!skill.description || skill.description.trim().length < 10) {
    errors.push({ field: 'skillDescription', message: 'Skill description must be at least 10 characters long', code: 'TOO_SHORT' });
  }
  
  if (!skill.category) {
    errors.push({ field: 'skillCategory', message: 'Skill category is required', code: 'REQUIRED' });
  }
  
  return errors;
};

export const validateSwapRequest = (request: {
  offeredSkillId: string;
  requestedSkillId: string;
  message?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!request.offeredSkillId) {
    errors.push({ field: 'offeredSkill', message: 'Please select a skill to offer', code: 'REQUIRED' });
  }
  
  if (!request.requestedSkillId) {
    errors.push({ field: 'requestedSkill', message: 'Please select a skill to learn', code: 'REQUIRED' });
  }
  
  if (request.message && request.message.length > 500) {
    errors.push({ field: 'message', message: 'Message is too long (max 500 characters)', code: 'TOO_LONG' });
  }
  
  return errors;
};

export const validateRating = (rating: number, feedback?: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (rating < 1 || rating > 5) {
    errors.push({ field: 'rating', message: 'Rating must be between 1 and 5', code: 'INVALID_RANGE' });
  }
  
  if (feedback && feedback.length > 1000) {
    errors.push({ field: 'feedback', message: 'Feedback is too long (max 1000 characters)', code: 'TOO_LONG' });
  }
  
  return errors;
};

// Comprehensive form validation
export const validateRegistrationForm = (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Validate name
  const nameError = validateName(formData.name);
  if (nameError) errors.push(nameError);
  
  // Validate email
  const emailError = validateEmail(formData.email);
  if (emailError) errors.push(emailError);
  
  // Validate password
  const passwordErrors = validatePassword(formData.password);
  errors.push(...passwordErrors);
  
  // Validate password confirmation
  if (formData.password !== formData.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match', code: 'MISMATCH' });
  }
  
  // Validate location
  const locationError = validateLocation(formData.location || '');
  if (locationError) errors.push(locationError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Error message mapping for user-friendly messages
export const getErrorMessage = (code: string, field?: string): string => {
  const errorMessages: Record<string, string> = {
    REQUIRED: `${field || 'This field'} is required`,
    INVALID_FORMAT: `Please enter a valid ${field || 'value'}`,
    TOO_SHORT: `${field || 'This field'} is too short`,
    TOO_LONG: `${field || 'This field'} is too long`,
    INVALID_RANGE: `${field || 'This field'} is out of range`,
    MISMATCH: `${field || 'Values'} do not match`,
    INVALID_RATING: 'Rating must be between 1 and 5',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    RATE_LIMITED: 'Too many requests. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.'
  };
  
  return errorMessages[code] || 'An error occurred';
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

// Validate file upload
export const validateFileUpload = (file: File, maxSize: number = 5 * 1024 * 1024): ValidationError | null => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { field: 'file', message: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)', code: 'INVALID_TYPE' };
  }
  
  if (file.size > maxSize) {
    return { field: 'file', message: `File size must be less than ${maxSize / (1024 * 1024)}MB`, code: 'TOO_LARGE' };
  }
  
  return null;
}; 