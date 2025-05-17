import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

import PasswordGenerator from './PasswordGenerator';
import PasswordStrengthMeter from './PasswordStrengthMeter';

interface AddCredentialFormProps {
  onAdd: (credential: { site: string; username: string; password: string }) => void;
  onCancel: () => void;
}

interface FormData {
  site: string;
  username: string;
  password: string;
}

const AddCredentialForm = ({ onAdd, onCancel }: AddCredentialFormProps) => {
  const [showGenerator, setShowGenerator] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      site: '',
      username: '',
      password: '',
    }
  });
  
  const password = watch('password');
  
  const onSubmit = (data: FormData) => {
    onAdd(data);
  };
  
  const handleSelectPassword = (generatedPassword: string) => {
    setValue('password', generatedPassword);
    setShowGenerator(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-6">Add New Credential</h2>
        
        {showGenerator ? (
          <div className="mb-6">
            <PasswordGenerator onSelect={handleSelectPassword} />
            <button 
              onClick={() => setShowGenerator(false)}
              className="btn-secondary w-full mt-4"
            >
              Cancel
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Website or Service
              </label>
              <input
                type="text"
                {...register('site', { required: 'Site name is required' })}
                className="input-field"
                placeholder="e.g., Google, Twitter, Netflix"
              />
              {errors.site && (
                <p className="mt-1 text-sm text-error-400">{errors.site.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Username or Email
              </label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="input-field"
                placeholder="e.g., john@example.com"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-error-400">{errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="input-field"
                  placeholder="Enter password or generate one"
                />
              </div>
              {password && <PasswordStrengthMeter password={password} />}
              {errors.password && (
                <p className="mt-1 text-sm text-error-400">{errors.password.message}</p>
              )}
              <button
                type="button"
                onClick={() => setShowGenerator(true)}
                className="text-sm text-primary-400 hover:text-primary-300 mt-1"
              >
                Generate Strong Password
              </button>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Save Credential
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCredentialForm;