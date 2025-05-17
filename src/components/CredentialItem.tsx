import { useState } from 'react';
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

import { Credential } from '../types';

interface CredentialItemProps {
  credential: Credential;
  onDelete: (id: string) => void;
}

const CredentialItem = ({ credential, onDelete }: CredentialItemProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(credential.password)
      .then(() => {
        toast.success('Password copied to clipboard!');
        // Clear clipboard after 30 seconds for security
        setTimeout(() => {
          navigator.clipboard.writeText('');
        }, 30000);
      })
      .catch(() => toast.error('Failed to copy password'));
  };
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the credentials for ${credential.site}?`)) {
      onDelete(credential.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="glass-panel p-4 transition-all duration-300 hover:shadow-lg hover:border-primary-500/30">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{credential.site}</h3>
        <button 
          onClick={handleDelete}
          className="p-1 text-white/60 hover:text-error-500 transition-colors"
          title="Delete credential"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="mb-2">
        <p className="text-white/70 text-sm">Username</p>
        <p className="font-medium">{credential.username}</p>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <p className="text-white/70 text-sm">Password</p>
          <div className="flex space-x-1">
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-white/60 hover:text-white transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button 
              onClick={handleCopy}
              className="p-1 text-white/60 hover:text-white transition-colors"
              title="Copy password"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
        <p className="font-medium font-mono">
          {showPassword ? credential.password : '••••••••••••••••'}
        </p>
      </div>
      
      <p className="text-xs text-white/50 mt-2">Added: {formatDate(credential.createdAt)}</p>
    </div>
  );
};

export default CredentialItem;