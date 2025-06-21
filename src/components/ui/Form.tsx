import React from 'react';

interface Field {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
}

interface FormProps {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  submitText?: string;
}

const Form: React.FC<FormProps> = ({ 
  fields, 
  onSubmit, 
  initialValues = {}, 
  submitText = 'Guardar' 
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                shadow-sm focus:ring-2 focus:ring-primary focus:border-primary
                transition-all duration-200 ease-in-out
                placeholder-gray-400 dark:placeholder-gray-500"
              required={field.required}
            />
          ) : (
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                shadow-sm focus:ring-2 focus:ring-primary focus:border-primary
                transition-all duration-200 ease-in-out
                placeholder-gray-400 dark:placeholder-gray-500"
              required={field.required}
            />
          )}
          {field.error && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{field.error}</p>
          )}
        </div>
      ))}
      
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent 
            bg-primary hover:bg-primary/90 text-white 
            py-2 px-4 text-sm font-medium shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            transition-all duration-200 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default Form; 