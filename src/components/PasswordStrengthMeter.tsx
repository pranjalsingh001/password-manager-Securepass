import { useMemo } from 'react';
import { calculatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthLabel } from '../utils/encryption';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const strengthColor = useMemo(() => getPasswordStrengthColor(strength), [strength]);
  const strengthLabel = useMemo(() => getPasswordStrengthLabel(strength), [strength]);
  
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs">Password Strength:</span>
        <span className="text-xs font-medium">{strengthLabel}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div 
          className={`${strengthColor} h-1.5 rounded-full transition-all duration-300`} 
          style={{ width: `${strength}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;