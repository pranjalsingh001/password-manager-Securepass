import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

import { PasswordOptions } from '../types';
import { generatePassword } from '../utils/passwordGenerator';
import PasswordStrengthMeter from './PasswordStrengthMeter';

interface PasswordGeneratorProps {
  onSelect?: (password: string) => void;
}

const PasswordGenerator = ({ onSelect }: PasswordGeneratorProps) => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  
  const [generatedPassword, setGeneratedPassword] = useState<string>(() => 
    generatePassword(options)
  );
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword)
      .then(() => {
        toast.success('Password copied to clipboard!');
        // Clear clipboard after 30 seconds for security
        setTimeout(() => {
          navigator.clipboard.writeText('');
        }, 30000);
      })
      .catch(() => toast.error('Failed to copy password'));
  };
  
  const handleGenerate = () => {
    const newPassword = generatePassword(options);
    setGeneratedPassword(newPassword);
  };
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect(generatedPassword);
      toast.success('Password selected!');
    }
  };
  
  const handleOptionChange = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  // Generate a new password when options change
  useState(() => {
    handleGenerate();
  });
  
  return (
    <div className="glass-panel p-5 w-full">
      <h2 className="text-xl font-semibold mb-4">Password Generator</h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          value={generatedPassword}
          readOnly
          className="input-field pr-20 font-mono"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          <button 
            onClick={handleGenerate}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            title="Generate new password"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            title="Copy to clipboard"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>
      
      <PasswordStrengthMeter password={generatedPassword} />
      
      <div className="mt-4 space-y-4">
        <div>
          <label className="flex justify-between">
            <span>Length: {options.length}</span>
          </label>
          <input
            type="range"
            min={8}
            max={32}
            value={options.length}
            onChange={(e) => handleOptionChange('length', Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => handleOptionChange('uppercase', e.target.checked)}
              className="rounded bg-white/10 border-white/20 focus:ring-primary-500"
            />
            <span>Uppercase (A-Z)</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => handleOptionChange('lowercase', e.target.checked)}
              className="rounded bg-white/10 border-white/20 focus:ring-primary-500"
            />
            <span>Lowercase (a-z)</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={(e) => handleOptionChange('numbers', e.target.checked)}
              className="rounded bg-white/10 border-white/20 focus:ring-primary-500"
            />
            <span>Numbers (0-9)</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={(e) => handleOptionChange('symbols', e.target.checked)}
              className="rounded bg-white/10 border-white/20 focus:ring-primary-500"
            />
            <span>Symbols (!@#$)</span>
          </label>
        </div>
      </div>
      
      {onSelect && (
        <button 
          onClick={handleSelect}
          className="btn-primary w-full mt-4"
        >
          Use This Password
        </button>
      )}
    </div>
  );
};

export default PasswordGenerator;