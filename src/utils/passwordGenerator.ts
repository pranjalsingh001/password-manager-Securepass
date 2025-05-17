import { PasswordOptions } from '../types';

// Generate a random password based on options
export const generatePassword = (options: PasswordOptions): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  // Create a character pool based on selected options
  let characters = '';
  if (options.uppercase) characters += uppercase;
  if (options.lowercase) characters += lowercase;
  if (options.numbers) characters += numbers;
  if (options.symbols) characters += symbols;
  
  // If no character types are selected, default to lowercase
  if (!characters) characters = lowercase;
  
  // Generate the password
  let password = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  
  // Ensure at least one character from each selected type is included
  let result = password;
  
  if (options.uppercase && !/[A-Z]/.test(result)) {
    const randomUpper = uppercase[Math.floor(Math.random() * uppercase.length)];
    const randomPos = Math.floor(Math.random() * result.length);
    result = result.substring(0, randomPos) + randomUpper + result.substring(randomPos + 1);
  }
  
  if (options.lowercase && !/[a-z]/.test(result)) {
    const randomLower = lowercase[Math.floor(Math.random() * lowercase.length)];
    const randomPos = Math.floor(Math.random() * result.length);
    result = result.substring(0, randomPos) + randomLower + result.substring(randomPos + 1);
  }
  
  if (options.numbers && !/[0-9]/.test(result)) {
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const randomPos = Math.floor(Math.random() * result.length);
    result = result.substring(0, randomPos) + randomNumber + result.substring(randomPos + 1);
  }
  
  if (options.symbols && !/[^A-Za-z0-9]/.test(result)) {
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const randomPos = Math.floor(Math.random() * result.length);
    result = result.substring(0, randomPos) + randomSymbol + result.substring(randomPos + 1);
  }
  
  return result;
};