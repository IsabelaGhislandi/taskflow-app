import { useState } from 'react';

export const useForm = <T>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const reset = () => setFormData(initialState);

  return { formData, handleChange, reset };
};