// This file would normally contain API calls to your backend
// For this demo, we're simulating API calls with localStorage

export const api = {
  // Mock API function to get credentials for a user
  getCredentials: async (userId: string) => {
    try {
      // Get credentials from localStorage
      const credentials = JSON.parse(localStorage.getItem(`credentials_${userId}`) || '[]');
      return credentials;
    } catch (error) {
      console.error('Error fetching credentials:', error);
      throw error;
    }
  },
  
  // Mock API function to add a credential
  addCredential: async (userId: string, credential: any) => {
    try {
      // Get existing credentials
      const credentials = JSON.parse(localStorage.getItem(`credentials_${userId}`) || '[]');
      
      // Add the new credential with an ID and timestamp
      const newCredential = {
        ...credential,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      
      // Save the updated credentials
      localStorage.setItem(`credentials_${userId}`, JSON.stringify([...credentials, newCredential]));
      
      return newCredential;
    } catch (error) {
      console.error('Error adding credential:', error);
      throw error;
    }
  },
  
  // Mock API function to delete a credential
  deleteCredential: async (userId: string, credentialId: string) => {
    try {
      // Get existing credentials
      const credentials = JSON.parse(localStorage.getItem(`credentials_${userId}`) || '[]');
      
      // Filter out the credential to delete
      const updatedCredentials = credentials.filter((cred: any) => cred.id !== credentialId);
      
      // Save the updated credentials
      localStorage.setItem(`credentials_${userId}`, JSON.stringify(updatedCredentials));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting credential:', error);
      throw error;
    }
  },
};