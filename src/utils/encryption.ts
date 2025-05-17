import CryptoJS from 'crypto-js';

// Encrypt a string using AES with the master password as the key
export const encryptData = (data: string, masterPassword: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, masterPassword).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt an encrypted string using AES with the master password as the key
export const decryptData = (encryptedData: string, masterPassword: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, masterPassword);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. Incorrect password or corrupted data.');
  }
};

// Calculate password strength score (0-100)
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  // Start with a base score
  let score = 0;
  
  // Add points for password length
  score += Math.min(password.length * 4, 40); // Max 40 points for length
  
  // Add points for character variety
  if (/[a-z]/.test(password)) score += 10; // lowercase
  if (/[A-Z]/.test(password)) score += 10; // uppercase
  if (/[0-9]/.test(password)) score += 10; // numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 15; // special characters
  
  // Add points for combination of character types
  const typesCount = (/[a-z]/.test(password) ? 1 : 0) + 
                     (/[A-Z]/.test(password) ? 1 : 0) + 
                     (/[0-9]/.test(password) ? 1 : 0) + 
                     (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  
  score += (typesCount - 1) * 5; // Bonus for using multiple types
  
  // Ensure the score doesn't exceed 100
  return Math.min(score, 100);
};

// Get a color based on password strength
export const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 30) return 'bg-error-500';
  if (strength < 60) return 'bg-warning-500';
  if (strength < 80) return 'bg-primary-500';
  return 'bg-green-500';
};

// Get a label based on password strength
export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength < 30) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  return 'Strong';
};