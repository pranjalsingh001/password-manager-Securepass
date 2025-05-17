import { useState, useEffect } from 'react';
import { LogOut, Plus, Search, Key } from 'lucide-react';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';
import { Credential, EncryptedCredential } from '../types';
import { encryptData, decryptData } from '../utils/encryption';
import { api } from '../utils/api';

import CredentialItem from '../components/CredentialItem';
import AddCredentialForm from '../components/AddCredentialForm';

const Dashboard = () => {
  const { user, logout, masterPassword } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Fetch credentials from API and decrypt them
  useEffect(() => {
    const fetchCredentials = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const encryptedCredentials = await api.getCredentials(user.id);
        
        // Decrypt passwords with master password
        const decryptedCredentials = encryptedCredentials.map((cred: EncryptedCredential) => ({
          ...cred,
          password: decryptData(cred.encryptedPassword, masterPassword),
        }));
        
        setCredentials(decryptedCredentials);
        setFilteredCredentials(decryptedCredentials);
      } catch (error) {
        console.error('Error fetching credentials:', error);
        toast.error('Failed to load your credentials');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCredentials();
  }, [user, masterPassword]);
  
  // Filter credentials based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCredentials(credentials);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = credentials.filter(cred => 
      cred.site.toLowerCase().includes(lowerCaseSearch) || 
      cred.username.toLowerCase().includes(lowerCaseSearch)
    );
    
    setFilteredCredentials(filtered);
  }, [searchTerm, credentials]);
  
  const handleAddCredential = async (newCred: { site: string; username: string; password: string }) => {
    if (!user) return;
    
    try {
      // Encrypt the password before sending to API
      const encryptedCredential = {
        site: newCred.site,
        username: newCred.username,
        encryptedPassword: encryptData(newCred.password, masterPassword),
      };
      
      // Add to API
      const addedCredential = await api.addCredential(user.id, encryptedCredential);
      
      // Add to state with decrypted password for display
      setCredentials(prev => [
        ...prev, 
        { 
          ...addedCredential, 
          password: newCred.password 
        }
      ]);
      
      toast.success('Credential added successfully!');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding credential:', error);
      toast.error('Failed to add credential');
    }
  };
  
  const handleDeleteCredential = async (id: string) => {
    if (!user) return;
    
    try {
      await api.deleteCredential(user.id, id);
      setCredentials(prev => prev.filter(cred => cred.id !== id));
      toast.success('Credential deleted successfully!');
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast.error('Failed to delete credential');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-panel border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center">
            <Key className="mr-2" size={24} />
            SecurePass
          </h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-white/70 hidden md:inline-block">
              {user?.email}
            </span>
            <button 
              onClick={logout}
              className="btn-secondary flex items-center space-x-1"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Add */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/50">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search credentials..." 
                className="input-field pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center space-x-2 whitespace-nowrap w-full md:w-auto"
            >
              <Plus size={18} />
              <span>Add New</span>
            </button>
          </div>
          
          {/* Credentials Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white/70">Loading your secure vault...</p>
            </div>
          ) : filteredCredentials.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <h2 className="text-xl font-semibold mb-2">No credentials found</h2>
              <p className="text-white/70 mb-6">
                {searchTerm 
                  ? 'No credentials match your search' 
                  : 'Add your first credential to get started'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add Credential</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCredentials.map(credential => (
                <CredentialItem 
                  key={credential.id} 
                  credential={credential} 
                  onDelete={handleDeleteCredential} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Add Credential Modal */}
      {showAddForm && (
        <AddCredentialForm 
          onAdd={handleAddCredential} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;